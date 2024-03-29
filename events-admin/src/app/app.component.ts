import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  EventPayload,
  EventsService,
  IEvent,
} from './services/events/events.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Organization, OrganizationsService } from './services/org/org.service';
import { take } from 'rxjs';

interface FileData {
  name: string;
  type: string;
  size: number;
}
enum Age {
  ANY = 'ANY',
  UNDER_18 = 'UNDER_18',
  ABOVE_18 = 'ABOVE_18',
  FAMILY = 'FAMILY',
  _UNKNOWN = '_UNKNOWN',
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  title = 'events-admin';
  createEventForm!: FormGroup;
  orgForm!: FormGroup;
  currentSelection: FileList | undefined = undefined;
  selectionData: FileData[] = [];
  config: any;
  events: IEvent[] = [];
  eventsToShow: IEvent[] = [];
  organizationsToShow: Organization[] = [];
  organizations: Organization[] = [];
  isShowOrgs: boolean = false;
  searchForm!: FormGroup;
  isCreating: boolean = false;
  eventFormtas: { [key: string]: Array<any> } = {};
  eventToEdit: IEvent = {} as IEvent;
  allCitites: string[] = [];
  searchByOrg!: FormGroup;
  ageValues: any[] = [
    {
      label: 'Любой возраст',
      value: Age.ANY,
    },
    {
      label: 'До 18 лет',
      value: Age.UNDER_18,
    },
    {
      label: 'От 18 лет',
      value: Age.ABOVE_18,
    },
    {
      label: 'Семейное',
      value: Age.FAMILY,
    },
  ];
  constructor(
    public eventsService: EventsService,
    public orgsService: OrganizationsService
  ) {
    this.initForm();
    this.searchByOrg = new FormGroup({
      org_name: new FormControl(''),
    });
    this.searchByOrg.valueChanges.subscribe((v) => {
      if (v.org_name) {
        this.organizationsToShow = this.organizations.filter(
          (org: Organization) => {
            return org.name
              .toLocaleLowerCase()
              .includes(v.org_name.toLocaleLowerCase());
          }
        );
      }
    });
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
    this.getOrganizations();
    this.getAllEvents();
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.searchForm.valueChanges.subscribe((v) => {
      if (v.search) {
        this.eventsToShow = this.events.filter((event: IEvent) =>
          event.name.toLocaleLowerCase().includes(v.search.toLocaleLowerCase())
        );
      } else {
        this.eventsToShow = [...this.events];
      }
    });

    this.eventsService.getConfig().subscribe((config) => {
      this.config = config;
      console.log(config);
      config.eventFormats.values.forEach((eventFormat: any) => {
        if (this.eventFormtas[eventFormat.category]) {
          this.eventFormtas[eventFormat.category].push(eventFormat.label);
        } else {
          this.eventFormtas[eventFormat.category] = [];
          this.eventFormtas[eventFormat.category].push(eventFormat.label);
        }
      });

      this.allCitites = [
        ...config.cities.values.coast,
        ...config.cities.values.common,
      ];
    });
  }
  initEventForm() {
    this.createEventForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      orgId: new FormControl(''),
      city: new FormControl('', { validators: Validators.required }),
      place: new FormControl(''),
      googleMapsLink: new FormControl('', { validators: Validators.required }),
      type: new FormControl('', { validators: Validators.required }),
      originUrl: new FormControl(''),
      startTime: new FormControl('', { validators: Validators.required }),
      endTime: new FormControl(''),
      ageRestrictionFrom: new FormControl(null),
      ageRestrictionTo: new FormControl(null),
      ageRestriction: new FormControl(Age._UNKNOWN),
      priceFrom: new FormControl(null),
      priceTo: new FormControl(null),
      description: new FormControl(''),
      startDate: new FormControl('', { validators: Validators.required }),
      endDate: new FormControl(''),
      addressAlias: new FormControl(''),
      linkToBuyAlias: new FormControl(null),
      eventUrl: new FormControl(''),
      isDonation: new FormControl(false),
    });
    this.currentSelection = undefined;
    this.selectionData = [];
    // (document.getElementById('file-input') as any).value = '';
  }
  initForm() {
    this.eventToEdit = {} as IEvent;

    this.initEventForm();

    this.orgForm = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      contacts: new FormControl(''),
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

  selectToEdit(event: IEvent) {
    console.log(event);
    this.eventToEdit = event;
    this.createEventForm.get('name')?.setValue(event.name);
    this.createEventForm.get('city')?.setValue(event.city);
    this.createEventForm.get('place')?.setValue(event.place);
    this.createEventForm.get('googleMapsLink')?.setValue(event.googleMapsLink);
    this.createEventForm.get('type')?.setValue(event.type);
    this.createEventForm.get('addressAlias')?.setValue(event.addressAlias);
    this.createEventForm.get('eventUrl')?.setValue(event.eventUrl);
    this.createEventForm.get('originUrl')?.setValue(event.originUrl);
    this.createEventForm.get('description')?.setValue(event.description);
    this.createEventForm.get('isDonation')?.setValue(event.isDonation);
    this.createEventForm.get('priceFrom')?.setValue(event.priceFrom);
    this.createEventForm.get('priceTo')?.setValue(event.priceTo);
    this.createEventForm.get('linkToBuyAlias')?.setValue(event.linkToBuyAlias);
    // this.ageFromChangeHandle({
    //   value: event.ageRestrictionFrom,
    // } as MatSelectChange);
    this.createEventForm
      .get('ageRestrictionFrom')
      ?.setValue(event.ageRestrictionFrom);
    this.createEventForm
      .get('ageRestrictionTo')
      ?.setValue(event.ageRestrictionTo);
    this.createEventForm.get('ageRestriction')?.setValue(event.ageRestriction);
    this.createEventForm.get('startDate')?.setValue(new Date(event.startDate));
    this.createEventForm.get('endDate')?.setValue(new Date(event.endDate));
    this.createEventForm
      .get('startTime')
      ?.setValue(
        new Date(event.startDate).toString().split(' ')[4].substr(0, 5)
      );
    this.createEventForm
      .get('endTime')
      ?.setValue(new Date(event.endDate).toString().split(' ')[4].substr(0, 5));
  }

  editEvent(value: any) {
    this.isCreating = true;

    let payload: EventPayload = this.generatePayload(
      value,
      this.eventToEdit.id
    );
    payload = { ...payload, images: this.eventToEdit.images };
    this.eventsService
      .updateEvent(payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isCreating = false;
          this.eventToEdit = {} as IEvent;
          this.initEventForm();
          this.getAllEvents();
        },
      });
  }

  createEvent(value: any) {
    this.isCreating = true;
    const payload: EventPayload = this.generatePayload(value);

    this.eventsService
      .createEvent(payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const formData = new FormData();
          if (this.currentSelection) {
            for (let i = 0; i < this.currentSelection.length; i++) {
              formData.append('images', this.currentSelection[i]);
            }
            this.initEventForm();

            this.eventsService
              .uploadImage(res.id as number, formData)
              .pipe(take(1))
              .subscribe({
                next: () => {
                  this.getAllEvents();
                },
                complete: () => {
                  this.isCreating = false;
                  this.currentSelection = undefined;
                  this.selectionData = [];
                  this.fileInput.nativeElement.value = '';

                  console.log('complete');
                },
              });
          }
        },
      });
    // send upload image request after event created
  }
  generatePayload(value: any, id?: number): EventPayload {
    const payload = {
      id: id ? id : null,
      name: value.name,
      orgId: value.orgId,
      city: value.city,
      place: value.place,
      googleMapsLink: value.googleMapsLink,
      type: value.type,
      ageRestriction: value.ageRestriction,
      ageRestrictionFrom: +value.ageRestrictionFrom,
      ageRestrictionTo: +value.ageRestrictionTo,
      priceFrom: value.priceFrom,
      priceTo: value.priceTo,
      addressAlias: value.addressAlias,
      eventUrl: value.eventUrl,
      originUrl: value.originUrl,
      description: value.description,
      startDate: new Date(
        new Date(value.startDate).setHours(value.startTime.split(':')[0])
      ).setMinutes(value.startTime.split(':')[1]),
      endDate: new Date(value.endDate).getTime(),
      hasNoEndTime: true,
      hasPrice: !(
        value.priceFrom === null ||
        (value.priceFrom === '' && value.priceTo === null) ||
        value.priceTo === ''
      ),
      isDonation: value.isDonation,
      linkToBuyAlias: value.linkToBuyAlias,
    };

    if (value.endTime) {
      payload.hasNoEndTime = false;
      payload.endDate = new Date(
        new Date(payload.endDate).setHours(value.endTime.split(':')[0])
      ).setMinutes(value.endTime.split(':')[1]);
    }

    if (payload.hasPrice) {
      payload.priceFrom = +payload.priceFrom;
      payload.priceTo = +payload.priceTo;
    }

    if (
      payload.ageRestrictionFrom < 18 &&
      payload.ageRestrictionTo < 18 &&
      payload.ageRestrictionTo !== 0
    ) {
      payload.ageRestriction = Age.UNDER_18;
    } else if (
      payload.ageRestrictionFrom === 18 &&
      payload.ageRestrictionTo === 200
    ) {
      payload.ageRestriction = Age.ABOVE_18;
    } else if (
      payload.ageRestrictionFrom < 18 &&
      payload.ageRestrictionTo === 200
    ) {
      payload.ageRestriction = Age.FAMILY;
    } else if (
      payload.ageRestrictionFrom === 0 &&
      payload.ageRestrictionTo === 0
    ) {
      payload.ageRestriction = Age._UNKNOWN;
    }
    return payload;
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
        this.organizationsToShow = res;
      });
  }

  deleteOrg(id: number) {
    this.orgsService
      .deleteOrg(id)
      .pipe(take(1))
      .subscribe((res) => {
        // console.log(res);
        this.getOrganizations();
      });
  }
  deleteEvent(id: number | undefined) {
    this.eventsService
      .deleteEventById(id)
      .pipe(take(1))
      .subscribe((res) => {
        // console.log(res);
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
    console.log(this.selectionData);
    console.log(this.currentSelection);
  }
  removeFile(file: FileData): void {
    // this.fileRemoved.emit(file.name);
    // console.log(file);
    this.selectionData = this.selectionData.filter((existingFile: FileData) => {
      return existingFile.name !== file.name;
    });
    if (this.currentSelection) {
      this.currentSelection = Array.from(this.currentSelection).filter(
        (selectedFile) => {
          return selectedFile.name !== file.name;
        }
      ) as any;
    }
  }

  msToDate(ms: number) {
    return new Date(ms);
  }

  setPrice(event: IEvent): string {
    if (event.isDonation) {
      if (event.priceFrom === 0) {
        return 'Вход свободный (Донат приветствуется)';
      } else {
        return `Вход свободный (Минимальный донат ${event.priceFrom})`;
      }
    } else {
      if (event.hasPrice) {
        if (event.priceTo === 0) {
          return 'Вход свободный';
        } else {
          return `${event.priceFrom} - ${event.priceTo}`;
        }
      } else {
        return 'Цена не указана';
      }
    }
  }
}
