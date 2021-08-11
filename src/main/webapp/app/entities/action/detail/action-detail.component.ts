import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAction } from '../action.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-action-detail',
  templateUrl: './action-detail.component.html',
})
export class ActionDetailComponent implements OnInit {
  action: IAction | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ action }) => {
      this.action = action;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
