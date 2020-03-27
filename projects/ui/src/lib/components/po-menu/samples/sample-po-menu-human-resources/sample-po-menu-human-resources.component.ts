import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

import { SamplePoMenuHumanResourcesService } from './sample-po-menu-human-resources.service';

@Component({
  selector: 'sample-po-menu-human-resources',
  templateUrl: './sample-po-menu-human-resources.component.html',
  providers: [SamplePoMenuHumanResourcesService],
  styles: [
    `
      .sample-menu-header-text-color {
        color: #9da7a9;
      }
    `
  ]
})
export class SamplePoMenuHumanResourcesComponent {
  menuItemSelected: string;

  menus: Array<PoMenuItem> = [
    { label: 'Register user', action: this.printMenuAction.bind(this), icon: 'po-icon-user', shortLabel: 'Register' },
    {
      label: 'Timekeeping',
      action: this.printMenuAction.bind(this),
      icon: 'po-icon-clock',
      shortLabel: 'Timekeeping',
      badge: { value: 1 }
    },
    {
      label: 'Useful links',
      icon: 'po-icon-share',
      shortLabel: 'Links',
      subItems: [
        { label: 'Ministry of Labour', action: this.printMenuAction.bind(this), link: 'http://trabalho.gov.br/' },
        { label: 'SindPD Syndicate', action: this.printMenuAction.bind(this), link: 'http://www.sindpd.com.br/' }
      ]
    },
    {
      label: 'Benefits',
      icon: 'po-icon-star',
      shortLabel: 'Benefits',
      subItems: [
        {
          label: 'Meal tickets',
          subItems: [
            { label: 'Acceptance network ', action: this.printMenuAction.bind(this) },
            {
              label: 'Extracts',
              action: this.printMenuAction.bind(this),
              subItems: [
                { label: 'Monthly', action: this.printMenuAction.bind(this), badge: { value: 3, color: 'color-03' } },
                { label: 'Custom', action: this.printMenuAction.bind(this) }
              ]
            }
          ]
        },
        { label: 'Transportation tickets', action: this.printMenuAction.bind(this), badge: { value: 12 } }
      ]
    }
  ];

  constructor(public samplePoMenuHumanResourcesService: SamplePoMenuHumanResourcesService) {}

  printMenuAction(menu: PoMenuItem) {
    this.menuItemSelected = menu.label;
  }
}
