"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient field of small outlined triangles drifting across the page (after the "constellation"
 * idea from the style reference), in Tangara's own palette. Very low opacity, no pointer events,
 * one cheap canvas at 1x resolution. Reduced motion: a single still frame.
 */
const COLORS = ["#3eb9a8", "#a4f2c0", "#f6c98b", "#5aa371", "#1d6c61"];

export default function AmbientField() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;
    const count = small ? 22 : 46;

    let w = 0;
    let h = 0;
    const size = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    size();

    const tris = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7, // depth: closer = bigger, faster, more parallax
      r: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.004,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -0.00006 - Math.random() * 0.00012,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: 0.18 + Math.random() * 0.32,
    }));

    let scroll = window.scrollY;
    const onScroll = () => (scroll = window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.2;
      for (const t of tris) {
        const s = 4 + t.z * 7;
        // Parallax: deeper triangles move less with the page.
        let py = (t.y * h - scroll * 0.12 * t.z) % h;
        if (py < -20) py += h + 40;
        const px = t.x * w;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(t.r);
        ctx.globalAlpha = t.a;
        ctx.strokeStyle = t.c;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.87, s * 0.5);
        ctx.lineTo(-s * 0.87, s * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      for (const t of tris) {
        t.x += t.vx * t.z;
        t.y += t.vy * t.z;
        t.r += t.vr;
        if (t.y < -0.05) t.y = 1.05;
        if (t.x < -0.05) t.x = 1.05;
        if (t.x > 1.05) t.x = -0.05;
      }
      draw();
    };
    if (still) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={cv} className="ambient-field" aria-hidden="true" />;
}
