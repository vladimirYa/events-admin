import { Component, OnInit } from '@angular/core';
import { EventsService, IEvent } from './services/events/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Organization, OrganizationsService } from './services/org/org.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'events-admin';
  createEventForm!: FormGroup;
  orgForm!: FormGroup;

  config: any;
  events: IEvent[] = [];
  organizations: Organization[] = [];
  isShowOrgs: boolean = false;
  constructor(
    public eventsService: EventsService,
    public orgsService: OrganizationsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((res) => {
      this.events = res;
    });

    this.eventsService.getConfig().subscribe((config) => {
      this.config = config;
      console.log(config);
    });

    this.getOrganizations();
  }

  initForm() {
    this.createEventForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      image: new FormControl('', { validators: Validators.required }),
      orgId: new FormControl('', { validators: Validators.required }),
      city: new FormControl('', { validators: Validators.required }),
      place: new FormControl('', { validators: Validators.required }),
      googleMapsLink: new FormControl('', { validators: Validators.required }),
      type: new FormControl('', { validators: Validators.required }),
      time: new FormControl('', { validators: Validators.required }),
      ageRestrictionFrom: new FormControl('', {
        validators: Validators.required,
      }),
      ageRestrictionTo: new FormControl('', {
        validators: Validators.required,
      }),
      priceFrom: new FormControl('', { validators: Validators.required }),
      priceTo: new FormControl('', { validators: Validators.required }),
      description: new FormControl('', { validators: Validators.required }),
      startDate: new FormControl('', { validators: Validators.required }),
      endDate: new FormControl('', { validators: Validators.required }),
    });

    this.orgForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      contacts: new FormControl('', { validators: Validators.required }),
      link: new FormControl(''),
    });

    this.createEventForm.valueChanges.subscribe((v) => {
      console.log(v);
    });
  }

  setEventType(item: string) {
    this.createEventForm.get('type')?.setValue(item);
  }

  priceFromChangeHandle(event: MatSelectChange) {
    if (event.value === 101) {
      this.createEventForm.get('priceTo')?.setValue(2147483647);
    } else {
      this.createEventForm.get('priceTo')?.setValue(null);
    }
  }

  ageFromChangeHandle(event: MatSelectChange) {
    console.log(event);
    if (this.createEventForm.get('ageRestrictionTo')?.value === '') {
      this.createEventForm.get('ageRestrictionTo')?.setValue(200);
    }

    if (event.value === 200) {
      this.createEventForm.get('ageRestrictionTo')?.setValue(200);
    }
  }

  createEvent(value: any) {
    console.log(value);
    // const payload: IEvent = { name: value.name };
  }

  createOrganization(value: any) {
    this.orgsService.createOrg(value).subscribe((res) => {
      this.getOrganizations();
      this.orgForm.reset();
    });
  }

  getOrganizations() {
    this.orgsService
      .getOrgs()
      .pipe(take(1))
      .subscribe((res) => {
        this.organizations = res;
      });
  }

  deleteOrg(id: number) {
    this.orgsService
      .deleteOrg(id)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        this.getOrganizations();
      });
  }
}
