# Ez Fin Design System

**Ez Fin** is a financial-infrastructure brand — a payments-and-money-movement platform pitched at developers and growing businesses. The product surface is two-sided: a **marketing website** built on a signature gradient-mesh hero and editorial-thin typography, and a **dashboard product** that flips polarity to a familiar dark-app shell where money and numerics live.

This design system is an inspired interpretation of a Stripe-class financial brand's design language: deep navy ink, an electric indigo primary, a recurring atmospheric gradient mesh in the upper third of nearly every marketing page, thin-weight display type with negative tracking, and tabular-figure body type wherever money appears.

> **Note:** "Ez Fin" is a fictional brand for this system. The logo (an ascending double-chevron) was provided; everything else is derived from the supplied design analysis.

## Sources

- **Logo:** `uploads/Gemini_Generated_Image_.png` (provided) → processed into `assets/logo-mark-*.png`.
- **Design language:** the attached `Stripi-design-analysis` spec (colors, type scale, components, do's & don'ts). Reproduced and tokenized here.
- No codebase or Figma file was provided; all UI kits are built from the design analysis and brand foundations.

---

## Content Fundamentals

**Voice — confident infrastructure, plainly stated.** Copy is declarative and short. It states what the product does and gets out of the way. No exclamation marks, no hype words ("revolutionary", "game-changing"). The brand sells by showing the product, not adjectives.

- **Person:** Addresses the reader as **you** ("Accept payments in minutes"), refers to the company as **we/Ez Fin**. Imperative verbs lead CTAs ("Start now", "Contact sales", "View docs").
- **Casing:** Sentence case everywhere — headlines, buttons, nav. The only uppercase is the `micro-cap` eyebrow label (e.g. `FINANCIAL INFRASTRUCTURE`), tracked at +0.1px. Never Title Case buttons.
- **Numbers are the message.** Copy leans on concrete figures — "135+ currencies", "2.9% + 30¢", "99.99% uptime" — always set in tabular figures. The quiet precision IS the financial-trust signal.
- **Headlines** are noun phrases or short claims: "Financial infrastructure for the internet", "Move money instantly". They run long and wrap across 2–3 lines at thin weight — the editorial air is intentional.
- **Body** is explanatory, second person, ~1–2 sentences per idea. Helper/caption text is muted navy.
- **No emoji.** The brand never uses emoji in product or marketing. Iconography is line-based and geometric (see Iconography).
- **Tone examples:**
  - CTA: `Start now` · `Contact sales` · `Read the docs`
  - Eyebrow: `PAYMENTS` · `FINANCIAL INFRASTRUCTURE`
  - Hero: `A complete payments platform engineered for growth.`
  - Microcopy: `Rates exclusive of applicable taxes.`

---

## Visual Foundations

**Color.** Two roles dominate. **Indigo `#533afd`** is the signature CTA — used sparingly, one filled pill per band, plus inline link emphasis. **Deep navy `#0d253d` (ink)** is the universal body-text color (never pure black) and `#1c1e54` (brand-dark-900) fills the featured pricing tier, dashboard chrome, and dark-app surfaces. Ruby/magenta/lemon exist only inside the gradient mesh and as accent dots in product UI — **never as button colors**. Don't introduce accent colors outside the documented gradient stops.

**Typography.** Sohne at **weight 300** with negative letter-spacing is the brand signature (substituted here with **Inter 300** — see Caveat below). Display tiers (32–56px) carry -1.4px to -0.64px tracking; body sits at 0; tabular/caption sizes use `tnum` plus a tightening -0.36 to -0.42px. `ss01` is enabled globally. **Never bump display above 300** — at 400 the editorial air collapses.

**Backgrounds.** The **gradient mesh** is the brand's primary depth medium and is *non-negotiable on marketing heroes*: a pastel cream → sherbet → lavender → indigo → ruby/magenta wash blurred horizontally across the upper third of the page (`assets/gradient-mesh.png`). Type and product mockups float above it on white. Below the hero, surfaces return to white, with feature bands on `canvas-soft` (#f6f9fc) and the occasional warm `canvas-cream` (#f5e9d4) interlude.

**Spacing & layout.** 8px base unit (with 2/4/12 sub-tokens). Marketing sections pad 64–96px; dashboard/product surfaces tighten to 32–48px. Content centers in a ~1200px container with the mesh extending edge-to-edge above. Section gaps tend toward 96px on marketing, ~32px where users compare and act.

