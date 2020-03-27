import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoModalAction, PoModalComponent, PoStepperComponent, PoUploadComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-upload-rs',
  templateUrl: 'sample-po-upload-rs.component.html'
})
export class SamplePoUploadRsComponent implements OnInit {
  confirm: PoModalAction = {
    action: () => {
      this.sucessData.close();
    },
    label: 'Return'
  };

  description: string;
  project: Array<any> = [];
  restrictions = { allowedExtensions: ['.zip', '.7z', '.tar', '.wim'] };
  title: string;

  @ViewChild('upload', { static: true }) upload: PoUploadComponent;
  @ViewChild('stepper', { static: true }) stepper: PoStepperComponent;
  @ViewChild('submitForm', { static: true }) submitForm: NgForm;
  @ViewChild('sucessData', { static: true }) sucessData: PoModalComponent;

  ngOnInit() {
    this.newSubmit();
  }

  canSubmitProject() {
    return !!(this.project && this.project.length) && this.title && this.description;
  }

  confirmSubmit() {
    this.sucessData.open();
    this.newSubmit();
    this.stepper.first();
  }

  submitProject() {
    this.upload.sendFiles();
    this.stepper.next();
  }

  private newSubmit() {
    this.project = [];
    this.title = undefined;
    this.description = undefined;
  }
}
