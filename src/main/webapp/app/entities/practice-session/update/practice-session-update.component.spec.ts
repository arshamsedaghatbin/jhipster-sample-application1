jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PracticeSessionService } from '../service/practice-session.service';
import { IPracticeSession, PracticeSession } from '../practice-session.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { IPractice } from 'app/entities/practice/practice.model';
import { PracticeService } from 'app/entities/practice/service/practice.service';

import { PracticeSessionUpdateComponent } from './practice-session-update.component';

describe('Component Tests', () => {
  describe('PracticeSession Management Update Component', () => {
    let comp: PracticeSessionUpdateComponent;
    let fixture: ComponentFixture<PracticeSessionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let practiceSessionService: PracticeSessionService;
    let actionService: ActionService;
    let practiceService: PracticeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PracticeSessionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PracticeSessionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PracticeSessionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      practiceSessionService = TestBed.inject(PracticeSessionService);
      actionService = TestBed.inject(ActionService);
      practiceService = TestBed.inject(PracticeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Action query and add missing value', () => {
        const practiceSession: IPracticeSession = { id: 456 };
        const actions: IAction[] = [{ id: 98431 }];
        practiceSession.actions = actions;

        const actionCollection: IAction[] = [{ id: 9873 }];
        jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
        const additionalActions = [...actions];
        const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
        jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        expect(actionService.query).toHaveBeenCalled();
        expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(actionCollection, ...additionalActions);
        expect(comp.actionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Practice query and add missing value', () => {
        const practiceSession: IPracticeSession = { id: 456 };
        const practice: IPractice = { id: 29431 };
        practiceSession.practice = practice;

        const practiceCollection: IPractice[] = [{ id: 54436 }];
        jest.spyOn(practiceService, 'query').mockReturnValue(of(new HttpResponse({ body: practiceCollection })));
        const additionalPractices = [practice];
        const expectedCollection: IPractice[] = [...additionalPractices, ...practiceCollection];
        jest.spyOn(practiceService, 'addPracticeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        expect(practiceService.query).toHaveBeenCalled();
        expect(practiceService.addPracticeToCollectionIfMissing).toHaveBeenCalledWith(practiceCollection, ...additionalPractices);
        expect(comp.practicesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const practiceSession: IPracticeSession = { id: 456 };
        const actions: IAction = { id: 97309 };
        practiceSession.actions = [actions];
        const practice: IPractice = { id: 54495 };
        practiceSession.practice = practice;

        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(practiceSession));
        expect(comp.actionsSharedCollection).toContain(actions);
        expect(comp.practicesSharedCollection).toContain(practice);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<PracticeSession>>();
        const practiceSession = { id: 123 };
        jest.spyOn(practiceSessionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: practiceSession }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(practiceSessionService.update).toHaveBeenCalledWith(practiceSession);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<PracticeSession>>();
        const practiceSession = new PracticeSession();
        jest.spyOn(practiceSessionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: practiceSession }));
        saveSubject.complete();

        // THEN
        expect(practiceSessionService.create).toHaveBeenCalledWith(practiceSession);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<PracticeSession>>();
        const practiceSession = { id: 123 };
        jest.spyOn(practiceSessionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practiceSession });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(practiceSessionService.update).toHaveBeenCalledWith(practiceSession);
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

      describe('trackPracticeById', () => {
        it('Should return tracked Practice primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPracticeById(0, entity);
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
