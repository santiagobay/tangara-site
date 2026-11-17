"use client";

import { useState } from "react";
import Split from "../Split";
import { industries } from "@/lib/site";

export default function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section id="industries" className="section industries">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              Built for every business
            </div>
            <Split text="One approach. | *Many* industries." />
          </div>
          <p className="section-intro" data-reveal>
            We adapt to your sector instead of forcing you into a template. Here is how we typically
            combine our services.
          </p>
        </div>

        <div className="ind-grid">
          <ul className="ind-list" data-stagger>
            {industries.map((x, i) => (
              <li key={x.t}>
                <button
                  className={i === active ? "is-active" : ""}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  data-cursor="Explore"
                  aria-pressed={i === active}
                >
                  <span className="mono">0{i + 1}</span>
                  {x.t}
                </button>
              </li>
            ))}
          </ul>
          <div className="ind-detail" aria-live="polite" data-reveal>
            <div className="mono">{`0${active + 1} / 0${industries.length}`}</div>
            <h3 key={industries[active].t}>{industries[active].t}</h3>
            <p key={industries[active].d}>{industries[active].d}</p>
            <a href="#contact" className="text-link">
              Talk to us about {industries[active].t.toLowerCase()} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
