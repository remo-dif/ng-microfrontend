import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@ng-microfrontend/auth-data-access';
import { PlatformHeader } from '@ng-microfrontend/ui';

@Component({
  imports: [PlatformHeader, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected signOut(): void {
    this.auth.clearSession();
    void this.router.navigateByUrl('/login');
  }
}
