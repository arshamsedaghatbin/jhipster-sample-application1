jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CategoryService } from '../service/category.service';
import { ICategory, Category } from '../category.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';

import { CategoryUpdateComponent } from './category-update.component';

describe('Component Tests', () => {
  describe('Category Management Update Component', () => {
    let comp: CategoryUpdateComponent;
    let fixture: ComponentFixture<CategoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let categoryService: CategoryService;
    let actionService: ActionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CategoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CategoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      categoryService = TestBed.inject(CategoryService);
      actionService = TestBed.inject(ActionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Action query and add missing value', () => {
        const category: ICategory = { id: 456 };
        const actions: IAction[] = [{ id: 74437 }];
        category.actions = actions;

        const actionCollection: IAction[] = [{ id: 54798 }];
        jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
        const additionalActions = [...actions];
        const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
        jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ category });
        comp.ngOnInit();

        expect(actionService.query).toHaveBeenCalled();
        expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(actionCollection, ...additionalActions);
        expect(comp.actionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const category: ICategory = { id: 456 };
        const actions: IAction = { id: 6744 };
        category.actions = [actions];

        activatedRoute.data = of({ category });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(category));
        expect(comp.actionsSharedCollection).toContain(actions);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Category>>();
        const category = { id: 123 };
        jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ category });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: category }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(categoryService.update).toHaveBeenCalledWith(category);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Category>>();
        const category = new Category();
        jest.spyOn(categoryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ category });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: category }));
        saveSubject.complete();

        // THEN
        expect(categoryService.create).toHaveBeenCalledWith(category);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Category>>();
        const category = { id: 123 };
        jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ category });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(categoryService.update).toHaveBeenCalledWith(category);
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
