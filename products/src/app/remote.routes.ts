import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiClient } from '@ng-microfrontend/api-client';
import { Product } from '@ng-microfrontend/models';
import { Routes } from '@angular/router';
import { catchError, of } from 'rxjs';

const demoProducts: readonly Product[] = [
  { id: 'p1', name: 'Enterprise keyboard', price: 129, stock: 42 },
  { id: 'p2', name: 'Signal-powered monitor', price: 499, stock: 12 },
  { id: 'p3', name: 'Federated headset', price: 189, stock: 7 },
];

@Component({
  imports: [CurrencyPipe],
  templateUrl: './products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ProductsPage {
  private readonly apiClient = inject(ApiClient);
  protected readonly products = toSignal(
    this.apiClient
      .get<readonly Product[]>('/products')
      .pipe(catchError(() => of(demoProducts))),
    { initialValue: demoProducts }
  );
  protected readonly count = computed(() => this.products().length);
}
export const remoteRoutes: Routes = [{ path: '', component: ProductsPage }];
