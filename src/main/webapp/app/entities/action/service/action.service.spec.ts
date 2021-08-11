import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountType } from 'app/entities/enumerations/account-type.model';
import { IAction, Action } from '../action.model';

import { ActionService } from './action.service';

describe('Service Tests', () => {
  describe('Action Service', () => {
    let service: ActionService;
    let httpMock: HttpTestingController;
    let elemDefault: IAction;
    let expectedResult: IAction | IAction[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ActionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        photoUrl: 'AAAAAAA',
        photoContentType: 'image/png',
        photo: 'AAAAAAA',
        code: 'AAAAAAA',
        videoContentType: 'image/png',
        video: 'AAAAAAA',
        videoUrl: 'AAAAAAA',
        masterDescription: 'AAAAAAA',
        accountType: AccountType.FREE,
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

      it('should create a Action', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Action()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Action', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            photo: 'BBBBBB',
            code: 'BBBBBB',
            video: 'BBBBBB',
            videoUrl: 'BBBBBB',
            masterDescription: 'BBBBBB',
            accountType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Action', () => {
        const patchObject = Object.assign(
          {
            code: 'BBBBBB',
            video: 'BBBBBB',
            masterDescription: 'BBBBBB',
          },
          new Action()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Action', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            photo: 'BBBBBB',
            code: 'BBBBBB',
            video: 'BBBBBB',
            videoUrl: 'BBBBBB',
            masterDescription: 'BBBBBB',
            accountType: 'BBBBBB',
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

      it('should delete a Action', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addActionToCollectionIfMissing', () => {
        it('should add a Action to an empty array', () => {
          const action: IAction = { id: 123 };
          expectedResult = service.addActionToCollectionIfMissing([], action);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(action);
        });

        it('should not add a Action to an array that contains it', () => {
          const action: IAction = { id: 123 };
          const actionCollection: IAction[] = [
            {
              ...action,
            },
            { id: 456 },
          ];
          expectedResult = service.addActionToCollectionIfMissing(actionCollection, action);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Action to an array that doesn't contain it", () => {
          const action: IAction = { id: 123 };
          const actionCollection: IAction[] = [{ id: 456 }];
          expectedResult = service.addActionToCollectionIfMissing(actionCollection, action);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(action);
        });

        it('should add only unique Action to an array', () => {
          const actionArray: IAction[] = [{ id: 123 }, { id: 456 }, { id: 5045 }];
          const actionCollection: IAction[] = [{ id: 123 }];
          expectedResult = service.addActionToCollectionIfMissing(actionCollection, ...actionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const action: IAction = { id: 123 };
          const action2: IAction = { id: 456 };
          expectedResult = service.addActionToCollectionIfMissing([], action, action2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(action);
          expect(expectedResult).toContain(action2);
        });

        it('should accept null and undefined values', () => {
          const action: IAction = { id: 123 };
          expectedResult = service.addActionToCollectionIfMissing([], null, action, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(action);
        });

        it('should return initial array if no Action is added', () => {
          const actionCollection: IAction[] = [{ id: 123 }];
          expectedResult = service.addActionToCollectionIfMissing(actionCollection, undefined, null);
          expect(expectedResult).toEqual(actionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
