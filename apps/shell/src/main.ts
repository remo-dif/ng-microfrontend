import { initFederation } from '@angular-architects/native-federation';

initFederation('/federation.manifest.json')
  .then(() => import('./bootstrap'))
  .catch((error) => console.error('Federation initialization failed', error));
