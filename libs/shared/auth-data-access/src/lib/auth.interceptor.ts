import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PLATFORM_CONFIG } from '@ng-microfrontend/util-config';
import { AuthStore } from './auth.store';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthStore).token();
  const apiBaseUrl = inject(PLATFORM_CONFIG).apiBaseUrl;
  const documentBase =
    typeof document === 'undefined' ? 'http://localhost' : document.baseURI;
  const requestUrl = new URL(request.url, documentBase);
  const apiUrl = new URL(apiBaseUrl, documentBase);
  const targetsApi =
    requestUrl.origin === apiUrl.origin &&
    requestUrl.pathname.startsWith(apiUrl.pathname);

  if (!token || !targetsApi || request.context.get(SKIP_AUTH))
    return next(request);
  return next(
    request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  );
};
