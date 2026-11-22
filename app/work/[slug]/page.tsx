import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import Cursor from "@/components/Cursor";
import { SoundFX } from "@/components/Sound";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import Split from "@/components/Split";
import Mock from "@/components/Mocks";
import Signature from "@/components/studies/Signature";
import { studies, studyBySlug } from "@/lib/studies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = studyBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.name} — direction study`,
    description: `${s.brief} A Tangara direction study (concept, not a client project).`,
    alternates: { canonical: `/work/${s.slug}` },
  };
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const s = studyBySlug(slug);
  if (!s) notFound();
  const i = studies.indexOf(s);
  const next = studies[(i + 1) % studies.length];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <SoundFX />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main
        id="top"
        className="study"
        style={
          {
            "--s-bg": s.theme.bg,
            "--s-fg": s.theme.fg,
            "--s-accent": s.theme.accent,
            "--s-muted": s.theme.muted,
          } as React.CSSProperties
        }
      >
        <p className="study-note mono">
          Direction study · not a client project. Brand, names, prices and copy are fictional.
        </p>

        <header className="wrap study-hero">
          <div className="study-meta mono">
            <span>(Direction study)</span>
            <span>({s.sector})</span>
            <span>
              ({pad(i + 1)} / {pad(studies.length)})
            </span>
          </div>
          <Split tag="h1" className="study-title" text={s.name} />
          <p className="study-tagline" data-reveal>
            {s.tagline}
          </p>
        </header>

        <div className="wrap">
          <figure className="study-shot" data-clip>
            <div className="browser study-browser">
              <div className="bar">
                <i />
                <i />
                <i />
                <span>concept / {s.sector.toLowerCase()}</span>
              </div>
              <div data-clip-inner>
                <Mock kind={s.kind} />
              </div>
            </div>
            <figcaption className="study-cap mono">
              <span>{s.name}</span>
              <span>(Concept)</span>
            </figcaption>
          </figure>
        </div>

        <section className="wrap study-block">
          <span className="study-label mono" data-reveal>
            (The brief)
          </span>
          <p className="study-lead" data-reveal>
            {s.brief}
          </p>
        </section>

        <section className="wrap study-block">
          <span className="study-label mono" data-reveal>
            (The idea)
          </span>
          <p className="study-lead study-lead--accent" data-reveal>
            {s.idea}
          </p>
        </section>

        <section className="wrap study-block study-block--stack">
          <span className="study-label mono" data-reveal>
            (Design decisions)
          </span>
          <ol className="study-decisions">
            {s.decisions.map((d, k) => (
              <li key={d.t} data-reveal>
                <span className="study-dn">{pad(k + 1)}</span>
                <h2>{d.t}</h2>
                <p>{d.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap study-block study-block--stack">
          <span className="study-label mono" data-reveal>
            (Palette)
          </span>
          <ul className="study-palette" data-swatches>
            {s.palette.map((c) => (
              <li key={c.hex} style={{ background: c.hex, color: c.ink ? "#15110e" : "#f4ece0" }}>
                <b>{c.name}</b>
                <span className="mono">{c.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap study-block study-block--stack">
          <span className="study-label mono" data-reveal>
            (Type)
          </span>
          <div className="study-type" data-reveal>
            <div className="study-aa" aria-hidden="true">
              Aa
            </div>
            <div>
              <p className="study-type-sample">{s.type.sample}</p>
              <p className="mono study-type-names">
                {s.type.display} · display &nbsp;/&nbsp; {s.type.text} · accents
              </p>
            </div>
          </div>
        </section>

        <section className="wrap study-block study-block--stack">
          <span className="study-label mono" data-reveal>
            (Signature interaction)
          </span>
          <div className="study-sig">
            <div data-reveal>
              <h2 className="study-sig-t">{s.signature.title}</h2>
              <p className="study-sig-d">{s.signature.d}</p>
            </div>
            <Signature kind={s.kind} />
          </div>
        </section>

        <section className="wrap study-block">
          <span className="study-label mono" data-reveal>
            (What success would look like)
          </span>
          <p className="study-lead" data-reveal>
            {s.success}
          </p>
        </section>

        <section className="wrap study-block">
          <span className="study-label mono" data-reveal>
            (Services involved)
          </span>
          <div className="study-services" data-reveal>
            <ul>
              {s.services.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <a className="btn" href="/#contact">
              Start a project like this <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <nav className="study-next" aria-label="Next study">
          <div className="wrap">
            <span className="study-label mono">(Next study)</span>
            <Link href={`/work/${next.slug}`} className="study-next-link" data-cursor="Next">
              {next.name} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#work" className="text-link">
              Back to all work
            </Link>
          </div>
        </nav>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
