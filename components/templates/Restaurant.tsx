"use client";

import { useState } from "react";
import { Words } from "./Kit";
import { Booking } from "./Widgets";

const menu = {
  Starters: [
    { n: "Charred leeks", d: "Hazelnut romesco, brown butter crumb", p: 16, c: ["#5aa371", "#c9744a", "#f4ece0"] },
    { n: "Burrata", d: "Blood orange, fennel, chili oil", p: 19, c: ["#f4ece0", "#e0603b", "#f6c98b"] },
    { n: "Beef tartare", d: "Smoked yolk, capers, rye crisps", p: 22, c: ["#8c2f2f", "#f6c98b", "#3a332d"] },
  ],
  Mains: [
    { n: "Saffron risotto", d: "Aged parmesan, crispy shallots", p: 29, c: ["#f6c98b", "#e9b84a", "#f4ece0"] },
    { n: "Half chicken", d: "Wood-fired, salsa verde, potatoes", p: 34, c: ["#c9744a", "#5aa371", "#f6c98b"] },
    { n: "Market fish", d: "Beurre blanc, charred greens", p: 38, c: ["#f4ece0", "#5aa371", "#e9b84a"] },
  ],
  Desserts: [
    { n: "Olive oil cake", d: "Crème fraîche, roasted plums", p: 13, c: ["#e9b84a", "#8c2f5a", "#f4ece0"] },
    { n: "Dark chocolate", d: "Sea salt, espresso cream", p: 14, c: ["#3a2418", "#f4ece0", "#c9744a"] },
    { n: "Affogato", d: "Vanilla bean gelato, double shot", p: 11, c: ["#f4ece0", "#3a2418", "#f6c98b"] },
  ],
};
type Cat = keyof typeof menu;

function Plate({ c }: { c: string[] }) {
  return (
    <div className="ms-plate" aria-hidden="true">
      <i style={{ background: c[0] }} />
      <i style={{ background: c[1] }} />
      <i style={{ background: c[2] }} />
    </div>
  );
}

export default function Restaurant() {
  const [cat, setCat] = useState<Cat>("Starters");
  const [hover, setHover] = useState(0);
  const items = menu[cat];

  return (
    <div className="tpl tpl-mesa">
      <header className="tpl-nav">
        <a href="#top" className="ms-logo">
          Mesa
        </a>
        <nav>
          <a href="#menu">Menu</a>
          <a href="#room">The room</a>
          <a href="#visit">Visit</a>
        </nav>
        <a href="#reserve" className="ms-btn">
          Reserve
        </a>
      </header>

      <section id="top" className="ms-hero">
        <div className="ms-hero-copy">
          <p className="ms-kicker" data-t-reveal>
            Wood-fired kitchen · Wed to Sun
          </p>
          <h1>
            <Words text="Tonight," />
            <br />
            <Words text="a table" />
            <br />
            <Words text="for two" className="ms-it" />
          </h1>
          <div className="ms-hero-cta" data-t-reveal="0.3">
            <a href="#reserve" className="ms-btn ms-btn-lg">
              Book a table
            </a>
            <a href="#menu" className="ms-link">
              See the menu ↓
            </a>
          </div>
        </div>
        <div className="ms-candle" aria-hidden="true">
          <div className="ms-glow" />
          <div className="ms-flame">
            <i />
          </div>
          <div className="ms-wick" />
          <div className="ms-wax" />
          {Array.from({ length: 10 }, (_, i) => (
            <b key={i} className="ms-spark" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      </section>

      <div className="ms-marquee" aria-hidden="true">
        <div className="ms-marquee-track">
          {[0, 1].map((k) => (
            <span key={k}>
              Charred leeks <em>✦</em> Saffron risotto <em>✦</em> Half chicken <em>✦</em> Olive oil cake{" "}
              <em>✦</em> Market fish <em>✦</em> Burrata <em>✦</em> Affogato <em>✦</em>{" "}
            </span>
          ))}
        </div>
      </div>

      <section id="menu" className="ms-menu">
        <div className="ms-menu-head">
          <h2>
            <Words text="The menu" />
          </h2>
          <div className="ms-tabs" role="tablist" aria-label="Menu sections">
            {(Object.keys(menu) as Cat[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={cat === k}
                className={cat === k ? "on" : ""}
                onClick={() => {
                  setCat(k);
                  setHover(0);
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="ms-menu-body">
          <ul className="ms-list" key={cat}>
            {items.map((it, i) => (
              <li
                key={it.n}
                className={hover === i ? "on" : ""}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
              >
                <div className="ms-item-top">
                  <h3>{it.n}</h3>
                  <span className="ms-dots" />
                  <b>${it.p}</b>
                </div>
                <p>{it.d}</p>
              </li>
            ))}
          </ul>
          <div className="ms-plate-wrap">
            <Plate key={`${cat}-${hover}`} c={items[hover].c} />
            <span className="ms-plate-cap">{items[hover].n}</span>
          </div>
        </div>
      </section>

      <section id="room" className="ms-room" data-t-mood="#15110e,#3a1f12">
        <p className="ms-kicker">The room</p>
        <h2 className="ms-room-lines">
          <Words text="Low light." />
          <br />
          <Words text="Long tables." />
          <br />
          <Words text="Loud laughs." className="ms-it" />
        </h2>
        <p className="ms-room-sub" data-t-reveal>
          Forty seats around an open fire. Walk-ins at the bar, always.
        </p>
      </section>

      <section id="reserve" className="ms-reserve">
        <div>
          <p className="ms-kicker">Reservations</p>
          <h2>
            <Words text="Pick a time." />
            <br />
            <Words text="We'll light a candle." className="ms-it" />
          </h2>
        </div>
        <div className="ms-booking" data-t-reveal>
          <Booking />
        </div>
      </section>

      <footer id="visit" className="ms-foot">
        <div>
          <span className="ms-logo">Mesa</span>
          <p>214 Ossington Ave, Toronto</p>
        </div>
        <dl>
          <div>
            <dt>Wed – Thu</dt>
            <dd>5 pm – 10 pm</dd>
          </div>
          <div>
            <dt>Fri – Sat</dt>
            <dd>5 pm – 12 am</dd>
          </div>
          <div>
            <dt>Sun</dt>
            <dd>4 pm – 9 pm</dd>
          </div>
        </dl>
      </footer>
    </div>
  );
}
