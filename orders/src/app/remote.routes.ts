import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Order } from '@ng-microfrontend/models';
import { Routes } from '@angular/router';
import { delay, of } from 'rxjs';

@Component({
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './orders-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OrdersPage {
  protected readonly orders$ = of<readonly Order[]>([
    { id: 'ORD-1042', status: 'shipped', total: 318 },
    { id: 'ORD-1043', status: 'paid', total: 499 },
  ]).pipe(delay(100));
}
export const remoteRoutes: Routes = [{ path: '', component: OrdersPage }];
