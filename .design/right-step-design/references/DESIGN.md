# Right Step DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: Tailwind CSS 4.1.13 + React 19.1.1 + Next.js 15.5.23
> Colors: 20 · Fonts: 1 · Components: 33
> Icon library: Lucide · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography uses **sans-serif** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 4, 8, 12, 16, 20, 24, 32, 40px. Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| color-navy-50 | `#f3f8ff` | background | Page background, darkest surface |
| color-navy-100 | `#e6f0fd` | surface | Card and panel backgrounds |
| color-navy-900 | `#12294b` | text-primary | Headings and body text |
| color-coral-400 | `#e8873a` | danger | Error states, destructive actions |
| color-gold-50 | `#f8f4e7` | warning | Warning states, caution indicators |
| color-teal-100 | `#d8ecee` | info | Informational highlights |
| color-gold-100 | `#f2e9d0` | unknown | Palette color |
| color-teal-500 | `#1596a0` | unknown | Palette color |
| color-gold-400 | `#c9a227` | unknown | Palette color |
| color-navy-200 | `#d1e2fa` | unknown | Palette color |
| color-navy-300 | `#b5cef3` | unknown | Palette color |
| color-navy-400 | `#8eb1e5` | unknown | Palette color |
| color-navy-500 | `#6d96d3` | unknown | Palette color |
| color-navy-600 | `#527bb8` | unknown | Palette color |
| color-navy-700 | `#3b5f94` | unknown | Palette color |
| color-navy-800 | `#25426f` | unknown | Palette color |
| color-navy-950 | `#071831` | unknown | Palette color |
| color-teal-200 | `#badde1` | unknown | Palette color |
| color-teal-300 | `#92cacf` | unknown | Palette color |
| color-teal-400 | `#5ab0b8` | unknown | Palette color |

### CSS Variable Tokens

```css
--color-ink-muted: var(--color-ink-700);
```


---

## 3. Typography Rules

**Font Stack:**
- **sans-serif** — Heading 1, Heading 2, Heading 3, Body, Caption

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | sans-serif | 48px / 3rem | 700 |
| Heading 2 | sans-serif | 32px / 2rem | 600 |
| Heading 3 | sans-serif | 24px / 1.5rem | 600 |
| Body | sans-serif | 16px / 1rem | 400 |
| Caption | sans-serif | 12px / 0.75rem | 400 |

**Typographic Rules:**
- Use **sans-serif** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (11)

**AuthNotice** — `src/components/AuthNotice.tsx`
- Key Styles: `rounded-xl`, `border-gold-200`, `bg-gold-50`, `gap-3.5`, `text-sm`, `font-bold`

```tsx
<div
      role="status"
      className="flex items-start gap-3.5 rounded-xl border border-gold-200 bg-gold-50 p-4"
    >
      <Icon name="secure" className="mt-0.5 h-5 w-5 text-gold-ink" />
      <div>
        <p className="text-sm font-bold text-navy">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
```

**AuthShell** — `src/components/AuthShell.tsx`
- Key Styles: `rounded-3xl`, `border-line`, `bg-surface`, `pt-[72px]`, `text-base`, `font-extrabold`, `opacity-70`, `pointer-events-none`

```tsx
<section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          {/* --- The form column --- */}
          <div className="mx-auto flex w-full max-w-md min-w-0 flex-col lg:mx-0">
            <h1 className="text-[2rem] leading-[1.05] font-extrabold text-balance text-navy sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-pretty text-ink-muted">
              {body}
            </p>
```

**ClientStrip** — `src/components/ClientStrip.tsx`
- Key Styles: `border-line`, `bg-surface`, `py-10`, `text-xs`, `font-bold`, `hover:text-navy`
- Animation: tw-animate-marquee, tw-transitions: transition-colors, duration-300

```tsx
<section className="border-b border-line bg-surface py-10 sm:py-12">
      <Container>
        <p className="mb-6 text-center text-xs font-bold tracking-[0.16em] text-ink-faint uppercase">
          {t("label"
```

