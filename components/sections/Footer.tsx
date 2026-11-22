import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            {/* The bird is the primary logo — same mark as the navigation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/bird-mark.png"
              alt="Tangara"
              className="footer-mark"
              width={56}
              height={56}
              loading="lazy"
            />
            <p className="muted">{site.tagline}</p>
          </div>
          <nav aria-label="Footer">
            {nav.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <a href="/#contact">Contact</a>
          </nav>
          <a className="mail small" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="giant" aria-hidden="true">
          Tangara
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tangara</span>
          <span className="footer-legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
