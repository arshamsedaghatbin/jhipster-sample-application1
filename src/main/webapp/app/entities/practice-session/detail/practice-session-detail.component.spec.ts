import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PracticeSessionDetailComponent } from './practice-session-detail.component';

describe('Component Tests', () => {
  describe('PracticeSession Management Detail Component', () => {
    let comp: PracticeSessionDetailComponent;
    let fixture: ComponentFixture<PracticeSessionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PracticeSessionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ practiceSession: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PracticeSessionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PracticeSessionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load practiceSession on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.practiceSession).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
