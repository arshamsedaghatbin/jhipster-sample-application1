import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPractice, Practice } from '../practice.model';
import { PracticeService } from '../service/practice.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-practice-update',
  templateUrl: './practice-update.component.html',
})
export class PracticeUpdateComponent implements OnInit {
  isSaving = false;

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
    briefMasterAdvice: [],
    accountType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected practiceService: PracticeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ practice }) => {
      this.updateForm(practice);
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
    const practice = this.createFromForm();
    if (practice.id !== undefined) {
      this.subscribeToSaveResponse(this.practiceService.update(practice));
    } else {
      this.subscribeToSaveResponse(this.practiceService.create(practice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPractice>>): void {
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

  protected updateForm(practice: IPractice): void {
    this.editForm.patchValue({
      id: practice.id,
      title: practice.title,
      photoUrl: practice.photoUrl,
      photo: practice.photo,
      photoContentType: practice.photoContentType,
      voiceUrl: practice.voiceUrl,
      voiceFile: practice.voiceFile,
      voiceFileContentType: practice.voiceFileContentType,
      masterDescription: practice.masterDescription,
      masterAdvice: practice.masterAdvice,
      briefMasterAdvice: practice.briefMasterAdvice,
      accountType: practice.accountType,
    });
  }

  protected createFromForm(): IPractice {
    return {
      ...new Practice(),
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
      briefMasterAdvice: this.editForm.get(['briefMasterAdvice'])!.value,
      accountType: this.editForm.get(['accountType'])!.value,
    };
  }
}
