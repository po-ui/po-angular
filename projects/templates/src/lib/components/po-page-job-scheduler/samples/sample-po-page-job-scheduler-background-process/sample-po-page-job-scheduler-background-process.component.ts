import { Component } from '@angular/core';

import { PoBreadcrumb } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-page-job-scheduler-background-process',
  templateUrl: './sample-po-page-job-scheduler-background-process.component.html'
})
export class SamplePoPageJobSchedulerBackgroundProcessComponent {
  breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'Pipelines', link: '/' }, { label: 'Background Process Scheduler' }]
  };
}
