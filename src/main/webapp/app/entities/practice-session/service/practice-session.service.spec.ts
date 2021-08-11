import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPracticeSession, PracticeSession } from '../practice-session.model';

import { PracticeSessionService } from './practice-session.service';

describe('Service Tests', () => {
  describe('PracticeSession Service', () => {
    let service: PracticeSessionService;
    let httpMock: HttpTestingController;
    let elemDefault: IPracticeSession;
    let expectedResult: IPracticeSession | IPracticeSession[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PracticeSessionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        tiltle: 'AAAAAAA',
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

      it('should create a PracticeSession', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new PracticeSession()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PracticeSession', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            tiltle: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PracticeSession', () => {
        const patchObject = Object.assign(
          {
            tiltle: 'BBBBBB',
          },
          new PracticeSession()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PracticeSession', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            tiltle: 'BBBBBB',
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

      it('should delete a PracticeSession', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPracticeSessionToCollectionIfMissing', () => {
        it('should add a PracticeSession to an empty array', () => {
          const practiceSession: IPracticeSession = { id: 123 };
          expectedResult = service.addPracticeSessionToCollectionIfMissing([], practiceSession);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(practiceSession);
        });

        it('should not add a PracticeSession to an array that contains it', () => {
          const practiceSession: IPracticeSession = { id: 123 };
          const practiceSessionCollection: IPracticeSession[] = [
            {
              ...practiceSession,
            },
            { id: 456 },
          ];
          expectedResult = service.addPracticeSessionToCollectionIfMissing(practiceSessionCollection, practiceSession);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PracticeSession to an array that doesn't contain it", () => {
          const practiceSession: IPracticeSession = { id: 123 };
          const practiceSessionCollection: IPracticeSession[] = [{ id: 456 }];
          expectedResult = service.addPracticeSessionToCollectionIfMissing(practiceSessionCollection, practiceSession);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(practiceSession);
        });

        it('should add only unique PracticeSession to an array', () => {
          const practiceSessionArray: IPracticeSession[] = [{ id: 123 }, { id: 456 }, { id: 74345 }];
          const practiceSessionCollection: IPracticeSession[] = [{ id: 123 }];
          expectedResult = service.addPracticeSessionToCollectionIfMissing(practiceSessionCollection, ...practiceSessionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const practiceSession: IPracticeSession = { id: 123 };
          const practiceSession2: IPracticeSession = { id: 456 };
          expectedResult = service.addPracticeSessionToCollectionIfMissing([], practiceSession, practiceSession2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(practiceSession);
          expect(expectedResult).toContain(practiceSession2);
        });

        it('should accept null and undefined values', () => {
          const practiceSession: IPracticeSession = { id: 123 };
          expectedResult = service.addPracticeSessionToCollectionIfMissing([], null, practiceSession, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(practiceSession);
        });

        it('should return initial array if no PracticeSession is added', () => {
          const practiceSessionCollection: IPracticeSession[] = [{ id: 123 }];
          expectedResult = service.addPracticeSessionToCollectionIfMissing(practiceSessionCollection, undefined, null);
          expect(expectedResult).toEqual(practiceSessionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
