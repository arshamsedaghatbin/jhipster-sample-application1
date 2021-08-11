import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookMarkAction, getBookMarkActionIdentifier } from '../book-mark-action.model';

export type EntityResponseType = HttpResponse<IBookMarkAction>;
export type EntityArrayResponseType = HttpResponse<IBookMarkAction[]>;

@Injectable({ providedIn: 'root' })
export class BookMarkActionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/book-mark-actions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bookMarkAction: IBookMarkAction): Observable<EntityResponseType> {
    return this.http.post<IBookMarkAction>(this.resourceUrl, bookMarkAction, { observe: 'response' });
  }

  update(bookMarkAction: IBookMarkAction): Observable<EntityResponseType> {
    return this.http.put<IBookMarkAction>(`${this.resourceUrl}/${getBookMarkActionIdentifier(bookMarkAction) as number}`, bookMarkAction, {
      observe: 'response',
    });
  }

  partialUpdate(bookMarkAction: IBookMarkAction): Observable<EntityResponseType> {
    return this.http.patch<IBookMarkAction>(
      `${this.resourceUrl}/${getBookMarkActionIdentifier(bookMarkAction) as number}`,
      bookMarkAction,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookMarkAction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookMarkAction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBookMarkActionToCollectionIfMissing(
    bookMarkActionCollection: IBookMarkAction[],
    ...bookMarkActionsToCheck: (IBookMarkAction | null | undefined)[]
  ): IBookMarkAction[] {
    const bookMarkActions: IBookMarkAction[] = bookMarkActionsToCheck.filter(isPresent);
    if (bookMarkActions.length > 0) {
      const bookMarkActionCollectionIdentifiers = bookMarkActionCollection.map(
        bookMarkActionItem => getBookMarkActionIdentifier(bookMarkActionItem)!
      );
      const bookMarkActionsToAdd = bookMarkActions.filter(bookMarkActionItem => {
        const bookMarkActionIdentifier = getBookMarkActionIdentifier(bookMarkActionItem);
        if (bookMarkActionIdentifier == null || bookMarkActionCollectionIdentifiers.includes(bookMarkActionIdentifier)) {
          return false;
        }
        bookMarkActionCollectionIdentifiers.push(bookMarkActionIdentifier);
        return true;
      });
      return [...bookMarkActionsToAdd, ...bookMarkActionCollection];
    }
    return bookMarkActionCollection;
  }
}
