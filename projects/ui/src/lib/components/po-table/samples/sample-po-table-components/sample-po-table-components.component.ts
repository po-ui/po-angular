import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoModalComponent, PoTableColumn } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-table-components',
  templateUrl: './sample-po-table-components.component.html',
})
export class SamplePoTableComponentsComponent {

  extraInformation: any;
  title: any;

  public readonly columns: Array<PoTableColumn> = [
    { property: 'status', type: 'label', width: '5%', labels: [
      { value: 'stable', color: 'color-11', label: 'Stable', tooltip: 'Published component' },
      { value: 'experimental', color: 'color-08', label: 'Experimental', tooltip: 'Component in homologation' },
      { value: 'roadmap', color: 'color-07', label: 'Roadmap', tooltip: 'Component in roadmap' }
    ]},
    { property: 'component', type: 'link' },
    { property: 'description', color: this.experimentalColor },
    { property: 'extra', label: 'Extras', type: 'link', tooltip: 'Additional details', action: (value, row) => {
      this.extras(value, row);
    },
      disabled: this.canShowExtras.bind(this) },
    { property: 'favorite', label: 'Actions', type: 'icon', icons: [
      {
        action: this.favorite.bind(this),
        color: this.isFavorite.bind(this),
        icon: 'po-icon-star',
        value: 'favorite'
      },
      {
        action: this.goToDocumentation.bind(this),
        disabled: this.canGoToDocumentation.bind(this),
        icon: 'po-icon-export',
        tooltip: 'Click to go to documentation',
        value: 'documentation'
      }
    ]}
  ];

  public readonly items: Array<any> = [
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Checkbox',
      description: 'Group of square buttons that allows multiple items to be selected',
      link: '/documentation/po-checkbox-group',
      extra: 'Best Practices',
      extras: [ 'Short and objective texts for items', 'Use with short lists', 'For big lists use Portinari Multiselect' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Combo',
      description: 'Display a list of items with filter and allows selection',
      link: '/documentation/po-combo',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Select',
      description: 'Display a list of items and allows selection',
      link: '/documentation/po-select',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari MultiSelect',
      description: 'Display a list of items and allows multiple selection',
      link: '/documentation/po-multiselect',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Input',
      description: 'Input for general texts',
      link: '/documentation/po-input',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Textarea',
      description: 'Larger input for big texts',
      link: '/documentation/po-textarea' ,
      extra: 'Best Practices',
      extras: [ 'Recommended to large texts like observations and details', 'For short texts use po-input' ],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Number',
      description: 'Input that allows only numbers',
      link: '/documentation/po-number',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Datepicker',
      description: 'Input with calendar for dates',
      link: '/documentation/po-datepicker',
      extra: 'Features',
      extras: [ 'Multiple idioms ( pt, es , en)', 'Custom date formats', 'Period validation (start date and end date)' ],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Email',
      description: 'Input that allows valid email texts (username@email.com)',
      link: '/documentation/po-email',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Url',
      description: 'Input that expects a valid url as text (http://www.url.com)',
      link: '/documentation/po-url',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Password',
      description: 'Input with bullet text to type passwords',
      link: '/documentation/po-password',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Login',
      description: 'Input with a user icon that represents a login field',
      link: '/documentation/po-login',
      extra: 'Features',
      extras: [ 'Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys' ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Upload',
      description: 'Upload file(s) with a loading bar',
      link: '/documentation/po-upload',
      extra: 'Features',
      extras: [ 'Multiple file selection', 'Automatic upload after click', 'File format and size restriction' ],
      status: 'experimental'
    }
  ];

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private router: Router) { }

  experimentalColor(row) {
    return row.status === 'experimental' ? 'color-08' : 'color-11';
  }

  extras(value, row) {
    this.title = value;
    this.extraInformation = row;

    this.poModal.open();
  }

  goToDocumentation(row) {
    this.router.navigate([row.link]);
  }

  private canGoToDocumentation(row) {
    return row.status !== 'stable';
  }

  private canShowExtras(row: any) {
    if (row.status) {
      return row.status !== 'stable';
    }
  }

  private favorite(row) {
    row.isFavorite = !row.isFavorite;
  }

  private isFavorite(row) {
    return row.isFavorite ? 'color-08' : 'color-11';
  }

}
