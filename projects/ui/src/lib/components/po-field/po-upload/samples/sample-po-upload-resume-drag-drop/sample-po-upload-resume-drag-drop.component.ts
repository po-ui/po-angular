import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-upload-resume-drag-drop',
  templateUrl: 'sample-po-upload-resume-drag-drop.component.html'
})
export class SamplePoUploadResumeDragDropComponent implements OnInit {
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
