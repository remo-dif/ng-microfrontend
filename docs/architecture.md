# Angular micro-frontend platform

## Decision record

This platform uses Angular 20, Nx 21 and native federation. Native federation keeps Angular's esbuild pipeline and exchanges browser-standard ESM/import maps. Nx's webpack Module Federation remains a valid alternative when an organization values Nx's host/remote generators, version negotiation tooling and long-standing webpack ecosystem more than esbuild alignment.

The shell owns composition, navigation, global error handling and route policy. Each remote exposes only a `Routes` contract and can be built and deployed independently. Angular, RxJS and workspace libraries are strict-version singletons. This is essential for dependency injection and signal state: loading a second Angular runtime can create a second root injector and split shared auth state.

## Folder structure

```text
apps/shell/                 composition root and Playwright target
auth/                       authentication remote (4201)
products/                   public catalogue remote (4202)
orders/                     authenticated orders remote (4203)
profile/                    authenticated profile remote (4204)
admin/                      admin-only remote (4205)
libs/shared/models/         framework-light cross-domain contracts
libs/shared/auth-data-access/ JWT store, interceptor and guards
libs/shared/api-client/     typed HTTP boundary
libs/shared/ui/             deliberately small platform chrome
libs/shared/util-config/    runtime configuration injection token
tools/                      manifest generation and atomic app deploy
.github/workflows/          affected CI and independent deployment matrix
```

Keep domain-specific code inside its remote. Promote code to `shared` only when it has stable semantics and at least two real consumers; a giant shared library recreates a distributed monolith.

## Local development

Use Node 22 (`nvm use`; see `.nvmrc`), then:

```bash
pnpm install --frozen-lockfile
pnpm build:mfes
pnpm nx run auth:federation-serve
pnpm nx run products:federation-serve
pnpm nx run orders:federation-serve
pnpm nx run profile:federation-serve
pnpm nx run admin:federation-serve
pnpm nx run shell:federation-serve
```

The committed manifest targets localhost. `tools/generate-federation-manifest.mjs` rewrites it for deployment from `MFE_ORIGIN`.

## Authentication trade-offs

`AuthStore` demonstrates signals for synchronous UI state and RxJS for asynchronous streams/HTTP. Route guards are UX controls, not security boundaries; every API must validate the access token and authorization server-side. The demo login constructs a fake JWT only so the repository runs without an identity provider. Production should use Authorization Code + PKCE, preferably through a BFF with an HttpOnly, Secure, SameSite cookie. If bearer tokens are required, short-lived access tokens in memory plus refresh-token rotation are safer than localStorage. The current sessionStorage adapter is intentionally isolated behind `AuthStore` so it can be replaced.

## CI and deployment

Nx hashes source, configuration and dependency inputs, so `nx affected` avoids untouched work and Nx Cloud reuses results across runners. The quality job can distribute tasks across three Nx Cloud agents. Deployment uses a matrix: every affected app gets its own S3 bucket and CloudFront distribution, allowing independent release and rollback.

GitHub must provide an OIDC deploy role, `NX_CLOUD_ACCESS_TOKEN`, `S3_BUCKETS_JSON`, `CLOUDFRONT_DISTRIBUTIONS_JSON`, `AWS_REGION`, and `MFE_ORIGIN`. Use least-privilege AWS policies scoped to each bucket/distribution. Hashed assets receive a one-year immutable cache; `index.html`, `remoteEntry.json`, and the shell manifest must never be cached. Upload immutable assets first and entry points last to prevent clients observing references to missing chunks.

## Production hardening increments

1. Replace demo login with the chosen OIDC/BFF integration and add refresh concurrency handling.
2. Add domain data-access libraries, contract tests and an API mock layer (MSW).
3. Add remote-load error boundaries, observability correlation IDs and CSP/SRI policy.
4. Add consumer-driven compatibility checks before promoting a remote manifest.
5. Deploy versioned prefixes, then atomically promote the manifest for instant rollback.

## Interview talking points

- Micro-frontends optimize team autonomy and release independence, not bundle size; they add runtime compatibility, observability and deployment complexity.
- The manifest is the release control plane. Versioned remote URLs make rollout and rollback atomic.
- Signals model local synchronous state; RxJS models cancellation, time and multi-event workflows. Converting everything to either abstraction loses clarity.
- Strict singleton sharing protects Angular DI identity, while narrow remote contracts limit coupling.
- Nx affected calculation reduces work; Nx Cloud remote cache reduces repeated work; distributed execution reduces critical-path latency. These are different optimizations.
- Client guards improve navigation, but authorization belongs at the API boundary.
