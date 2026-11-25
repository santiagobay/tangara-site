"use client";

import { useEffect, useRef, useState } from "react";
import { Words } from "./Kit";

const services = [
  { n: "01", t: "Kitchens", d: "Layouts that work, cabinetry built on site, finished in weeks, not months." },
  { n: "02", t: "Bathrooms", d: "Waterproofed right the first time, with tile work you will want to show off." },
  { n: "03", t: "Basements", d: "Dry, warm and permitted. A full extra floor for the family." },
  { n: "04", t: "Additions", d: "From structural drawings to the last coat of paint, one crew." },
];

const process = [
  { t: "Site visit", d: "We measure, listen and photograph. Free, 45 minutes." },
  { t: "3D plan", d: "You walk through the space before a single wall moves." },
  { t: "Fixed quote", d: "One number, broken down line by line." },
  { t: "Build", d: "A dedicated lead on site and a weekly photo update." },
  { t: "Walkthrough", d: "We fix every last detail before the final invoice." },
];

/* Illustrative rates per sq ft (fictional, for the template's estimator). */
const rates = { Kitchen: 260, Bathroom: 320, Basement: 110, Addition: 340 } as const;
type Kind = keyof typeof rates;

/** A CSS 3D box: front, back, left, right and top faces (the bottom is never seen). */
function Box({
  w,
  h,
  d,
  cls = "",
  at = [0, 0, 0],
  style,
}: {
  w: number;
  h: number;
  d: number;
  cls?: string;
  at?: [number, number, number];
  style?: React.CSSProperties;
}) {
  const [x, y, z] = at;
  return (
    <div
      className={`b3 ${cls}`}
      style={{ width: w, height: h, transform: `translate3d(${x}px, ${y}px, ${z}px)`, ...style }}
    >
      <i className="b3-f" style={{ width: w, height: h, transform: `translateZ(${d / 2}px)` }} />
      <i className="b3-b" style={{ width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)` }} />
      <i
        className="b3-r"
        style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)` }}
      />
      <i
        className="b3-l"
        style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)` }}
      />
      <i
        className="b3-t"
        style={{ width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` }}
      />
    </div>
  );
}

/**
 * Hero model: a mid-rise that drops in floor by floor and a tower crane slewing over it.
 * Pure CSS 3D (about 70 small elements, no WebGL) so it stays cheap on any machine.
 */
