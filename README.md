# Right Step — Public Website

Client-facing marketing site for Right Step (Abu Dhabi). Next.js 15 App Router,
Tailwind CSS v4, bilingual Arabic/English with true RTL.

**Slogan:** Pure Vision For Perfect Trip · رؤية صافية لرحلة مثالية

```bash
npm install
npm run dev     # http://localhost:3100
npm run build
```

Arabic is the default locale: `/` redirects to `/ar`. English lives at `/en`.

## Pages

| Route             | Sections                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `/[locale]`       | Hero → client strip → services overview → stats band → **The Steps** → packages → testimonials → CTA |
| `/[locale]/services` | Page hero → 3 detailed practices → 9 packages → The Steps → CTA                                    |
| `/[locale]/about`    | Page hero → vision & mission → values → three journeys → Abu Dhabi → CTA                           |
| `/[locale]/contact`  | Split layout: direct contact channels + enquiry form                                               |

## Brand tokens

All colours live in one place: the `@theme` block at the top of
[`src/app/globals.css`](src/app/globals.css). Nothing hardcodes a hex outside
of it except the inline SVG logo mark.

| Token           | Value     | Use                                             |
| --------------- | --------- | ----------------------------------------------- |
| `navy`          | `#12294B` | Primary — trust, dark sections, headings         |
| `teal`          | `#1596A0` | Primary — energy, eyebrows, early steps          |
| `gold`          | `#C9A227` | Accent — achievement, featured prices, mid steps |
| `coral`         | `#E8873A` | **CTA only** — buttons, "most chosen" chip       |
| `ink`           | `#1B2430` | All text (charcoal navy, never pure black)       |

Two rules the design depends on:

1. **Pure black `#000000` appears nowhere** — including shadows, which are all
   navy-tinted (`--shadow-step`, `--shadow-step-lg`, `--shadow-cta`).
2. **Coral is reserved for calls to action.** Decorative accents that would
   otherwise have been coral (the third service card, the HR practice on the
   Services page) use navy instead so the CTA buttons keep their pull. The one
   deliberate exception is the top step of the staircase, which is coral
   because it leads the eye straight into the CTA beneath it.

## The "Steps" concept

The staircase is structural, not decorative. It appears as:

- **Hero** — three ascending treads carrying the proof-point cards.
- **`StepsStaircase`** — the five-step process. On desktop each card sits on a
  riser that grows with the step index, so the row physically climbs; on mobile
  it becomes a vertical timeline with a connecting rail.
- **Section dividers** — the `riser-top` / `riser-bottom` clip-path utilities
  cut a diagonal stair edge between sections.
- **Services overview** — the three cards are pitched at different heights.
- **Journeys (About)** — each audience shown as a from → to climb.
- **Logo, hamburger icon, mobile nav bullets, quote marks** — all built from
  ascending treads.

Everything mirrors under RTL: the stair always climbs in the reading direction.

## Editing content

**All copy is in `messages/ar.json` and `messages/en.json`.** No strings are
hardcoded in components. The two files have identical key structures — edit
them in pairs.

**Pricing** lives at `packages.groups[].tiers[]`. Prices are indicative
placeholders in AED. Arabic uses Arabic-Indic numerals (`٤٬٥٠٠`), English uses
Western (`4,500`). Set `"featured": true` on one tier per group to give it the
navy treatment and the "most chosen" chip.

**Contact details** are in [`src/lib/site.ts`](src/lib/site.ts) — phone, email,
WhatsApp and social URLs. The social links are currently placeholders pointing
at platform homepages.

## Before launch

- [ ] Replace placeholder pricing with confirmed figures (`packages.note` flags this on-page).
- [ ] Replace the placeholder testimonials with real, attributed quotes (`testimonials.note`).
- [ ] Replace the illustrative statistics with verified sources (`stats.footnote`).
- [ ] Replace the fictional client names in `clients.items`.
- [ ] Point the social URLs in `src/lib/site.ts` at real profiles.
- [ ] Wire the contact form: the submit handler in
      [`src/components/ContactForm.tsx`](src/components/ContactForm.tsx)
      currently logs to the console and fakes a 700 ms round-trip. Replace it
      with a POST to your CRM or email service. The on-page demo notice
      (`contactPage.form.demoNotice`) should be removed at the same time.
- [ ] Add real Privacy Policy and Terms pages — the footer links are inert spans.
- [ ] Add `metadataBase` and Open Graph images once the domain is known.

## Accessibility & i18n notes

- Skip link, visible focus rings (3px teal), `aria-current` on the active nav
  item, labelled form fields, and `prefers-reduced-motion` support.
- Phone and email render `dir="ltr"` inside Arabic pages so they read correctly.
- Arabic uses IBM Plex Sans Arabic with a looser line-height; English uses
  Plus Jakarta Sans. Both load through `next/font`.
- Layout uses logical properties (`start`/`end`, `ms-`/`me-`) throughout, so RTL
  is a genuine mirror rather than a patched LTR layout.