**CtaBand** — `src/components/CtaBand.tsx`
- Key Styles: `rounded-3xl`, `bg-surface`, `pb-20`, `text-base`, `font-bold`, `opacity-60`, `pointer-events-none`
- Animation: tw-transitions: transition-colors

```tsx
<section className="bg-surface pb-20 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="tread-lines absolute inset-0 opacity-60" />
            <div className="absolute -bottom-24 end-[-6%] h-72 w-72 rounded-full bg-coral/20 blur-[100px]" />
          </div>

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
```

**Field** — `src/components/Field.tsx`
- Key Styles: `rounded-e-xl`, `gap-2`, `text-sm`, `font-bold`, `hover:text-navy`
- Animation: tw-transitions: transition-colors, duration-200
- State: useState

```tsx
<div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-bold text-navy"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-coral-ink">
            *
          </span>
```

**Footer** — `src/components/Footer.tsx`
- Key Styles: `rounded-xl`, `border-white/12`, `bg-navy-deep`, `gap-10`, `text-lg`, `font-extrabold`, `hover:-translate-y-0.5`
- Animation: tw-transitions: transition-all, duration-300, transition-colors, hover-transforms

```tsx
<footer className="relative bg-navy-deep text-white">
      {/* Rising edge into the footer — the last tread of the page. */}
      <div
        aria-hidden="true"
        className="riser-bottom -mt-14 h-14 w-full bg-surface"
      />

      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
```

**Header** — `src/components/Header.tsx`
- Key Styles: `rounded-full`, `border-line`, `bg-white`, `gap-4`, `text-base`, `font-semibold`
- Animation: tw-transitions: transition-all, duration-300, ease-step, transition-colors, duration-200, transition-transform
- State: useState, useRef

**Hero** — `src/components/Hero.tsx`
- Key Styles: `rounded-full`, `border-white/10`, `bg-navy`, `pt-[72px]`, `text-base`, `font-extrabold`, `opacity-60`, `pointer-events-none`

```tsx
<section className="relative overflow-hidden bg-navy pt-[72px] text-white sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tread-lines absolute inset-0 opacity-60" />
        {/* The light sits high and ahead — where the stairs lead. */}
        <div className="absolute -top-40 end-[-6%] h-[520px] w-[520px] rounded-full bg-teal/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] start-[-10%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[130px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-28">
          <div className="flex flex-col items-start">
            {/* No kicker above the headline — the location sits with the other
```

*...and 3 more layout components.*

### Navigation (12)

**LegalPage** — `src/components/LegalPage.tsx`
- Variants: `privacy`, `terms`
- Key Styles: `rounded-lg`, `border-line`, `bg-surface`, `py-14`, `text-xs`, `font-bold`, `hover:text-navy`
- Animation: tw-transitions: transition-colors

```tsx
<>
      <PageHero title={t("title"
```

**ServicesOverview** — `src/components/ServicesOverview.tsx`
- Key Styles: `border-line`, `bg-surface`, `py-20`, `text-base`, `font-bold`, `hover:text-coral`
- Animation: tw-transitions: transition-colors

```tsx
<section id="services" className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading title={t("title"
```

**WorkshopsHub** — `src/components/WorkshopsHub.tsx`
- Variants: `all`, `online`, `person`
- Props: `value`, `label`
- Key Styles: `rounded-2xl`, `border-line`, `bg-surface`, `py-14`, `text-sm`, `font-semibold`, `shadow-[var(--shadow-cta)]`, `hover:text-coral-ink`
- Animation: tw-transitions: transition-colors, transition-all, duration-300, ease-step, transition-transform, hover-transforms
- State: useState

```tsx
<section className="bg-surface py-14 sm:py-20">
      <Container>
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-line pb-6">
          <FilterRow
            label={t("filterPractice"
```

**WorkshopsSlider** — `src/components/WorkshopsSlider.tsx`
- Variants: `prev`, `next`
- Props: `left`
- Key Styles: `rounded-full`, `border-line`, `bg-surface`, `py-20`, `text-sm`, `font-bold`, `hover:text-coral-ink`
- Animation: tw-transitions: transition-colors, transition-all, duration-300, ease-step, hover-transforms
- State: useState, useRef

