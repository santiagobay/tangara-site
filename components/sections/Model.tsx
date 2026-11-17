import Split from "../Split";
import { model } from "@/lib/site";

export default function Model() {
  return (
    <section id="model" className="section model">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              Ways to work together
            </div>
            <Split text="Pick a lane. | *Switch* anytime." />
          </div>
          <p className="section-intro" data-reveal>
            Start small with a single project, bundle services into a package, or bring us in as an ongoing
            creative partner.
          </p>
        </div>
        <ul className="model-grid" data-stagger>
          {model.map((m) => (
            <li key={m.n} className="model-card" data-cursor="">
              <span className="model-n">{m.n}</span>
              <h3>{m.t}</h3>
              <p>{m.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
