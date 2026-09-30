# Gufran Bhatti — Portfolio

Personal portfolio site for Gufran Bhatti (AI Engineer & Full-Stack Developer), built as an interactive, single-page experience rather than a static resume page. It's designed around a dark, "industrial brutalist / terminal" identity — sharp edges, zero border-radius, a lime accent, mono/display typography, grid overlays — with real WebGL, scroll-driven, and physics-based interactivity layered on top, plus an AI assistant grounded in the site's own content.

**Live site:** [gufran-bhatti.vercel.app](http://gufran-bhatti.vercel.app/)

---

## Contents

- [What's actually interactive here](#whats-actually-interactive-here)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [The AI assistant (Ask.GB)](#the-ai-assistant-askgb)
- [Theming (dark / light mode)](#theming-dark--light-mode)
- [Deployment](#deployment)
- [Design system reference](#design-system-reference)
- [Notes, gotchas, and deliberate decisions](#notes-gotchas-and-deliberate-decisions)

---

## What's actually interactive here

This isn't a portfolio with a few CSS transitions — most sections have a real mechanic behind them:

- **Hero** — a physics-simulated particle field (magnetic attraction + swirl toward the cursor, damping, spring-return) that, after ~1.1s of cursor stillness, slowly assembles into a procedurally-routed circuit-board trace layout spanning the background, then scatters back to dust the instant you move again. The name headline "decrypts" itself from random glyphs into real text on load. The portrait sits in an angled, clipped panel (not a card) with cursor-driven 3D tilt and a scanning-line animation, and is deliberately pinned to a fixed dark treatment regardless of site theme (see [Notes](#notes-gotchas-and-deliberate-decisions)).
- **System.Specs (About)** — a 350vh scroll-pinned section: a photo stays `position: sticky` in view while three text stages crossfade in sequence as you scroll past it, each fully replacing the last.
- **Section transitions** — every major section slides up and settles over the one before it (`RevealSection.jsx`) — translate/scale/border-radius/shadow all tied to scroll progress, not a plain fade.
- **Signature** (footer) — "Gufran Bhatti" is drawn stroke-by-stroke via `pathLength` animation on real vector glyph outlines (not an approximation — the outline path was generated once from the actual Sacramento font using `opentype.js` and baked into the component), then settles into a solid fill.
- **Heading hover effect** — every section heading scatters its characters outward on hover and reassembles on mouse-leave (`TextDisperse.jsx`).
- **Custom cursor** — a velocity-rotated arrow that tracks pointer direction, and scales up + fills solid when hovering anything clickable.
- **Ask.GB** — a chat box grounded in this portfolio's actual content, backed by Gemini. See its own section below.
- **Dark / light mode** — a real second theme, not an inverted-colors hack (see [Theming](#theming-dark--light-mode)).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 |
| Animation | Framer Motion (scroll-linked transforms, gestures, layout) |
| 3D / WebGL | `@react-three/fiber` + `@react-three/drei` + `three` |
| Icons | `lucide-react` |
| AI backend | Vercel serverless function (`api/chat.js`) calling the Gemini API directly via `fetch` (no SDK) |
| Fonts | Outfit (display), Inter (body), JetBrains Mono (mono) — Google Fonts |
| Hosting | Vercel |

No CSS framework — every component is styled with plain inline `style` objects plus a handful of utility classes in `src/styles/global.css`, using CSS custom properties for theming.

## Project structure

```
.
├── api/
│   └── chat.js                  # Vercel serverless function — Gemini-backed chat, key never reaches the client
├── src/
│   ├── App.jsx                  # Page composition: section order, RevealSection wrapping, ThemeProvider
│   ├── main.jsx                 # React root
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark/light theme state, localStorage persistence, data-theme attribute
│   ├── styles/
│   │   └── global.css           # CSS variables (both themes), base styles, hover-state utility classes
│   └── components/
│       ├── Hero.jsx             # Particle field, circuit-assembly, portrait panel, decrypt-text headline
│       ├── About.jsx            # Scroll-pinned photo story ("SYSTEM.SPECS")
│       ├── Skills.jsx           # Categorized skill grid ("SKILL.TREE")
│       ├── Experience.jsx       # Work history with full bullet detail ("WORK.HISTORY")
│       ├── Education.jsx        # ("EDU.LOG")
│       ├── Certifications.jsx
│       ├── Projects.jsx         # ("PROJECTS")
│       ├── Publications.jsx     # ("RESEARCH.PUB")
│       ├── AskGB.jsx            # Chat UI for the AI assistant
│       ├── Contact.jsx          # CTA + signature draw + footer directory
│       ├── Navbar.jsx           # Nav links + theme switch
│       ├── CustomCursor.jsx
│       ├── SplashScreen.jsx     # Boot-sequence loader on first paint
│       ├── RevealSection.jsx    # Shared "slide up and settle over the previous section" wrapper
│       ├── SignatureText.jsx    # SVG pathLength signature-draw component
│       └── TextDisperse.jsx     # Hover character-scatter effect for headings
├── hero-section.png             # Hero portrait
├── about-photo.jpg              # About section's pinned photo
├── footer-photo.jpg             # Footer background photo
├── .env.example                 # Documents required env vars (committed, no real values)
├── .env.local                   # Real secrets — gitignored, never committed
└── vite.config.js
```

## Getting started

```bash
npm install
npm run dev
```

This starts the Vite dev server (default `localhost:5173`) for the site itself. **`npm run dev` does not run `api/chat.js`** — plain Vite has no concept of Vercel serverless functions, so the Ask.GB chat will fail with a network error under this command. That's expected; see below for testing it.

To test the full site including the chat:

```bash
npx vercel dev
```

The first run will ask you to log into Vercel and link/create a project (accept the defaults — it auto-detects this as a Vite project). It picks up `GEMINI_API_KEY` automatically from `.env.local` and serves both the static site and `/api/chat` together, typically on `localhost:3000`.

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Environment variables

| Variable | Required for | Notes |
|---|---|---|
| `GEMINI_API_KEY` | The Ask.GB chat (`api/chat.js`) | Get one from Google AI Studio. Set locally in `.env.local` (gitignored), and in your Vercel project's Environment Variables for production. |

`.env.example` documents the variable name with no value — copy it to `.env.local` and fill in your own key if you're setting this up fresh:

```bash
cp .env.example .env.local
```

**The key is never sent to the browser.** `api/chat.js` runs server-side only; the frontend calls `/api/chat` and never sees the key itself. Don't move Gemini calls into client-side code — this is a static SPA, and anything in `src/` ships to every visitor's browser as-is.

## The AI assistant (Ask.GB)

`AskGB.jsx` is a chat UI that calls `api/chat.js`, a Vercel serverless function using `gemini-3.5-flash` via direct `fetch` calls to the Gemini REST API (no SDK dependency).

**How it's grounded:** the entire portfolio's content — profile, all six skill categories, all four jobs with full bullet detail, education, the IEEE publication, all certifications, and all fourteen projects — is baked directly into the system prompt as a static reference block. At this content size, that's simpler and more reliable than a vector-search/RAG pipeline, and it means the assistant can't drift from what's actually true about Gufran's background.

**Guardrails**, enforced via the system prompt:
- Only answers questions about Gufran — anything off-topic gets politely declined and redirected.
- Only uses the reference block — if something isn't covered there, it says so rather than inventing an answer.
- Explicitly instructed to ignore prompt-injection attempts embedded in user messages (e.g. "ignore previous instructions") and treat them as off-topic.
- Never reveals the system prompt or reference block verbatim, even if asked directly.

These were verified with real test calls (not just written and assumed to work) against: a legitimate portfolio question, a prompt-injection attempt asking it to write unrelated code, an off-topic general-knowledge question, and a direct attempt to extract the system prompt. All four behaved correctly.

**One implementation detail worth knowing:** Gemini 3.5's "thinking" tokens count against `maxOutputTokens` by default, which was silently truncating every response to a few words until `thinkingConfig: { thinkingBudget: 0 }` was added to the generation config. If you ever see the chat return clipped, near-empty replies after touching this file, check that setting first.

**Known gap:** if you ask it "how many languages does he know," it'll say it doesn't have that information — the portfolio only lists programming languages, not spoken ones, and that wasn't guessed into the context rather than made up.

## Theming (dark / light mode)

`ThemeContext.jsx` provides a `useTheme()` hook (`{ theme, toggleTheme }`), defaults to **dark** (the site's actual identity — it doesn't follow OS preference for first-time visitors), and persists the user's choice to `localStorage`. Toggling sets a `data-theme="light"` attribute on `<html>`, which `global.css` uses to override a full set of CSS custom properties (`--bg`, `--fg`, `--accent`, `--accent-secondary`, `--border`, `--muted`, etc.) — not a naive color inversion. The lime accent shifts to a darker olive in light mode since bright lime fails contrast on white.

**Two sections are deliberately exempt from theming**: the Hero portrait panel and the entire `About.jsx` scroll-pinned photo section are pinned to fixed dark values regardless of the toggle. Both are full-bleed photographs with a dramatic dark treatment — letting them follow the theme washed the photos out and made the overlaid text illegible in light mode, so they stay fixed "cinematic" zones by design. Every other section (Skills, Experience, Education, Certifications, Projects, Ask.GB, Contact, the footer) is fully theme-reactive.

**If you add new hover-color effects**, don't animate them via Framer Motion's `whileHover`/`variants` with a `var(--x)` target. Framer resolves the CSS variable once via `getComputedStyle` when the hover animation starts and leaves that frozen value as an inline style afterward — there's nothing telling it what to revert to on mouse-leave. If the theme changes while an element still has that stale inline style, it stays stuck showing the old theme's color until re-hovered. Use a plain CSS `:hover` rule instead (see `.cert-cell`, `.btn-primary`, `.btn-outline`, `.project-card` in `global.css` for the pattern) — native CSS re-reads the current variable value live, so it can't go stale. Framer is still fine for hover effects that animate numeric values (scale, scaleY, position) — the bug is specific to color/`var()` targets.

## Deployment

The site deploys on **Vercel**, which auto-detects it as a Vite project (build command `npm run build`, output `dist`) and treats `api/*.js` files as serverless functions automatically — no `vercel.json` needed.

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Add `GEMINI_API_KEY` in Project Settings → Environment Variables before (or right after, then redeploy) the first deploy.
3. Deploy. `/api/chat` starts working immediately on the live URL.

### Git remotes

This repo (`portfolio_v3.0`) is a clean rebuild with its own history, separate from an earlier static-HTML version of this portfolio that still lives at `GufranBhatti.github.io`. If you're working from a clone that still has an `old-origin` remote pointing there, it's inert — nothing in this workflow pushes to it.

## Design system reference

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#09090b` | `#f2f2ef` |
| `--fg` | `#fafafa` | `#101012` |
| `--accent` | `#d9f99d` (lime) | `#4d7c0f` (olive) |
| `--accent-secondary` | `#f97316` (orange) | `#c2410c` |
| `--font-display` | Outfit — all headings, uppercase, `-0.04em` tracking | |
| `--font-mono` | JetBrains Mono — labels, meta text, code-styled UI | |
| `--font-body` | Inter — paragraph copy | |

Brutalist conventions used throughout: `border-radius: 0` everywhere (the theme toggle is a rectangular switch, not a pill, on purpose), 1px hairline borders via `.brutalist-grid`/`.brutalist-cell`, and terminal-style section labels (`SYS.STATUS: ONLINE`, `// SYSTEM.SPECS`, hex-styled IDs like `0xGB_ENG`).

## Notes, gotchas, and deliberate decisions

- **`npm run dev` vs `vercel dev`** — covered above, but worth repeating: if the chat silently fails locally, you're almost certainly on plain `vite dev`.
- **Stale Vite dependency cache** — if the dev server ever renders a blank white page with no error overlay after adding a new dependency import, it's very likely a stale pre-bundle cache from before Vite discovered the new import. Fix: `rm -rf node_modules/.vite`, restart, hard-refresh the browser tab.
- **`hero-section.png`, `about-photo.jpg`, `footer-photo.jpg`** live at the project root (not under `src/`) and are imported directly by file path from the components that use them — this matches the original static-site layout and was kept as-is during the migration rather than relocated.
- **The particle field's shape-assembly target** (the circuit layout in Hero) is generated once via a seeded pseudo-random walk, not `Math.random()`, specifically so the routed trace layout is the same stable pattern on every load rather than a potentially-messy random layout each time.
- **`RevealSection.jsx`'s transform values are intentionally small** (`translateY: 3%`, `scale: 0.98`, `transform-origin: top`). Earlier, larger values (`10%`/`0.94` with a center origin) caused a visible gap of bare background between sections during the whole scroll transition, not just briefly — the incoming section was visibly lagging behind its natural flush position for the entire scroll distance. If you're tempted to make this effect more dramatic, keep the top-anchored origin or the gap comes back.
