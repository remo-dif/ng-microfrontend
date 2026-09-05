import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@ng-microfrontend/models';
import { Routes } from '@angular/router';

@Component({
  imports: [CurrencyPipe], template: `<h1>Products</h1><p>{{ count() }} products available</p><div class="grid">@for (product of products(); track product.id) {<article class="card"><h2>{{ product.name }}</h2><strong>{{ product.price | currency }}</strong><p>{{ product.stock }} in stock</p></article>}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ProductsPage {
  protected readonly products = signal<readonly Product[]>([{ id:'p1',name:'Enterprise keyboard',price:129,stock:42 },{ id:'p2',name:'Signal-powered monitor',price:499,stock:12 },{ id:'p3',name:'Federated headset',price:189,stock:7 }]);
  protected readonly count = computed(() => this.products().length);
}
export const remoteRoutes: Routes = [{ path: '', component: ProductsPage }];
