import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'category',
        data: { pageTitle: 'jhipsterSampleApplication1App.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'sub-category',
        data: { pageTitle: 'jhipsterSampleApplication1App.subCategory.home.title' },
        loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule),
      },
      {
        path: 'action',
        data: { pageTitle: 'jhipsterSampleApplication1App.action.home.title' },
        loadChildren: () => import('./action/action.module').then(m => m.ActionModule),
      },
      {
        path: 'book-mark-action',
        data: { pageTitle: 'jhipsterSampleApplication1App.bookMarkAction.home.title' },
        loadChildren: () => import('./book-mark-action/book-mark-action.module').then(m => m.BookMarkActionModule),
      },
      {
        path: 'practice',
        data: { pageTitle: 'jhipsterSampleApplication1App.practice.home.title' },
        loadChildren: () => import('./practice/practice.module').then(m => m.PracticeModule),
      },
      {
        path: 'practice-session',
        data: { pageTitle: 'jhipsterSampleApplication1App.practiceSession.home.title' },
        loadChildren: () => import('./practice-session/practice-session.module').then(m => m.PracticeSessionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
