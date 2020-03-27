import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoComboOption, PoComboOptionGroup, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { SamplePoComboSchedulingService } from './sample-po-combo-scheduling.service';

@Component({
  selector: 'sample-po-combo-scheduling',
  templateUrl: './sample-po-combo-scheduling.component.html',
  providers: [SamplePoComboSchedulingService]
})
export class SamplePoComboSchedulingComponent implements OnInit {
  birthday: string;
  citiesOptions: Array<PoComboOptionGroup>;
  city: string;
  email: string;
  informations: string;
  medicalSpecialty: string;
  medicalSpecialtyOptions: Array<PoComboOption>;
  name: string;
  phone: string;
  typeScheduling: string;

  readonly typeSchedulings: Array<PoSelectOption> = [
    { label: 'Particular', value: 'particular' },
    { label: 'Health Insurance', value: 'healthInsurance' }
  ];

  @ViewChild('schedulingForm', { static: true }) form: NgForm;

  constructor(
    private poNotification: PoNotificationService,
    private schedulingService: SamplePoComboSchedulingService
  ) {}

  ngOnInit() {
    this.citiesOptions = this.schedulingService.getcities();
    this.medicalSpecialtyOptions = this.schedulingService.getMedicalSpecialty();
  }

  confirmPreAppointment(name: string = '') {
    this.poNotification.success(`Great ${name}, your pre-appointment was successfully received!`);

    this.form.reset();
  }

  getStateByLabel(state: string) {
    const stateByLabel = {
      ['São Paulo']: 'sp',
      ['Santa Catarina']: 'sc',
      ['Paraná']: 'pr'
    };

    return `https://thf.totvs.com.br/sample/api/static/assets/${stateByLabel[state]}.png`;
  }
}
