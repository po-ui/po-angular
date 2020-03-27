import { Component, ElementRef, ViewChild } from '@angular/core';

import { PoButtonComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-popover-basic',
  templateUrl: './sample-po-popover-basic.component.html'
})
export class SamplePoPopoverBasicComponent {
  @ViewChild(PoButtonComponent, { read: ElementRef, static: true }) poButton: PoButtonComponent;
}
