import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@ng-microfrontend/auth-data-access';
import { Routes } from '@angular/router';

@Component({
  templateUrl: './profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ProfilePage {
  protected readonly auth = inject(AuthStore);
}
export const remoteRoutes: Routes = [{ path: '', component: ProfilePage }];
