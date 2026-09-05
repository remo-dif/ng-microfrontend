# Northstar Angular micro-frontends

Production-oriented Angular 20 + Nx 21 reference platform with a native-federation shell and five independently deployable remotes.

## Quick start

```bash
nvm use
npm ci
npx nx run products:federation-serve
npx nx run shell:federation-serve
```

Run the remaining remotes on ports 4201–4205 as listed in [the architecture guide](docs/architecture.md). Use any email to enter the demo; include `+admin` before `@` to see the admin route.

## Commands

- `npm run build:mfes` — production native-federation builds
- `npm test` — Jest unit tests through Nx
- `npm run e2e` — Playwright shell journey
- `npm run graph` — inspect project dependencies and affected boundaries

The demo JWT is not a production identity implementation. Read [docs/architecture.md](docs/architecture.md) before connecting an identity provider or deploying.
