"use client";

import { useRef } from "react";
import Split from "../Split";
import { showcase, type ShowcaseItem } from "@/lib/site";
import Mock from "../Mocks";

const pad = (n: number) => String(n).padStart(2, "0");

function Card({ item }: { item: ShowcaseItem }) {
  const ref = useRef<HTMLDivElement>(null);

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
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const browser = (
    <div ref={ref} className="browser" onPointerMove={move} onPointerLeave={leave}>
      <div className="bar">
        <i />
        <i />
        <i />
        <span>{item.url}</span>
      </div>
      <Mock kind={item.kind} />
      <div className="glare" aria-hidden="true" />
    </div>
  );

  return (
    <article
      className={`card ${item.live ? "is-live" : ""}`}
      data-gallery-card
      data-cursor={item.live ? "Visit live ↗" : "Concept"}
    >
      <div className="card-meta">
        <span className="mono">{item.n}</span>
        <span className="mono">
          {item.live ? (
            <span className="live-badge">
              <i aria-hidden="true" /> Self-initiated · Live
            </span>
          ) : (
            <span className="concept-badge">Concept study · not a client</span>
          )}
          {item.sector}
        </span>
      </div>
      <div className="browser-wrap">
        {item.live ? (
          <a
            href={item.live.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.name} — live site (opens in a new tab)`}
            className="browser-link"
          >
            {browser}
          </a>
        ) : (
          browser
        )}
      </div>
      <div className="card-foot">
        <h3>
          {item.live ? (
            <a href={item.live.href} target="_blank" rel="noopener noreferrer">
              {item.name} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            item.name
          )}
        </h3>
        <p>{item.blurb}</p>
        {item.notes && (
          <dl className="case-notes">
            {item.notes.map((n) => (
              <div key={n.k}>
                <dt className="mono">{n.k}</dt>
                <dd>{n.v}</dd>
              </div>
            ))}
          </dl>
        )}
        <ul className="chips">
          {item.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function FirstCase() {
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
        <span className="mono">Next</span>
        <span className="mono">Open spot</span>
      </div>
      <a href="#contact" className="first-case" onClick={go} data-cursor="Let's talk">
        <span className="first-case-k mono">Case study 01</span>
        <span className="first-case-t">
          Your project could be our <em>first</em> case study
        </span>
        <span className="first-case-cta">
          Tell us what you&apos;re building <span aria-hidden="true">↗</span>
        </span>
      </a>
      <div className="card-foot">
        <p>
          The first businesses we work with get the founders on every call, and the case study is written with
          them, published only with their permission.
        </p>
      </div>
    </article>
  );
}

export default function Showcase() {
  const total = showcase.length + 1;

  return (
    <section id="work" className="work" data-gallery>
      <div className="work-inner">
        <div className="work-head">
          <div>
            <div className="eyebrow">Studio work / self-initiated &amp; concept</div>
            <Split text="No clients to show yet | Here's how we *build*" />
          </div>
          <div className="work-side">
            <p className="section-intro">
              We&apos;re a new studio, so we won&apos;t borrow logos or invent results. What you see is one live
              project we built for ourselves and six concept studies, each labelled for what it is. We design
              and write in English and Spanish.
            </p>
            <div className="work-progress" aria-hidden="true">
              <span data-gallery-count>
                01 / {pad(total)}
              </span>
              <div className="bar-track">
                <div className="bar-fill" data-gallery-bar />
              </div>
            </div>
          </div>
        </div>

        <div className="track" data-gallery-track>
          {showcase.map((s) => (
            <Card key={s.n} item={s} />
          ))}
          <FirstCase />
        </div>
      </div>
    </section>
  );
}
