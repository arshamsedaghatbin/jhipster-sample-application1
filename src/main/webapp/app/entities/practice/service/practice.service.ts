import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPractice, getPracticeIdentifier } from '../practice.model';

export type EntityResponseType = HttpResponse<IPractice>;
export type EntityArrayResponseType = HttpResponse<IPractice[]>;

@Injectable({ providedIn: 'root' })
export class PracticeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/practices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(practice: IPractice): Observable<EntityResponseType> {
    return this.http.post<IPractice>(this.resourceUrl, practice, { observe: 'response' });
  }

  update(practice: IPractice): Observable<EntityResponseType> {
    return this.http.put<IPractice>(`${this.resourceUrl}/${getPracticeIdentifier(practice) as number}`, practice, { observe: 'response' });
  }

  partialUpdate(practice: IPractice): Observable<EntityResponseType> {
    return this.http.patch<IPractice>(`${this.resourceUrl}/${getPracticeIdentifier(practice) as number}`, practice, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPractice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPractice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPracticeToCollectionIfMissing(practiceCollection: IPractice[], ...practicesToCheck: (IPractice | null | undefined)[]): IPractice[] {
    const practices: IPractice[] = practicesToCheck.filter(isPresent);
    if (practices.length > 0) {
      const practiceCollectionIdentifiers = practiceCollection.map(practiceItem => getPracticeIdentifier(practiceItem)!);
      const practicesToAdd = practices.filter(practiceItem => {
        const practiceIdentifier = getPracticeIdentifier(practiceItem);
        if (practiceIdentifier == null || practiceCollectionIdentifiers.includes(practiceIdentifier)) {
          return false;
        }
        practiceCollectionIdentifiers.push(practiceIdentifier);
        return true;
      });
      return [...practicesToAdd, ...practiceCollection];
    }
    return practiceCollection;
  }
}