function Building() {
  const floors = 7;
  const FH = 46; // floor height
  return (
    <div className="il-scene" aria-hidden="true">
      <div className="il-site">
        <div className="il-tower">
          {Array.from({ length: floors }, (_, i) => (
            <Box
              key={i}
              w={200}
              h={FH}
              d={140}
              cls={`il-fl ${i === 0 ? "il-lobby" : ""} ${i % 3 === 1 ? "il-lit" : ""}`}
              at={[0, -(i + 1) * FH, 0]}
              style={{ "--f": i } as React.CSSProperties}
            />
          ))}
          <Box w={206} h={10} d={146} cls="il-parapet" at={[-3, -floors * FH - 10, 0]} />
          <Box w={44} h={26} d={36} cls="il-unit" at={[30, -floors * FH - 36, -20]} />
          <Box w={30} h={40} d={30} cls="il-tank" at={[130, -floors * FH - 50, 20]} />
        </div>

        <div className="il-crane">
          <Box w={16} h={500} d={16} cls="il-mast" at={[0, -500, 0]} />
          <div className="il-slew" style={{ transform: "translate3d(0, -512px, 0)" }}>
            <Box w={380} h={12} d={12} cls="il-jib" at={[-292, 0, 0]} />
            <Box w={44} h={28} d={26} cls="il-weight" at={[44, -6, 0]} />
            <Box w={24} h={22} d={22} cls="il-cab" at={[-4, 12, 0]} />
            <div className="il-trolley">
              <Box w={18} h={8} d={16} cls="il-carriage" at={[0, 12, 0]} />
              <i className="il-rope" />
              <Box w={14} h={14} d={14} cls="il-hook" />
            </div>
          </div>
        </div>
        <i className="il-ground" />
      </div>
    </div>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const set = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="il-ba"
      onPointerDown={(e) => {
        drag.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        set(e.clientX);
      }}
      onPointerMove={(e) => drag.current && set(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      style={{ "--pos": `${pos}%` } as React.CSSProperties}
    >
      <div className="il-room il-after" aria-hidden="true">
        <i className="win" />
        <i className="cab" />
        <i className="counter" />
        <i className="island" />
        <i className="lamp l1" />
        <i className="lamp l2" />
        <span className="il-tag">After</span>
      </div>
      <div className="il-room il-before" aria-hidden="true">
        <i className="win" />
        <i className="cab" />
        <i className="counter" />
        <span className="il-tag">Before</span>
      </div>
      <input
        type="range"
        min={4}
        max={96}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="il-ba-range"
        aria-label="Compare before and after"
      />
      <span className="il-handle" aria-hidden="true">
        ⟷
      </span>
    </div>
  );
}

function Estimator() {
  const [kind, setKind] = useState<Kind>("Kitchen");
  const [size, setSize] = useState(180);
  const [finish, setFinish] = useState<"Standard" | "Premium">("Standard");
  const base = rates[kind] * size * (finish === "Premium" ? 1.35 : 1);
  const [shown, setShown] = useState({ lo: base * 0.9, hi: base * 1.15 });
  const raf = useRef(0);

  useEffect(() => {
    const target = { lo: base * 0.9, hi: base * 1.15 };
    const start = performance.now();
    const from = shown;
    cancelAnimationFrame(raf.current);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 450);
      const e = 1 - Math.pow(1 - p, 3);
      setShown({ lo: from.lo + (target.lo - from.lo) * e, hi: from.hi + (target.hi - from.hi) * e });
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const money = (n: number) => "$" + (Math.round(n / 500) * 500).toLocaleString("en-CA");

  return (
    <div className="il-est">
      <div className="il-est-row" role="group" aria-label="Project type">
        {(Object.keys(rates) as Kind[]).map((k) => (
          <button key={k} className={kind === k ? "on" : ""} aria-pressed={kind === k} onClick={() => setKind(k)}>
            {k}
          </button>
        ))}
      </div>
      <label className="il-est-size">
        <span>
          Size <b>{size} sq ft</b>
        </span>
        <input type="range" min={40} max={800} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>
      <div className="il-est-row" role="group" aria-label="Finish level">
        {(["Standard", "Premium"] as const).map((f) => (
          <button key={f} className={finish === f ? "on" : ""} aria-pressed={finish === f} onClick={() => setFinish(f)}>
            {f} finish
          </button>
        ))}
      </div>
      <div className="il-est-out" aria-live="polite">
        <span>Estimated range</span>
        <b>
          {money(shown.lo)} – {money(shown.hi)}
        </b>
        <small>Illustrative template figures. A real quote follows the site visit.</small>
      </div>
    </div>
  );
}

export default function Construction() {
  return (
    <div className="tpl tpl-iron">
      <header className="tpl-nav">
        <a href="#top" className="il-logo">
          IRONLINE
        </a>
        <nav>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#process">Process</a>
        </nav>
        <a href="#quote" className="il-btn">
          Get an estimate
        </a>
      </header>

      <section id="top" className="il-hero">
        <div className="il-hero-copy">
          <p className="il-kicker" data-t-reveal>
            Renovations & additions · Greater Toronto Area
          </p>
          <h1>
            <Words text="Build." />
            <br />
            <Words text="Visualize." className="il-accent" />
            <br />
            <Words text="Move in." />
          </h1>
          <p className="il-lead" data-t-reveal="0.3">
            See your renovation in 3D before we start, then get one fixed price. No surprises halfway through.
          </p>
          <a href="#quote" className="il-btn il-btn-lg" data-t-reveal="0.45">
            Estimate my project
          </a>
        </div>
        <Building />
      </section>

      <section id="services" className="il-services">
        <h2>
          <Words text="What we build" />
        </h2>
        <ol data-t-stagger>
          {services.map((s) => (
            <li key={s.n}>
              <span>{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" className="il-projects">
        <div>
          <p className="il-kicker">Project · Kitchen, Riverdale</p>
          <h2>
            <Words text="Drag to see" />
            <br />
            <Words text="the difference" className="il-accent" />
          </h2>
          <p className="il-lead" data-t-reveal>
            Before and after, on one slider. Every project page works this way.
          </p>
        </div>
        <div data-t-clip>
          <BeforeAfter />
        </div>
      </section>

      <section id="process" className="il-process">
        <h2>
          <Words text="Five steps," />
          <br />
          <Words text="one crew" className="il-accent" />
        </h2>
        <div className="il-steps">
          <svg className="il-steps-line" viewBox="0 0 4 100" preserveAspectRatio="none" data-t-draw aria-hidden="true">
            <line x1="2" y1="0" x2="2" y2="100" />
          </svg>
          <ol data-t-stagger>
            {process.map((p, i) => (
              <li key={p.t}>
                <span>0{i + 1}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="quote" className="il-quote">
        <div>
          <p className="il-kicker">Instant estimate</p>
          <h2>
            <Words text="What will" />
            <br />
            <Words text="it cost?" className="il-accent" />
          </h2>
          <p className="il-lead" data-t-reveal>
            Three choices, one honest range. Then we come and measure.
          </p>
        </div>
        <div data-t-reveal>
          <Estimator />
        </div>
      </section>

      <footer className="il-foot">
        <span className="il-logo">IRONLINE</span>
        <span>Licensed & insured · Greater Toronto Area</span>
      </footer>
    </div>
  );
}
