# Tangara — studio website

Next.js 16 (App Router) · React 19 · TypeScript · Three.js · GSAP + ScrollTrigger · Lenis

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Add env vars (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://yourdomain.com` (used for sitemap, OG, canonical)
   - `RESEND_API_KEY` — enables the contact form (https://resend.com)
   - `CONTACT_TO_EMAIL` — where enquiries are delivered
   - `CONTACT_FROM_EMAIL` — a sender on your verified Resend domain
3. Add your domain in Settings → Domains, then verify it in Google Search Console and submit `/sitemap.xml`.

Without `RESEND_API_KEY` the form logs to the console in dev and shows a friendly error in production.

## Where to edit things

| What | File |
| --- | --- |
| Copy, services, industries, portfolio concepts, email | `lib/site.ts` |
| Brand colors, fonts, all styling | `app/globals.css` (tokens at the top) |
| Hero 3D particle bird | `components/three/HeroScene.tsx` |
| Contact 3D orb | `components/three/CtaScene.tsx` |
| Scroll animations (reveals, pinned gallery, fade-outs) | `components/Motion.tsx` |
| Custom cursor, magnetic buttons | `components/Cursor.tsx`, `components/Magnetic.tsx` |
| Portfolio website mock-ups | `components/Mocks.tsx` |
| Logo assets | `public/brand/` |

Headline syntax in `Split`: `*word*` = serif italic accent, `|` = line break.

Accessibility: honors `prefers-reduced-motion`, custom cursor is fine-pointer only, keyboard focus is visible, WebGL failure falls back to the static logo.
