import { Component } from '@angular/core';

import { PoMenuItem } from '@portinari/portinari-ui';

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
    { label: 'Register user', action: this.printMenuAction, icon: 'po-icon-user', shortLabel: 'Register' },
    {
      label: 'Timekeeping',
      action: this.printMenuAction,
      icon: 'po-icon-clock',
      shortLabel: 'Timekeeping',
      badge: { value: 1 }
    },
    {
      label: 'Useful links',
      icon: 'po-icon-share',
      shortLabel: 'Links',
      subItems: [
        { label: 'Ministry of Labour', action: this.printMenuAction, link: 'http://trabalho.gov.br/' },
        { label: 'SindPD Syndicate', action: this.printMenuAction, link: 'http://www.sindpd.com.br/' }
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
            { label: 'Acceptance network ', action: this.printMenuAction },
            {
              label: 'Extracts',
              action: this.printMenuAction,
              subItems: [
                { label: 'Monthly', action: this.printMenuAction, badge: { value: 3, color: 'color-03' } },
                { label: 'Custom', action: this.printMenuAction }
              ]
            }
          ]
        },
        { label: 'Transportation tickets', action: this.printMenuAction, badge: { value: 12 } }
      ]
    }
  ];

  constructor(public samplePoMenuHumanResourcesService: SamplePoMenuHumanResourcesService) {}

  printMenuAction(menu: PoMenuItem) {
    this.menuItemSelected = menu.label;
  }
}
