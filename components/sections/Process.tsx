import Split from "../Split";
import { processSteps as steps } from "@/lib/site";

export default function Process() {
  return (
    <section id="approach" className="section process">
      <div className="wrap">
        <div className="section-head" data-fadeout>
          <div>
            <div className="eyebrow" data-reveal>
              Process
            </div>
            <Split text="How we work | five steps, no *surprises*" />
          </div>
          <p className="section-intro" data-reveal>
            We start by understanding your business before we propose anything. You see the scope, the
            price and the timeline in writing before any work begins.
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
