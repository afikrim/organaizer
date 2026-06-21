# Browser-use Visual QA Plan

## Purpose

Use `browser-use` to verify that the implemented organAIzer UI matches the design direction and prototype in `design/`.

This plan is for visual QA only. Functional behavior will be tested manually.

## Source of truth

- Prototype: `design/organAIzer.dc.html`
- Design assets: `design/assets/`
- Design system reference: `design/_ds/`
- Target product docs: Obsidian organAIzer PRD, TRD, UI spec, and implementation plan

## What browser-use validates

- Page/screen structure
- Visual hierarchy
- Spacing, radius, shadows, and layout rhythm
- Color/token usage
- Mobile-first responsive behavior
- Presence of key UI states
- Screenshot capture for human visual review

## What browser-use does not validate

- Upload correctness
- API correctness
- Gemini response quality
- Supabase persistence
- Session/auth behavior
- Rate limiting
- Follow-up answer correctness

Those areas are covered by manual functional QA.

## Local test assumptions

Expected local URLs after implementation:

```txt
Landing: http://localhost:4321
App:     http://localhost:5173/app
API:     http://localhost:3000/v1
```

Start local services before testing:

```bash
pnpm dev
```

Use named browser sessions:

```bash
browser-use --session organaizer-landing open http://localhost:4321
browser-use --session organaizer-app open http://localhost:5173/app
```

Save screenshots under:

```txt
docs/testing/screenshots/
```

## Visual QA scenarios

### 1. Landing page

Capture screenshots:

```txt
landing-hero.png
landing-problem.png
landing-how-it-works.png
landing-use-cases.png
landing-example-result.png
landing-final-cta-footer.png
```

Check:

- Gradient mesh hero is present.
- Sticky nav matches the prototype direction.
- Logo and `organAIzer` wordmark treatment match.
- CTA buttons use the expected pill shape and indigo/white styling.
- Phone mockup/result preview is visually consistent with the prototype.
- Section spacing, card radius, and soft shadows match the EzFin design system.
- Use case pills wrap cleanly.
- Dark example and final CTA panels match the prototype tone.

Suggested commands:

```bash
browser-use --session organaizer-landing open http://localhost:4321
browser-use --session organaizer-landing state
browser-use --session organaizer-landing screenshot docs/testing/screenshots/landing-hero.png
browser-use --session organaizer-landing scroll down
browser-use --session organaizer-landing screenshot docs/testing/screenshots/landing-problem.png
```

### 2. App upload screen

Capture screenshots:

```txt
app-upload-empty.png
app-upload-goal-selected.png
```

Check:

- App renders as a mobile-first narrow shell.
- Header layout matches the prototype.
- Sample photo area matches the rounded 4:3 treatment.
- Goal rows match selected and unselected states.
- Privacy note is visible and styled correctly.
- Disabled and enabled primary button states match the prototype.

Suggested commands:

```bash
browser-use --session organaizer-app open http://localhost:5173/app
browser-use --session organaizer-app state
browser-use --session organaizer-app screenshot docs/testing/screenshots/app-upload-empty.png
```

### 3. Loading screen

Capture screenshot:

```txt
app-loading.png
```

Check:

- Photo has a dim overlay.
- Scan band appears in the same visual style as the prototype.
- Skeleton cards are shown below the photo.
- There is no blank loading screen.

### 4. Result screen

Capture screenshots:

```txt
app-result-top.png
app-result-suggestions.png
app-result-checklist.png
app-result-follow-up.png
```

Check:

- Marker overlay style matches the prototype.
- Priority colors match design tokens.
- Summary card uses the dark navy surface.
- Suggestion cards have the correct hierarchy and priority treatment.
- Active marker/card state is visually obvious.
- Checklist card matches the soft canvas style.
- Follow-up chips, input, and bubbles match the prototype.

### 5. Error screen

Capture screenshot:

```txt
app-error.png
```

Check:

- Ruby error icon treatment is present.
- Heading/body hierarchy matches the prototype.
- Try-again button matches primary CTA styling.
- Layout is centered and not cramped.

### 6. Responsive checks

Capture at these widths:

```txt
375px mobile
402px prototype width
768px tablet
1280px desktop
```

Check:

- App stays narrow and centered on desktop.
- App does not stretch full width.
- Landing sections reflow cleanly.
- No horizontal scrolling.
- Tap targets remain visually large enough.

## Acceptance criteria

Browser-use visual QA passes when:

- All required screenshots are captured.
- Screens visually match the prototype/design direction.
- No expected section or UI state is missing.
- No obvious spacing, radius, color, typography, or hierarchy mismatch is present.
- Mobile and desktop layouts are not broken.
- The screenshot set is ready for human review before manual functional QA.

## Cleanup

Close browser sessions after testing:

```bash
browser-use --session organaizer-landing close
browser-use --session organaizer-app close
```
