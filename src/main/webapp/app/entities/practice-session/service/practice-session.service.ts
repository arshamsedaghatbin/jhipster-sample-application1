import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPracticeSession, getPracticeSessionIdentifier } from '../practice-session.model';

export type EntityResponseType = HttpResponse<IPracticeSession>;
export type EntityArrayResponseType = HttpResponse<IPracticeSession[]>;

@Injectable({ providedIn: 'root' })
export class PracticeSessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/practice-sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(practiceSession: IPracticeSession): Observable<EntityResponseType> {
    return this.http.post<IPracticeSession>(this.resourceUrl, practiceSession, { observe: 'response' });
  }

  update(practiceSession: IPracticeSession): Observable<EntityResponseType> {
    return this.http.put<IPracticeSession>(
      `${this.resourceUrl}/${getPracticeSessionIdentifier(practiceSession) as number}`,
      practiceSession,
      { observe: 'response' }
    );
  }

  partialUpdate(practiceSession: IPracticeSession): Observable<EntityResponseType> {
    return this.http.patch<IPracticeSession>(
      `${this.resourceUrl}/${getPracticeSessionIdentifier(practiceSession) as number}`,
      practiceSession,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPracticeSession>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPracticeSession[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPracticeSessionToCollectionIfMissing(
    practiceSessionCollection: IPracticeSession[],
    ...practiceSessionsToCheck: (IPracticeSession | null | undefined)[]
  ): IPracticeSession[] {
    const practiceSessions: IPracticeSession[] = practiceSessionsToCheck.filter(isPresent);
    if (practiceSessions.length > 0) {
      const practiceSessionCollectionIdentifiers = practiceSessionCollection.map(
        practiceSessionItem => getPracticeSessionIdentifier(practiceSessionItem)!
      );
      const practiceSessionsToAdd = practiceSessions.filter(practiceSessionItem => {
        const practiceSessionIdentifier = getPracticeSessionIdentifier(practiceSessionItem);
        if (practiceSessionIdentifier == null || practiceSessionCollectionIdentifiers.includes(practiceSessionIdentifier)) {
          return false;
        }
        practiceSessionCollectionIdentifiers.push(practiceSessionIdentifier);
        return true;
      });
      return [...practiceSessionsToAdd, ...practiceSessionCollection];
    }
    return practiceSessionCollection;
  }
}
