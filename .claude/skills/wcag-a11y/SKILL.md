---
name: wcag-a11y
description: WCAG 2.2 AA accessibility patterns for building compliant Astro pages. Use this skill when creating new pages, forms, interactive components, or reviewing accessibility.
---

# WCAG 2.2 AA Accessibility Skill

Patterns and checklists for building WCAG 2.2 Level AA compliant pages in this Astro monorepo. Barrierefreiheit ist kein Feature, sondern Baseline — jedes Pattern muss ohne Maus, ohne Sehen und ohne perfekte Motorik nutzbar sein.

## Page Structure

Every page must follow this semantic structure:

```astro
---
import BaseLayout from '@astro-v6/shared/layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title" description="..." lang="en">
  <nav slot="header" aria-label="Main navigation">...</nav>

  <!-- BaseLayout provides <main id="main"> with skip link target -->
  <article>
    <h1>Single H1 per page</h1>
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section Title</h2>
      <!-- h2 → h3 → h4 — never skip levels -->
    </section>
  </article>

  <footer slot="footer">...</footer>
</BaseLayout>
```

### Required Landmarks

| Landmark | Element | Notes |
|---|---|---|
| Skip link | `<a href="#main" class="skip-link">` | Provided by BaseLayout |
| Navigation | `<nav aria-label="Main navigation">` | Label required if multiple navs |
| Main | `<main id="main">` | Provided by BaseLayout |
| Article | `<article>` | For standalone content (blog posts, pages) |
| Section | `<section aria-labelledby="id">` | Must have `aria-label` or heading |
| Aside | `<aside aria-label="...">` | For supplementary content |
| Footer | `<footer>` | Page-level footer |

### Heading Rules

- **One `<h1>` per page** — no duplicates
- **No skipped levels** — h1 → h2 → h3, never h1 → h3
- **Meaningful text** — headings describe the content below them
- Validated by `@casoon/astro-post-audit` (`headings.no_skip: true`)

### Semantic HTML Rules

- Lists as `<ul>`/`<ol>` + `<li>`, never as `<div>` chains
- Navigation lists inside `<nav>` with `aria-label` to distinguish multiple navs
- Use correct landmark elements: `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, `<aside>`

## Language

```astro
<!-- Set on <html> via BaseLayout lang prop -->
<BaseLayout lang="en">  <!-- or "de" -->
```

- Always pass `lang` to BaseLayout
- For i18n pages, derive from URL: `const lang = Astro.url.pathname.startsWith('/de') ? 'de' : 'en';`

## Interactive Elements

### Links

```astro
<!-- Standard link — always has underline (WCAG 1.4.1) -->
<a href="/page">Link text</a>

<!-- Button-style link — use no-underline class -->
<a href="/page" class="no-underline rounded-lg bg-accent px-4 py-2 text-text-inverse">
  Call to Action
</a>

<!-- Link without visible text (e.g. social icon) — MUST have aria-label -->
<a href="https://github.com/casoon" aria-label="GitHub Profile">
  <svg aria-hidden="true">...</svg>
</a>

<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Site
  <span class="sr-only">(opens in new tab)</span>
</a>
```

**Rules:**
- Links must be distinguishable by **underline**, not color alone
- External links with `target="_blank"` need `rel="noopener noreferrer"` + screen reader hint
- Never use `<a>` without `href` — use `<button>` instead for actions
- `<a>` without visible text needs `aria-label`

### Buttons

```astro
<!-- Text button -->
<button type="button" onclick="handleClick()">
  Save Changes
</button>

<!-- Icon-only button — MUST have aria-label -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Submit button -->
<button type="submit">Send Message</button>
```

**Rules:**
- Icon-only buttons **must** have `aria-label`
- Icons inside buttons use `aria-hidden="true"`
- Always set `type="button"` or `type="submit"` explicitly
- Only `<button>` or `<a>` for clickable elements — **never** `<div onclick>`

### Keyboard Navigation

All interactive elements must be keyboard-accessible:

```css
/* Global focus style in global.css — DO NOT REMOVE */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

