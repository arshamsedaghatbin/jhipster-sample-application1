import { IBookMarkAction } from 'app/entities/book-mark-action/book-mark-action.model';
import { ICategory } from 'app/entities/category/category.model';
import { ISubCategory } from 'app/entities/sub-category/sub-category.model';
import { IPracticeSession } from 'app/entities/practice-session/practice-session.model';
import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface IAction {
  id?: number;
  title?: string | null;
  photoUrl?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  code?: string | null;
  videoContentType?: string | null;
  video?: string | null;
  videoUrl?: string | null;
  masterDescription?: string | null;
  accountType?: AccountType | null;
  bookMarks?: IBookMarkAction[] | null;
  categories?: ICategory[] | null;
  subCategories?: ISubCategory[] | null;
  sessions?: IPracticeSession[] | null;
}

export class Action implements IAction {
  constructor(
    public id?: number,
    public title?: string | null,
    public photoUrl?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public code?: string | null,
    public videoContentType?: string | null,
    public video?: string | null,
    public videoUrl?: string | null,
    public masterDescription?: string | null,
    public accountType?: AccountType | null,
    public bookMarks?: IBookMarkAction[] | null,
    public categories?: ICategory[] | null,
    public subCategories?: ISubCategory[] | null,
    public sessions?: IPracticeSession[] | null
  ) {}
}

export function getActionIdentifier(action: IAction): number | undefined {
  return action.id;
}
