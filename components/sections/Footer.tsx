import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/lockup.png" alt="Tangara" className="footer-lockup" width={160} />
            <p className="muted">Independent by nature. Intentional by design.</p>
          </div>
          <nav aria-label="Footer">
            {nav.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>
          <a className="mail small" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="giant" aria-hidden="true">
          tangara
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tangara</span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
