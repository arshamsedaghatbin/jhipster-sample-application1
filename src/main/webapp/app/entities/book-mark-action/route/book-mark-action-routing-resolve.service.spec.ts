jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBookMarkAction, BookMarkAction } from '../book-mark-action.model';
import { BookMarkActionService } from '../service/book-mark-action.service';

import { BookMarkActionRoutingResolveService } from './book-mark-action-routing-resolve.service';

describe('Service Tests', () => {
  describe('BookMarkAction routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BookMarkActionRoutingResolveService;
    let service: BookMarkActionService;
    let resultBookMarkAction: IBookMarkAction | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BookMarkActionRoutingResolveService);
      service = TestBed.inject(BookMarkActionService);
      resultBookMarkAction = undefined;
    });

    describe('resolve', () => {
      it('should return IBookMarkAction returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookMarkAction = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBookMarkAction).toEqual({ id: 123 });
      });

      it('should return new IBookMarkAction if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookMarkAction = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBookMarkAction).toEqual(new BookMarkAction());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BookMarkAction })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookMarkAction = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBookMarkAction).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
