import { Component } from '@angular/core';

import { PoComboOption, PoRadioGroupOption, PoTableColumn, PoThemeTokens, PoThemeService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-theme-form',
  templateUrl: './sample-po-theme-form.component.html'
})
export class SamplePoThemeFormComponent {
  address: string;
  addressNumber: number;
  dateOfBirth: Date;
  email: string;
  genre: string;
  heros: Array<any>;
  name: string;
  phone: string;
  website: string;

  readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Name' },
    { property: 'email', label: 'E-mail' },
    {
      property: 'genre',
      label: 'Genre',
      type: 'label',
      labels: [
        { value: '1', color: 'color-02', label: 'Male' },
        { value: '2', color: 'color-05', label: 'Female' },
        { value: '3', color: 'color-10', label: 'Other' }
      ]
    }
  ];

  readonly genreOptions: Array<PoRadioGroupOption> = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
    { label: 'Other', value: '3' }
  ];

  items: Array<any> = [
    { name: 'James', email: 'james@xpto.com', genre: '1' },
    { name: 'Thomas', email: 'thomas@xpto.com', genre: '1' },
    { name: 'Sophia', email: 'sophia@poui.com', genre: '2' },
    { name: 'John', email: 'john@xpto.com', genre: '1' },
    { name: 'Emma', email: 'emma@xisto.com.br', genre: '2' }
  ];

  readonly themeOptions: Array<PoComboOption> = [
    { label: 'Blue', value: 'blue' },
    { label: 'Red', value: 'red' }
  ];

  readonly blueTheme: PoThemeTokens = {
    '--color-brand-01-lightest': '#EBEBF5',
    '--color-brand-01-lighter': '#C2C2E5',
    '--color-brand-01-light': '#9898CD',
    '--color-brand-01-dark': '#1F1F7A',
    '--color-brand-01-darker': '#0D0D59',
    '--color-brand-01-darkest': '#030330',
    '--color-brand-01-base': '#4545A1',
    '--color-brand-02-base': '#4545A1',
    '--color-brand-03-base': '#4545A1',
    '--color-primary-light-80': '#36364A',
    '--color-neutral-light-05': '#F9F9FA',
    '--color-neutral-light-10': '#ECECEE'
  };

  readonly redTheme: PoThemeTokens = {
    '--color-brand-01-lightest': '#f9a8a3',
    '--color-brand-01-lighter': '#ec7674',
    '--color-brand-01-light': '#e55d5d',
    '--color-brand-01-dark': '#8d1212',
    '--color-brand-01-darker': '#780909',
    '--color-brand-01-darkest': '#640000',
    '--color-brand-01-base': '#b52424',
    '--color-brand-02-base': '#b52424',
    '--color-brand-03-base': '#b52424',
    '--color-primary-light-80': '#b52424',
    '--color-neutral-light-05': '#FDE6DC',
    '--color-neutral-light-10': '#FDCCB2'
  };

  constructor(private poTheme: PoThemeService) {}

  onChangeTheme(theme: string): void {
    this.poTheme.setTheme(theme === 'blue' ? this.blueTheme : this.redTheme);
  }

  onClickAdd(): void {
    this.items.push({
      name: this.name,
      email: this.email,
      genre: this.genre
    });

    this.onClickReset();
  }

  onClickReset(): void {
    this.name = '';
    this.dateOfBirth = new Date();
    this.genre = '';
    this.address = '';
    this.addressNumber = 0;
    this.phone = '';
    this.email = '';
    this.website = '';
    this.heros = [];
  }
}
