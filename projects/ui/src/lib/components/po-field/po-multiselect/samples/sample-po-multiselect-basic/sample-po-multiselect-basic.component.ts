import { Component } from '@angular/core';

import { PoMultiselectOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-multiselect-basic',
  templateUrl: './sample-po-multiselect-basic.component.html'
})
export class SamplePoMultiselectBasicComponent {
  options: Array<PoMultiselectOption> = [
    { value: 'portinariMultiselect1', label: 'Portinari Multiselect 1' },
    { value: 'portinariMultiselect2', label: 'Portinari Multiselect 2' }
  ];
}
