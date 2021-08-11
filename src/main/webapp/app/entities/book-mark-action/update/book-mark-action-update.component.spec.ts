jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BookMarkActionService } from '../service/book-mark-action.service';
import { IBookMarkAction, BookMarkAction } from '../book-mark-action.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';

import { BookMarkActionUpdateComponent } from './book-mark-action-update.component';

describe('Component Tests', () => {
  describe('BookMarkAction Management Update Component', () => {
    let comp: BookMarkActionUpdateComponent;
    let fixture: ComponentFixture<BookMarkActionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bookMarkActionService: BookMarkActionService;
    let actionService: ActionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BookMarkActionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BookMarkActionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookMarkActionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bookMarkActionService = TestBed.inject(BookMarkActionService);
      actionService = TestBed.inject(ActionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Action query and add missing value', () => {
        const bookMarkAction: IBookMarkAction = { id: 456 };
        const action: IAction = { id: 97649 };
        bookMarkAction.action = action;

        const actionCollection: IAction[] = [{ id: 45065 }];
        jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
        const additionalActions = [action];
        const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
        jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ bookMarkAction });
        comp.ngOnInit();

        expect(actionService.query).toHaveBeenCalled();
        expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(actionCollection, ...additionalActions);
        expect(comp.actionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const bookMarkAction: IBookMarkAction = { id: 456 };
        const action: IAction = { id: 89396 };
        bookMarkAction.action = action;

        activatedRoute.data = of({ bookMarkAction });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bookMarkAction));
        expect(comp.actionsSharedCollection).toContain(action);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BookMarkAction>>();
        const bookMarkAction = { id: 123 };
        jest.spyOn(bookMarkActionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookMarkAction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bookMarkAction }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bookMarkActionService.update).toHaveBeenCalledWith(bookMarkAction);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BookMarkAction>>();
        const bookMarkAction = new BookMarkAction();
        jest.spyOn(bookMarkActionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookMarkAction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bookMarkAction }));
        saveSubject.complete();

        // THEN
        expect(bookMarkActionService.create).toHaveBeenCalledWith(bookMarkAction);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BookMarkAction>>();
        const bookMarkAction = { id: 123 };
        jest.spyOn(bookMarkActionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookMarkAction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bookMarkActionService.update).toHaveBeenCalledWith(bookMarkAction);
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
  });
});
