import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-upload-resume',
  templateUrl: 'sample-po-upload-resume.component.html'
})
export class SamplePoUploadResumeComponent implements OnInit {
  biograph: string;
  linkedin: string;
  name: string;
  resume: string;
  uploadedResume: boolean;

  @ViewChild('formOpportunity', { static: true }) formOpportunity: FormControl;

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.uploadedResume = false;
  }

  apply() {
    this.formOpportunity.reset();
    this.uploadedResume = false;

    this.poNotification.success('You were applied successfully');
  }

  resumeUploadError() {
    this.uploadedResume = false;
  }

  resumeUploadSuccess() {
    this.uploadedResume = true;
  }
}
