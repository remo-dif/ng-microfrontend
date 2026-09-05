import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Routes } from '@angular/router';

@Component({ template:`<h1>Administration</h1><section class="card"><h2>Platform health</h2><p>{{ status() }}</p><button (click)="refresh()">Refresh</button></section>`, changeDetection:ChangeDetectionStrategy.OnPush })
class AdminPage { protected readonly status = signal('All systems operational'); protected refresh(){ this.status.set('Checked just now — all systems operational'); } }
export const remoteRoutes: Routes = [{ path:'', component:AdminPage }];
