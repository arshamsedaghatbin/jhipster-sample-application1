import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPractice } from '../practice.model';
import { PracticeService } from '../service/practice.service';

@Component({
  templateUrl: './practice-delete-dialog.component.html',
})
export class PracticeDeleteDialogComponent {
  practice?: IPractice;

  constructor(protected practiceService: PracticeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.practiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
