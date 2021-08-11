import { IAction } from 'app/entities/action/action.model';
import { IPractice } from 'app/entities/practice/practice.model';

export interface IPracticeSession {
  id?: number;
  tiltle?: string | null;
  actions?: IAction[] | null;
  practice?: IPractice | null;
}

export class PracticeSession implements IPracticeSession {
  constructor(public id?: number, public tiltle?: string | null, public actions?: IAction[] | null, public practice?: IPractice | null) {}
}

export function getPracticeSessionIdentifier(practiceSession: IPracticeSession): number | undefined {
  return practiceSession.id;
}
