import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Order } from '@ng-microfrontend/models';
import { Routes } from '@angular/router';
import { delay, of } from 'rxjs';

@Component({ imports:[AsyncPipe,CurrencyPipe], template:`<h1>Orders</h1><div class="grid">@for (order of orders$ | async; track order.id) {<article class="card"><h2>{{ order.id }}</h2><p>{{ order.status }}</p><strong>{{ order.total | currency }}</strong></article>}</div>`, changeDetection:ChangeDetectionStrategy.OnPush })
class OrdersPage { protected readonly orders$ = of<readonly Order[]>([{id:'ORD-1042',status:'shipped',total:318},{id:'ORD-1043',status:'paid',total:499}]).pipe(delay(100)); }
export const remoteRoutes: Routes = [{ path:'', component:OrdersPage }];
