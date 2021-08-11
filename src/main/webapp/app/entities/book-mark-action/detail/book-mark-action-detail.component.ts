import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookMarkAction } from '../book-mark-action.model';

@Component({
  selector: 'jhi-book-mark-action-detail',
  templateUrl: './book-mark-action-detail.component.html',
})
export class BookMarkActionDetailComponent implements OnInit {
  bookMarkAction: IBookMarkAction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookMarkAction }) => {
      this.bookMarkAction = bookMarkAction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