**DeliverablesPreview** — `src/components/portal/DeliverablesPreview.tsx`
- Key Styles: `rounded-2xl`, `border-line`, `bg-surface`, `p-5`, `text-xs`, `font-bold`, `hover:text-coral-ink`
- Animation: tw-transitions: transition-colors, transition-transform

```tsx
<section
      aria-labelledby="files-heading"
      className="flex flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="files-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("title"
```

**JourneyStair** — `src/components/portal/JourneyStair.tsx`
- Key Styles: `rounded-2xl`, `border-line`, `bg-surface`, `p-5`, `text-lg`, `font-bold`, `hover:text-coral-ink`
- Animation: tw-transitions: transition-all, duration-300, ease-step, transition-colors, transition-transform, hover-transforms
- State: useState

```tsx
<section
      aria-labelledby="journey-heading"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="journey-heading" className="text-lg font-bold text-navy">
          {t("title"
```

**NextSessionCard** — `src/components/portal/NextSessionCard.tsx`
- Variants: `soon`
- Key Styles: `rounded-full`, `border-line`, `bg-coral`, `gap-3`, `text-xs`, `font-bold`, `hover:border-navy/50`
- Animation: tw-animate-pulse, tw-transitions: transition-colors, duration-500, transition-all, duration-300, ease-step, hover-transforms
- State: useState

**PortalSidebar** — `src/components/portal/PortalSidebar.tsx`
- Key Styles: `rounded-full`, `border-e`, `bg-navy-950`, `gap-3`, `text-sm`, `font-bold`
- Animation: tw-transitions: transition-colors

```tsx
<aside className="hidden w-64 shrink-0 flex-col border-e border-navy-800 bg-navy-950 lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-navy-800 px-6">
        <LogoMark className="h-9 w-9" onDark />
        <span className="text-sm font-bold text-white">{t("portal"
```

*...and 4 more navigation components.*

### Data Display (1)

**StatsBand** — `src/components/StatsBand.tsx`
- Key Styles: `border-line`, `bg-surface-alt`, `py-20`, `text-sm`, `font-bold`

```tsx
<section className="bg-surface-alt py-20 sm:py-28">
      <Container>
        <SectionHeading title={t("title"
```

### Data Input (5)

**CheckoutClient** — `src/components/CheckoutClient.tsx`
- Variants: `card`, `wallet`, `idle`, `working`, `bank`, `blocked`
- Key Styles: `rounded-xl`, `border-line`, `bg-surface`, `pt-[72px]`, `text-sm`, `font-semibold`, `shadow-[var(--shadow-step)]`, `hover:text-navy`
- Animation: tw-transitions: transition-colors, duration-200, transition-all, duration-300, ease-step, hover-transforms
- State: useState

```tsx
<section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="py-10 sm:py-14">
          <Link
            href="/#workshops"
            className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
          >
            <ArrowIcon className="rotate-180 group-hover/link:-translate-x-0.5 rtl:rotate-0" />
            {t("backLink"
```

**ContactForm** — `src/components/ContactForm.tsx`
- Variants: `idle`, `sending`, `sent`
- Key Styles: `rounded-2xl`, `border-line`, `bg-teal-50`, `gap-4`, `text-xl`, `font-extrabold`, `shadow-[var(--shadow-step)]`, `hover:text-navy`
- Animation: tw-transitions: transition-colors, duration-200, transition-all, duration-300, ease-step, hover-transforms
- State: useState

```tsx
<div className="flex flex-col items-start gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-8">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-extrabold text-navy">
          {t("successTitle"
```

**ForgotForm** — `src/components/ForgotForm.tsx`
- Variants: `idle`, `working`, `sent`
- Key Styles: `rounded-2xl`, `bg-teal-50`, `gap-4`, `text-xl`, `font-bold`, `shadow-[var(--shadow-cta)]`, `hover:-translate-y-0.5`
- Animation: tw-transitions: transition-all, duration-300, ease-step, hover-transforms
- State: useState

