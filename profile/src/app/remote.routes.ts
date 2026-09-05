import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@ng-microfrontend/auth-data-access';
import { Routes } from '@angular/router';

@Component({ template:`<h1>Profile</h1><section class="card"><h2>{{ auth.user()?.displayName }}</h2><p>{{ auth.user()?.email }}</p><p>Roles: {{ auth.user()?.roles?.join(', ') }}</p></section>`, changeDetection:ChangeDetectionStrategy.OnPush })
class ProfilePage { protected readonly auth = inject(AuthStore); }
export const remoteRoutes: Routes = [{ path:'', component:ProfilePage }];
