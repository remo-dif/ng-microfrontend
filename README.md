# Northstar Angular micro-frontends

Production-oriented reference platform built with Angular 20, Nx 21, native federation, standalone components, signals, RxJS, SCSS, Jest, Playwright, pnpm, GitHub Actions, Nx Cloud, Docker, Amazon S3, and CloudFront.

Northstar contains a composition shell and five independently buildable and deployable micro-frontends. It is designed as an architectural learning project and an enterprise-grade starting point rather than a finished business application.

## Architecture at a glance

```text
Browser
  └─ shell :4200
       ├─ auth     :4201
       ├─ products :4202
       ├─ orders   :4203
       ├─ profile  :4204
       └─ admin    :4205
```

The shell reads `federation.manifest.json` at runtime and loads each remote's exposed Angular routes. Angular, RxJS, and workspace libraries are strict-version singletons so all applications share compatible dependency-injection and reactive state identities.

Read [ARCHITECTURE.md](ARCHITECTURE.md) for the detailed runtime model, trust boundaries, design trade-offs, CI strategy, deployment topology, caching rules, resilience roadmap, and interview talking points.

## Technology choices

| Concern          | Choice                                                            |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | Angular 20, standalone components, `OnPush`                       |
| Monorepo         | Nx 21                                                             |
| Composition      | `@angular-architects/native-federation`                           |
| Package manager  | pnpm 11                                                           |
| State            | Angular signals for current UI state; RxJS for temporal workflows |
| Styling          | SCSS                                                              |
| Unit tests       | Jest                                                              |
| End-to-end tests | Playwright                                                        |
| CI and cache     | GitHub Actions, Nx affected commands, optional Nx Cloud           |
| Delivery         | Independent S3 buckets and CloudFront distributions               |
| Container        | Multi-stage Node/nginx Docker image                               |

## Prerequisites

- Node.js `22.19.0` (see [.nvmrc](.nvmrc))
- pnpm `11.25.0` (pinned through the `packageManager` field)
- Git
- Chromium browsers for local Playwright execution
- Docker Desktop only when building the container image

With a Node version manager:

```bash
nvm use
corepack enable
corepack install --global pnpm@11.25.0
```

## Install

```bash
pnpm install --frozen-lockfile
```

`pnpm-workspace.yaml` explicitly allows lifecycle scripts only for the trusted binary dependencies required by Nx, esbuild, SWC, and their native storage/watcher packages.

## Run locally

Start the complete platform:

```bash
pnpm start
```

