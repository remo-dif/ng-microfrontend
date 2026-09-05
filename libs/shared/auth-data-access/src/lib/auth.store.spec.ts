import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_CONFIG } from '@ng-microfrontend/util-config';
import { AuthStore } from './auth.store';
import { authInterceptor } from './auth.interceptor';

function token(claims: Record<string, unknown>): string {
  const bytes = new TextEncoder().encode(JSON.stringify(claims));
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  const payload = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `header.${payload}.signature`;
}

describe('AuthStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: PLATFORM_CONFIG, useValue: { apiBaseUrl: '/api', production: false } },
      ],
    });
  });

  it('accepts a valid Base64URL token and derives roles', () => {
    const store = TestBed.inject(AuthStore);
    const accepted = store.establishSession({
      accessToken: token({ sub: '42', email: 'josé@example.com', name: 'José', roles: ['customer', 'admin'], exp: Math.floor(Date.now() / 1000) + 60 }),
    });

    expect(accepted).toBe(true);
    expect(store.authenticated()).toBe(true);
    expect(store.isAdmin()).toBe(true);
    expect(store.user()?.displayName).toBe('José');
  });

  it('rejects expired and malformed tokens', () => {
    const store = TestBed.inject(AuthStore);
    expect(store.establishSession({ accessToken: token({ sub: '42', email: 'a@b.com', roles: ['customer'], exp: 1 }) })).toBe(false);
    expect(store.establishSession({ accessToken: 'invalid' })).toBe(false);
    expect(store.authenticated()).toBe(false);
  });

  it('sends bearer tokens only to the configured API', () => {
    const store = TestBed.inject(AuthStore);
    store.establishSession({ accessToken: token({ sub: '42', email: 'a@b.com', roles: ['customer'], exp: Math.floor(Date.now() / 1000) + 60 }) });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);

    http.get('/api/orders').subscribe();
    expect(controller.expectOne('/api/orders').request.headers.get('Authorization')).toMatch(/^Bearer /);
    http.get('https://telemetry.example/events').subscribe();
    expect(controller.expectOne('https://telemetry.example/events').request.headers.has('Authorization')).toBe(false);
    controller.verify();
  });
});
