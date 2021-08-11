import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookMarkAction, BookMarkAction } from '../book-mark-action.model';
import { BookMarkActionService } from '../service/book-mark-action.service';

@Injectable({ providedIn: 'root' })
export class BookMarkActionRoutingResolveService implements Resolve<IBookMarkAction> {
  constructor(protected service: BookMarkActionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookMarkAction> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookMarkAction: HttpResponse<BookMarkAction>) => {
          if (bookMarkAction.body) {
            return of(bookMarkAction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BookMarkAction());
  }
}
