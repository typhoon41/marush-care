# Marush frontend

Angular 20 app (zoneless, SSR). Locally it runs as the `marush-care-app` resource of the Aspire host at http://localhost:4200, and talks to the API at https://localhost:7251. See the [root README](../../README.md) for running everything together.

Install the packages once with `npm ci`.

| Script | What it does |
|---|---|
| `npm start` | Dev server, Serbian locale (the host runs `start:aspire`, which is the same on the port Aspire assigns) |
| `npm run start-en` / `npm run start-ru` | Dev server, English / Russian locale |
| `npm run build` | Production build into `dist/` |
| `npm run test` | Unit tests |
| `npm run lint` | ESLint + Stylelint with auto-fix |
| `npm run translate` | Extract i18n strings and sort the locale files |
