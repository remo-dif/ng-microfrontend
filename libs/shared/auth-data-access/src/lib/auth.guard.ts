import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Role } from '@ng-microfrontend/models';
import { AuthStore } from './auth.store';

export const authGuard: CanMatchFn = (_, segments) => {
  const auth = inject(AuthStore);
  const returnUrl = `/${segments.map((segment) => segment.path).join('/')}`;
  return auth.authenticated() || inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl } });
};

export const roleGuard = (role: Role): CanMatchFn => () => {
  const auth = inject(AuthStore);
  return auth.hasRole(role) || inject(Router).createUrlTree(['/']);
};
