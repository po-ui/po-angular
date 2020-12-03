import { Component } from '@angular/core';
import { PoTimelineItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timeline-basic',
  templateUrl: './sample-po-timeline-basic.component.html'
})
export class SamplePoContainerBasicComponent {
  public readonly items: Array<PoTimelineItem> = [
    {
      title: 'Title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      color: 'po-color-primary'
    },
    {
      title: 'Title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      color: 'po-color-secondary'
    }
  ];
}
