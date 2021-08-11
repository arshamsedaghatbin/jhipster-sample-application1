import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPracticeSession } from '../practice-session.model';
import { PracticeSessionService } from '../service/practice-session.service';

@Component({
  templateUrl: './practice-session-delete-dialog.component.html',
})
export class PracticeSessionDeleteDialogComponent {
  practiceSession?: IPracticeSession;

  constructor(protected practiceSessionService: PracticeSessionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.practiceSessionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
