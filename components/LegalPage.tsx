import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import { SoundFX } from "@/components/Sound";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";

/** Shared shell for plain-text legal pages: readable column, no scroll effects. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <SoundFX />
      <Nav />
      <main id="top" className="legal">
        <div className="wrap legal-wrap">
          <div className="eyebrow">Legal</div>
          <h1>{title}</h1>
          <p className="legal-updated mono">Last updated: {updated}</p>
          <div className="legal-body">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
