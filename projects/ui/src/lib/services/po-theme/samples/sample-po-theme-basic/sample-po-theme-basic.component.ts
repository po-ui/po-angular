import { Component } from '@angular/core';

import { PoThemeService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-theme-basic',
  templateUrl: './sample-po-theme-basic.component.html'
})
export class SamplePoThemeBasicComponent {
  constructor(public poTheme: PoThemeService) {}
}
