import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPractice } from '../practice.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-practice-detail',
  templateUrl: './practice-detail.component.html',
})
export class PracticeDetailComponent implements OnInit {
  practice: IPractice | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ practice }) => {
      this.practice = practice;
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
