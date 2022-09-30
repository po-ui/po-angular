import { Component, OnInit } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-link-heroes',
  templateUrl: './sample-po-link-heroes.component.html'
})
export class SamplePoLinkHeroesComponent {
  columns: Array<PoTableColumn> = [
    { property: 'nickname', type: 'columnTemplate' },
    { property: 'name' },
    { property: 'email' }
  ];
}
