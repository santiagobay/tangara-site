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
          {item.live && (
            <span className="live-badge">
              <i aria-hidden="true" /> Live · {item.live.lang}
            </span>
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
            aria-label={`Visit ${item.name} (opens in a new tab)`}
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
        <ul className="chips">
          {item.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Showcase() {
  const liveCount = showcase.filter((s) => s.live).length;
  const conceptCount = showcase.length - liveCount;
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

  return (
    <section id="work" className="work" data-gallery>
      <div className="work-inner">
        <div className="work-head">
          <div>
            <div className="eyebrow">Selected work / live &amp; concept builds</div>
            <Split text="Websites that | *make* a statement." />
          </div>
          <div className="work-side">
            <p className="section-intro">
              {words[liveCount] ?? liveCount} live {liveCount === 1 ? "project" : "projects"} and{" "}
              {(words[conceptCount] ?? String(conceptCount)).toLowerCase()} concept builds that show the
              range of what we design and ship, in English and Spanish.
            </p>
            <div className="work-progress" aria-hidden="true">
              <span data-gallery-count>
                01 / {pad(showcase.length)}
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
        </div>
      </div>
    </section>
  );
}
