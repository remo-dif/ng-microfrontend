# Northstar Angular micro-frontends

Production-oriented Angular 20 + Nx 21 reference platform with a native-federation shell and five independently deployable remotes.

## Quick start

```bash
nvm use
pnpm install --frozen-lockfile
pnpm nx run products:federation-serve
pnpm nx run shell:federation-serve
```

Run the remaining remotes on ports 4201–4205 as listed in [the architecture guide](docs/architecture.md). Use any email to enter the demo; include `+admin` before `@` to see the admin route.

## Commands

- `pnpm build:mfes` — production native-federation builds
- `pnpm test` — Jest unit tests through Nx
- `pnpm e2e` — Playwright shell journey
- `pnpm graph` — inspect project dependencies and affected boundaries

The demo JWT is not a production identity implementation. Read the canonical [architecture guide](ARCHITECTURE.md) before connecting an identity provider or deploying. A shorter overview remains in [docs/architecture.md](docs/architecture.md).
