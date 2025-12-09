<h1 align="center">SpecMatch AI Hub</h1>

<p align="center">An AI-first, TypeScript + Vite web app for exploring, comparing, and matching "specs" with speed and clarity.</p>

## Overview

SpecMatch AI Hub is a lightweight, React-based interface for experimenting with “spec matching” workflows. The app provides a clean, modular UI to:
- Load or define a “source spec” (e.g., a requirement, product sheet, or profile)
- Compare it against candidate specs
- Visualize alignment and gaps
- Iterate rapidly on matching strategies

This repo is designed to be hackathon-friendly: fast to set up, simple to extend, and easy to explain.

## Features

- Modern, zero-backend frontend built with Vite, React, and TypeScript
- Tailwind CSS styling with utility-first workflows
- Modular architecture:
  - `pages/` for routing-level views
  - `components/` for reusable UI
  - `hooks/` for stateful logic
  - `lib/` for utilities and adapters
  - `data/` for sample inputs or local datasets
- Sensible defaults and clear separation of concerns for rapid iteration
- Works out of the box locally; can integrate external AI APIs if desired

## Why It Matters (for judges)

- Problem: Matching requirements (“specs”) to the best candidates is tedious and error-prone.
- Solution: A focused, fast UI that helps teams compare and rank candidates against a target spec, highlight differences, and make decisions quickly.
- Impact: Reduces manual review time, increases consistency, and provides a foundation to plug in AI scoring/extraction later.

## Prerequisites

- Node.js 18+ (recommended) OR Bun (optional)
- A package manager of your choice:
  - npm (default here), or
  - bun (since `bun.lockb` exists), or
  - yarn/pnpm if you prefer
- Git (to clone the repository)

## Getting the Code

```bash
git clone https://github.com/ak8057/specmatch-ai-hub.git
cd specmatch-ai-hub
```

If you prefer not to use Git, download the repository as a ZIP from GitHub and extract it to a convenient directory.

## Installation

Using npm:
```bash
npm install
```

Using Bun:
```bash
bun install
```

## Running Locally

Using npm:
```bash
npm run dev
```

Using Bun:
```bash
bun run dev
```

Then open the printed local URL (typically `http://localhost:5173/`).

## Production Build

Using npm:
```bash
npm run build
npm run preview
```

Using Bun:
```bash
bun run build
bun run preview
```

## Usage

1. Start the dev server and open the app in your browser.
2. Navigate to the matching page (see the app’s top-level navigation).
3. Provide a “Source Spec” (paste text or load a sample).
4. Provide one or more “Candidate Specs.”
5. Run comparison to see alignment, differences, and a preliminary ranking.
6. Iterate on inputs, weights, or display settings as needed.

Note: By default, the app runs entirely in the browser. You can later integrate external AI scoring or extraction via client-side adapters in `src/lib/` if desired.

## Configuration

- Styling: Tailwind is configured via `tailwind.config.ts` and `postcss.config.js`.
- TypeScript: Project-wide settings live in `tsconfig*.json`.
- ESLint: Rules are defined in `eslint.config.js`.
- UI Components: The presence of `components.json` means you can introduce/generate component primitives consistently (e.g., via your preferred component tooling).

### Environment Variables (optional)

If you plan to call external APIs (e.g., for AI scoring), add a local `.env` file (Vite-friendly) and read variables in your client code via `import.meta.env`. Example:

```
VITE_API_BASE_URL="https://your-service.example.com"
VITE_API_KEY="your-key"
```

Keep secrets safe—never commit `.env` to version control.

## Tech Stack

- React + TypeScript
- Vite (bundler/dev server)
- Tailwind CSS (styling)
- ESLint (linting)
- Node/npm (primary) or Bun (optional)

## Project Structure

```
specmatch-ai-hub/
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── index.css
│   ├── lib/
│   ├── main.tsx
│   ├── pages/
│   ├── types/
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

- `src/pages/`: Top-level routes (e.g., “Match”, “About”, “Settings”).
- `src/components/`: Reusable UI building blocks.
- `src/hooks/`: Custom React hooks for app logic/state.
- `src/lib/`: Utilities, adapters (e.g., parsers, scoring helpers).
- `src/data/`: Sample inputs or mock datasets for demos.
- `src/App.tsx`: Root app component.
- `src/main.tsx`: App bootstrap with Vite/React.

## How It Works

<img width="1454" height="714" alt="image" src="https://github.com/user-attachments/assets/6df7658b-8306-4fea-a21d-58d6cdd3a970" />

## Development Workflow

- Start the dev server and iterate on `src/pages` and `src/components`.
- Use `src/hooks` for stateful logic and `src/lib` for pure helpers.
- Tailwind styles live in `index.css` and are configured via `tailwind.config.ts`.
- Lint while developing to maintain consistency:
  ```bash
  npm run lint
  ```
  or with Bun:
  ```bash
  bun run lint
  ```

## Roadmap

- Pluggable scoring strategies (rule-based, similarity, AI-assisted)
- Diff visualizations (side-by-side highlights)
- Import/export in CSV/JSON
- Persisted workspaces (local storage or cloud)
- Accessibility and keyboard-first operations

## Screenshots / Demo

- Add a short GIF or screenshots here to showcase the core flow:
  - Inputting a Source Spec
  - Adding candidates
  - Viewing ranked matches and diffs

## Troubleshooting

- App doesn’t start: Ensure Node 18+ (or Bun) and run `npm install` (or `bun install`) again.
- Styling not applying: Verify Tailwind classes and `index.css` import.
- Type errors: Run `npm run build` to surface strict TS diagnostics.

## Support

- File issues or enhancement requests through the repository issue tracker:
  - Issues: https://github.com/ak8057/specmatch-ai-hub/issues
  - Pull Requests: https://github.com/ak8057/specmatch-ai-hub/pulls
- Contributions are welcome; please describe the change and include testing notes.

## License

All rights are reserved by the repository owner unless explicitly granted otherwise.
