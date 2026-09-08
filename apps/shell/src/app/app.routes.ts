import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard, roleGuard } from '@ng-microfrontend/auth-data-access';
import { Route } from '@angular/router';

const remoteRoutes = (remoteName: string) => () =>
  loadRemoteModule(remoteName, './Routes').then(
    (module) => module.remoteRoutes
  );

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'login', loadChildren: remoteRoutes('auth') },
  { path: 'products', loadChildren: remoteRoutes('products') },
  {
    path: 'orders',
    canMatch: [authGuard],
    loadChildren: remoteRoutes('orders'),
  },
  {
    path: 'profile',
    canMatch: [authGuard],
    loadChildren: remoteRoutes('profile'),
  },
  {
    path: 'admin',
    canMatch: [authGuard, roleGuard('admin')],
    loadChildren: remoteRoutes('admin'),
  },
  { path: '**', redirectTo: 'products' },
];
