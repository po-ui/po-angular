import { Component, ViewChild } from '@angular/core';

import { PoTableColumn, PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-link-heroes',
  templateUrl: './sample-po-link-heroes.component.html'
})
export class SamplePoLinkHeroesComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  heroSelected = '';

  protected columns: Array<PoTableColumn> = [
    { property: 'nickname', type: 'columnTemplate' },
    { property: 'name' },
    { property: 'email' }
  ];

  selectedMyHero(heroName: string) {
    this.heroSelected = heroName;
    this.poModal.open();
  }
}
