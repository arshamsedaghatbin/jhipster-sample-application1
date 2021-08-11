import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookMarkActionDetailComponent } from './book-mark-action-detail.component';

describe('Component Tests', () => {
  describe('BookMarkAction Management Detail Component', () => {
    let comp: BookMarkActionDetailComponent;
    let fixture: ComponentFixture<BookMarkActionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BookMarkActionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bookMarkAction: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BookMarkActionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookMarkActionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bookMarkAction on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bookMarkAction).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
