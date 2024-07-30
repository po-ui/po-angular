import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { PoDynamicFormField, PoStepperItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-stepper-labs',
  templateUrl: './sample-po-stepper-labs.component.html'
})
export class SamplePoStepperLabsComponent implements OnInit {
  event: any;
  properties: any = {};
  stepItem: PoStepperItem = <any>{};
  steps: Array<PoStepperItem> = [];

  readonly propertiesFields: Array<PoDynamicFormField> = [
    {
      divider: 'Properties',
      property: 'stepSize',
      label: 'Step Size',
      type: 'number',
      maxValue: 64,
      minValue: 24,
      gridLgColumns: 2
    },
    {
      property: 'orientation',
      options: [
        { value: 'vertical', label: 'Vertical', checked: true },
        { value: 'horizontal', label: 'Horizontal' }
      ],
      gridLgColumns: 4
    },
    {
      label: 'Step icons',
      gridLgColumns: 4,
      property: 'stepIcons',
      type: 'boolean'
    },
    {
      label: 'Step Icon Active Custom',
      help: 'Ex.: po-icon po-icon-light',
      gridLgColumns: 4,
      property: 'iconActive'
    },
    {
      label: 'Step Icon Done Custom',
      help: 'Ex.: po-icon po-icon-arrow-right',
      gridLgColumns: 4,
      property: 'iconDone'
    }
  ];

  readonly stepItemFields: Array<PoDynamicFormField> = [
    {
      divider: 'Step form',
      property: 'label',
      label: 'Step Label',
      gridMdColumns: 6,
      gridXlColumns: 6
    },
    {
      property: 'iconDefault',
      label: 'Step Icon Default Custom',
      help: 'Ex.: po-icon po-icon-help',
      gridMdColumns: 6,
      gridXlColumns: 6
    }
  ];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.restore();
  }

  addItem(stepItem: PoStepperItem) {
    this.steps = [...this.steps, { ...stepItem }];
    this.stepItem = {};
    this.changeDetector.detectChanges();
  }

  changeStep(event) {
    this.event = event;

    this.changeDetector.detectChanges();
  }

  restore() {
    this.properties = {};
    this.steps = [];
    this.event = undefined;
    this.properties.orientation = 'horizontal';
  }
}
