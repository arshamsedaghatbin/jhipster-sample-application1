import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountType } from 'app/entities/enumerations/account-type.model';
import { IPractice, Practice } from '../practice.model';

import { PracticeService } from './practice.service';

describe('Service Tests', () => {
  describe('Practice Service', () => {
    let service: PracticeService;
    let httpMock: HttpTestingController;
    let elemDefault: IPractice;
    let expectedResult: IPractice | IPractice[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PracticeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        photoUrl: 'AAAAAAA',
        photoContentType: 'image/png',
        photo: 'AAAAAAA',
        voiceUrl: 'AAAAAAA',
        voiceFileContentType: 'image/png',
        voiceFile: 'AAAAAAA',
        masterDescription: 'AAAAAAA',
        masterAdvice: 'AAAAAAA',
        briefMasterAdvice: 'AAAAAAA',
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

      it('should create a Practice', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Practice()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Practice', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            photo: 'BBBBBB',
            voiceUrl: 'BBBBBB',
            voiceFile: 'BBBBBB',
            masterDescription: 'BBBBBB',
            masterAdvice: 'BBBBBB',
            briefMasterAdvice: 'BBBBBB',
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

      it('should partial update a Practice', () => {
        const patchObject = Object.assign(
          {
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            masterDescription: 'BBBBBB',
            briefMasterAdvice: 'BBBBBB',
          },
          new Practice()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Practice', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            photo: 'BBBBBB',
            voiceUrl: 'BBBBBB',
            voiceFile: 'BBBBBB',
            masterDescription: 'BBBBBB',
            masterAdvice: 'BBBBBB',
            briefMasterAdvice: 'BBBBBB',
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

      it('should delete a Practice', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPracticeToCollectionIfMissing', () => {
        it('should add a Practice to an empty array', () => {
          const practice: IPractice = { id: 123 };
          expectedResult = service.addPracticeToCollectionIfMissing([], practice);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(practice);
        });

        it('should not add a Practice to an array that contains it', () => {
          const practice: IPractice = { id: 123 };
          const practiceCollection: IPractice[] = [
            {
              ...practice,
            },
            { id: 456 },
          ];
          expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, practice);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Practice to an array that doesn't contain it", () => {
          const practice: IPractice = { id: 123 };
          const practiceCollection: IPractice[] = [{ id: 456 }];
          expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, practice);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(practice);
        });

        it('should add only unique Practice to an array', () => {
          const practiceArray: IPractice[] = [{ id: 123 }, { id: 456 }, { id: 69586 }];
          const practiceCollection: IPractice[] = [{ id: 123 }];
          expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, ...practiceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const practice: IPractice = { id: 123 };
          const practice2: IPractice = { id: 456 };
          expectedResult = service.addPracticeToCollectionIfMissing([], practice, practice2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(practice);
          expect(expectedResult).toContain(practice2);
        });

        it('should accept null and undefined values', () => {
          const practice: IPractice = { id: 123 };
          expectedResult = service.addPracticeToCollectionIfMissing([], null, practice, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(practice);
        });

        it('should return initial array if no Practice is added', () => {
          const practiceCollection: IPractice[] = [{ id: 123 }];
          expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, undefined, null);
          expect(expectedResult).toEqual(practiceCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
