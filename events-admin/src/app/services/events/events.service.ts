import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Organization {
  name: string;
  contacts: string;
  link: string;
}

export interface IEvent {
  id?: number;
  name: string;
  // image: string;
  images: string[];
  org: Organization;
  city: string;
  place: string;
  googleMapsLink: string;
  type: string;
  ageRestrictionFrom: number;
  ageRestrictionTo: number;
  priceFrom: number;
  priceTo: number;
  description: string;
  startDate: number;
  endDate: number;
}

export interface EventPayload {
  name: string;
  orgId: number;
  city: string;
  place: string;
  googleMapsLink: string;
  type: string;
  ageRestrictionFrom: string;
  ageRestrictionTo: string;
  priceFrom: number;
  priceTo: number;
  description: string;
  startDate: number;
  endDate: number;
  originUrl: string;
  hasNoEndTime: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(public http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>('http://34.154.88.126:8080' + '/events');
  }

  createEvent(body: EventPayload): Observable<IEvent> {
    return this.http.post<IEvent>(
      'http://34.154.88.126:8080' + '/events',
      body
    );
  }

  updateEvent(body: IEvent): Observable<IEvent> {
    return this.http.put<IEvent>('http://34.154.88.126:8080' + '/events', body);
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>('http://34.154.88.126:8080' + `/events/${id}`);
  }

  deleteEventById(id: number | undefined): Observable<IEvent> {
    return this.http.delete<IEvent>(
      'http://34.154.88.126:8080' + `/events/${id}`
    );
  }

  getConfig(): Observable<any> {
    return this.http.get('http://34.154.88.126:8080' + `/configs/event-filter`);
  }

  uploadImage(eventId: number, formData: FormData): Observable<any> {
    return this.http.post(
      'http://34.154.88.126:8080' + `/events/${eventId}/images`,
      formData
    );
  }
}
