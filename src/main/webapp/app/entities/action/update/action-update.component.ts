import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAction, Action } from '../action.model';
import { ActionService } from '../service/action.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-action-update',
  templateUrl: './action-update.component.html',
})
export class ActionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
    photoUrl: [],
    photo: [],
    photoContentType: [],
    code: [null, []],
    video: [],
    videoContentType: [],
    videoUrl: [],
    masterDescription: [],
    accountType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected actionService: ActionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ action }) => {
      this.updateForm(action);
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
    const action = this.createFromForm();
    if (action.id !== undefined) {
      this.subscribeToSaveResponse(this.actionService.update(action));
    } else {
      this.subscribeToSaveResponse(this.actionService.create(action));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAction>>): void {
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

  protected updateForm(action: IAction): void {
    this.editForm.patchValue({
      id: action.id,
      title: action.title,
      photoUrl: action.photoUrl,
      photo: action.photo,
      photoContentType: action.photoContentType,
      code: action.code,
      video: action.video,
      videoContentType: action.videoContentType,
      videoUrl: action.videoUrl,
      masterDescription: action.masterDescription,
      accountType: action.accountType,
    });
  }

  protected createFromForm(): IAction {
    return {
      ...new Action(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      photoUrl: this.editForm.get(['photoUrl'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      code: this.editForm.get(['code'])!.value,
      videoContentType: this.editForm.get(['videoContentType'])!.value,
      video: this.editForm.get(['video'])!.value,
      videoUrl: this.editForm.get(['videoUrl'])!.value,
      masterDescription: this.editForm.get(['masterDescription'])!.value,
      accountType: this.editForm.get(['accountType'])!.value,
    };
  }
}
