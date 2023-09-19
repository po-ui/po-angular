import { Component, ElementRef, ViewChild } from '@angular/core';
import { PoButtonComponent, PoButtonGroupItem, PoMenuItem, PoMultiselectOption } from '../../../ui/src/lib';
import { SamplePoMenuHumanResourcesService } from './sample-po-menu-human-resources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(PoButtonComponent, { read: ElementRef, static: true }) botaopop: PoButtonComponent;
  @ViewChild('buttonClick', { read: ElementRef, static: true }) buttonClickRef: ElementRef;
  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;
  @ViewChild('targetdois', { read: ElementRef, static: true }) targetRefDois: ElementRef;

  menuItemSelected: string;
  tokenValores: string[] = [
    'NunitoSans, sans-serif',
    'NunitoSans-Bold, sans-serif',
    'NunitoSans-ExtraLight, sans-serif',
    '#B4E2FD',
    '#69C5FC',
    '#12A2F7',
    '#045B8F',
    '#013F65',
    '#002944',
    '#00182B',
    '#045B8F',
    '#29b6c5',
    '#4D4D4D',
    '#363636',
    '#1A1A1A',
    '#0D0D0D',
    '#FFFFFF',
    '#F2F2F2',
    '#E5E5E5',
    '#CCCCCC',
    '#B2B2B2',
    '#999999',
    '#666666'
  ];

  tokenList: string[] = [
    '--font-family-theme',
    '--font-family-theme-bold',
    '--font-family-theme-extra-light',
    '--color-brand-01-lightest',
    '--color-brand-01-lighter',
    '--color-brand-01-light',
    '--color-brand-01-base',
    '--color-brand-01-dark',
    '--color-brand-01-darker',
    '--color-brand-01-darkest',
    '--color-brand-02-base',
    '--color-brand-03-base',
    '--color-neutral-dark-70',
    '--color-neutral-dark-80',
    '--color-neutral-dark-90',
    '--color-neutral-dark-95',
    '--color-neutral-light-00',
    '--color-neutral-light-05',
    '--color-neutral-light-10',
    '--color-neutral-light-20',
    '--color-neutral-light-30',
    '--color-neutral-mid-40',
    '--color-neutral-mid-60'
  ];

  modelCheckbox = ['1'];
  modelRadio = '1';
  modelSwitch = true;
  modelMulti = ['poMultiselect1'];

  buttons: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action.bind(this) },
    { label: 'Button 2', action: this.action.bind(this) }
  ];
  buttons2: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action.bind(this), selected: true },
    { label: 'Button 2', action: this.action.bind(this) }
  ];

  optionsMultiselect: Array<PoMultiselectOption> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' }
  ];

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

  action(button) {}

  isValidHexColor(hexColor: string): boolean {
    // Regular expression to match valid hexadecimal colors
    const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return hexColorRegex.test(hexColor);
  }
}
