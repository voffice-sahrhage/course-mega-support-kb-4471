# Building the kb

Not part of the desk's export: the glue that renders the kb pages to static HTML.

```
npm ci
npx vite build        # → build/kb/…/index.html
```

- `vite.config.js`: SvelteKit 3 + mdsvex (`.svx`), the `runbook` layout, `#lib` → `src/lib`, static output with CSS inlined.
- `src/routes/+layout.ts`, `src/app.html`: prerender every page.

## The page as the desk will see it

- Source: `src/routes/kb/incidents/4471/problems/+page.svx`
- Rendered: `rendered/incident-4471-problems.html` (copied from `build/kb/incidents/4471/problems/index.html`) and `rendered/incident-4471-problems.png`
