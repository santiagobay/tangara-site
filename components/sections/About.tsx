import Split, { ScrubWords } from "../Split";
import { objectives, pillars } from "@/lib/site";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              Brand identity ✳ Websites ✳ 3D &amp; motion ✳ Marketing &amp; growth ✳ Real estate &amp;
              development ✳{" "}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap about-grid">
        <div data-fadeout>
          <div className="eyebrow" data-reveal>
            Who we are
          </div>
          <Split text="One team for | your brand, site | and *content*" />
        </div>
        <div className="about-copy">
          <ScrubWords text="Tangara is a small studio for brand, web, 3D and marketing. Instead of hiring a designer, a developer and a marketer separately, you get one team that keeps your business looking and sounding the same everywhere: on your sign, your site, your socials and your sales deck." />
          <p className="muted" data-reveal>
            We&apos;re new, and we say so. We work with small and growing businesses, from a restaurant
            opening its second location to a developer pre-selling a project, and we stay close after
            launch.
          </p>
        </div>
      </div>

      <div className="wrap">
        <ul className="objectives" data-stagger>
          {objectives.map((o, i) => (
            <li key={o.k} className="objective" data-cursor="">
              <span className="mono">0{i + 1}</span>
              <h3>{o.k}</h3>
              <p>{o.v}</p>
            </li>
          ))}
        </ul>

        <ul className="pillars" data-stagger>
          {pillars.map((p) => (
            <li key={p.k}>
              <b>{p.k}</b>
              <span>{p.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
