import { IAction } from 'app/entities/action/action.model';
import { ICategory } from 'app/entities/category/category.model';
import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface ISubCategory {
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
  accountType?: AccountType | null;
  actions?: IAction[] | null;
  category?: ICategory | null;
}

export class SubCategory implements ISubCategory {
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
    public accountType?: AccountType | null,
    public actions?: IAction[] | null,
    public category?: ICategory | null
  ) {}
}

export function getSubCategoryIdentifier(subCategory: ISubCategory): number | undefined {
  return subCategory.id;
}
