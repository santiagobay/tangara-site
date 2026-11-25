"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sfx } from "@/lib/sfx";
import { useSound } from "./Sound";

/**
 * Floating "quick controls" bubble (like iOS AssistiveTouch): drag it anywhere, it snaps to the
 * nearest side and remembers where you left it. Tap to open sound on/off and text size A− / A+.
 */
const STEPS = [0.9, 1, 1.1, 1.2, 1.35];
const FS_KEY = "tangara-fs";
const POS_KEY = "tangara-dock";
const SIZE = 56;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage blocked */
  }
};

function applyScale(v: number) {
  document.documentElement.style.setProperty("--fs", String(v));
  // Layout changed: let scroll animations re-measure.
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export default function QuickDock() {
  const sound = useSound();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [pos, setPos] = useState<{ side: "left" | "right"; y: number }>({ side: "right", y: 0.72 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, x: 0, y: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const [free, setFree] = useState<{ x: number; y: number } | null>(null);

  // Restore saved text size and position.
  useEffect(() => {
    const fs = parseFloat(read(FS_KEY) || "1");
    const i = STEPS.indexOf(fs);
    if (i >= 0) {
      setStep(i);
      if (fs !== 1) applyScale(fs);
    }
    try {
      const p = JSON.parse(read(POS_KEY) || "null");
      if (p && (p.side === "left" || p.side === "right") && typeof p.y === "number") setPos(p);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const outside = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.(".dock")) setOpen(false);
    };
    window.addEventListener("keydown", esc);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", esc);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  const setScale = (i: number) => {
    const n = Math.max(0, Math.min(STEPS.length - 1, i));
    setStep(n);
    applyScale(STEPS[n]);
    write(FS_KEY, String(STEPS[n]));
    sfx.play("tick");
  };

  /* drag to move, tap to open */
  const onDown = (e: React.PointerEvent) => {
    const r = btn.current!.getBoundingClientRect();
    drag.current = { active: true, moved: false, sx: e.clientX, sy: e.clientY, x: r.left, y: r.top };
    btn.current!.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      setOpen(false);
    }
    setFree({
      x: Math.max(8, Math.min(window.innerWidth - SIZE - 8, d.x + dx)),
      y: Math.max(8, Math.min(window.innerHeight - SIZE - 8, d.y + dy)),
    });
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    d.active = false;
    if (!d.moved) return;
    const cx = e.clientX;
    const next = {
      side: (cx < window.innerWidth / 2 ? "left" : "right") as "left" | "right",
      y: Math.max(0.08, Math.min(0.92, e.clientY / window.innerHeight)),
    };
    setPos(next);
    setFree(null);
    setDragging(false);
    write(POS_KEY, JSON.stringify(next));
  };
  const onClick = () => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    setOpen((o) => !o);
  };

  const style: React.CSSProperties = free
    ? { left: free.x, top: free.y, right: "auto" }
    : { [pos.side]: 16, top: `calc(${pos.y * 100}% - ${SIZE / 2}px)` };

  return (
    <div className={`dock dock--${pos.side} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""}`} style={style}>
      <button
        ref={btn}
        type="button"
        className="dock-btn"
        aria-expanded={open}
        aria-controls="dock-panel"
        aria-label={open ? "Close quick controls" : "Open quick controls: sound and text size"}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onClick={onClick}
        data-sfx="none"
      >
        <span className="dock-ring" aria-hidden="true" />
        <span className={`dock-eq ${sound ? "is-on" : ""}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>

      <div id="dock-panel" className="dock-panel" role="group" aria-label="Quick controls" hidden={!open}>
        <button
          type="button"
          className={`dock-item ${sound ? "is-on" : ""}`}
          aria-pressed={sound}
          onClick={() => sfx.setEnabled(!sound)}
          data-sfx="none"
        >
          <span className="dock-ico" aria-hidden="true">
            {sound ? "♪" : "×"}
          </span>
          <span>Sound {sound ? "on" : "off"}</span>
        </button>
        <div className="dock-text" role="group" aria-label="Text size">
          <button type="button" onClick={() => setScale(step - 1)} disabled={step === 0} aria-label="Smaller text">
            A<small>−</small>
          </button>
          <span aria-live="polite">{Math.round(STEPS[step] * 100)}%</span>
          <button
            type="button"
            onClick={() => setScale(step + 1)}
            disabled={step === STEPS.length - 1}
            aria-label="Larger text"
          >
            A<small>+</small>
          </button>
        </div>
        {step !== 1 && (
          <button type="button" className="dock-reset" onClick={() => setScale(1)}>
            Reset text size
          </button>
        )}
      </div>
    </div>
  );
}
