"use client";

import { useState } from "react";
import { Words } from "./Kit";
import { House } from "./Widgets";

type Unit = { id: string; type: "A" | "B" | "C"; status: "available" | "reserved" | "sold" };
const units: Unit[] = [
  { id: "01", type: "A", status: "sold" },
  { id: "02", type: "A", status: "available" },
  { id: "03", type: "B", status: "reserved" },
  { id: "04", type: "B", status: "available" },
  { id: "05", type: "C", status: "available" },
  { id: "06", type: "C", status: "sold" },
  { id: "07", type: "A", status: "available" },
  { id: "08", type: "A", status: "reserved" },
  { id: "09", type: "B", status: "available" },
  { id: "10", type: "B", status: "available" },
  { id: "11", type: "C", status: "available" },
  { id: "12", type: "C", status: "reserved" },
];
const types = {
  A: { beds: 2, baths: 2, sqft: 1180, from: "649,000", note: "South-facing garden" },
  B: { beds: 3, baths: 2.5, sqft: 1520, from: "829,000", note: "Rooftop terrace" },
  C: { beds: 3, baths: 3, sqft: 1760, from: "949,000", note: "Corner unit, extra windows" },
};

const places = [
  { n: "Jimmie Simpson Park", m: 4 },
  { n: "Queen streetcar", m: 3 },
  { n: "Leslieville farmers' market", m: 6 },
  { n: "Public school", m: 7 },
];