**Shape & radius.** Tight-radius pill (`9999px`) for **all** buttons and tag pills, with decisive `8px 16px` padding — short, transactional. Cards use `12px` (feature/pricing) up to `16px` (dashboard mockup chrome). Inputs use `6px`; hairline tags `4px`. Never square the button corners.

**Elevation.** Navy-tinted shadows, used subtly. Level 1 = `rgba(0,55,112,0.08) 0 1px 3px` (card lift). Level 2 = `rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px` (floating panels, dashboard mockups). The gradient mesh — not literal shadow — is the dominant depth system.

**Borders.** 1px hairlines: `#e3e8ee` on cards/tables, a cooler `#a8c3de` on form inputs. Inputs swap their border to indigo with a soft 3px focus ring on focus.

**Cards.** Near-white surface, 1px hairline, 12px radius, optional Level-1 shadow, 32px internal padding. Featured/dashboard cards invert to deep navy. The cream-band card is the brand's warm chromatic interlude.

**Animation & states.** Restrained. Transitions ~120–140ms ease. Buttons darken to `primary-press` on press with a 0.5px nudge down (no scale bounce). Switches slide their knob with a cubic-bezier ease. No decorative looping animation on content. Respect `prefers-reduced-motion`.

**Transparency & blur.** Used in the mesh and soft focus rings only; the brand is otherwise flat and opaque. Imagery skews toward **product UI mockups over photography** — faux dashboard/IDE composites in deep navy inside rounded containers; real photography is rare (logo strips, the occasional 4:3 case-study inset, no shadow).

---

## Iconography

The brand has **no proprietary icon font**. Icons are **line-based, geometric, ~1.5px stroke, rounded joins** — the financial-SaaS convention. This system substitutes **[Lucide](https://lucide.dev)** (open-source, MIT, 1.5px geometric stroke) loaded from CDN as the closest match to that style.

> ⚠️ **Substitution flagged:** Lucide stands in for an unspecified custom icon set. If Ez Fin has its own icon library, drop the SVGs into `assets/icons/` and swap the CDN reference.

- **Load:** `<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()`, or use inline `<svg>` from lucide.dev.
- **Usage:** icons ride alongside text in nav, feature bullets, dashboard rows. Stroke color follows text (`currentColor`) — `ink` on light, `on-primary`/`primary-soft` on dark.
- **Check marks** in pricing/feature lists are hand-set inline SVGs at the indigo (`primary`) / indigo-soft (on dark) color.
- **No emoji. No unicode-glyph icons.** The chevron logo mark is the only brand-specific glyph.

### Logo assets (`assets/`)
- `logo-mark-trim.png` — navy ascending-chevron mark, tightly cropped (primary).
- `logo-mark-white.png` — reversed (white) for dark surfaces.
- `logo-mark-indigo.png` — indigo fill variant.
- `logo-mark.png` — full-canvas transparent original.
- `gradient-mesh.png` — the signature mesh backdrop.

---

## Index / Manifest

**Foundations**
- `styles.css` — root entry; `@import`s everything below.
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` · `tokens/fonts.css`
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

**Components** (`components/`, namespace `window.EzFinDesignSystem_7ddd3c`)
- `buttons/Button` — pill CTA: primary / secondary / on-dark / ghost; md/sm.
- `forms/Input` · `forms/Select` · `forms/Checkbox` · `forms/Switch`
- `data-display/Card` — light / cream / soft / dark surface.
- `data-display/Badge` — soft eyebrow + status tones.
- `data-display/PricingCard` — standard & dark featured tier.

**UI kits** (`ui_kits/`)
- `marketing/` — gradient-mesh website: hero/home, payments feature, pricing.
- `dashboard/` — dark-app product shell: payments overview, balances/payouts.

**Other**
- `SKILL.md` — Agent-Skills-compatible entry point.
- `assets/` — logos + gradient mesh.

---

## Caveats

- **Sohne is proprietary** (Klim Type Foundry) and cannot be shipped. **Inter 300** with `ss01` + negative tracking is the substitute. Replace `tokens/fonts.css` with licensed `sohne-var` for full fidelity.
- **Lucide** substitutes for the (unspecified) icon set — see Iconography.
- The gradient mesh is a generated approximation of the brand's organic-blob backdrop; swap in the real asset if available.
