jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPractice, Practice } from '../practice.model';
import { PracticeService } from '../service/practice.service';

import { PracticeRoutingResolveService } from './practice-routing-resolve.service';

describe('Service Tests', () => {
  describe('Practice routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PracticeRoutingResolveService;
    let service: PracticeService;
    let resultPractice: IPractice | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PracticeRoutingResolveService);
      service = TestBed.inject(PracticeService);
      resultPractice = undefined;
    });

    describe('resolve', () => {
      it('should return IPractice returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPractice = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPractice).toEqual({ id: 123 });
      });

      it('should return new IPractice if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPractice = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPractice).toEqual(new Practice());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Practice })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPractice = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPractice).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
