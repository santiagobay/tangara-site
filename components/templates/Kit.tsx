"use client";

import Link from "next/link";
import { Fragment, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Thin Tangara bar shown above every template so nobody mistakes it for a real business. */
export function TemplateBar({ industry }: { industry: string }) {
  return (
    <div className="tpl-bar">
      <Link href="/#work" className="tpl-bar-back">
        ← Tangara
      </Link>
      <span className="tpl-bar-mid">
        {industry} template by Tangara · fictional brand, prices and details
      </span>
      <Link href="/#contact" className="tpl-bar-cta">
        Start a project like this ↗
      </Link>
    </div>
  );
}

/** Headline whose words rise from a mask (animated by <TemplateMotion />). */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`tw-line ${className}`} data-t-split aria-label={text}>
      {text.split(" ").map((w, i, all) => (
        <Fragment key={i}>
          <span className="tw-m" aria-hidden="true">
            <span className="tw">{w}</span>
          </span>
          {i < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/** Scroll animations shared by all templates. Content is fully visible without JS or with reduced motion. */
export function TemplateMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-t-split]").forEach((el) => {
        gsap.from(el.querySelectorAll(".tw"), {
          yPercent: 115,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-t-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          delay: parseFloat(el.dataset.tReveal || "0"),
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-t-stagger]").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-t-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 12% 18% 12% round 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 25%", scrub: 0.6 },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-t-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.tParallax || "0.15");
        gsap.to(el, {
          y: () => -window.innerHeight * amt,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<SVGGeometryElement>("[data-t-draw] path, [data-t-draw] line, [data-t-draw] rect, [data-t-draw] polyline").forEach((p) => {
        const len = p.getTotalLength ? p.getTotalLength() : 400;
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: p.closest("[data-t-draw]"), start: "top 80%", end: "bottom 45%", scrub: 0.8 },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-t-count]").forEach((el) => {
        const to = parseFloat(el.dataset.tCount || "0");
        const state = { v: 0 };
        gsap.to(state, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => (el.textContent = String(Math.round(state.v))),
        });
      });
      // Pinned horizontal story (desktop only)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 960px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-t-hscroll]").forEach((wrap) => {
          const track = wrap.querySelector<HTMLElement>("[data-t-track]");
          if (!track) return;
          const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
          });
        });
      });
      // Background colour shift for "mood" sections
      gsap.utils.toArray<HTMLElement>("[data-t-mood]").forEach((el) => {
        const [from, to] = (el.dataset.tMood || "").split(",");
        if (!from || !to) return;
        gsap.fromTo(
          el,
          { backgroundColor: from },
          { backgroundColor: to, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true } },
        );
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);
  return null;
}
