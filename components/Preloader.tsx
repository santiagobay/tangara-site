"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markReady } from "@/lib/ready";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      markReady();
      setGone(true);
      return;
    }

    document.documentElement.classList.add("is-loading");
    const state = { v: 0 };
    const tl = gsap.timeline();
    tl.to(state, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(state.v));
        if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
      },
    })
      .to(".preloader-inner", { opacity: 0, y: -20, duration: 0.45, ease: "power2.in" })
      .to(root.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "power4.inOut",
        onStart: () => {
          document.documentElement.classList.remove("is-loading");
          markReady();
        },
      })
      .add(() => setGone(true));

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading Tangara">
      <div className="preloader-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bird-mark.png" alt="" width={96} height={96} className="preloader-mark" />
        <div className="preloader-name">Tangara</div>
        <div className="preloader-track" aria-hidden="true">
          <div ref={bar} className="preloader-bar" />
        </div>
        <div className="preloader-count" aria-hidden="true">
          {String(count).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
