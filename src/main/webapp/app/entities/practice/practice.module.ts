import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PracticeComponent } from './list/practice.component';
import { PracticeDetailComponent } from './detail/practice-detail.component';
import { PracticeUpdateComponent } from './update/practice-update.component';
import { PracticeDeleteDialogComponent } from './delete/practice-delete-dialog.component';
import { PracticeRoutingModule } from './route/practice-routing.module';

@NgModule({
  imports: [SharedModule, PracticeRoutingModule],
  declarations: [PracticeComponent, PracticeDetailComponent, PracticeUpdateComponent, PracticeDeleteDialogComponent],
  entryComponents: [PracticeDeleteDialogComponent],
})
export class PracticeModule {}
