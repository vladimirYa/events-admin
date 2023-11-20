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
    return this.http.get<Organization[]>('https://idu.world/back' + '/orgs');
  }

  createOrg(body: Organization): Observable<Organization> {
    return this.http.post<Organization>(
      'https://idu.world/back' + '/orgs',
      body
    );
  }

  updateOrg(body: Organization): Observable<Organization> {
    return this.http.put<Organization>(
      'https://idu.world/back' + '/orgs',
      body
    );
  }

  deleteOrg(id: any): Observable<Organization> {
    return this.http.delete<Organization>(
      'https://idu.world/back' + `/orgs/${id}`
    );
  }
}
