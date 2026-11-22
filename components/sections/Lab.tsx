"use client";

import { useEffect, useRef, useState } from "react";
import Split from "../Split";
import { sfx, NOTE_NAMES } from "@/lib/sfx";
import { useSound } from "../Sound";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Tracks whether an element is near the viewport — demos pause offscreen. */
function useVisible(ref: React.RefObject<Element | null>) {
  const vis = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (vis.current = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return vis;
}

/* ── 01 · Kinetic type: words decode from random glyphs ─────────────────── */
function Scramble() {
  const el = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const vis = useVisible(stage);
  const hovering = useRef(false);
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    const node = el.current;
    if (!node || reduced()) return;
    const words = ["Brand", "Motion", "Story", "Launch", "Español", "Sound"];
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/";
    let i = 0;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      i = (i + 1) % words.length;
      const target = words[i];
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 900);
        const fixed = Math.floor(p * target.length);
        node.textContent = target
          .split("")
          .map((c, k) => (k < fixed ? c : glyphs[(Math.random() * glyphs.length) | 0]))
          .join("");
        if (hovering.current) sfx.play("tick");
        if (p < 1) raf = requestAnimationFrame(tick);
        else if (hovering.current) sfx.play("chime");
      };
      raf = requestAnimationFrame(tick);
    };
    runRef.current = run;
    const id = window.setInterval(() => vis.current && run(), 2600);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [vis]);

  return (
    <div
      ref={stage}
      className="lab-stage lab-type"
      onPointerEnter={() => {
        hovering.current = true;
        runRef.current();
      }}
      onPointerLeave={() => (hovering.current = false)}
    >
      <span className="lab-type-k mono">We make it</span>
      <span ref={el} className="lab-type-w">
        Brand
      </span>
      <span className="lab-hint mono">Hover to decode</span>
    </div>
  );
}

/* ── 02 · Particle field: repels from the pointer, bursts on click ──────── */
function Particles() {
  const cv = useRef<HTMLCanvasElement>(null);
  const vis = useVisible(cv);
  useEffect(() => {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const still = reduced();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const mouse = { x: -999, y: -999 };
    const pts = Array.from({ length: 64 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
    }));
    let sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const size = () => {
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const out = () => (mouse.x = mouse.y = -999);
    const burst = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      for (let k = 0; k < 26; k++) {
        const a = (k / 26) * Math.PI * 2;
        const s = 1.5 + Math.random() * 2.5;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
      }
      for (let k = 0; k < 4; k++) setTimeout(() => sfx.play("pop"), k * 55);
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", out);
    c.addEventListener("pointerdown", burst);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!vis.current && !still) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!still) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        }
        const dx = p.x * w - mouse.x;
        const dy = p.y * h - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 90 && d > 0) {
          p.x += (dx / d) * 0.004;
          p.y += (dy / d) * 0.004;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
          if (d < 70) {
            ctx.strokeStyle = `rgba(62,185,168,${(1 - d / 70) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
        const near = Math.hypot(a.x * w - mouse.x, a.y * h - mouse.y) < 110;
        ctx.fillStyle = near ? "#f6c98b" : "#a4f2c0";
        ctx.beginPath();
        ctx.arc(a.x * w, a.y * h, near ? 2.6 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.life -= 0.022;
        ctx.fillStyle = `rgba(246,201,139,${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2 * s.life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (still && sparks.length === 0) cancelAnimationFrame(raf);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", out);
      c.removeEventListener("pointerdown", burst);
    };
  }, [vis]);
  return (
    <div className="lab-stage lab-particles" data-cursor="Burst">
      <canvas ref={cv} />
      <span className="lab-hint mono">Move · click</span>
    </div>
  );
}

