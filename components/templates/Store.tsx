"use client";

import { useEffect, useRef, useState } from "react";
import { Words } from "./Kit";
import { sfx } from "@/lib/sfx";

type P = { id: string; name: string; origin: string; size: string; price: number; jar: [string, string]; lid: string; shape: "jar" | "bottle" | "tin" };
const products: P[] = [
  { id: "honey", name: "Wildflower honey", origin: "Okanagan valley", size: "250 g", price: 14, jar: ["#f6c98b", "#c9744a"], lid: "#5aa371", shape: "jar" },
  { id: "jam", name: "Sour cherry jam", origin: "Niagara", size: "220 g", price: 12, jar: ["#c0394b", "#7d1f2c"], lid: "#f2ebd8", shape: "jar" },
  { id: "oil", name: "Cold-pressed canola", origin: "Prairies", size: "500 ml", price: 18, jar: ["#e4ff62", "#a8b83a"], lid: "#193d35", shape: "bottle" },
  { id: "syrup", name: "Dark maple syrup", origin: "Eastern Townships", size: "375 ml", price: 21, jar: ["#a2531f", "#5c2a0c"], lid: "#f2ebd8", shape: "bottle" },
  { id: "salt", name: "Smoked sea salt", origin: "Vancouver Island", size: "120 g", price: 11, jar: ["#d9d4c7", "#8f8a7d"], lid: "#3eb9a8", shape: "tin" },
  { id: "tea", name: "Wild mint tea", origin: "Annapolis valley", size: "40 g", price: 15, jar: ["#5aa371", "#2e6b45"], lid: "#e4ff62", shape: "tin" },
];

function Vessel({ p }: { p: P }) {
  return (
    <div className={`tr-vessel tr-${p.shape}`} aria-hidden="true">
      <i className="lid" style={{ background: p.lid }} />
      <i className="body" style={{ background: `linear-gradient(160deg, ${p.jar[0]}, ${p.jar[1]})` }} />
      <i className="label">
        <span>{p.name.split(" ")[0]}</span>
      </i>
    </div>
  );
}

const story = [
  { k: "01", t: "Small farms", d: "We buy from fourteen growers we have met in person." },
  { k: "02", t: "Small batches", d: "Everything is jarred within a week of harvest." },
  { k: "03", t: "Honest labels", d: "Origin, weight and harvest month on every jar." },
  { k: "04", t: "Slow shipping", d: "Packed by hand in paper and wool, never plastic." },
];

