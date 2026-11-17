import Split from "../Split";
import { processSteps as steps } from "@/lib/site";

export default function Process() {
  return (
    <section id="approach" className="section process">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              A clear path to distinct
            </div>
            <Split text="From first question | to *full signal.*" />
          </div>
          <p className="section-intro" data-reveal>
            Our method starts by understanding you — before we propose anything. Every step keeps the big
            idea connected to the details that make it real.
          </p>
        </div>

        <ol className="steps">
          <span className="steps-line" aria-hidden="true">
            <i data-process-line />
          </span>
          {steps.map((s) => (
            <li key={s.n} className="step" data-reveal>
              <span className="mono num">
                {s.n} / {s.k.toUpperCase()}
              </span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
