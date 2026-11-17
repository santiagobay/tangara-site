"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom cursor: dot + trailing ring + context label + soft spotlight. Fine pointers only.
 * On interactive elements the ring fills and uses `mix-blend-mode: difference`, so whatever
 * sits beneath it is shown in negative instead of being covered. The context label lives in a
 * separate pill offset from the pointer, so it never hides the text you are pointing at.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !dot.current || !ring.current || !tag.current || !label.current || !glow.current) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: reduce ? 0.01 : 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: reduce ? 0.01 : 0.55, ease: "power3" });
    const tx = gsap.quickTo(tag.current, "x", { duration: reduce ? 0.01 : 0.35, ease: "power3" });
    const ty = gsap.quickTo(tag.current, "y", { duration: reduce ? 0.01 : 0.35, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      tx(e.clientX);
      ty(e.clientY);
      glow.current!.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      const lab = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button, [role='button'], summary, label");
      const field = t.closest("input, textarea, select");
      ring.current!.classList.toggle("is-link", !!link && !lab && !field);
      ring.current!.classList.toggle("is-label", !!lab && !field);
      ring.current!.classList.toggle("is-field", !!field);
      dot.current!.classList.toggle("is-hidden", (!!link || !!lab) && !field);
      const text = field ? "" : lab?.dataset.cursor ?? "";
      if (text) label.current!.textContent = text;
      tag.current!.classList.toggle("is-on", !!text);
    };

    const leave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.25 });
      tag.current!.classList.remove("is-on");
    };
    const down = () => ring.current!.classList.add("is-down");
    const up = () => ring.current!.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={tag} className="cursor-tag" aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
    </>
  );
}
