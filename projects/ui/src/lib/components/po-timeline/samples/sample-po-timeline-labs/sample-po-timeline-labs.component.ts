import { Component } from '@angular/core';
import { PoSelectOption, PoRadioGroupOption, PoTimelineItem, PoTimelineMode } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timeline-labs',
  templateUrl: './sample-po-timeline-labs.component.html'
})
export class SamplePoContainerBasicComponent {
  public newItem: PoTimelineItem = {
    title: 'Title',
    description: 'Description',
    color: 'po-color-primary'
  };

  public items: Array<PoTimelineItem> = [{ ...this.newItem }];

  public mode: PoTimelineMode = PoTimelineMode.Full;

  public clickable: boolean = false;

  public readonly modeOptions: Array<PoRadioGroupOption> = [
    { label: 'Full', value: 'full' },
    { label: 'Compact', value: 'compact' }
  ];

  public readonly colorsOptions: Array<PoSelectOption> = [
    { label: 'Primary', value: 'po-color-primary' },
    { label: 'Secondary', value: 'po-color-secondary' },
    { label: 'Warning', value: 'po-color-warning' },
    { label: 'Danger', value: 'po-color-danger' }
  ];

  public clickedItem: string = '';

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
    this.mode = PoTimelineMode.Full;
    this.clickable = false;
    this.clickedItem = '';
  }

  public clickEvent(poTimelineItem: PoTimelineItem) {
    this.clickedItem = JSON.stringify(poTimelineItem);
  }
}