- Use native `<button>`, `<a>`, `<input>` — they're keyboard-accessible by default
- Never use `<div onclick>` — use `<button>` instead
- Custom interactive elements need `tabindex="0"`, `role`, and keyboard event handlers
- Focus order must follow visual layout (don't use positive `tabindex`)
- Never `outline: none` without a visible alternative

### Touch Targets (WCAG 2.5.8)

All interactive elements must have a minimum touch target of **44×44px**:

```astro
<!-- Ensure minimum touch target size -->
<button type="button" class="min-h-[44px] min-w-[44px] p-2">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Or via padding to reach 44px -->
<a href="/page" class="inline-block px-4 py-3">Link</a>
```

- Apply `min-h-[44px] min-w-[44px]` or equivalent padding
- Hover-only content must also be reachable via focus/click

## Forms

### Input Pattern

```astro
---
// Track errors from server validation
const inputError = result?.error?.fields;
---

<div>
  <label for="email" class="text-sm font-semibold">
    Email <span aria-hidden="true">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    required
    autocomplete="email"
    aria-invalid={!!inputError?.email}
    aria-describedby={inputError?.email ? 'email-error' : undefined}
    class="rounded-md border border-border px-3 py-2
           focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
  />
  {inputError?.email && (
    <span id="email-error" class="text-xs text-error" role="alert">
      {inputError.email}
    </span>
  )}
</div>
```

### Form Groups (Fieldset + Legend)

```astro
<fieldset>
  <legend class="text-sm font-semibold">Contact Preference</legend>
  <div class="flex gap-4">
    <label>
      <input type="radio" name="contact" value="email" /> Email
    </label>
    <label>
      <input type="radio" name="contact" value="phone" /> Phone
    </label>
  </div>
</fieldset>
```

- Use `<fieldset>` + `<legend>` for related input groups (radios, checkboxes, address fields)

### Form Accessibility Checklist

| Requirement | Implementation |
|---|---|
| Associated label | `<label for="id">` matching `<input id="id">` |
| Required indicator | Visual `*` with `aria-hidden="true"` + `required` attribute |
| Error state | `aria-invalid={true}` on invalid input |
| Error message | `<span role="alert">` with `aria-describedby` linking |
| Autocomplete | `autocomplete="name\|email\|tel\|..."` on inputs |
| Focus style | Ring + border change on `:focus` |
| Success feedback | `<div role="status">` for success messages |
| Grouped inputs | `<fieldset>` + `<legend>` for radios, checkboxes |

### Textarea

```astro
<label for="message" class="text-sm font-semibold">Message</label>
<textarea
  id="message"
  name="message"
  rows="5"
  required
  aria-invalid={!!inputError?.message}
  aria-describedby={inputError?.message ? 'message-error' : undefined}
></textarea>
```

### Select

```astro
<label for="topic" class="text-sm font-semibold">Topic</label>
<select id="topic" name="topic" required>
  <option value="" disabled selected>Choose a topic</option>
  <option value="web">Web Development</option>
  <option value="seo">SEO</option>
</select>
```

## Tables

```astro
<table>
  <caption>Monthly Revenue 2025</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>€12,500</td>
      <td>+5%</td>
    </tr>
  </tbody>
</table>
```

**Rules:**
- Always include `<caption>` for table purpose
- `<thead>` with `<th scope="col">` for column headers
- `<th scope="row">` for row headers
- Never use tables for layout — only for tabular data

## Images

```astro
<!-- Informative image — descriptive alt text -->
<img src="/photo.jpg" alt="Team meeting in the Rostock office" width="800" height="600" />

<!-- Decorative image — empty alt + aria-hidden -->
<img src="/divider.svg" alt="" aria-hidden="true" />

<!-- SVG icon — hidden from assistive tech -->
<svg aria-hidden="true" focusable="false">...</svg>
```

**Rules:**
- All `<img>` elements **must** have `alt` attribute
- Decorative images: `alt=""` + `aria-hidden="true"`
- Always include `width` and `height` to prevent layout shift
- Enforced by `@casoon/astro-post-audit` (`a11y.require_img_alt: true`)

## Color & Contrast

### Contrast Requirements

| Text Type | Min. Ratio | Example |
|---|---|---|
| Normal text (< 18px) | **4.5:1** | Body text, form labels |
| Large text (>= 18px bold / 24px) | **3:1** | Headings, large UI text |
| UI components & graphics | **3:1** | Borders, icons, focus rings |

**Never rely on color alone** to convey meaning — always pair with icon, text, or pattern:

```astro
<!-- WRONG: color-only error indicator -->
<span class="text-error">Invalid email</span>

<!-- RIGHT: color + icon + descriptive text -->
<span class="text-error">⚠ Error: Please enter a valid email address</span>
```

### Dark Mode Pairing Rules

Both light and dark color schemes must independently meet contrast requirements. Every color class needs an explicit `dark:` counterpart:

| Light | Dark | Purpose |
|---|---|---|
| `text-neutral-900` | `dark:text-neutral-100` | Primary text |
| `text-neutral-700` | `dark:text-neutral-300` | Secondary text |
| `text-neutral-600` | `dark:text-neutral-400` | Tertiary text (min. contrast!) |
| `bg-white` | `dark:bg-neutral-900` | Background |
| `border-neutral-200` | `dark:border-neutral-700` | Borders |

- OKLCH lightness values are tuned for contrast:
  - Light: text `oklch(18% ...)` on background `oklch(98% ...)`
  - Dark: text `oklch(98% ...)` on background `oklch(18% ...)`
- No missing `dark:` variants — better redundant than incomplete
- Avoid `text-neutral-400` on white — fails contrast at 4.5:1

## Animations & Motion

### prefers-reduced-motion

All CSS animations must respect reduced motion preferences:

```css
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
}
```

**Rules:**
- Every `animation` property needs a `prefers-reduced-motion: reduce` override with `animation: none`
- Scroll-based animations: provide `@supports` fallback + `prefers-reduced-motion` check
- No blinking or flashing effects (WCAG 2.3.1 — max 3 flashes per second)
- Tailwind: use `motion-safe:` and `motion-reduce:` variants

```astro
<!-- Tailwind motion-safe variant -->
<div class="motion-safe:animate-fade-in motion-reduce:opacity-100">
  Content
</div>
```

## ARIA Patterns

### Navigation with aria-current

```astro
---
const isActive = Astro.url.pathname === href;
---
<a href={href} aria-current={isActive ? 'page' : undefined}>
  {label}
</a>
```

### Accordion / Disclosure

Prefer native `<details>` + `<summary>` (needs no ARIA):

```astro
<details>
  <summary>FAQ: How does this work?</summary>
  <p>Detailed explanation here...</p>
</details>
```

For custom accordion:

```astro
<button
  type="button"
  aria-expanded={isOpen}
  aria-controls="panel-id"
>
  Toggle Section
  <svg aria-hidden="true" class={isOpen ? 'rotate-180' : ''}>...</svg>
</button>
<div id="panel-id" hidden={!isOpen}>
  Content
</div>
```

### Tabs

```astro
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-general" id="tab-general">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-security" id="tab-security" tabindex="-1">
    Security
  </button>
</div>

<div role="tabpanel" id="panel-general" aria-labelledby="tab-general">
  General settings content
</div>
<div role="tabpanel" id="panel-security" aria-labelledby="tab-security" hidden>
  Security settings content
</div>
```

**Rules:**
- `role="tablist"` on container with `aria-label`
- `role="tab"` + `aria-selected` on each tab
- `role="tabpanel"` + `aria-labelledby` on each panel
- Arrow key navigation between tabs (left/right)
- Inactive tabs: `tabindex="-1"`, active tab: no tabindex or `tabindex="0"`

### Modal / Dialog

Prefer native `<dialog>`:

```astro
<dialog id="confirm-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to proceed?</p>
  <div class="flex gap-4">
    <button type="button" onclick="this.closest('dialog').close()">Cancel</button>
    <button type="button" onclick="confirmAction()">Confirm</button>
  </div>
</dialog>

<button type="button" onclick="document.getElementById('confirm-dialog').showModal()">
  Delete Item
</button>
```

For custom modals:
- `aria-modal="true"` + `role="dialog"` + `aria-labelledby`
- **Focus trap** — Tab must cycle within dialog
- **Escape key** closes the dialog
- **Return focus** to the trigger element after closing

### Live Regions

```astro
<!-- Polite: announced after current speech -->
<div aria-live="polite">Status updates here</div>

<!-- Assertive: interrupts current speech -->
<div role="alert">Error message here</div>

<!-- Status: polite + role="status" -->
<div role="status">Success message here</div>
```

## Error Pages

```astro
<div role="alert">
  <p class="text-6xl font-light">404</p>
  <h1>Page Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">Back to Home</a>
</div>
```

- Error pages use `role="alert"` for screen reader announcement
- Always provide a way back (link to homepage)

## Lists

```astro
<!-- When using list-none (Tailwind removes semantics), restore with role -->
<ul class="list-none" role="list">
  <li>Item</li>
</ul>

<!-- Standard list — no role needed -->
<ul>
  <li>Item</li>
</ul>
```

Tailwind's `list-none` removes list semantics in Safari — add `role="list"` to restore.

## Anti-Patterns

```html
<!-- WRONG: Div as button -->
<div class="cursor-pointer" onclick="...">Click me</div>
<!-- RIGHT -->
<button type="button">Click me</button>

<!-- WRONG: Icon button without label -->
<button><svg>...</svg></button>
<!-- RIGHT -->
<button aria-label="Close menu"><svg aria-hidden="true">...</svg></button>

<!-- WRONG: Image without alt -->
<img src="photo.jpg">
<!-- RIGHT: Informative -->
<img src="photo.jpg" alt="Team meeting in progress">
<!-- RIGHT: Decorative -->
<img src="bg.jpg" alt="" aria-hidden="true">

<!-- WRONG: Color as only indicator -->
<span class="text-red-500">Error</span>
<!-- RIGHT: Color + icon + descriptive text -->
<span class="text-red-500">⚠ Error: Email is required</span>

<!-- WRONG: outline:none without alternative -->
<button class="outline-none">Submit</button>
<!-- RIGHT: focus-visible with ring -->
<button class="focus:outline-none focus:ring-2 focus:ring-accent">Submit</button>

<!-- WRONG: Missing dark mode pairing -->
<p class="text-neutral-700">Text</p>
<!-- RIGHT -->
<p class="text-neutral-700 dark:text-neutral-300">Text</p>
```

## New Page Checklist

When creating a new page, verify:

- [ ] `lang` attribute set via BaseLayout
- [ ] Skip link works (provided by BaseLayout)
- [ ] Single `<h1>`, heading hierarchy without skipped levels
- [ ] Semantic landmarks: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- [ ] All images have `alt` text (or `alt=""` + `aria-hidden` for decorative)
- [ ] All links have visible underlines (or `no-underline` for button-style)
- [ ] All icon-only buttons/links have `aria-label`
- [ ] Form inputs have associated `<label>`, `aria-invalid`, `aria-describedby`
- [ ] Form groups use `<fieldset>` + `<legend>`
- [ ] Error messages use `role="alert"`
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets 4.5:1 (normal text) / 3:1 (large text)
- [ ] Dark mode: all color classes have `dark:` counterparts
- [ ] Color not used as sole indicator — paired with icon/text
- [ ] No keyboard traps — all interactive elements reachable and escapable
- [ ] Touch targets minimum 44×44px
- [ ] Animations have `prefers-reduced-motion` fallback
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Tables have `<caption>`, `<th scope>`

## Testing

### Automated (axe-core + Playwright)

```typescript
// e2e/*/a11y.spec.ts
import AxeBuilder from '@axe-core/playwright';

test('page has no a11y violations', async ({ page }) => {
  await page.goto('/new-page');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### Build-Time (astro-post-audit)

Automatically checks after every build:
- `a11y.require_skip_link` — skip link present
- `a11y.require_img_alt` — all images have alt text
- `a11y.require_button_text` — buttons have accessible text
- `a11y.require_label` — form inputs have labels

### Manual Checks

- **Tab through the page** — verify focus order and visibility
- **Screen reader** — test with VoiceOver (macOS) or NVDA (Windows)
- **Zoom to 200%** — content must reflow without horizontal scroll
- **Touch targets** — verify 44px minimum on mobile viewport
- **Reduced motion** — enable `prefers-reduced-motion` in DevTools, verify animations stop
- **Browser DevTools** — Accessibility tab shows computed roles and names
