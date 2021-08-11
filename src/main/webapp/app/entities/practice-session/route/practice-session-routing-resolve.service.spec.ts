jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPracticeSession, PracticeSession } from '../practice-session.model';
import { PracticeSessionService } from '../service/practice-session.service';

import { PracticeSessionRoutingResolveService } from './practice-session-routing-resolve.service';

describe('Service Tests', () => {
  describe('PracticeSession routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PracticeSessionRoutingResolveService;
    let service: PracticeSessionService;
    let resultPracticeSession: IPracticeSession | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PracticeSessionRoutingResolveService);
      service = TestBed.inject(PracticeSessionService);
      resultPracticeSession = undefined;
    });

    describe('resolve', () => {
      it('should return IPracticeSession returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPracticeSession = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPracticeSession).toEqual({ id: 123 });
      });

      it('should return new IPracticeSession if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPracticeSession = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPracticeSession).toEqual(new PracticeSession());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PracticeSession })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPracticeSession = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPracticeSession).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
