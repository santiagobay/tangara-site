import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const interest = clean(body.interest, 120);
  const message = clean(body.message, 4000);

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 422 });
  if (message.length < 10)
    return NextResponse.json({ ok: false, error: "Tell us a little more about your project." }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `Tangara <onboarding@resend.dev>`;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact:dev]", { name, email, company, interest, message });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: `The form isn't connected yet. Please email us at ${site.email}.` },
      { status: 503 },
    );
  }

  const html = `
    <h2>New project enquiry</h2>
    <p><b>Name:</b> ${esc(name)}</p>
    <p><b>Email:</b> ${esc(email)}</p>
    <p><b>Company:</b> ${esc(company || "—")}</p>
    <p><b>Interested in:</b> ${esc(interest || "—")}</p>
    <p><b>Project:</b></p>
    <p style="white-space:pre-wrap">${esc(message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `New enquiry — ${name}`, html }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `We couldn't send that just now. Please email ${site.email}.` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
