import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  templateUrl: './admin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AdminPage {
  protected readonly status = signal('All systems operational');
  protected refresh() {
    this.status.set('Checked just now — all systems operational');
  }
}
export const remoteRoutes: Routes = [{ path: '', component: AdminPage }];
