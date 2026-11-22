"use client";

import Split from "../Split";
import { services } from "@/lib/site";

/** Scrolls to the contact form and preselects the service the visitor asked about. */
function enquire(e: React.MouseEvent<HTMLAnchorElement>, service: string) {
  const form = document.querySelector<HTMLElement>("#contact");
  const select = document.querySelector<HTMLSelectElement>("#interest");
  if (select) select.value = service;
  if (!form) return;
  e.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(form, { offset: -70, duration: 1.4 });
  else form.scrollIntoView({ behavior: "smooth" });
}

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              What we do
            </div>
            <Split text="Five services | *one* team" />
          </div>
          <p className="section-intro" data-reveal>
            Hire one, or combine them. Most projects pair a brand with a website, and we quote them together.
            Prices are starting points in Canadian dollars, before GST/HST. You get a fixed quote before we
            start.
          </p>
        </div>

        <ol className="svc-list">
          {services.map((s) => (
            <li key={s.id} className="svc" data-reveal>
              <div className="svc-head">
                <h3>{s.t}</h3>
                <span className="svc-n" aria-hidden="true">
                  {s.n}
                </span>
              </div>
              <div className="svc-body">
                <p className="svc-outcome">{s.outcome}</p>
                <ul className="svc-items">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <div className="svc-foot">
                  <p className="svc-price">
                    <span>From</span> <b>{s.price}</b>
                    {s.unit && <span> {s.unit}</span>}
                  </p>
                  <a
                    href="#contact"
                    className="text-link"
                    onClick={(e) => enquire(e, s.t)}
                    data-cursor="Enquire"
                  >
                    Ask about {s.t.replace(/^\w/, (c) => c.toLowerCase()).replace(/^3d/, "3D")} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