/* ── 03 · Exploded 3D view: layers separate on hover / tap ──────────────── */
function Exploded() {
  const [open, setOpen] = useState(false);
  const pt = useRef("");
  const set = (v: boolean) =>
    setOpen((o) => {
      if (o !== v) sfx.play(v ? "whoosh" : "close");
      return v;
    });
  const layers = ["Board", "GPU", "Cooling", "Glass"];
  return (
    <button
      type="button"
      className={`lab-stage lab-explode ${open ? "is-open" : ""}`}
      onPointerDown={(e) => (pt.current = e.pointerType)}
      onClick={() => {
        // Mouse users open it by hovering; touch and keyboard toggle on press.
        if (pt.current !== "mouse") set(!open);
        pt.current = "";
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && set(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && set(false)}
      aria-pressed={open}
      aria-label="Toggle exploded view"
      data-cursor="Explode"
      data-sfx="none"
    >
      <span className="lab-iso">
        {layers.map((l, i) => (
          <span key={l} className="lab-plate" style={{ "--i": i } as React.CSSProperties}>
            <em className="mono">{l}</em>
          </span>
        ))}
      </span>
    </button>
  );
}

/* ── 04 · Scroll-driven path (scrubbed by <Motion />, notes on milestones) ── */
function ScrollPath() {
  const d = "M20 220 C 90 220, 90 60, 160 60 S 240 200, 300 160 S 360 40, 384 40";
  const nodes: [number, number, string][] = [
    [20, 220, "Brief"],
    [160, 60, "Idea"],
    [300, 160, "Build"],
    [384, 40, "Launch"],
  ];
  return (
    <div className="lab-stage lab-path" data-lab-path>
      <svg viewBox="-10 0 420 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path className="ghost" d={d} />
        <path className="draw" pathLength={1} d={d} />
        {nodes.map(([x, y, t]) => (
          <g key={t} className="node" data-lab-node>
            <circle cx={x} cy={y} r={7} />
            <text x={x > 340 ? x - 12 : x + 12} y={y - 14} textAnchor={x > 340 ? "end" : "start"}>
              {t}
            </text>
          </g>
        ))}
      </svg>
      <span className="lab-hint mono">Scroll to draw</span>
    </div>
  );
}

/* ── 05 · Reactive dot grid: follows the pointer, ripples on click ─────── */
function DotGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const cols = 22;
  const rows = 9;
  const each = (e: React.PointerEvent, fn: (d: HTMLElement, dist: number) => void) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dots = el.querySelectorAll<HTMLElement>("i");
    dots.forEach((d, k) => {
      const x = ((k % cols) + 0.5) * (r.width / cols);
      const y = (Math.floor(k / cols) + 0.5) * (r.height / rows);
      fn(d, Math.hypot(x - px, y - py));
    });
  };
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-active");
    each(e, (d, dist) => d.style.setProperty("--s", Math.max(0, 1 - dist / 130).toFixed(3)));
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-active", "is-ripple");
    el.querySelectorAll<HTMLElement>("i").forEach((d) => d.style.removeProperty("--s"));
  };
  const ripple = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-ripple");
    each(e, (d, dist) => d.style.setProperty("--rd", `${(dist / 900).toFixed(3)}s`));
    void el.offsetWidth;
    el.classList.add("is-ripple");
    sfx.note(0, { gain: 0.12, dur: 1.2 });
    sfx.note(4, { gain: 0.06, dur: 1.4 });
  };
  return (
    <div
      ref={ref}
      className="lab-stage lab-grid"
      style={{ "--cols": cols, "--rows": rows } as React.CSSProperties}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerDown={ripple}
      data-cursor="Ripple"
    >
      {Array.from({ length: cols * rows }, (_, k) => (
        <i key={k} style={{ "--d": (k % cols) + Math.floor(k / cols) } as React.CSSProperties} />
      ))}
      <span className="lab-hint mono">Move · click</span>
    </div>
  );
}

/* ── 06 · Micro-interaction: idle → loading → done ──────────────────────── */
function MicroButton() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  const go = () => {
    if (state !== "idle") return;
    setState("busy");
    t.current.push(
      window.setTimeout(() => {
        setState("done");
        sfx.play("success");
      }, 1400),
    );
    t.current.push(window.setTimeout(() => setState("idle"), 3600));
  };
  return (
    <div className="lab-stage lab-micro">
      <button type="button" className={`lab-btn is-${state}`} onClick={go} data-cursor="Try it">
        <span className="lab-btn-t" aria-live="polite">
          {state === "idle" ? "Book a table" : state === "busy" ? "Booking…" : "Confirmed"}
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
        </svg>
      </button>
    </div>
  );
}

