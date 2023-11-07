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
    return this.http.get<Organization[]>(window.location.origin + '/orgs');
  }

  createOrg(body: Organization): Observable<Organization> {
    return this.http.post<Organization>(window.location.origin + '/orgs', body);
  }

  updateOrg(body: Organization): Observable<Organization> {
    return this.http.put<Organization>(window.location.origin + '/orgs', body);
  }

  deleteOrg(id: any): Observable<Organization> {
    return this.http.delete<Organization>(
      window.location.origin + `/orgs/${id}`
    );
  }
}
