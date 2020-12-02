import { Component } from '@angular/core';
import { PoSelectOption, PoRadioGroupOption, PoTimelineItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timeline-labs',
  templateUrl: './sample-po-timeline-labs.component.html'
})
export class SamplePoContainerBasicComponent {
  public items: PoTimelineItem[] = [];

  public mode: string = 'full';

  public newItem: PoTimelineItem = {
    title: 'Title',
    description: 'Description',
    color: 'po-color-primary'
  };

  public readonly modeOptions: Array<PoRadioGroupOption> = [
    { label: 'Full', value: 'full' },
    { label: 'Compact', value: 'compact' }
  ];

  public readonly colorsOptions: Array<PoSelectOption> = [
    [
      { label: 'Primary', value: 'po-color-primary' },
      { label: 'Secondary', value: 'po-color-secondary' },
      { label: 'Warning', value: 'po-color-warning' },
      { label: 'Danger', value: 'po-color-danger' }
    ]
  ];

  public addItem() {
    this.items.push({ ...this.newItem });
    this.resetNewItem();
  }

  public resetNewItem() {
    this.newItem = {
      title: 'Title',
      description: 'Description',
      color: 'po-color-primary'
    };
  }

  public restore() {
    this.resetNewItem();
    this.items = [{ ...this.newItem }];
    this.mode = 'full';
  }
}
