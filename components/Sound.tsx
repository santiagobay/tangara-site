"use client";

import { useEffect, useState } from "react";
import { sfx, type SfxName } from "@/lib/sfx";

const INTERACTIVE = "a, button, summary, label, [role='button'], [data-cursor]";

/** Site-wide interface sounds: soft tick on hover, tactile click on press. */
export function SoundFX() {
  useEffect(() => {
    sfx.init();
    let last: Element | null = null;

    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) ?? null;
      if (t && t !== last && (t as HTMLElement).dataset.sfx !== "none") sfx.play("hover");
      last = t;
    };
    const down = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(INTERACTIVE);
      if (!t || t.closest("[data-sfx='none']")) return;
      // Plain [data-cursor] areas (cards, tiles) aren't buttons — no click sound.
      if (!t.matches("a, button, summary, label, [role='button']")) return;
      sfx.play((t.dataset.sfx as SfxName) || "click");
    };

    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
    };
  }, []);
  return null;
}

/** Hook: live sound on/off state. */
export function useSound() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(sfx.enabled);
    return sfx.subscribe(setOn);
  }, []);
  return on;
}

/** Nav toggle with a tiny equaliser that dances while sound is on. */
export function SoundToggle() {
  const on = useSound();
  return (
    <button
      type="button"
      className={`sound-toggle ${on ? "is-on" : ""}`}
      aria-pressed={on}
      aria-label={on ? "Turn interface sound off" : "Turn interface sound on"}
      onClick={() => sfx.setEnabled(!on)}
      data-sfx="none"
    >
      <span className="eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="mono">Sound {on ? "on" : "off"}</span>
    </button>
  );
}
