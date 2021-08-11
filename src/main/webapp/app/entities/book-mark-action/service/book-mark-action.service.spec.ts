import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBookMarkAction, BookMarkAction } from '../book-mark-action.model';

import { BookMarkActionService } from './book-mark-action.service';

describe('Service Tests', () => {
  describe('BookMarkAction Service', () => {
    let service: BookMarkActionService;
    let httpMock: HttpTestingController;
    let elemDefault: IBookMarkAction;
    let expectedResult: IBookMarkAction | IBookMarkAction[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BookMarkActionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        userDescription: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BookMarkAction', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BookMarkAction()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BookMarkAction', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            userDescription: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BookMarkAction', () => {
        const patchObject = Object.assign({}, new BookMarkAction());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BookMarkAction', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            userDescription: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BookMarkAction', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBookMarkActionToCollectionIfMissing', () => {
        it('should add a BookMarkAction to an empty array', () => {
          const bookMarkAction: IBookMarkAction = { id: 123 };
          expectedResult = service.addBookMarkActionToCollectionIfMissing([], bookMarkAction);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bookMarkAction);
        });

        it('should not add a BookMarkAction to an array that contains it', () => {
          const bookMarkAction: IBookMarkAction = { id: 123 };
          const bookMarkActionCollection: IBookMarkAction[] = [
            {
              ...bookMarkAction,
            },
            { id: 456 },
          ];
          expectedResult = service.addBookMarkActionToCollectionIfMissing(bookMarkActionCollection, bookMarkAction);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BookMarkAction to an array that doesn't contain it", () => {
          const bookMarkAction: IBookMarkAction = { id: 123 };
          const bookMarkActionCollection: IBookMarkAction[] = [{ id: 456 }];
          expectedResult = service.addBookMarkActionToCollectionIfMissing(bookMarkActionCollection, bookMarkAction);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bookMarkAction);
        });

        it('should add only unique BookMarkAction to an array', () => {
          const bookMarkActionArray: IBookMarkAction[] = [{ id: 123 }, { id: 456 }, { id: 3153 }];
          const bookMarkActionCollection: IBookMarkAction[] = [{ id: 123 }];
          expectedResult = service.addBookMarkActionToCollectionIfMissing(bookMarkActionCollection, ...bookMarkActionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bookMarkAction: IBookMarkAction = { id: 123 };
          const bookMarkAction2: IBookMarkAction = { id: 456 };
          expectedResult = service.addBookMarkActionToCollectionIfMissing([], bookMarkAction, bookMarkAction2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bookMarkAction);
          expect(expectedResult).toContain(bookMarkAction2);
        });

        it('should accept null and undefined values', () => {
          const bookMarkAction: IBookMarkAction = { id: 123 };
          expectedResult = service.addBookMarkActionToCollectionIfMissing([], null, bookMarkAction, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bookMarkAction);
        });

        it('should return initial array if no BookMarkAction is added', () => {
          const bookMarkActionCollection: IBookMarkAction[] = [{ id: 123 }];
          expectedResult = service.addBookMarkActionToCollectionIfMissing(bookMarkActionCollection, undefined, null);
          expect(expectedResult).toEqual(bookMarkActionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
