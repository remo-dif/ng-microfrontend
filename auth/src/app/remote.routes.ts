import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthStore } from '@ng-microfrontend/auth-data-access';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <section class="card"><h1>Sign in</h1><p>Demo: any valid email. Add <code>+admin</code> for the admin role.</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Email <input type="email" formControlName="email" autocomplete="email" /></label>
        <button [disabled]="form.invalid" type="submit">Continue</button>
      </form>
    </section>`,
  styles: [`form,label{display:grid;gap:.75rem} input{padding:.75rem;max-width:24rem} button{width:max-content;padding:.65rem 1rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LoginPage {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly form = new FormGroup({ email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }) });

  protected submit(): void {
    if (this.form.invalid) return;
    const email = this.form.controls.email.value;
    const claims = { sub: crypto.randomUUID(), email, name: email.split('@')[0], roles: email.includes('+admin') ? ['customer', 'admin'] : ['customer'], exp: Math.floor(Date.now() / 1000) + 3600 };
    const bytes = new TextEncoder().encode(JSON.stringify(claims));
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    const payload = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    if (!this.auth.establishSession({ accessToken: `demo.${payload}.signature` })) return;

    const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const returnUrl = requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//') ? requestedUrl : '/products';
    void this.router.navigateByUrl(returnUrl);
  }
}

export const remoteRoutes: Routes = [{ path: '', component: LoginPage }];
