import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import Cursor from "@/components/Cursor";
import { SoundFX } from "@/components/Sound";
import Preloader from "@/components/Preloader";
import AmbientField from "@/components/AmbientField";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import Split from "@/components/Split";
import FounderPlates from "@/components/team/FounderPlates";
import { founders } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the three founders behind Tangara. You work directly with us: no account managers, no hand-offs.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <SoundFX />
      <AmbientField />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <section className="section team-hero" id="top">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow" data-reveal>
                  Team
                </div>
                <Split tag="h1" text="Three founders | *one* studio" />
              </div>
              <p className="section-intro" data-reveal>
                Tangara is the three of us. When you hire us, you talk to the people doing the work, from the
                first call to launch day. Hover or tap each plate: they&apos;re built the same way we build for
                clients.
              </p>
            </div>
            <FounderPlates founders={founders} />
          </div>
        </section>

        <section className="section team-cta">
          <div className="wrap team-cta-inner">
            <Split text="Want to work | *with* us?" />
            <a className="btn" href="/#contact">
              Get a quote <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
