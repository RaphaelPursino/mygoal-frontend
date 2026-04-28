import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal, GoalRequest, Mission } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private apiUrl = `${environment.apiUrl}/goals`;

  constructor(private http: HttpClient) {}

  list(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  getById(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/${id}`);
  }

  create(req: GoalRequest): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  completeMission(missionId: string): Observable<Mission> {
    return this.http.patch<Mission>(`${this.apiUrl}/missions/${missionId}/complete`, {});
  }
}