export default function Store() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState<"idle" | "done">("idle");
  const hero = useRef<HTMLDivElement>(null);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((a, [id, q]) => a + (products.find((p) => p.id === id)?.price ?? 0) * q, 0);

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setOpen(true);
    sfx.play("pop");
  };
  const dec = (id: string) =>
    setCart((c) => {
      const n = { ...c, [id]: (c[id] ?? 0) - 1 };
      if (n[id] <= 0) delete n[id];
      return n;
    });

  // Floating jars follow the pointer a little (depth by data-depth).
  useEffect(() => {
    const el = hero.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      items.forEach((it) => {
        const d = parseFloat(it.dataset.depth || "1");
        it.style.translate = `${x * 40 * d}px ${y * 30 * d}px`;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div className="tpl tpl-terra">
      <header className="tpl-nav">
        <a href="#top" className="tr-logo">
          TERRA
        </a>
        <nav>
          <a href="#shop">Shop</a>
          <a href="#story">Story</a>
        </nav>
        <button className="tr-cart-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
          Cart · <span key={count} className="tr-count">{count}</span>
        </button>
      </header>

      <section id="top" className="tr-hero" ref={hero}>
        <h1>
          <Words text="Good" />
          <br />
          <Words text="things" />
          <br />
          <Words text="grow" />
        </h1>
        <p className="tr-lead" data-t-reveal="0.3">
          Small-batch pantry goods from Canadian farms, jarred within a week of harvest.
        </p>
        <a href="#shop" className="tr-btn" data-t-reveal="0.45">
          Shop the pantry
        </a>
        <div className="tr-float" aria-hidden="true">
          <div data-depth="1.6" className="tr-f1">
            <Vessel p={products[0]} />
          </div>
          <div data-depth="0.8" className="tr-f2">
            <Vessel p={products[3]} />
          </div>
          <div data-depth="1.2" className="tr-f3">
            <Vessel p={products[1]} />
          </div>
          <i data-depth="2.2" className="tr-orb o1" />
          <i data-depth="0.6" className="tr-orb o2" />
          <i data-depth="1.4" className="tr-orb o3" />
        </div>
      </section>

      <section id="shop" className="tr-shop">
        <div className="tr-head">
          <h2>
            <Words text="The pantry" />
          </h2>
          <p>{products.length} goods · free shipping over $60</p>
        </div>
        <ul className="tr-grid" data-t-stagger>
          {products.map((p) => (
            <li key={p.id} className="tr-card">
              <div className="tr-card-art">
                <Vessel p={p} />
              </div>
              <span className="tr-origin">
                {p.origin} · {p.size}
              </span>
              <h3>{p.name}</h3>
              <div className="tr-buy">
                <b>${p.price}</b>
                <button onClick={() => add(p.id)} className={cart[p.id] ? "in" : ""}>
                  {cart[p.id] ? `In cart · ${cart[p.id]}` : "Add to cart"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="story" className="tr-story" data-t-hscroll>
        <div className="tr-story-track" data-t-track>
          <div className="tr-story-intro">
            <p className="tr-kicker">From field to shelf</p>
            <h2>
              <Words text="Grown slowly," />
              <br />
              <Words text="sold kindly" className="tr-it" />
            </h2>
          </div>
          {story.map((s) => (
            <article key={s.k} className="tr-story-card">
              <span>{s.k}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tr-news">
        <h2>
          <Words text="First pick of the season," />
          <br />
          <Words text="in your inbox" className="tr-it" />
        </h2>
        {mail === "done" ? (
          <p className="tr-done" role="status">
            You&apos;re on the list. (Template: nothing was sent.)
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMail("done");
            }}
          >
            <input type="email" required placeholder="you@email.com" aria-label="Email" />
            <button className="tr-btn">Join</button>
          </form>
        )}
      </section>

      <footer className="tr-foot">
        <span className="tr-logo">TERRA</span>
        <span>Small-batch pantry goods · Canada</span>
      </footer>

      <div className={`tr-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="tr-scrim" aria-label="Close cart" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />
        <aside className="tr-panel" role="dialog" aria-label="Cart">
          <div className="tr-panel-head">
            <h2>Your cart</h2>
            <button onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Close
            </button>
          </div>
          {count === 0 ? (
            <p className="tr-empty">Nothing here yet. Start with the honey.</p>
          ) : (
            <ul className="tr-lines">
              {Object.entries(cart).map(([id, q]) => {
                const p = products.find((x) => x.id === id)!;
                return (
                  <li key={id}>
                    <div className="tr-line-art">
                      <Vessel p={p} />
                    </div>
                    <div>
                      <b>{p.name}</b>
                      <span>${p.price} each</span>
                    </div>
                    <div className="tr-qty">
                      <button onClick={() => dec(id)} aria-label={`Remove one ${p.name}`} tabIndex={open ? 0 : -1}>
                        −
                      </button>
                      <span>{q}</span>
                      <button onClick={() => add(id)} aria-label={`Add one ${p.name}`} tabIndex={open ? 0 : -1}>
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="tr-total">
            <span>Subtotal</span>
            <b>${total}</b>
          </div>
          <p className="tr-ship">{total >= 60 ? "Free shipping unlocked" : `$${60 - total} away from free shipping`}</p>
          <button className="tr-btn tr-checkout" disabled={!count} tabIndex={open ? 0 : -1}>
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
