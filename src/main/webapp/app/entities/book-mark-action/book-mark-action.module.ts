import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookMarkActionComponent } from './list/book-mark-action.component';
import { BookMarkActionDetailComponent } from './detail/book-mark-action-detail.component';
import { BookMarkActionUpdateComponent } from './update/book-mark-action-update.component';
import { BookMarkActionDeleteDialogComponent } from './delete/book-mark-action-delete-dialog.component';
import { BookMarkActionRoutingModule } from './route/book-mark-action-routing.module';

@NgModule({
  imports: [SharedModule, BookMarkActionRoutingModule],
  declarations: [
    BookMarkActionComponent,
    BookMarkActionDetailComponent,
    BookMarkActionUpdateComponent,
    BookMarkActionDeleteDialogComponent,
  ],
  entryComponents: [BookMarkActionDeleteDialogComponent],
})
export class BookMarkActionModule {}
