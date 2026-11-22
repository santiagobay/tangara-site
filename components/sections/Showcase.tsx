"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Split from "../Split";
import { showcase, type ShowcaseItem } from "@/lib/site";
import Mock from "../Mocks";

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

function Card({ item }: { item: ShowcaseItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardRef, inView] = usePlay();

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
      ref={cardRef as React.RefObject<HTMLElement>}
      className={`card ${item.live ? "is-live" : ""} ${inView ? "is-play" : ""}`}
      data-gallery-card
      data-cursor={item.live ? "Visit live ↗" : item.study ? "View study" : "Direction study"}
    >
      <div className="card-meta">
        <span className="mono">{item.n}</span>
        <span className="mono">
          {item.live ? (
            <span className="live-badge">
              <i aria-hidden="true" /> Self-initiated · Live
            </span>
          ) : (
            <span className="concept-badge">Direction study · concept</span>
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
        ) : item.study ? (
          <Link href={`/work/${item.study}`} aria-label={`${item.name} — read the direction study`} className="browser-link">
            {browser}
          </Link>
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
          ) : item.study ? (
            <Link href={`/work/${item.study}`}>
              {item.name} <span aria-hidden="true">→</span>
            </Link>
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
        {item.approach && (
          <details className="approach">
            <summary>
              How we&apos;d approach it <span aria-hidden="true">+</span>
            </summary>
            <ol>
              {item.approach.map((a, i) => (
                <li key={a}>
                  <span className="mono">0{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
          </details>
        )}
        {item.study && (
          <Link href={`/work/${item.study}`} className="text-link study-link">
            Read the full study <span aria-hidden="true">→</span>
          </Link>
        )}
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
        <span className="mono">Now booking</span>
      </div>
      <a href="#contact" className="first-case" onClick={go} data-cursor="Let's talk">
        <span className="first-case-k mono">Next case study</span>
        <span className="first-case-t">
          The next one <em>could</em> be yours
        </span>
        <span className="first-case-cta">
          Tell us what you&apos;re building <span aria-hidden="true">↗</span>
        </span>
      </a>
      <div className="card-foot">
        <p>
          Every client project is planned with the whole team on the call, and published here only with the
          client&apos;s permission.
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
            <div className="eyebrow">Work / studio projects &amp; direction studies</div>
            <Split text="Studio projects and | *direction* studies" />
          </div>
          <div className="work-side">
            <p className="section-intro">
              A live project built in-house and a series of direction studies: how we would approach a store,
              a pre-sale, a restaurant or a launch. Each piece is labelled for what it is.
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
