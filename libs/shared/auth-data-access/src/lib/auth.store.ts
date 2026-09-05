import { computed, Injectable, signal } from '@angular/core';
import { AuthTokens, Role, User } from '@ng-microfrontend/models';

const TOKEN_KEY = 'platform.access_token';

interface JwtClaims {
  readonly sub: string;
  readonly email: string;
  readonly name?: string;
  readonly roles: readonly Role[];
  readonly exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenState = signal<string | null>(null);
  private readonly userState = signal<User | null>(null);

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly authenticated = computed(() => this.tokenState() !== null && this.userState() !== null);
  readonly isAdmin = computed(() => this.userState()?.roles.includes('admin') ?? false);

  constructor() {
    this.restoreSession();
  }

  establishSession(tokens: AuthTokens): boolean {
    const user = this.decodeUser(tokens.accessToken);
    if (!user) {
      this.clearSession();
      return false;
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, tokens.accessToken);
    }
    this.tokenState.set(tokens.accessToken);
    this.userState.set(user);
    return true;
  }

  clearSession(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
    }
    this.tokenState.set(null);
    this.userState.set(null);
  }

  hasRole(role: Role): boolean {
    return this.userState()?.roles.includes(role) ?? false;
  }

  private restoreSession(): void {
    const token = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(TOKEN_KEY);
    if (token) this.establishSession({ accessToken: token });
  }

  private decodeUser(token: string): User | null {
    try {
      const encodedPayload = token.split('.')[1];
      if (!encodedPayload) return null;
      const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');
      const json = decodeURIComponent(
        Array.from(atob(base64), (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
      );
      const claims = JSON.parse(json) as Partial<JwtClaims>;
      const roles = claims.roles?.filter((role): role is Role => role === 'customer' || role === 'admin');
      if (!claims.sub || !claims.email || !claims.exp || claims.exp * 1000 <= Date.now() || !roles?.length) return null;

      return {
        id: claims.sub,
        email: claims.email,
        displayName: claims.name || claims.email,
        roles,
      };
    } catch {
      return null;
    }
  }
}
