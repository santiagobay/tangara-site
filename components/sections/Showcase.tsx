"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Split from "../Split";
import Mock from "../Mocks";
import { templates, type Template } from "@/lib/templates";

const pad = (n: number) => String(n).padStart(2, "0");

/** Plays the mock's micro-animation on hover (mouse) or while it is on screen (touch). */
function usePlay() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Card({ t, i }: { t: Template; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardRef, inView] = usePlay();
  const href = `/templates/${t.slug}`;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 8}deg`);
    el.style.setProperty("--ry", `${x * 10}deg`);
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={`card ${inView ? "is-play" : ""}`}
      data-gallery-card
      data-cursor="Open template"
    >
      <div className="card-meta">
        <span className="mono">{pad(i + 1)}</span>
        <span className="mono">
          <span className="concept-badge">Template</span>
          {t.industry}
        </span>
      </div>
      <div className="browser-wrap">
        <Link href={href} aria-label={`Open the ${t.industry.toLowerCase()} template`} className="browser-link">
          <div ref={ref} className="browser" onPointerMove={move} onPointerLeave={leave}>
            <div className="bar">
              <i />
              <i />
              <i />
              <span>template / {t.slug}</span>
            </div>
            <Mock kind={t.kind} />
            <div className="glare" aria-hidden="true" />
          </div>
        </Link>
      </div>
      <div className="card-foot">
        <h3>
          <Link href={href}>
            {t.industry} <span aria-hidden="true">→</span>
          </Link>
        </h3>
        <p>{t.pitch}</p>
        <ul className="chips">
          {t.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Link href={href} className="text-link study-link">
          Open the template <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function Custom() {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const t = document.querySelector<HTMLElement>("#contact");
    if (!t) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(t, { offset: -70, duration: 1.4 });
    else t.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <article className="card card-first" data-gallery-card>
      <div className="card-meta">
        <span className="mono">{pad(templates.length + 1)}</span>
        <span className="mono">Made to measure</span>
      </div>
      <a href="#contact" className="first-case" onClick={go} data-cursor="Let's talk">
        <span className="first-case-k mono">Something else?</span>
        <span className="first-case-t">
          We build from <em>scratch</em> too
        </span>
        <span className="first-case-cta">
          Tell us what you&apos;re building <span aria-hidden="true">↗</span>
        </span>
      </a>
      <div className="card-foot">
        <p>Templates are a starting point. Every site we ship is adapted to your brand, your content and your customers.</p>
      </div>
    </article>
  );
}

export default function Showcase() {
  const total = templates.length + 1;
  return (
    <section id="work" className="work" data-gallery>
      <div className="work-inner">
        <div className="work-head">
          <div>
            <div className="eyebrow">Work / website templates</div>
            <Split text="Four templates | ready to make *yours*" />
          </div>
          <div className="work-side">
            <p className="section-intro">
              Complete websites for restaurants, real estate, online stores and builders. Designed, animated and
              ready to adapt to your brand. Open one and click around: everything works.
            </p>
            <div className="work-progress" aria-hidden="true">
              <span data-gallery-count>01 / {pad(total)}</span>
              <div className="bar-track">
                <div className="bar-fill" data-gallery-bar />
              </div>
            </div>
          </div>
        </div>

        <div className="track" data-gallery-track>
          {templates.map((t, i) => (
            <Card key={t.slug} t={t} i={i} />
          ))}
          <Custom />
        </div>
      </div>
    </section>
  );
}