export default function RealEstate() {
  const [sel, setSel] = useState("02");
  const [visit, setVisit] = useState<"idle" | "done">("idle");
  const unit = units.find((u) => u.id === sel)!;
  const t = types[unit.type];
  const left = units.filter((u) => u.status === "available").length;

  return (
    <div className="tpl tpl-casa">
      <header className="tpl-nav">
        <a href="#top" className="cf-logo">
          casa forma
        </a>
        <nav>
          <a href="#homes">Homes</a>
          <a href="#plans">Plans</a>
          <a href="#area">Neighbourhood</a>
        </nav>
        <a href="#visit" className="cf-btn">
          Book a visit
        </a>
      </header>

      <section id="top" className="cf-hero">
        <div className="cf-hero-copy">
          <p className="cf-kicker" data-t-reveal>
            Now pre-selling · Leslieville, Toronto
          </p>
          <h1>
            <Words text="A more" />
            <br />
            <Words text="human home" className="cf-it" />
          </h1>
          <p className="cf-lead" data-t-reveal="0.2">
            Twelve townhomes with gardens, rooftops and morning light. Move in spring 2028.
          </p>
          <div className="cf-stats" data-t-reveal="0.35">
            <div>
              <b data-t-count="12">12</b>
              <span>townhomes</span>
            </div>
            <div>
              <b data-t-count={left}>{left}</b>
              <span>still available</span>
            </div>
            <div>
              <b data-t-count="4">4</b>
              <span>min to the park</span>
            </div>
          </div>
        </div>
        <div className="cf-hero-model">
          <House />
        </div>
      </section>

      <section id="homes" className="cf-homes">
        <div className="cf-head">
          <h2>
            <Words text="Choose your home" />
          </h2>
          <ul className="cf-legend">
            <li className="available">Available</li>
            <li className="reserved">Reserved</li>
            <li className="sold">Sold</li>
          </ul>
        </div>
        <div className="cf-homes-body">
          <div className="cf-site" role="group" aria-label="Units" data-t-stagger>
            {units.map((u) => (
              <button
                key={u.id}
                className={`cf-unit ${u.status} ${sel === u.id ? "on" : ""}`}
                onClick={() => setSel(u.id)}
                aria-pressed={sel === u.id}
                aria-label={`Unit ${u.id}, type ${u.type}, ${u.status}`}
              >
                <span>{u.id}</span>
                <small>Type {u.type}</small>
              </button>
            ))}
          </div>
          <div className="cf-detail" key={sel}>
            <p className="cf-kicker">
              Unit {unit.id} · Type {unit.type} · <span className={`cf-status ${unit.status}`}>{unit.status}</span>
            </p>
            <div className="cf-detail-grid">
              <div>
                <b>{t.beds}</b>
                <span>bedrooms</span>
              </div>
              <div>
                <b>{t.baths}</b>
                <span>bathrooms</span>
              </div>
              <div>
                <b>{t.sqft.toLocaleString("en-CA")}</b>
                <span>sq ft</span>
              </div>
            </div>
            <p className="cf-note">{t.note}</p>
            <p className="cf-price">
              From <b>${t.from}</b>
            </p>
            <a href="#visit" className="cf-btn">
              {unit.status === "sold" ? "Join the waitlist" : "Book a visit"}
            </a>
          </div>
        </div>
      </section>

      <section id="plans" className="cf-plans">
        <div>
          <p className="cf-kicker">Type B · ground floor</p>
          <h2>
            <Words text="Plans that" />
            <br />
            <Words text="draw themselves" className="cf-it" />
          </h2>
          <p className="cf-lead" data-t-reveal>
            Scroll and the plan sketches itself, wall by wall. Every room gets a window.
          </p>
        </div>
        <svg className="cf-plan" viewBox="0 0 400 300" data-t-draw aria-hidden="true">
          <rect x="10" y="10" width="380" height="280" />
          <line x1="190" y1="10" x2="190" y2="170" />
          <line x1="10" y1="170" x2="260" y2="170" />
          <line x1="260" y1="170" x2="260" y2="290" />
          <path d="M190 120 A 40 40 0 0 1 230 160" />
          <path d="M60 170 A 34 34 0 0 0 94 204" />
          <line x1="300" y1="10" x2="300" y2="110" />
          <line x1="300" y1="110" x2="390" y2="110" />
          <polyline points="30,250 30,270 120,270" />
          <text x="80" y="95">Living</text>
          <text x="225" y="70">Kitchen</text>
          <text x="320" y="65">Bath</text>
          <text x="110" y="235">Bedroom</text>
          <text x="300" y="235">Garden →</text>
        </svg>
      </section>

      <section id="area" className="cf-area">
        <svg className="cf-map" viewBox="0 0 400 300" aria-hidden="true">
          <g className="cf-streets" data-t-draw>
            <path d="M0 80 H400" />
            <path d="M0 210 H400" />
            <path d="M120 0 V300" />
            <path d="M290 0 V300" />
            <path d="M0 300 L400 20" />
          </g>
          <rect className="cf-parkshape" x="300" y="220" width="90" height="70" rx="10" />
          <g className="cf-home-pin">
            <circle cx="200" cy="150" r="22" />
            <circle cx="200" cy="150" r="7" />
          </g>
          {[
            [330, 250],
            [120, 80],
            [60, 210],
            [290, 40],
          ].map(([x, y], i) => (
            <circle key={i} className="cf-pin" cx={x} cy={y} r="6" style={{ "--d": `${i * 0.4}s` } as React.CSSProperties} />
          ))}
        </svg>
        <div>
          <p className="cf-kicker">The neighbourhood</p>
          <h2>
            <Words text="Everything," />
            <br />
            <Words text="a short walk away" className="cf-it" />
          </h2>
          <ul className="cf-places" data-t-stagger>
            {places.map((p) => (
              <li key={p.n}>
                <span>{p.n}</span>
                <b>{p.m} min</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="visit" className="cf-visit">
        <h2>
          <Words text="Come see" />
          <br />
          <Words text="the light" className="cf-it" />
        </h2>
        {visit === "done" ? (
          <p className="cf-done" role="status">
            Thank you. Our sales team would call you within a day. (This is a template: nothing was sent.)
          </p>
        ) : (
          <form
            className="cf-form"
            onSubmit={(e) => {
              e.preventDefault();
              setVisit("done");
            }}
          >
            <input aria-label="Your name" placeholder="Your name" required />
            <input aria-label="Email" type="email" placeholder="Email" required />
            <select aria-label="Preferred day" defaultValue="Saturday">
              <option>Saturday</option>
              <option>Sunday</option>
              <option>Weekday evening</option>
            </select>
            <button type="submit" className="cf-btn">
              Book a visit
            </button>
          </form>
        )}
      </section>

      <footer className="cf-foot">
        <span className="cf-logo">casa forma</span>
        <span>Sales centre · 1180 Queen St E · Sat & Sun 11 – 5</span>
      </footer>
    </div>
  );
}
