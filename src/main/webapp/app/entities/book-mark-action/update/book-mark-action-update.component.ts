import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBookMarkAction, BookMarkAction } from '../book-mark-action.model';
import { BookMarkActionService } from '../service/book-mark-action.service';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';

@Component({
  selector: 'jhi-book-mark-action-update',
  templateUrl: './book-mark-action-update.component.html',
})
export class BookMarkActionUpdateComponent implements OnInit {
  isSaving = false;

  actionsSharedCollection: IAction[] = [];

  editForm = this.fb.group({
    id: [],
    userDescription: [],
    action: [],
  });

  constructor(
    protected bookMarkActionService: BookMarkActionService,
    protected actionService: ActionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookMarkAction }) => {
      this.updateForm(bookMarkAction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookMarkAction = this.createFromForm();
    if (bookMarkAction.id !== undefined) {
      this.subscribeToSaveResponse(this.bookMarkActionService.update(bookMarkAction));
    } else {
      this.subscribeToSaveResponse(this.bookMarkActionService.create(bookMarkAction));
    }
  }

  trackActionById(index: number, item: IAction): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookMarkAction>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookMarkAction: IBookMarkAction): void {
    this.editForm.patchValue({
      id: bookMarkAction.id,
      userDescription: bookMarkAction.userDescription,
      action: bookMarkAction.action,
    });

    this.actionsSharedCollection = this.actionService.addActionToCollectionIfMissing(this.actionsSharedCollection, bookMarkAction.action);
  }

  protected loadRelationshipsOptions(): void {
    this.actionService
      .query()
      .pipe(map((res: HttpResponse<IAction[]>) => res.body ?? []))
      .pipe(map((actions: IAction[]) => this.actionService.addActionToCollectionIfMissing(actions, this.editForm.get('action')!.value)))
      .subscribe((actions: IAction[]) => (this.actionsSharedCollection = actions));
  }

  protected createFromForm(): IBookMarkAction {
    return {
      ...new BookMarkAction(),
      id: this.editForm.get(['id'])!.value,
      userDescription: this.editForm.get(['userDescription'])!.value,
      action: this.editForm.get(['action'])!.value,
    };
  }
}
