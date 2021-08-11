import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountType } from 'app/entities/enumerations/account-type.model';
import { ISubCategory, SubCategory } from '../sub-category.model';

import { SubCategoryService } from './sub-category.service';

describe('Service Tests', () => {
  describe('SubCategory Service', () => {
    let service: SubCategoryService;
    let httpMock: HttpTestingController;
    let elemDefault: ISubCategory;
    let expectedResult: ISubCategory | ISubCategory[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SubCategoryService);
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

      it('should create a SubCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SubCategory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SubCategory', () => {
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

      it('should partial update a SubCategory', () => {
        const patchObject = Object.assign(
          {
            title: 'BBBBBB',
            photoUrl: 'BBBBBB',
            voiceUrl: 'BBBBBB',
            voiceFile: 'BBBBBB',
            masterDescription: 'BBBBBB',
            masterAdvice: 'BBBBBB',
          },
          new SubCategory()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SubCategory', () => {
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

      it('should delete a SubCategory', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSubCategoryToCollectionIfMissing', () => {
        it('should add a SubCategory to an empty array', () => {
          const subCategory: ISubCategory = { id: 123 };
          expectedResult = service.addSubCategoryToCollectionIfMissing([], subCategory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(subCategory);
        });

        it('should not add a SubCategory to an array that contains it', () => {
          const subCategory: ISubCategory = { id: 123 };
          const subCategoryCollection: ISubCategory[] = [
            {
              ...subCategory,
            },
            { id: 456 },
          ];
          expectedResult = service.addSubCategoryToCollectionIfMissing(subCategoryCollection, subCategory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SubCategory to an array that doesn't contain it", () => {
          const subCategory: ISubCategory = { id: 123 };
          const subCategoryCollection: ISubCategory[] = [{ id: 456 }];
          expectedResult = service.addSubCategoryToCollectionIfMissing(subCategoryCollection, subCategory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(subCategory);
        });

        it('should add only unique SubCategory to an array', () => {
          const subCategoryArray: ISubCategory[] = [{ id: 123 }, { id: 456 }, { id: 75552 }];
          const subCategoryCollection: ISubCategory[] = [{ id: 123 }];
          expectedResult = service.addSubCategoryToCollectionIfMissing(subCategoryCollection, ...subCategoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const subCategory: ISubCategory = { id: 123 };
          const subCategory2: ISubCategory = { id: 456 };
          expectedResult = service.addSubCategoryToCollectionIfMissing([], subCategory, subCategory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(subCategory);
          expect(expectedResult).toContain(subCategory2);
        });

        it('should accept null and undefined values', () => {
          const subCategory: ISubCategory = { id: 123 };
          expectedResult = service.addSubCategoryToCollectionIfMissing([], null, subCategory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(subCategory);
        });

        it('should return initial array if no SubCategory is added', () => {
          const subCategoryCollection: ISubCategory[] = [{ id: 123 }];
          expectedResult = service.addSubCategoryToCollectionIfMissing(subCategoryCollection, undefined, null);
          expect(expectedResult).toEqual(subCategoryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
