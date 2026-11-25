import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { emailHtml, emailText, type Enquiry } from "@/lib/enquiry-email";

export const runtime = "nodejs";

/* ── helpers ─────────────────────────────────────────────────────────────── */

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

/** Single-line fields: also collapse newlines (prevents header tricks in subjects). */
const line = (v: unknown, max: number) => clean(v, max).replace(/\s+/g, " ");


/** Very small in-memory rate limit: 5 enquiries per IP per 10 minutes (per server instance). */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

/* ── handler ─────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: `Too many messages in a short time. Please try again later or email ${site.email}.` },
      { status: 429 },
    );
  }

  const e: Enquiry = {
    name: line(body.name, 120),
    email: line(body.email, 200),
    company: line(body.company, 160),
    interest: line(body.interest, 120),
    message: clean(body.message, 5000),
    receivedAt: new Date().toLocaleString("en-CA", {
      timeZone: "America/Toronto",
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  if (e.name.length < 2) return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email))
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 422 });
  if (e.message.length < 10)
    return NextResponse.json({ ok: false, error: "Tell us a little more about your project." }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  // Enquiries go to the studio inbox by default (santimax18@gmail.com via site.email).
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  // onboarding@resend.dev works without a verified domain, but only delivers to the email
  // address that owns the Resend account. Set CONTACT_FROM_EMAIL once a domain is verified.
  const from = process.env.CONTACT_FROM_EMAIL || "Tangara website <onboarding@resend.dev>";

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact:dev] email preview\n" + emailText(e));
      return NextResponse.json({ ok: true });
    }
    console.error("[contact] RESEND_API_KEY is not set — enquiry not delivered.");
    return NextResponse.json(
      { ok: false, error: `The form isn't connected yet. Please email us at ${site.email}.` },
      { status: 503 },
    );
  }

  const subject = `New enquiry · ${e.interest || "General"} · ${e.company || e.name}`.slice(0, 150);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: e.email, subject, html: emailHtml(e), text: emailText(e) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
      return NextResponse.json(
        { ok: false, error: `We couldn't send that just now. Please email ${site.email}.` },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return NextResponse.json(
      { ok: false, error: `We couldn't send that just now. Please email ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
