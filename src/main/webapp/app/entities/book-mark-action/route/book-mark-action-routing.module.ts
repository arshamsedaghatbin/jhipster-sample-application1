import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookMarkActionComponent } from '../list/book-mark-action.component';
import { BookMarkActionDetailComponent } from '../detail/book-mark-action-detail.component';
import { BookMarkActionUpdateComponent } from '../update/book-mark-action-update.component';
import { BookMarkActionRoutingResolveService } from './book-mark-action-routing-resolve.service';

const bookMarkActionRoute: Routes = [
  {
    path: '',
    component: BookMarkActionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookMarkActionDetailComponent,
    resolve: {
      bookMarkAction: BookMarkActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookMarkActionUpdateComponent,
    resolve: {
      bookMarkAction: BookMarkActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookMarkActionUpdateComponent,
    resolve: {
      bookMarkAction: BookMarkActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookMarkActionRoute)],
  exports: [RouterModule],
})
export class BookMarkActionRoutingModule {}
