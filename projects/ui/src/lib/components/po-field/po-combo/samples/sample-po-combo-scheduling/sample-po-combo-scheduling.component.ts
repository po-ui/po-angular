import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoComboOption, PoSelectOption } from '@portinari/portinari-ui';

import { PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-combo-scheduling',
  templateUrl: './sample-po-combo-scheduling.component.html'
})
export class SamplePoComboSchedulingComponent implements OnInit {

  birthday: string;
  email: string;
  especialities: Array<PoComboOption>;
  especiality: string;
  informations: string;
  name: string;
  phone: string;
  typeScheduling: string;

  readonly typeSchedulings: Array<PoSelectOption> = [
    { label: 'Particular', value: 'particular' },
    { label: 'Health Insurance', value: 'healthInsurance' },
  ];

  @ViewChild('schedulingForm', { static: true }) form: NgForm;

  constructor(private poNotification: PoNotificationService) { }

  ngOnInit() {
    this.especialities = this.getEspecialities();
  }

  confirmPreAppointment(name: string = '') {
    this.poNotification.success(`Great ${name}, your pre-appointment was successfully received!`);

    this.form.reset();
  }

  private getEspecialities() {
    return [
      { label: 'Allergist', value: 'allergist' },
      { label: 'Cardiologist', value: 'cardiologist' },
      { label: 'General practitioner', value: 'generalPractitioner' },
      { label: 'Dermatologist', value: 'dermatologist' },
      { label: 'Gynecologist', value: 'gynecologist' },
      { label: 'Nutritionist', value: 'nutritionist' },
      { label: 'Pediatrist', value: 'pediatrist' },
      { label: 'Psychiatrist', value: 'psychiatrist' },
      { label: 'Orthopaedist', value: 'orthopaedist' }
    ];
  }

}
