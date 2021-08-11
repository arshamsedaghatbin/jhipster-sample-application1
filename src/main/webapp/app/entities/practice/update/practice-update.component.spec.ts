jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PracticeService } from '../service/practice.service';
import { IPractice, Practice } from '../practice.model';

import { PracticeUpdateComponent } from './practice-update.component';

describe('Component Tests', () => {
  describe('Practice Management Update Component', () => {
    let comp: PracticeUpdateComponent;
    let fixture: ComponentFixture<PracticeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let practiceService: PracticeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PracticeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PracticeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PracticeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      practiceService = TestBed.inject(PracticeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const practice: IPractice = { id: 456 };

        activatedRoute.data = of({ practice });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(practice));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Practice>>();
        const practice = { id: 123 };
        jest.spyOn(practiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: practice }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(practiceService.update).toHaveBeenCalledWith(practice);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Practice>>();
        const practice = new Practice();
        jest.spyOn(practiceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: practice }));
        saveSubject.complete();

        // THEN
        expect(practiceService.create).toHaveBeenCalledWith(practice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Practice>>();
        const practice = { id: 123 };
        jest.spyOn(practiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ practice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(practiceService.update).toHaveBeenCalledWith(practice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
