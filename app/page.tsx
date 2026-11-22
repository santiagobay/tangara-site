import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import Cursor from "@/components/Cursor";
import { SoundFX } from "@/components/Sound";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Lab from "@/components/sections/Lab";
import Showcase from "@/components/sections/Showcase";
import Process from "@/components/sections/Process";
import Model from "@/components/sections/Model";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <SoundFX />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Showcase />
        <Lab />
        <Process />
        <Model />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
