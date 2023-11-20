import { Component, OnInit } from '@angular/core';
import {
  EventPayload,
  EventsService,
  IEvent,
} from './services/events/events.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Organization, OrganizationsService } from './services/org/org.service';
import { take } from 'rxjs';

interface FileData {
  name: string;
  type: string;
  size: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'events-admin';
  createEventForm!: FormGroup;
  orgForm!: FormGroup;
  currentSelection!: FileList;
  selectionData: FileData[] = [];
  config: any;
  events: IEvent[] = [];
  eventsToShow: IEvent[] = [];
  organizations: Organization[] = [];
  isShowOrgs: boolean = false;
  searchForm!: FormGroup;
  constructor(
    public eventsService: EventsService,
    public orgsService: OrganizationsService
  ) {
    this.initForm();
  }

  getAllEvents() {
    this.eventsService
      .getEvents()
      .pipe(take(1))
      .subscribe((res) => {
        this.events = res;
        this.eventsToShow = res;
      });
  }

  ngOnInit(): void {
    this.getAllEvents();
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.searchForm.valueChanges.subscribe((v) => {
      if (v.search) {
        this.eventsToShow = this.events.filter((event: IEvent) =>
          event.name.includes(v.search)
        );
      } else {
        this.eventsToShow = [...this.events];
      }
    });

    this.eventsService.getConfig().subscribe((config) => {
      this.config = config;
    });

    this.getOrganizations();
  }

  initForm() {
    this.createEventForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      orgId: new FormControl('', { validators: Validators.required }),
      city: new FormControl('', { validators: Validators.required }),
      place: new FormControl('', { validators: Validators.required }),
      googleMapsLink: new FormControl('', { validators: Validators.required }),
      type: new FormControl('', { validators: Validators.required }),
      originUrl: new FormControl('', { validators: Validators.required }),
      startTime: new FormControl('', { validators: Validators.required }),
      endTime: new FormControl(''),
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
    if (this.createEventForm.get('ageRestrictionTo')?.value === '') {
      this.createEventForm.get('ageRestrictionTo')?.setValue(200);
    }

    if (event.value === 200) {
      this.createEventForm.get('ageRestrictionTo')?.setValue(200);
    }
  }

  createEvent(value: any) {
    const payload: EventPayload = {
      name: value.name,
      orgId: value.orgId,
      city: value.city,
      place: value.place,
      googleMapsLink: value.googleMapsLink,
      type: value.type,
      ageRestrictionFrom: value.ageRestrictionFrom,
      ageRestrictionTo: value.ageRestrictionTo,
      priceFrom: +value.priceFrom,
      priceTo: +value.priceTo,
      originUrl: value.originUrl,
      description: value.description,
      startDate: new Date(
        new Date(value.startDate).setHours(value.startTime.split(':')[0])
      ).setMinutes(value.startTime.split(':')[1]),
      endDate: new Date(value.endDate).getTime(),
      hasNoEndTime: true,
    };

    if (value.endTime) {
      payload.hasNoEndTime = false;
      payload.endDate = new Date(
        new Date(payload.endDate).setHours(value.endTime.split(':')[0])
      ).setMinutes(value.endTime.split(':')[1]);
    }
    this.eventsService
      .createEvent(payload)
      .pipe(take(1))
      .subscribe((res) => {
        const formData = new FormData();

        for (let i = 0; i < this.currentSelection.length; i++) {
          formData.append('images', this.currentSelection[i]);
        }

        console.log('LETSGOO');
        this.eventsService
          .uploadImage(res.id as number, formData)
          .pipe(take(1))
          .subscribe((uploadRes) => {
            console.log(uploadRes);

            this.getAllEvents();
          });
      });
    // send upload image request after event created
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
  deleteEvent(id: number | undefined) {
    this.eventsService
      .deleteEventById(id)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        this.getAllEvents();
      });
  }
  ///// file upload

  onFileSelected(event: any): void {
    if (!event.target) return;
    this.selectionData = [];
    this.currentSelection = event.target.files;

    if (this.currentSelection) {
      for (let i = 0; i < this.currentSelection.length; i++) {
        this.selectionData.push({
          name: this.currentSelection[i].name,
          size: this.currentSelection[i].size,
          type: this.currentSelection[i].type.split('/')[1],
        });
      }
    }
  }
  removeFile(file: FileData): void {
    // this.fileRemoved.emit(file.name);
    console.log(file);
    this.selectionData = this.selectionData.filter((existingFile: FileData) => {
      return existingFile.name !== file.name;
    });

    this.currentSelection = Array.from(this.currentSelection).filter(
      (selectedFile) => {
        return selectedFile.name !== file.name;
      }
    ) as any;
  }

  msToDate(ms: number) {
    return new Date(ms);
  }
}
