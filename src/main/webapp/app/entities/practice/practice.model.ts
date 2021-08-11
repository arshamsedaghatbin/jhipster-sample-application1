import { IPracticeSession } from 'app/entities/practice-session/practice-session.model';
import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface IPractice {
  id?: number;
  title?: string | null;
  photoUrl?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  voiceUrl?: string | null;
  voiceFileContentType?: string | null;
  voiceFile?: string | null;
  masterDescription?: string | null;
  masterAdvice?: string | null;
  briefMasterAdvice?: string | null;
  accountType?: AccountType | null;
  sessions?: IPracticeSession[] | null;
}

export class Practice implements IPractice {
  constructor(
    public id?: number,
    public title?: string | null,
    public photoUrl?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public voiceUrl?: string | null,
    public voiceFileContentType?: string | null,
    public voiceFile?: string | null,
    public masterDescription?: string | null,
    public masterAdvice?: string | null,
    public briefMasterAdvice?: string | null,
    public accountType?: AccountType | null,
    public sessions?: IPracticeSession[] | null
  ) {}
}

export function getPracticeIdentifier(practice: IPractice): number | undefined {
  return practice.id;
}
