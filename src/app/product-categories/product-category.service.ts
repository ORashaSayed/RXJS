import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';

import { ProductCategory } from './product-category';
import { tap, catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private productCategoriesUrl = 'api/productCategories';

//Multicasting
// In RxJS observables are cold, or unicast by default. 
// These operators can make an observable hot, or multicast, allowing side-effects to be shared among multiple subscribers.

// Why use shareReplay?
// You generally want to use shareReplay when you have side-effects or
// taxing computations that you do not wish to be executed amongst multiple subscribers. 
//It may also be valuable in situations where you know you will have late subscribers to a stream that need access 
//to previously emitted values. This ability to replay values on subscription is what differentiates share and shareReplay.
  productCategories$ = this.http.get<ProductCategory[]>(this.productCategoriesUrl)
    .pipe(
      tap(data => console.log('categories', JSON.stringify(data))),
      shareReplay(1),
      catchError(this.handleError)
    );

  constructor(private http: HttpClient) { }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
