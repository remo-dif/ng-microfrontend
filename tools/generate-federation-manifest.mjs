import { writeFileSync } from 'node:fs';

const origin = (process.env.MFE_ORIGIN ?? 'http://localhost').replace(/\/$/, '');
const local = !process.env.MFE_ORIGIN;
const ports = { auth: 4201, products: 4202, orders: 4203, profile: 4204, admin: 4205 };
const manifest = Object.fromEntries(Object.entries(ports).map(([name, port]) => [
  name,
  local ? `${origin}:${port}/remoteEntry.json` : `${origin}/${name}/remoteEntry.json`,
]));
writeFileSync('apps/shell/public/federation.manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
