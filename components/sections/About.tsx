import Split, { ScrubWords } from "../Split";
import { objectives, pillars } from "@/lib/site";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              CLARITY ✳ CHARACTER ✳ CULTURE ✳ CREATIVE THAT MOVES BUSINESS ✳ BRAND ✳ WEB ✳ 3D ✳ CONTENT ✳
              MARKETING ✳{" "}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap about-grid">
        <div data-fadeout>
          <div className="eyebrow" data-reveal>
            Who we are
          </div>
          <Split text="One studio. | *Every* touchpoint." />
        </div>
        <div className="about-copy">
          <ScrubWords text="We are a multidisciplinary studio of creative and digital solutions that helps businesses develop, improve and strengthen their presence in the market. We bring creativity, technology, design and strategic thinking together — so a restaurant, a real-estate firm, a shop, a builder or a brand-new startup can communicate its value and give customers a better experience." />
          <p className="muted" data-reveal>
            Rather than specializing in a single industry or a single service, we adapt our capabilities to
            each client&apos;s challenge — and aim to be the creative and strategic ally you can rely on as
            your business grows.
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
