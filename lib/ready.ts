/** Runs `cb` once the preloader has finished (or immediately if it already has). */
export function onReady(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  if (document.documentElement.classList.contains("is-ready")) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("tangara:ready", handler, { once: true });
  return () => window.removeEventListener("tangara:ready", handler);
}

export function markReady() {
  document.documentElement.classList.add("is-ready");
  window.dispatchEvent(new Event("tangara:ready"));
}
