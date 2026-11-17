import Split from "../Split";
import { services } from "@/lib/site";

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              What we offer
            </div>
            <Split text="Strategy first. | *Everywhere* it matters." />
          </div>
          <p className="section-intro" data-reveal>
            A connected set of capabilities to help you find your signal, tell your story and show up with
            consistency. Hire one — or combine them.
          </p>
        </div>

        <ul className="service-list">
          {services.map((s) => (
            <li key={s.n} className="service" data-reveal>
              <details>
                <summary data-cursor="Open">
                  <span className="mono num">{s.n}</span>
                  <h3>{s.t}</h3>
                  <span className="arrow" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="service-body">
                  <p>{s.d}</p>
                  <ul className="chips">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
