import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PracticeSessionComponent } from './list/practice-session.component';
import { PracticeSessionDetailComponent } from './detail/practice-session-detail.component';
import { PracticeSessionUpdateComponent } from './update/practice-session-update.component';
import { PracticeSessionDeleteDialogComponent } from './delete/practice-session-delete-dialog.component';
import { PracticeSessionRoutingModule } from './route/practice-session-routing.module';

@NgModule({
  imports: [SharedModule, PracticeSessionRoutingModule],
  declarations: [
    PracticeSessionComponent,
    PracticeSessionDetailComponent,
    PracticeSessionUpdateComponent,
    PracticeSessionDeleteDialogComponent,
  ],
  entryComponents: [PracticeSessionDeleteDialogComponent],
})
export class PracticeSessionModule {}
