import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPracticeSession, PracticeSession } from '../practice-session.model';
import { PracticeSessionService } from '../service/practice-session.service';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { IPractice } from 'app/entities/practice/practice.model';
import { PracticeService } from 'app/entities/practice/service/practice.service';

@Component({
  selector: 'jhi-practice-session-update',
  templateUrl: './practice-session-update.component.html',
})
export class PracticeSessionUpdateComponent implements OnInit {
  isSaving = false;

  actionsSharedCollection: IAction[] = [];
  practicesSharedCollection: IPractice[] = [];

  editForm = this.fb.group({
    id: [],
    tiltle: [],
    actions: [],
    practice: [],
  });

  constructor(
    protected practiceSessionService: PracticeSessionService,
    protected actionService: ActionService,
    protected practiceService: PracticeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ practiceSession }) => {
      this.updateForm(practiceSession);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const practiceSession = this.createFromForm();
    if (practiceSession.id !== undefined) {
      this.subscribeToSaveResponse(this.practiceSessionService.update(practiceSession));
    } else {
      this.subscribeToSaveResponse(this.practiceSessionService.create(practiceSession));
    }
  }

  trackActionById(index: number, item: IAction): number {
    return item.id!;
  }

  trackPracticeById(index: number, item: IPractice): number {
    return item.id!;
  }

  getSelectedAction(option: IAction, selectedVals?: IAction[]): IAction {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPracticeSession>>): void {
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

  protected updateForm(practiceSession: IPracticeSession): void {
    this.editForm.patchValue({
      id: practiceSession.id,
      tiltle: practiceSession.tiltle,
      actions: practiceSession.actions,
      practice: practiceSession.practice,
    });

    this.actionsSharedCollection = this.actionService.addActionToCollectionIfMissing(
      this.actionsSharedCollection,
      ...(practiceSession.actions ?? [])
    );
    this.practicesSharedCollection = this.practiceService.addPracticeToCollectionIfMissing(
      this.practicesSharedCollection,
      practiceSession.practice
    );
  }

  protected loadRelationshipsOptions(): void {
    this.actionService
      .query()
      .pipe(map((res: HttpResponse<IAction[]>) => res.body ?? []))
      .pipe(
        map((actions: IAction[]) =>
          this.actionService.addActionToCollectionIfMissing(actions, ...(this.editForm.get('actions')!.value ?? []))
        )
      )
      .subscribe((actions: IAction[]) => (this.actionsSharedCollection = actions));

    this.practiceService
      .query()
      .pipe(map((res: HttpResponse<IPractice[]>) => res.body ?? []))
      .pipe(
        map((practices: IPractice[]) =>
          this.practiceService.addPracticeToCollectionIfMissing(practices, this.editForm.get('practice')!.value)
        )
      )
      .subscribe((practices: IPractice[]) => (this.practicesSharedCollection = practices));
  }

  protected createFromForm(): IPracticeSession {
    return {
      ...new PracticeSession(),
      id: this.editForm.get(['id'])!.value,
      tiltle: this.editForm.get(['tiltle'])!.value,
      actions: this.editForm.get(['actions'])!.value,
      practice: this.editForm.get(['practice'])!.value,
    };
  }
}
