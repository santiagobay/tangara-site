"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import Magnetic from "./Magnetic";
import QuickDock from "./QuickDock";

/** Smooth-scrolls to "/#id" or "#id" when that section is on the current page; otherwise navigates. */
function go(e: React.MouseEvent<HTMLAnchorElement>, href: string, close?: () => void) {
  close?.();
  const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  e.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.4 });
  else (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
}

const TOPLINE = 32; // height of the thin bar above the nav

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const logo = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Past the hero the bar clears away: only the logo and "Get a quote" stay on screen.
      setCompact(y > 160);
      // The floating logo follows the nav until the top line has scrolled away.
      if (logo.current) logo.current.style.transform = `translateY(${Math.max(0, TOPLINE - y)}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <div className="topline">
        <span>Creative &amp; digital studio</span>
        <span>{site.location}</span>
      </div>
      {/* The logo lives outside the header so `mix-blend-mode` can react to whatever is behind it. */}
      <a
        ref={logo}
        href="/#top"
        className="logo logo-float"
        aria-label="Tangara home"
        onClick={(e) => go(e, "/#top", () => setOpen(false))}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bird-mark.png" alt="" width={40} height={40} />
      </a>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${compact && !open ? "is-compact" : ""}`}>
        <span className="logo-slot" aria-hidden="true" />
        <nav className="links" aria-label="Primary">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} tabIndex={compact ? -1 : 0}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <Magnetic>
            <a href="/#contact" className="btn btn-sm" onClick={(e) => go(e, "/#contact")}>
              Get a quote <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
          <button
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <QuickDock />
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {[...nav, { href: "/#contact", label: "Contact" }].map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: `${open ? 120 + i * 60 : 0}ms` }}
            onClick={(e) => go(e, l.href, () => setOpen(false))}
          >
            <small>0{i + 1}</small>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
