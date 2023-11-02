import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Organization {
  id: number;
  name: string;
  contacts: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(public http: HttpClient) {}

  getOrgs(): Observable<Organization[]> {
    return this.http.get<Organization[]>('http://localhost:8080/orgs');
  }

  createOrg(body: Organization): Observable<Organization> {
    return this.http.post<Organization>('http://localhost:8080/orgs', body);
  }

  updateOrg(body: Organization): Observable<Organization> {
    return this.http.put<Organization>('http://localhost:8080/orgs', body);
  }

  deleteOrg(id: any): Observable<Organization> {
    return this.http.delete<Organization>(`http://localhost:8080/orgs/${id}`);
  }
}
