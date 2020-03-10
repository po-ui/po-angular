import { Component, ElementRef, ViewChild } from '@angular/core';

import { PoButtonComponent } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-popover-basic',
  templateUrl: './sample-po-popover-basic.component.html'
})
export class SamplePoPopoverBasicComponent {
  @ViewChild(PoButtonComponent, { read: ElementRef, static: true }) poButton: PoButtonComponent;
}
