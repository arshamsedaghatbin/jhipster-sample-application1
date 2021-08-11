import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PracticeComponent } from '../list/practice.component';
import { PracticeDetailComponent } from '../detail/practice-detail.component';
import { PracticeUpdateComponent } from '../update/practice-update.component';
import { PracticeRoutingResolveService } from './practice-routing-resolve.service';

const practiceRoute: Routes = [
  {
    path: '',
    component: PracticeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PracticeDetailComponent,
    resolve: {
      practice: PracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PracticeUpdateComponent,
    resolve: {
      practice: PracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PracticeUpdateComponent,
    resolve: {
      practice: PracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(practiceRoute)],
  exports: [RouterModule],
})
export class PracticeRoutingModule {}
