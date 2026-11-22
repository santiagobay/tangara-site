"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Split from "../Split";
import Magnetic from "../Magnetic";
import { onReady } from "@/lib/ready";

const HeroScene = dynamic(() => import("../three/HeroScene"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero .wi", { yPercent: 115 });
      gsap.set("[data-intro]", { opacity: 0, y: 28 });
    }, el);

    const off = onReady(() => {
      gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(".hero .wi", { yPercent: 0, duration: 1.3, stagger: 0.09 })
          .to("[data-intro]", { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, "-=0.8");
      }, el);
    });

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(t as HTMLElement, { offset: -70, duration: 1.4 });
    else (t as HTMLElement).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" ref={root} className="hero">
      <HeroScene />
      <div className="hero-content">
        <div className="eyebrow" data-intro>
          Brand · Web · 3D · Marketing
        </div>
        <Split tag="h1" mode="intro" className="hero-title" text="Brands and websites | with real *depth*" />
        <p className="intro" data-intro>
          Tangara designs identities, websites and 3D visuals for businesses across Canada. Strategy,
          design and code from one team, so everything your customers see feels like the same company.
        </p>
        <div className="hero-actions" data-intro>
          <Magnetic>
            <a className="btn" href="#contact" onClick={(e) => jump(e, "#contact")}>
              Start a project <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
          <a className="text-link" href="#work" onClick={(e) => jump(e, "#work")}>
            See our work ↓
          </a>
        </div>
      </div>
      <div className="hero-meta" data-intro>
        <span>Brand</span>
        <span>Web</span>
        <span>3D</span>
        <span>Marketing</span>
        <span>Real estate</span>
        <span className="scroll-cue">
          Scroll <i aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