Open [http://localhost:4200](http://localhost:4200). The default route displays the Products remote.

Each application can also be started independently, which is useful for debugging startup or federation boundaries:

```bash
pnpm nx run auth:federation-serve
pnpm nx run products:federation-serve
pnpm nx run orders:federation-serve
pnpm nx run profile:federation-serve
pnpm nx run admin:federation-serve
pnpm nx run shell:federation-serve
```

| Application | URL                     | Purpose                                   |
| ----------- | ----------------------- | ----------------------------------------- |
| Shell       | `http://localhost:4200` | Composition, navigation, global providers |
| Auth        | `http://localhost:4201` | Demo session establishment                |
| Products    | `http://localhost:4202` | Public product catalogue                  |
| Orders      | `http://localhost:4203` | Authenticated order history               |
| Profile     | `http://localhost:4204` | Authenticated user profile                |
| Admin       | `http://localhost:4205` | Role-protected administration             |

The development manifest is [apps/shell/public/federation.manifest.json](apps/shell/public/federation.manifest.json).

## Demo authentication

Select **Sign in** and enter any valid email address. There is no password because this repository intentionally runs without an external identity provider.

- `developer@example.com` receives the `customer` role.
- `developer+admin@example.com` receives the `customer` and `admin` roles.

The generated token is a synthetic, unsigned demonstration JWT stored in `sessionStorage`. It must not be treated as production authentication. A real deployment should use OIDC Authorization Code with PKCE or a backend-for-frontend and enforce authorization at every API boundary.

## Workspace structure

```text
apps/
  shell/                       composition root
  shell-e2e/                   Playwright journeys
auth/                          authentication remote
products/                      catalogue remote
orders/                        orders remote
profile/                       profile remote
admin/                         administration remote
libs/shared/
  models/                      shared contracts
  auth-data-access/            JWT store, guards, interceptor
  api-client/                  typed HTTP boundary
  ui/                          platform UI and navigation
  util-config/                 runtime configuration token
tools/                         manifest and deployment scripts
.github/workflows/             affected CI and deployment matrix
```

Domain behavior belongs in its owning remote. Shared libraries should contain only stable contracts or capabilities with multiple genuine consumers.

## Common commands

| Command             | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `pnpm start`        | Serve the shell and all remotes                         |
| `pnpm build`        | Run standard Angular builds                             |
| `pnpm build:mfes`   | Build all native-federation applications for production |
| `pnpm test`         | Run all Jest projects through Nx                        |
| `pnpm e2e`          | Run the composed-shell Playwright journey               |
| `pnpm graph`        | Open the Nx project graph                               |
| `pnpm format:check` | Check repository formatting                             |

Run a single target with the workspace-local Nx binary:

```bash
pnpm nx run shell:lint
pnpm nx run auth-data-access:test
pnpm nx run products:federation-build
```

Run only projects affected by a change:

```bash
pnpm nx affected -t lint,test,build --base=origin/main --head=HEAD
```

Install Chromium before the first local end-to-end run:

```bash
pnpm exec playwright install chromium
pnpm e2e
```

## Testing strategy

- Jest covers components, shared libraries, authentication state, JWT parsing, guards, and interceptor behavior.
- Playwright validates the composed application through the shell rather than testing remotes only in isolation.
- Native-federation production builds verify exposed route contracts and shared dependency preparation.
- CI runs affected lint, build, federation-build, test, and Chromium Playwright tasks.

## CI and Nx Cloud

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs for pull requests and pushes to `main`.

The pipeline uses:

1. `nx affected` to avoid work unrelated to the Git diff.
2. Nx's local task cache for repeated tasks on the same runner.
3. Nx Cloud remote caching when `NX_CLOUD_ACCESS_TOKEN` is configured.
4. Nx Cloud distributed execution when the access token is available.

The workflow handles an initial GitHub push by comparing the root commit to Git's empty-tree object. This prevents the invalid all-zero `github.event.before` SHA from breaking affected calculations.

## AWS deployment

Deployment is disabled until the repository variable `AWS_DEPLOY_ENABLED` is set to `true`. This keeps ordinary CI green before AWS infrastructure exists.

Configure the GitHub production environment with:

| Name                            | Type     | Description                                        |
| ------------------------------- | -------- | -------------------------------------------------- |
| `AWS_DEPLOY_ENABLED`            | Variable | Set to `true` after all AWS configuration is ready |
| `AWS_REGION`                    | Variable | Target AWS region                                  |
| `MFE_ORIGIN`                    | Variable | Public base origin used in the runtime manifest    |
| `AWS_DEPLOY_ROLE_ARN`           | Secret   | Least-privilege role assumed through GitHub OIDC   |
| `S3_BUCKETS_JSON`               | Secret   | Application-to-bucket mapping                      |
| `CLOUDFRONT_DISTRIBUTIONS_JSON` | Secret   | Application-to-distribution mapping                |
| `NX_CLOUD_ACCESS_TOKEN`         | Secret   | Optional Nx remote-cache and distribution token    |

Example mapping shape:

```json
{
  "shell": "northstar-shell-production",
  "auth": "northstar-auth-production",
  "products": "northstar-products-production",
  "orders": "northstar-orders-production",
  "profile": "northstar-profile-production",
  "admin": "northstar-admin-production"
}
```

Each affected application is built and uploaded independently. Hashed assets receive immutable caching; `index.html`, `remoteEntry.json`, and `federation.manifest.json` are uploaded last with no-cache headers before CloudFront invalidation.

## Docker

Build the shell image:

```bash
docker build --build-arg APP=shell -t northstar-shell .
docker run --rm -p 8080:8080 northstar-shell
```

Open [http://localhost:8080](http://localhost:8080). The Docker image validates the shell as a production-style static nginx deployment; independently hosted remote artifacts must still be reachable through the manifest.

## Troubleshooting

### The page is blank

Confirm that all remote ports are running and each URL returns `remoteEntry.json`. Native federation also requires `es-module-shims` in every application's polyfills; it is already configured in this workspace.

### Nx waits for another project graph

Stop stale development processes, then reset Nx:

```bash
pnpm nx reset
```

Start the applications independently if the parallel development command remains blocked.

### The editor reports TypeScript configuration deprecations

Use the workspace TypeScript version and restart the editor's TypeScript server. The root configuration uses `moduleResolution: "bundler"` and explicit path mappings without deprecated `baseUrl`.

### pnpm reports an unsupported Node engine

Activate Node `22.19.0` from `.nvmrc`. The workspace deliberately supports Node `>=20.19 <23`; newer system runtimes are not part of the validated toolchain.

## Further reading

- [Detailed architecture](ARCHITECTURE.md)
- [Concise architecture notes](docs/architecture.md)
- [Deployment script](tools/deploy-app.sh)
- [CI workflow](.github/workflows/ci.yml)

## License

MIT
