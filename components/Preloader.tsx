"use client";

import { useEffect } from "react";
import { markReady } from "@/lib/ready";

/**
 * There is no blocking preloader any more: content must be visible as fast as possible
 * (it cost ~2.9s of LCP on mobile). This only fires the "ready" signal that the hero
 * intro and the 3D scene listen for, right after hydration.
 */
export default function Preloader() {
  useEffect(() => {
    markReady();
  }, []);
  return null;
}
