import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'events-admin';
  createEventForm!: FormGroup;

  config: any;
  constructor(public eventsService: EventsService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((res) => {
      console.log(res);
    });

    this.eventsService.getConfig().subscribe((config) => {
      console.log(config);
      this.config = config;
    });
  }

  initForm() {
    this.createEventForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      image: new FormControl('', { validators: Validators.required }),
      org: new FormControl('', { validators: Validators.required }),
      city: new FormControl('', { validators: Validators.required }),
      place: new FormControl('', { validators: Validators.required }),
      googleMapsLink: new FormControl('', { validators: Validators.required }),
      type: new FormControl('', { validators: Validators.required }),
      ageRestrictionFrom: new FormControl('', {
        validators: Validators.required,
      }),
      ageRestrictionTo: new FormControl('', {
        validators: Validators.required,
      }),
      price: new FormControl('', { validators: Validators.required }),
      description: new FormControl('', { validators: Validators.required }),
      startDate: new FormControl('', { validators: Validators.required }),
      endDate: new FormControl('', { validators: Validators.required }),
    });
  }
}
