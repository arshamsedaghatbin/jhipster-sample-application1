jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SubCategoryService } from '../service/sub-category.service';
import { ISubCategory, SubCategory } from '../sub-category.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { SubCategoryUpdateComponent } from './sub-category-update.component';

describe('Component Tests', () => {
  describe('SubCategory Management Update Component', () => {
    let comp: SubCategoryUpdateComponent;
    let fixture: ComponentFixture<SubCategoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let subCategoryService: SubCategoryService;
    let actionService: ActionService;
    let categoryService: CategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SubCategoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SubCategoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SubCategoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      subCategoryService = TestBed.inject(SubCategoryService);
      actionService = TestBed.inject(ActionService);
      categoryService = TestBed.inject(CategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Action query and add missing value', () => {
        const subCategory: ISubCategory = { id: 456 };
        const actions: IAction[] = [{ id: 22612 }];
        subCategory.actions = actions;

        const actionCollection: IAction[] = [{ id: 23410 }];
        jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
        const additionalActions = [...actions];
        const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
        jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        expect(actionService.query).toHaveBeenCalled();
        expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(actionCollection, ...additionalActions);
        expect(comp.actionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Category query and add missing value', () => {
        const subCategory: ISubCategory = { id: 456 };
        const category: ICategory = { id: 66678 };
        subCategory.category = category;

        const categoryCollection: ICategory[] = [{ id: 1287 }];
        jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
        const additionalCategories = [category];
        const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
        jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        expect(categoryService.query).toHaveBeenCalled();
        expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
        expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const subCategory: ISubCategory = { id: 456 };
        const actions: IAction = { id: 30043 };
        subCategory.actions = [actions];
        const category: ICategory = { id: 25495 };
        subCategory.category = category;

        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(subCategory));
        expect(comp.actionsSharedCollection).toContain(actions);
        expect(comp.categoriesSharedCollection).toContain(category);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SubCategory>>();
        const subCategory = { id: 123 };
        jest.spyOn(subCategoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subCategory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(subCategoryService.update).toHaveBeenCalledWith(subCategory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SubCategory>>();
        const subCategory = new SubCategory();
        jest.spyOn(subCategoryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subCategory }));
        saveSubject.complete();

        // THEN
        expect(subCategoryService.create).toHaveBeenCalledWith(subCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SubCategory>>();
        const subCategory = { id: 123 };
        jest.spyOn(subCategoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ subCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(subCategoryService.update).toHaveBeenCalledWith(subCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackActionById', () => {
        it('Should return tracked Action primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackActionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCategoryById', () => {
        it('Should return tracked Category primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedAction', () => {
        it('Should return option if no Action is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedAction(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Action for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedAction(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Action is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedAction(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
