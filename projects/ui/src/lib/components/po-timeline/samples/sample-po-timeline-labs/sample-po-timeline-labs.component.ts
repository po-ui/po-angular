import { Component, OnInit } from '@angular/core';
import { TimeLineCard } from '../../models/timeline-card.model';

import { PoCheckboxGroupOption, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-timeline-lab',
  templateUrl: './sample-po-timeline.component.html'
})
export class SamplePoTimelineLabsComponent implements OnInit {

  size: string;
  clickable: boolean;
  col: string = '12';

  timelineList: Array<TimeLineCard> = [
    {
      title: 'First',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'left',
      icon: 'po-icon po-icon-bar-code',
      color: 'po-color-secondary'
    },
    {
      title: 'Second',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'right',
      icon: 'po-icon po-icon-book',
      color: 'po-color-primary'
    },
    {
      title: 'Third',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'left',
      icon: 'po-icon po-icon-camera',
      color: 'po-color-warning'
    },
    {
      title: 'Fourth',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.',
      side: 'right',
      icon: 'po-icon po-icon-cart',
      color: 'po-color-success'
    }
  ];

  sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'SM', value: 'sm' },
    { label: 'MD', value: 'md' },
    { label: 'LG', value: 'lg' }
  ];

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'true', label: 'Clickable' }
  ];

  constructor() { }

  ngOnInit() {
    this.restore();
  }

  onClickCard(event: TimeLineCard) {
    alert(JSON.stringify(event));
  }

  restore() {
    this.size = undefined;
    this.col = '12';
    this.clickable = false;
  }
}
