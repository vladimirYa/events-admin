import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Organization {
  name: string;
  contacts: string;
  link: string;
}

export interface IEvent {
  name: string;
  image: string;
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

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(public http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>('http://localhost:8080/events');
  }

  createEvent(body: IEvent): Observable<IEvent> {
    return this.http.post<IEvent>('http://localhost:8080/events', body);
  }

  updateEvent(body: IEvent): Observable<IEvent> {
    return this.http.put<IEvent>('http://localhost:8080/events', body);
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>(`http://localhost:8080/events/${id}`);
  }

  deleteEventById(id: string): Observable<IEvent> {
    return this.http.delete<IEvent>(`http://localhost:8080/events/${id}`);
  }

  getConfig(): Observable<any> {
    return this.http.get('http://localhost:8080/configs/event-filter');
  }
}
