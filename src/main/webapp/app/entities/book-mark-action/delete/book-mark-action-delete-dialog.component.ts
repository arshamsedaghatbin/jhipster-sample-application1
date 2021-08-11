import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookMarkAction } from '../book-mark-action.model';
import { BookMarkActionService } from '../service/book-mark-action.service';

@Component({
  templateUrl: './book-mark-action-delete-dialog.component.html',
})
export class BookMarkActionDeleteDialogComponent {
  bookMarkAction?: IBookMarkAction;

  constructor(protected bookMarkActionService: BookMarkActionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookMarkActionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