/* ── 07 · Sound design: playable pads + live waveform ───────────────────── */
function SoundPads() {
  const on = useSound();
  const cv = useRef<HTMLCanvasElement>(null);
  const vis = useVisible(cv);
  const [hit, setHit] = useState<number | null>(null);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const play = (i: number) => {
    if (!sfx.enabled) sfx.setEnabled(true);
    sfx.note(i);
    setHit(i);
    window.setTimeout(() => setHit((h) => (h === i ? null : h)), 260);
  };

  useEffect(() => {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let buf: Uint8Array<ArrayBuffer> | null = null;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!vis.current) return;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const an = sfx.enabled ? sfx.analyser() : null;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3eb9a8";
      ctx.shadowColor = "rgba(62,185,168,0.6)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      if (an) {
        if (!buf || buf.length !== an.fftSize) buf = new Uint8Array(an.fftSize);
        an.getByteTimeDomainData(buf);
        for (let i = 0; i < buf.length; i++) {
          const x = (i / (buf.length - 1)) * w;
          const y = h / 2 + ((buf[i] - 128) / 128) * h * 0.9;
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
      } else {
        const t = performance.now() / 900;
        for (let x = 0; x <= w; x += 4) {
          const y = h / 2 + Math.sin(x / 18 + t) * 3;
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [vis]);

  return (
    <div
      className="lab-stage lab-sound"
      onKeyDown={(e) => {
        const i = keys.indexOf(e.key);
        if (i >= 0) play(i);
      }}
    >
      <canvas ref={cv} className="lab-wave" aria-hidden="true" />
      <div className="lab-pads" role="group" aria-label="Sound pads">
        {NOTE_NAMES.map((n, i) => (
          <button
            key={i}
            type="button"
            className={`lab-pad ${hit === i ? "is-hit" : ""}`}
            onPointerDown={() => play(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), play(i))}
            data-sfx="none"
            aria-label={`Play note ${n}`}
          >
            <span className="mono">{n}</span>
            <small className="mono">{keys[i]}</small>
          </button>
        ))}
      </div>
      <span className="lab-hint mono">{on ? "Play the pads · keys 1–8" : "Tap a pad to turn sound on"}</span>
    </div>
  );
}

/* ── 08 · Data in motion: counters + chart that build when seen ────────── */
function DataMotion() {
  const ref = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(0);
  const nums = useRef<(HTMLElement | null)[]>([]);
  // Placeholder figures only — never present these as client results.
  const stats: { v: number; k: string; pre?: string; suf?: string; dec?: number }[] = [
    { v: 12, k: "Your metric" },
    { v: 3.5, k: "Your metric", dec: 1 },
    { v: 64, suf: "%", k: "Your metric" },
  ];
  const bars = [32, 46, 40, 58, 52, 74, 68, 88, 96];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun((r) => r + 1);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    const el = ref.current;
    el?.classList.remove("is-on");
    void el?.offsetWidth;
    el?.classList.add("is-on");
    const start = performance.now();
    const dur = reduced() ? 1 : 1400;
    let raf = 0;
    let lastStep = -1;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      stats.forEach((s, i) => {
        const n = nums.current[i];
        if (n) n.textContent = `${s.pre ?? ""}${(s.v * e).toFixed(s.dec ?? 0)}${s.suf ?? ""}`;
      });
      const step = Math.floor(p * 8);
      if (step !== lastStep && run > 1) {
        lastStep = step;
        sfx.play("tick");
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else if (run > 1) sfx.play("chime");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return (
    <button
      type="button"
      ref={ref}
      className="lab-stage lab-data"
      onClick={() => setRun((r) => r + 1)}
      data-cursor="Replay"
      data-sfx="none"
      aria-label="Replay the data animation (placeholder numbers)"
    >
      <span className="lab-stats">
        {stats.map((s, i) => (
          <span key={s.k}>
            <b ref={(n) => void (nums.current[i] = n)}>0</b>
            <small className="mono">{s.k}</small>
          </span>
        ))}
      </span>
      <span className="lab-bars" aria-hidden="true">
        {bars.map((b, i) => (
          <i key={i} style={{ "--h": `${b}%`, "--i": i } as React.CSSProperties} />
        ))}
      </span>
      <span className="lab-hint mono">Placeholder numbers · your data goes here · click to replay</span>
    </button>
  );
}

/* ── 09 · Liquid shapes: gooey blobs that merge with the pointer ────────── */
function Liquid() {
  const svg = useRef<SVGSVGElement>(null);
  const lead = useRef<SVGCircleElement>(null);
  const vis = useVisible(svg);
  const target = useRef({ x: 200, y: 150 });

  useEffect(() => {
    const c = lead.current;
    if (!c) return;
    const pos = { x: 200, y: 150 };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!vis.current) return;
      pos.x += (target.current.x - pos.x) * 0.12;
      pos.y += (target.current.y - pos.y) * 0.12;
      c.setAttribute("cx", pos.x.toFixed(1));
      c.setAttribute("cy", pos.y.toFixed(1));
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [vis]);

  const move = (e: React.PointerEvent) => {
    const s = svg.current;
    if (!s) return;
    const r = s.getBoundingClientRect();
    const scale = Math.max(400 / r.width, 300 / r.height);
    target.current = {
      x: 200 + (e.clientX - r.left - r.width / 2) * scale,
      y: 150 + (e.clientY - r.top - r.height / 2) * scale,
    };
  };

  return (
    <div
      className="lab-stage lab-liquid"
      onPointerMove={move}
      onPointerLeave={() => (target.current = { x: 200, y: 150 })}
      onPointerDown={() => {
        const c = lead.current;
        if (c) {
          c.classList.remove("is-pulse");
          void c.getBoundingClientRect();
          c.classList.add("is-pulse");
        }
        sfx.play("pop");
        sfx.note(5, { gain: 0.08, dur: 0.6 });
      }}
      data-cursor="Squish"
    >
      <svg ref={svg} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="lab-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b" />
            <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
          <linearGradient id="lab-goo-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a4f2c0" />
            <stop offset="0.55" stopColor="#3eb9a8" />
            <stop offset="1" stopColor="#f6c98b" />
          </linearGradient>
        </defs>
        <g filter="url(#lab-goo)" fill="url(#lab-goo-fill)">
          <g className="orbit o1">
            <circle cx="200" cy="96" r="30" />
          </g>
          <g className="orbit o2">
            <circle cx="268" cy="150" r="24" />
          </g>
          <g className="orbit o3">
            <circle cx="140" cy="190" r="34" />
          </g>
          <circle cx="200" cy="150" r="46" />
          <circle ref={lead} className="lead" cx="200" cy="150" r="28" />
        </g>
      </svg>
      <span className="lab-hint mono">Move · click</span>
    </div>
  );
}

const items = [
  { n: "01", area: "type", t: "Kinetic typography", d: "Headlines that decode and assemble themselves.", C: Scramble },
  { n: "02", area: "parts", t: "Interactive particles", d: "Generative fields that react to every move.", C: Particles },
  { n: "03", area: "expl", t: "Exploded 3D views", d: "Products taken apart, layer by layer.", C: Exploded },
  { n: "04", area: "path", t: "Scroll storytelling", d: "Timelines that unfold as you scroll.", C: ScrollPath },
  { n: "05", area: "sound", t: "Sound design", d: "Custom UI sounds and sonic branding, synthesised live in the browser.", C: SoundPads },
  { n: "06", area: "grid", t: "Reactive surfaces", d: "Textures that ripple around the pointer.", C: DotGrid },
  { n: "07", area: "micro", t: "Micro-interactions", d: "Clear feedback at every step: tap, wait, done.", C: MicroButton },
  { n: "08", area: "data", t: "Data in motion", d: "Your numbers and charts, built as they are seen. (Placeholder figures.)", C: DataMotion },
  { n: "09", area: "liquid", t: "Liquid shapes", d: "Organic forms that merge, stretch and follow.", C: Liquid },
];

export default function Lab() {
  return (
    <section id="lab" className="section lab">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              Lab
            </div>
            <Split text="Built in-house | Ready for *your* site" />
          </div>
          <p className="section-intro" data-reveal>
            Every tile below is live and made by us. Hover it, click it, scroll past it. Each one is
            something we can build into your website, your launch or your presentation.
          </p>
        </div>

        <ul className="lab-bento" data-stagger>
          {items.map(({ n, area, t, d, C }) => (
            <li key={n} className={`lab-tile lab-tile--${area}`}>
              <C />
              <div className="lab-foot">
                <span className="mono num">{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