```tsx
<div className="flex flex-col items-start gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-7">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-700 text-white">
          <Icon name="mail" className="h-6 w-6" />
        </span>
        <h2 className="text-xl font-bold text-navy">{t("sentTitle"
```

**LoginForm** — `src/components/LoginForm.tsx`
- Variants: `idle`, `working`, `blocked`
- Key Styles: `rounded-xl`, `bg-coral`, `gap-5`, `text-sm`, `font-semibold`, `shadow-[var(--shadow-cta)]`, `hover:text-navy`
- Animation: tw-transitions: transition-colors, transition-all, duration-300, ease-step, hover-transforms
- State: useState

```tsx
<form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={tAuth("emailLabel"
```

**SignupForm** — `src/components/SignupForm.tsx`
- Variants: `idle`, `working`, `blocked`
- Key Styles: `rounded`, `border-line`, `bg-coral`, `gap-5`, `text-sm`, `font-semibold`, `shadow-[var(--shadow-cta)]`, `hover:-translate-y-0.5`
- Animation: tw-transitions: transition-all, duration-300, ease-step, hover-transforms
- State: useState

```tsx
<form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={t("nameLabel"
```

### Media (2)

**Icon** — `src/components/Icon.tsx`

```tsx
<Glyph
      aria-hidden="true"
      strokeWidth={STROKE}
      className={`shrink-0 ${flipRtl ? "rtl:-scale-x-100" : ""} ${className}`}
    />
```

**Logo** — `src/components/Logo.tsx`
- Key Styles: `gap-2.5`, `text-base`, `font-extrabold`, `group-hover:-translate-y-0.5`
- Animation: tw-transitions: transition-transform, duration-300, ease-step, hover-transforms

```tsx
<svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 rtl:-scale-x-100 ${className}`}
    >
      <rect
        width="40"
        height="40"
        rx="11"
        fill={onDark ? "#1C3861" : "#12294B"}
      />
```

### Other (2)

**HashScroll** — `src/components/HashScroll.tsx`
- Props: `block`, `behavior`

**Reveal** — `src/components/Reveal.tsx`
- Variants: `div`, `ol`, `ul`, `section`
- State: useState, useRef



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- **Border radius:** 4px, 8px, 12px, 16px, 24px
- **Grid usage:** `grid-cols-5`, `grid-cols-2`
- **Container:** Tailwind `container` class with responsive padding

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

No box-shadow values detected. The design appears to use a flat visual style.


---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### CSS Animations

- `@keyframes marquee`
- `@keyframes animate-marquee`
- `@keyframes animate-pulse`

### Animated Components

- **CheckoutClient**: tw-transitions: transition-colors, duration-200, transition-all, duration-300, ease-step, hover-transforms
- **ClientStrip**: tw-animate-marquee, tw-transitions: transition-colors, duration-300
- **ContactForm**: tw-transitions: transition-colors, duration-200, transition-all, duration-300, ease-step, hover-transforms
- **CtaBand**: tw-transitions: transition-colors
- **Field**: tw-transitions: transition-colors, duration-200

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#f3f8ff` as the primary page background
- Use **sans-serif** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use border and background shifts for elevation — not shadows
- Use border-radius from the scale: 4px, 8px, 12px, 16px, 24px
- Reuse existing components from Section 4 before creating new ones
- Use **Lucide** for all icons

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use sans-serif consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't add box-shadow — this design system uses flat elevation
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't mix icon libraries — consistency matters

### Anti-Patterns (detected from codebase)

- No box-shadow on any element
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #e6f0fd
Border: 1px solid var(--border)
Radius: 12px
Padding: 16px
Font: sans-serif
No shadows — use borders and surface colors for depth.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 12px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #f3f8ff
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #e6f0fd
Label: var(--text-muted) (muted, 12px, uppercase)
Value: #12294b (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #f3f8ff
Input border: 1px solid var(--border)
Focus: border-color var(--accent)
Label: var(--text-muted) 12px
Spacing: 16px between fields
Radius: 12px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: sans-serif, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: flat, surface shifts
```
