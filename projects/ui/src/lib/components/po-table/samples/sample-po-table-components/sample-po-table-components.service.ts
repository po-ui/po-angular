import { Injectable } from '@angular/core';

import { PoTableColumnSort, PoTableColumnSortType } from '@portinari/portinari-ui';

@Injectable()
export class SamplePoTableComponentsService {
  readonly items = [
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Select',
      description: 'Display a list of items and allows selection',
      link: '/documentation/po-select',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Checkbox',
      description: 'Group of square buttons that allows multiple items to be selected',
      link: '/documentation/po-checkbox-group',
      extra: 'Best Practices',
      extras: [
        'Short and objective texts for items',
        'Use with short lists',
        'For big lists use Portinari Multiselect'
      ],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Number',
      description: 'Input that allows only numbers',
      link: '/documentation/po-number',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Combo',
      description: 'Display a list of items with filter and allows selection',
      link: '/documentation/po-combo',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari MultiSelect',
      description: 'Display a list of items and allows multiple selection',
      link: '/documentation/po-multiselect',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Input',
      description: 'Input for general texts',
      link: '/documentation/po-input',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Textarea',
      description: 'Larger input for big texts',
      link: '/documentation/po-textarea',
      extra: 'Best Practices',
      extras: ['Recommended to large texts like observations and details', 'For short texts use po-input'],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Datepicker',
      description: 'Input with calendar for dates',
      link: '/documentation/po-datepicker',
      extra: 'Features',
      extras: ['Multiple idioms ( pt, es , en)', 'Custom date formats', 'Period validation (start date and end date)'],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Email',
      description: 'Input that allows valid email texts (username@email.com)',
      link: '/documentation/po-email',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Url',
      description: 'Input that expects a valid url as text (http://www.url.com)',
      link: '/documentation/po-url',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Password',
      description: 'Input with bullet text to type passwords',
      link: '/documentation/po-password',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Login',
      description: 'Input with a user icon that represents a login field',
      link: '/documentation/po-login',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 'stable'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Upload',
      description: 'Upload file(s) with a loading bar',
      link: '/documentation/po-upload',
      extra: 'Features',
      extras: ['Multiple file selection', 'Automatic upload after click', 'File format and size restriction'],
      status: 'experimental'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'Portinari Avatar',
      description: 'Creates a circle with a picture inside',
      link: '/documentation/po-avatar',
      extra: 'Features',
      extras: ['Multiple sizes', 'Default image'],
      status: 'stable'
    }
  ];

  getItems(sort?: PoTableColumnSort, loadAll: boolean = false): Array<any> {
    const result = [...this.items];

    if (sort && sort.column) {
      result.sort((value, valueToCompare) => this.sort(value, valueToCompare, sort));
    }

    if (!loadAll) {
      result.length = 10;
    }

    return result;
  }

  private sort(value: any, valueToCompare: any, sort: PoTableColumnSort) {
    const property = sort.column.property;
    const type = sort.type;

    if (value[property] < valueToCompare[property]) {
      return type === PoTableColumnSortType.Ascending ? -1 : 1;
    }

    if (value[property] > valueToCompare[property]) {
      return type === PoTableColumnSortType.Ascending ? 1 : -1;
    }

    return 0;
  }
}
