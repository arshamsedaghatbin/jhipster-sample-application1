import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISubCategory, SubCategory } from '../sub-category.model';
import { SubCategoryService } from '../service/sub-category.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-sub-category-update',
  templateUrl: './sub-category-update.component.html',
})
export class SubCategoryUpdateComponent implements OnInit {
  isSaving = false;

  actionsSharedCollection: IAction[] = [];
  categoriesSharedCollection: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    photoUrl: [],
    photo: [],
    photoContentType: [],
    voiceUrl: [],
    voiceFile: [],
    voiceFileContentType: [],
    masterDescription: [],
    masterAdvice: [],
    accountType: [],
    actions: [],
    category: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected subCategoryService: SubCategoryService,
    protected actionService: ActionService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subCategory }) => {
      this.updateForm(subCategory);

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
    const subCategory = this.createFromForm();
    if (subCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.subCategoryService.update(subCategory));
    } else {
      this.subscribeToSaveResponse(this.subCategoryService.create(subCategory));
    }
  }

  trackActionById(index: number, item: IAction): number {
    return item.id!;
  }

  trackCategoryById(index: number, item: ICategory): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubCategory>>): void {
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

  protected updateForm(subCategory: ISubCategory): void {
    this.editForm.patchValue({
      id: subCategory.id,
      title: subCategory.title,
      photoUrl: subCategory.photoUrl,
      photo: subCategory.photo,
      photoContentType: subCategory.photoContentType,
      voiceUrl: subCategory.voiceUrl,
      voiceFile: subCategory.voiceFile,
      voiceFileContentType: subCategory.voiceFileContentType,
      masterDescription: subCategory.masterDescription,
      masterAdvice: subCategory.masterAdvice,
      accountType: subCategory.accountType,
      actions: subCategory.actions,
      category: subCategory.category,
    });

    this.actionsSharedCollection = this.actionService.addActionToCollectionIfMissing(
      this.actionsSharedCollection,
      ...(subCategory.actions ?? [])
    );
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      subCategory.category
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

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }

  protected createFromForm(): ISubCategory {
    return {
      ...new SubCategory(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      photoUrl: this.editForm.get(['photoUrl'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      voiceUrl: this.editForm.get(['voiceUrl'])!.value,
      voiceFileContentType: this.editForm.get(['voiceFileContentType'])!.value,
      voiceFile: this.editForm.get(['voiceFile'])!.value,
      masterDescription: this.editForm.get(['masterDescription'])!.value,
      masterAdvice: this.editForm.get(['masterAdvice'])!.value,
      accountType: this.editForm.get(['accountType'])!.value,
      actions: this.editForm.get(['actions'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }
}
