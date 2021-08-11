import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPracticeSession } from '../practice-session.model';

@Component({
  selector: 'jhi-practice-session-detail',
  templateUrl: './practice-session-detail.component.html',
})
export class PracticeSessionDetailComponent implements OnInit {
  practiceSession: IPracticeSession | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ practiceSession }) => {
      this.practiceSession = practiceSession;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
