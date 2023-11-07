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
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(public http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(
      'https://09c7-89-71-160-107.ngrok-free.app/events'
    );
  }

  createEvent(body: EventPayload): Observable<IEvent> {
    return this.http.post<IEvent>(
      'https://09c7-89-71-160-107.ngrok-free.app/events',
      body
    );
  }

  updateEvent(body: IEvent): Observable<IEvent> {
    return this.http.put<IEvent>(
      'https://09c7-89-71-160-107.ngrok-free.app/events',
      body
    );
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>(
      `https://09c7-89-71-160-107.ngrok-free.app/events/${id}`
    );
  }

  deleteEventById(id: number | undefined): Observable<IEvent> {
    return this.http.delete<IEvent>(
      `https://09c7-89-71-160-107.ngrok-free.app/events/${id}`
    );
  }

  getConfig(): Observable<any> {
    return this.http.get(
      'https://09c7-89-71-160-107.ngrok-free.app/configs/event-filter'
    );
  }

  uploadImage(eventId: number, formData: FormData): Observable<any> {
    return this.http.post(
      `https://09c7-89-71-160-107.ngrok-free.app/events/${eventId}/images`,
      formData
    );
  }
}
