import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICategory, Category } from '../category.model';
import { CategoryService } from '../service/category.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';

@Component({
  selector: 'jhi-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  isSaving = false;

  actionsSharedCollection: IAction[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    photoUrl: [],
    photo: [],
    photoContentType: [],
    voiceUrl: [],
    voiceFile: [],
    voiceFileContentType: [],
    description: [],
    advice: [],
    accountType: [],
    actions: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected categoryService: CategoryService,
    protected actionService: ActionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ category }) => {
      this.updateForm(category);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('jhipsterSampleApplication1App.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const category = this.createFromForm();
    if (category.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  trackActionById(index: number, item: IAction): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>): void {
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

  protected updateForm(category: ICategory): void {
    this.editForm.patchValue({
      id: category.id,
      title: category.title,
      photoUrl: category.photoUrl,
      photo: category.photo,
      photoContentType: category.photoContentType,
      voiceUrl: category.voiceUrl,
      voiceFile: category.voiceFile,
      voiceFileContentType: category.voiceFileContentType,
      description: category.description,
      advice: category.advice,
      accountType: category.accountType,
      actions: category.actions,
    });

    this.actionsSharedCollection = this.actionService.addActionToCollectionIfMissing(
      this.actionsSharedCollection,
      ...(category.actions ?? [])
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
  }

  protected createFromForm(): ICategory {
    return {
      ...new Category(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      photoUrl: this.editForm.get(['photoUrl'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      voiceUrl: this.editForm.get(['voiceUrl'])!.value,
      voiceFileContentType: this.editForm.get(['voiceFileContentType'])!.value,
      voiceFile: this.editForm.get(['voiceFile'])!.value,
      description: this.editForm.get(['description'])!.value,
      advice: this.editForm.get(['advice'])!.value,
      accountType: this.editForm.get(['accountType'])!.value,
      actions: this.editForm.get(['actions'])!.value,
    };
  }
}
