import { IAction } from 'app/entities/action/action.model';

export interface IBookMarkAction {
  id?: number;
  userDescription?: string | null;
  action?: IAction | null;
}

export class BookMarkAction implements IBookMarkAction {
  constructor(public id?: number, public userDescription?: string | null, public action?: IAction | null) {}
}

export function getBookMarkActionIdentifier(bookMarkAction: IBookMarkAction): number | undefined {
  return bookMarkAction.id;
}
