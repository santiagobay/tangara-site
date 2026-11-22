import Split, { ScrubWords } from "../Split";
import { objectives, pillars } from "@/lib/site";

const tickerItems = ["Brand identity", "Websites", "3D & motion", "Marketing & growth", "Real estate & development"];
const tickerSub = ["Strategy", "Design", "Code", "Renders", "Motion", "Content", "Launch"];

export default function About() {
  return (
    <section id="about" className="section about">
      {/* Two half-tracks with identical content: the loop moves exactly one half (-50%), so each
          half repeats the list enough times to stay wider than any screen — no gap, no jump. */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((half) => (
            <span key={half} className="ticker-half">
              {[0, 1].map((rep) =>
                tickerItems.map((t, i) => (
                  <span key={`${rep}-${i}`} className="ticker-item">
                    {t}
                    <em className="ticker-sep">✳</em>
                  </span>
                )),
              )}
            </span>
          ))}
        </div>
        <div className="ticker-track ticker-track--rev">
          {[0, 1].map((half) => (
            <span key={half} className="ticker-half">
              {[0, 1, 2].map((rep) =>
                tickerSub.map((t, i) => (
                  <span key={`${rep}-${i}`} className="ticker-item">
                    {t}
                    <em className="ticker-sep">·</em>
                  </span>
                )),
              )}
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
            We work with small and growing businesses across Canada, from a restaurant opening its second
            location to a developer pre-selling a project, and we stay close after launch.
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
