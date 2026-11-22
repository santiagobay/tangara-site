"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Split from "../Split";
import Magnetic from "../Magnetic";
import { services, site } from "@/lib/site";

const CtaScene = dynamic(() => import("../three/CtaScene"), { ssr: false });

type Status = "idle" | "sending" | "ok" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // The 3D orb (and Three.js) only loads when the visitor gets close to this section.
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="section contact">
      {near && <CtaScene />}
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <div className="eyebrow" data-reveal>
            Contact
          </div>
          <Split text="Tell us what | you're *building*" />
          <p className="muted" data-reveal>
            A website, a brand, a launch: describe it in a few lines. We&apos;ll reply with next steps and,
            if we&apos;re a good fit, a fixed quote.
          </p>
          <a className="mail" href={`mailto:${site.email}`} data-reveal data-cursor="Email">
            {site.email}
          </a>
        </div>

        <form className="form-card" onSubmit={onSubmit} noValidate data-reveal>
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" autoComplete="name" required minLength={2} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="company">Business / company</label>
            <input id="company" name="company" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="interest">I&apos;m interested in</label>
            <select id="interest" name="interest" defaultValue="">
              <option value="" disabled>
                Choose a service
              </option>
              {services.map((s) => (
                <option key={s.n} value={s.t}>
                  {s.t}
                </option>
              ))}
              <option value="Brand + website">Brand + website</option>
              <option value="Not sure yet">Not sure yet — help me choose</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="message">Tell us about your project</label>
            <textarea id="message" name="message" rows={5} required minLength={10} />
          </div>
          {/* Honeypot — hidden from people, tempting to bots */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="form-foot">
            <Magnetic>
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">↗</span>
              </button>
            </Magnetic>
            <p className={`form-msg ${status}`} role="status" aria-live="polite">
              {status === "ok" && "Got it. We'll reply with next steps soon. Check your inbox, and your spam folder just in case."}
              {status === "error" && error}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
