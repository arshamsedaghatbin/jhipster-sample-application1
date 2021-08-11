import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPracticeSession, PracticeSession } from '../practice-session.model';
import { PracticeSessionService } from '../service/practice-session.service';

@Injectable({ providedIn: 'root' })
export class PracticeSessionRoutingResolveService implements Resolve<IPracticeSession> {
  constructor(protected service: PracticeSessionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPracticeSession> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((practiceSession: HttpResponse<PracticeSession>) => {
          if (practiceSession.body) {
            return of(practiceSession.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PracticeSession());
  }
}
