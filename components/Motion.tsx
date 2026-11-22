"use client";

import { useEffect } from "react";
import { sfx } from "@/lib/sfx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place for every scroll-driven animation on the page.
 * Pin triggers are created first so later triggers measure after the pin spacing.
 */
export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* 1 — Pinned horizontal gallery (desktop) */
      mm.add("(min-width: 960px)", () => {
        const wrap = document.querySelector<HTMLElement>("[data-gallery]");
        const track = document.querySelector<HTMLElement>("[data-gallery-track]");
        const bar = document.querySelector<HTMLElement>("[data-gallery-bar]");
        const count = document.querySelector<HTMLElement>("[data-gallery-count]");
        if (!wrap || !track) return;
        const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]");
        const dist = () => Math.max(0, track.offsetLeft + track.scrollWidth - wrap.clientWidth);

        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => "+=" + (dist() + window.innerHeight * 0.2),
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              if (count) {
                const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
                count.textContent = `${String(i).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
              }
            },
          },
        });

        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector(".browser"),
            { rotateY: 14, scale: 0.94 },
            {
              rotateY: -10,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 95%",
                end: "right 5%",
                scrub: true,
              },
            },
          );
        });
      });

      /* 2 — Hero fades out as you leave it */
      gsap.to(".hero-content", {
        opacity: 0,
        y: -80,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 25%", scrub: true },
      });
      gsap.to(".hero-meta", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "40% top", scrub: true },
      });

      /* 3 — Headline word reveals */
      gsap.utils.toArray<HTMLElement>('[data-split="rise"]').forEach((h) => {
        gsap.from(h.querySelectorAll(".wi"), {
          yPercent: 115,
          rotate: 4,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: h, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      /* 4 — Generic fade/rise reveals and staggered groups */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 56,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      /* 5 — Scroll-scrubbed word highlight */
      gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((p) => {
        gsap.fromTo(
          p.querySelectorAll(".sw"),
          // Never below ~4.5:1 contrast, even before the words are "lit".
          { opacity: 0.5 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 45%", scrub: true },
          },
        );
      });

      /* 6 — Fade out as sections scroll away */
      gsap.utils.toArray<HTMLElement>("[data-fadeout]").forEach((el) => {
        gsap.to(el, {
          opacity: 0.06,
          y: -50,
          ease: "none",
          scrollTrigger: { trigger: el, start: "bottom 30%", end: "bottom -10%", scrub: true },
        });
      });

      /* 7 — Soft parallax */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax ?? "0.15");
        gsap.to(el, {
          y: () => -window.innerHeight * amt,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      /* 8b — Lab: path draws and milestones light up as you scroll */
      gsap.utils.toArray<HTMLElement>("[data-lab-path]").forEach((stage) => {
        const nodes = stage.querySelectorAll<SVGGElement>("[data-lab-node]");
        const paint = (p: number, audible = false) => {
          stage.style.setProperty("--draw", String(1 - p));
          nodes.forEach((n, i) => {
            const off = p < i / (nodes.length - 1) - 0.02;
            if (audible && !off && n.classList.contains("is-off")) sfx.note(i * 2, { gain: 0.1, dur: 0.9 });
            n.classList.toggle("is-off", off);
          });
        };
        paint(0);
        ScrollTrigger.create({
          trigger: stage,
          start: "top 85%",
          end: "bottom 35%",
          scrub: true,
          onUpdate: (self) => paint(self.progress, true),
        });
      });

      /* 8 — Process line draws as you scroll */
      const line = document.querySelector<HTMLElement>("[data-process-line]");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".process", start: "top 60%", end: "bottom 70%", scrub: true },
          },
        );
      }
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return null;
}
