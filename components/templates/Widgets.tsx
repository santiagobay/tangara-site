"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Casa Forma: a CSS 3D townhouse that turns with the pointer (or a drag on touch) ── */
export function House() {
  const stage = useRef<HTMLDivElement>(null);
  const model = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current;
    const m = model.current;
    if (!el || !m) return;
    const still = reduced();
    const s = { ry: -30, ty: -30, rx: -12, tx: -12, idle: true, dragging: false, lastX: 0 };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (s.idle && !still) s.ty += 0.12;
      s.ry += (s.ty - s.ry) * 0.08;
      s.rx += (s.tx - s.rx) * 0.08;
      m.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
    };
    loop();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.pointerType === "mouse") {
        s.idle = false;
        s.ty = ((e.clientX - r.left) / r.width - 0.5) * 140;
        s.tx = -8 - ((e.clientY - r.top) / r.height - 0.5) * 18;
      } else if (s.dragging) {
        s.ty += (e.clientX - s.lastX) * 0.6;
        s.lastX = e.clientX;
      }
    };
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.idle = false;
      s.lastX = e.clientX;
    };
    const up = () => (s.dragging = false);
    const leave = () => (s.idle = true);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={stage} className="sig-stage sig-house" data-cursor="Turn" aria-hidden="true">
      <div className="house3d" ref={model}>
        <div className="h-face h-front">
          <i /> <i /> <i className="door" />
        </div>
        <div className="h-face h-back" />
        <div className="h-face h-left">
          <i />
        </div>
        <div className="h-face h-right">
          <i />
        </div>
        <div className="h-roof h-roof-l" />
        <div className="h-roof h-roof-r" />
        <div className="h-gable h-gable-f" />
        <div className="h-gable h-gable-b" />
        <div className="h-ground" />
      </div>
      <span className="sig-hint mono">Move · drag to turn</span>
    </div>
  );
}

/* ── Mesa: three-tap reservation ─────────────────────────────────────────── */
export function Booking() {
  const days = ["Tonight", "Tomorrow", "Fri"];
  const times = ["6:30", "7:00", "7:30", "8:00", "8:30", "9:00"];
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);

  const confirm = () => {
    if (!time || state !== "idle") return;
    setState("busy");
    t.current.push(
      window.setTimeout(() => {
        setState("done");
        sfx.play("success");
      }, 900),
    );
  };
  const reset = () => {
    setState("idle");
    setTime(null);
  };

  return (
    <div className="sig-stage sig-booking">
      {state === "done" ? (
        <div className="bk-done" role="status">
          <span className="mono">Confirmed</span>
          <p>
            See you {days[day].toLowerCase()} at {time}, table for {guests}.
          </p>
          <em>— The Mesa kitchen</em>
          <button type="button" className="bk-again" onClick={reset}>
            Book another table
          </button>
        </div>
      ) : (
        <>
          <div className="bk-row" role="group" aria-label="Day">
            {days.map((d, i) => (
              <button key={d} type="button" aria-pressed={day === i} className={day === i ? "on" : ""} onClick={() => setDay(i)}>
                {d}
              </button>
            ))}
          </div>
          <div className="bk-slots" role="group" aria-label="Time">
            {times.map((x) => (
              <button key={x} type="button" aria-pressed={time === x} className={time === x ? "on" : ""} onClick={() => setTime(x)}>
                {x}
              </button>
            ))}
          </div>
          <div className="bk-foot">
            <div className="bk-guests" role="group" aria-label="Guests">
              <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                −
              </button>
              <span aria-live="polite">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
              <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(8, g + 1))}>
                +
              </button>
            </div>
            <button type="button" className="bk-confirm" disabled={!time || state === "busy"} onClick={confirm}>
              {state === "busy" ? "Booking…" : time ? `Reserve ${time}` : "Pick a time"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Terra Supply: product card with a live cart count ───────────────────── */
export function Product() {
  const [count, setCount] = useState(2);
  const [bump, setBump] = useState(0);
  const [added, setAdded] = useState(false);
  const t = useRef<number>(0);
  useEffect(() => () => clearTimeout(t.current), []);
  const add = () => {
    setCount((c) => c + 1);
    setBump((b) => b + 1);
    setAdded(true);
    sfx.play("pop");
    clearTimeout(t.current);
    t.current = window.setTimeout(() => setAdded(false), 1600);
  };
  return (
    <div className="sig-stage sig-product">
      <div className="pd-bar">
        <b>TERRA</b>
        <span key={bump} className="pd-cart" aria-live="polite">
          Cart · {count}
        </span>
      </div>
      <div className="pd-card">
        <div className="pd-jar" aria-hidden="true">
          <i className="lid" />
          <i className="body" />
          <i className="label">
            <span>Wildflower</span>
          </i>
        </div>
        <div className="pd-info">
          <span className="mono">Okanagan valley · 250 g</span>
          <h4>Wildflower honey</h4>
          <p>Raw, unfiltered, harvested in late summer.</p>
          <div className="pd-buy">
            <b>$14</b>
            <button type="button" onClick={add} className={added ? "is-added" : ""}>
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
