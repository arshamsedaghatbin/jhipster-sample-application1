import { ISubCategory } from 'app/entities/sub-category/sub-category.model';
import { IAction } from 'app/entities/action/action.model';
import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface ICategory {
  id?: number;
  title?: string | null;
  photoUrl?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  voiceUrl?: string | null;
  voiceFileContentType?: string | null;
  voiceFile?: string | null;
  description?: string | null;
  advice?: string | null;
  accountType?: AccountType | null;
  subcategories?: ISubCategory[] | null;
  actions?: IAction[] | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public title?: string | null,
    public photoUrl?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public voiceUrl?: string | null,
    public voiceFileContentType?: string | null,
    public voiceFile?: string | null,
    public description?: string | null,
    public advice?: string | null,
    public accountType?: AccountType | null,
    public subcategories?: ISubCategory[] | null,
    public actions?: IAction[] | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
