import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, map, filter } from 'rxjs/operators';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Detail for: ${p.productName}` : null)
    );

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }));


//Filter 
//Emit values that pass the provided condition.
// If you would like to complete an observable when a condition fails, check out takeWhile!

//combineLatest
//This operator is best used when you have multiple,
// long-lived observables that rely on each other for some calculation or determination.

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) =>
        ({ product, productSuppliers, pageTitle }))
    );

  constructor(private productService: ProductService) { }

}
