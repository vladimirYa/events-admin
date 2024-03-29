import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Organization {
  id: string;
  name: string;
  contacts: string;
  link: string;
}

export interface IEvent {
  id: number;
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
  ageRestriction: string;
  priceFrom: number;
  priceTo: number;
  description: string;
  startDate: number;
  endDate: number;
  addressAlias: string;
  hasPrice: boolean;
  hasNoEndTime: boolean;
  isDonation: boolean;
  eventUrl: string;
  originUrl: string;
  linkToBuyAlias: string;
}

export interface EventPayload {
  name: string;
  orgId: number;
  city: string;
  place: string;
  googleMapsLink: string;
  type: string;
  ageRestrictionFrom: number;
  ageRestrictionTo: number;
  ageRestriction: string;
  priceFrom: number;
  priceTo: number;
  description: string;
  startDate: number;
  endDate: number;
  originUrl: string;
  hasNoEndTime: boolean;
  addressAlias: string;
  eventUrl: string;
  hasPrice: boolean;
  isDonation: boolean;
  images?: string[];
  linkToBuyAlias?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(public http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>('https://idu.world/back' + '/events');
  }

  createEvent(body: EventPayload): Observable<IEvent> {
    return this.http.post<IEvent>('https://idu.world/back' + '/events', body);
  }

  updateEvent(body: EventPayload): Observable<IEvent> {
    return this.http.put<IEvent>('https://idu.world/back' + '/events', body);
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>('https://idu.world/back' + `/events/${id}`);
  }

  deleteEventById(id: number | undefined): Observable<IEvent> {
    return this.http.delete<IEvent>('https://idu.world/back' + `/events/${id}`);
  }

  getConfig(): Observable<any> {
    return this.http.get('https://idu.world/back' + `/configs/event-filter`);
  }

  uploadImage(eventId: number, formData: FormData): Observable<any> {
    return this.http.post(
      'https://idu.world/back' + `/events/${eventId}/images`,
      formData
    );
  }
}
