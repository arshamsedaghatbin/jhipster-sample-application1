import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PracticeSessionComponent } from '../list/practice-session.component';
import { PracticeSessionDetailComponent } from '../detail/practice-session-detail.component';
import { PracticeSessionUpdateComponent } from '../update/practice-session-update.component';
import { PracticeSessionRoutingResolveService } from './practice-session-routing-resolve.service';

const practiceSessionRoute: Routes = [
  {
    path: '',
    component: PracticeSessionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PracticeSessionDetailComponent,
    resolve: {
      practiceSession: PracticeSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PracticeSessionUpdateComponent,
    resolve: {
      practiceSession: PracticeSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PracticeSessionUpdateComponent,
    resolve: {
      practiceSession: PracticeSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(practiceSessionRoute)],
  exports: [RouterModule],
})
export class PracticeSessionRoutingModule {}
