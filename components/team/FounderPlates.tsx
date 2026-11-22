"use client";

import { useEffect, useRef, useState } from "react";
import type { Founder } from "@/lib/team";
import { sfx } from "@/lib/sfx";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has come near the viewport (plates only animate when seen). */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/* ── Terminal: types a short "whoami" session ─────────────────────────────── */
function TerminalPlate({ f }: { f: Founder }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const script = [
    { p: true, t: "whoami" },
    { p: false, t: f.name.toLowerCase().replace(/\s+/g, "-") },
    { p: true, t: "cat role.txt" },
    { p: false, t: f.role },
    { p: true, t: "cat bio.txt" },
    { p: false, t: "bio coming soon" },
  ];
  const full = script.map((l) => l.t);
  const [out, setOut] = useState<string[]>(() => script.map(() => ""));
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (reduced()) {
      setOut(full);
      return;
    }
    let line = 0;
    let ch = 0;
    const lines = script.map(() => "");
    setOut([...lines]);
    const id = window.setInterval(() => {
      if (line >= script.length) return window.clearInterval(id);
      const target = script[line].t;
      ch += script[line].p ? 1 : 3;
      lines[line] = target.slice(0, ch);
      if (script[line].p) sfx.play("tick");
      setOut([...lines]);
      if (ch >= target.length) {
        line += 1;
        ch = 0;
      }
    }, 38);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, run]);

  return (
    <div
      ref={ref}
      className="plate-stage plate-term"
      onClick={() => setRun((r) => r + 1)}
      data-cursor="Replay"
      aria-hidden="true"
    >
      <div className="plate-term-bar">
        <i />
        <i />
        <i />
        <span className="mono">~/tangara</span>
      </div>
      <div className="plate-term-body mono">
        {script.map((l, i) =>
          out[i] || i === 0 ? (
            <div key={i} className={l.p ? "is-cmd" : "is-out"}>
              {l.p && <span className="plate-term-ps">$</span>}
              {out[i]}
            </div>
          ) : null,
        )}
        <span className="plate-term-caret" />
      </div>
    </div>
  );
}

/* ── Dots: initials drawn in particles that move away from the pointer ────── */
function DotsPlate({ f }: { f: Founder }) {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const still = reduced();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let pts: { x: number; y: number; hx: number; hy: number }[] = [];
    const mouse = { x: -999, y: -999 };
    let visible = false;

    const build = () => {
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sample the initials from an offscreen canvas.
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.round(w));
      off.height = Math.max(1, Math.round(h));
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `700 ${Math.round(h * 0.62)}px "Bricolage Grotesque Variable", system-ui, sans-serif`;
      o.fillText(f.initials, w / 2, h / 2 + h * 0.03);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(5, Math.round(w / 90));
      pts = [];
      for (let y = 0; y < off.height; y += step)
        for (let x = 0; x < off.width; x += step)
          if (data[(y * off.width + x) * 4 + 3] > 128) pts.push({ x, y, hx: x, hy: y });
    };

    let raf = 0;
    const draw = () => {
      if (!still) raf = requestAnimationFrame(draw);
      if (!visible && !still) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (!still && d < 70 && d > 0) {
          p.x += (dx / d) * 4;
          p.y += (dy / d) * 4;
        }
        p.x += (p.hx - p.x) * 0.08;
        p.y += (p.hy - p.y) * 0.08;
        const near = d < 90;
        ctx.fillStyle = near ? "#f6c98b" : "#a4f2c0";
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const ro = new ResizeObserver(() => {
      build();
      if (still) draw();
    });
    ro.observe(c);
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const out = () => (mouse.x = mouse.y = -999);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", out);
    document.fonts?.ready.then(() => {
      build();
      draw();
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", out);
    };
  }, [f.initials]);

  return (
    <div className="plate-stage plate-dots" data-cursor="Move" aria-hidden="true">
      <canvas ref={cv} />
    </div>
  );
}

/* ── Scramble: name and role decode from random letters ───────────────────── */
function ScramblePlate({ f }: { f: Founder }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const words = [f.name.split(" ")[0], f.name.split(" ").slice(1).join(" "), f.initials];
  const nameRef = useRef<HTMLSpanElement>(null);
  const idx = useRef(0);
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    const node = nameRef.current;
    if (!node || !seen || reduced()) return;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/";
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      idx.current = (idx.current + 1) % words.length;
      const target = words[idx.current];
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 800);
        const fixed = Math.floor(p * target.length);
        node.textContent = target
          .split("")
          .map((ch, k) => (k < fixed || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
          .join("");
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    runRef.current = run;
    const id = window.setInterval(run, 2600);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  return (
    <div
      ref={ref}
      className="plate-stage plate-scramble"
      onPointerEnter={() => runRef.current()}
      data-cursor="Decode"
      aria-hidden="true"
    >
      <span className="mono plate-scramble-k">Hello, I&apos;m</span>
      <span ref={nameRef} className="plate-scramble-w">
        {words[0]}
      </span>
    </div>
  );
}

function Plate({ f }: { f: Founder }) {
  if (f.plate === "terminal") return <TerminalPlate f={f} />;
  if (f.plate === "dots") return <DotsPlate f={f} />;
  return <ScramblePlate f={f} />;
}

export default function FounderPlates({ founders }: { founders: Founder[] }) {
  return (
    <ul className="plates" data-stagger>
      {founders.map((f) => {
        const links = [
          f.links.linkedin && { href: f.links.linkedin, label: "LinkedIn" },
          f.links.instagram && { href: f.links.instagram, label: "Instagram" },
          f.links.email && { href: `mailto:${f.links.email}`, label: "Email" },
        ].filter(Boolean) as { href: string; label: string }[];
        return (
          <li key={f.n} className={`plate plate--${f.plate}`}>
            <Plate f={f} />
            <div className="plate-foot">
              <div className="plate-id">
                {f.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.photo} alt="" className="plate-photo" width={56} height={56} loading="lazy" />
                ) : (
                  <span className="plate-photo plate-mono" aria-hidden="true">
                    {f.initials}
                  </span>
                )}
                <div>
                  <span className="mono plate-n">Plate {f.n}</span>
                  <h2>{f.name}</h2>
                  <p className="plate-role">{f.role}</p>
                </div>
              </div>
              <p className="plate-bio">{f.bio}</p>
              <ul className="chips">
                {f.focus.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              {links.length > 0 && (
                <p className="plate-links">
                  {links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-link">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
