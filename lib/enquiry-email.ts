import { site } from "./site";

/** HTML + plain-text layout of the enquiry email the studio receives. */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  receivedAt: string;
};

const C = { bg: "#f4f5f1", card: "#ffffff", ink: "#1e201f", muted: "#5d6b64", line: "#e3e8e4", accent: "#1d6c61", soft: "#e9f6f1" };

function row(label: string, value: string, href?: string) {
  const v = value
    ? href
      ? `<a href="${esc(href)}" style="color:${C.accent};text-decoration:none;">${esc(value)}</a>`
      : esc(value)
    : `<span style="color:#a3ada8;">Not provided</span>`;
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};width:150px;vertical-align:top;font:600 12px/1.4 Arial,sans-serif;color:${C.muted};text-transform:uppercase;letter-spacing:.06em;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};vertical-align:top;font:400 15px/1.5 Arial,sans-serif;color:${C.ink};">${v}</td>
  </tr>`;
}

function section(title: string, rows: string) {
  return `<tr><td style="padding:28px 32px 0;">
    <div style="font:700 13px/1 Arial,sans-serif;color:${C.accent};letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">${title}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
  </td></tr>`;
}

export function emailHtml(e: Enquiry) {
  const summary = [e.interest || "General enquiry", e.company || e.name].join(" · ");
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:${C.card};border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
        <tr><td style="background:${C.ink};padding:24px 32px;">
          <div style="font:600 12px/1 Arial,sans-serif;color:#a4f2c0;letter-spacing:.1em;text-transform:uppercase;">Tangara · New project enquiry</div>
          <div style="font:700 24px/1.25 Arial,sans-serif;color:#f1f3ec;margin-top:10px;">${esc(summary)}</div>
          <div style="font:400 13px/1.4 Arial,sans-serif;color:#bdcbc4;margin-top:8px;">Received ${esc(e.receivedAt)} (Toronto time)</div>
        </td></tr>
        ${section(
          "Contact",
          row("Name", e.name) + row("Email", e.email, `mailto:${e.email}`) + row("Company", e.company),
        )}
        ${section("Project", row("Service", e.interest))}
        <tr><td style="padding:28px 32px 0;">
          <div style="font:700 13px/1 Arial,sans-serif;color:${C.accent};letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;">Project description</div>
          <div style="background:${C.soft};border-radius:8px;padding:18px 20px;font:400 15px/1.65 Arial,sans-serif;color:${C.ink};white-space:pre-wrap;">${esc(e.message)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px 32px;">
          <a href="mailto:${esc(e.email)}?subject=${encodeURIComponent(`Re: your enquiry to Tangara`)}" style="display:inline-block;background:${C.accent};color:#ffffff;font:700 14px/1 Arial,sans-serif;text-decoration:none;padding:14px 22px;border-radius:6px;">Reply to ${esc(e.name)}</a>
          <div style="font:400 12px/1.5 Arial,sans-serif;color:${C.muted};margin-top:16px;">You can also just hit “Reply”: it goes straight to ${esc(e.email)}.</div>
        </td></tr>
      </table>
      <div style="font:400 11px/1.5 Arial,sans-serif;color:#8a958f;margin-top:14px;">Sent from the contact form on ${esc(site.url.replace(/^https?:\/\//, ""))}</div>
    </td></tr>
  </table></body></html>`;
}

export function emailText(e: Enquiry) {
  const v = (x: string) => x || "Not provided";
  return [
    `NEW PROJECT ENQUIRY — ${e.interest || "General enquiry"}`,
    `Received ${e.receivedAt} (Toronto time)`,
    ``,
    `CONTACT`,
    `Name:      ${e.name}`,
    `Email:     ${e.email}`,
    `Company:   ${v(e.company)}`,
    ``,
    `PROJECT`,
    `Service:   ${v(e.interest)}`,
    ``,
    `DESCRIPTION`,
    e.message,
    ``,
    `Reply to this email to answer ${e.name} directly.`,
  ].join("\n");
}
