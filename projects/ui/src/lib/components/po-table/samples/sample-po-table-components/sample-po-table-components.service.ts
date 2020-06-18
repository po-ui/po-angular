import { Injectable } from '@angular/core';

import { PoTableColumnSort, PoTableColumnSortType } from '@po-ui/ng-components';

@Injectable()
export class SamplePoTableComponentsService {
  readonly items = [
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Select',
      description: 'Display a list of items and allows selection',
      link: '/documentation/po-select',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Checkbox',
      description: 'Group of square buttons that allows multiple items to be selected',
      link: '/documentation/po-checkbox-group',
      extra: 'Best Practices',
      extras: ['Short and objective texts for items', 'Use with short lists', 'For big lists use PO Multiselect'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Page Login',
      description: 'Template for authentication',
      link: '/documentation/po-page-login',
      extra: 'Features',
      extras: [],
      status: 0,
      type: 'template'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Number',
      description: 'Input that allows only numbers',
      link: '/documentation/po-number',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 1,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Page Dynamic Table',
      description: 'Template for list resources with a table',
      link: '/documentation/po-page-dynamic-table',
      extra: 'Features',
      extras: ['6 defaults actions', 'Use Metadata to build your page', 'No code', 'Customization'],
      status: 0,
      type: 'template'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Combo',
      description: 'Display a list of items with filter and allows selection',
      link: '/documentation/po-combo',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Notification',
      description: 'Show notification easily and quickly',
      link: '/documentation/po-notification',
      extra: 'Features',
      extras: ['4 types of notifications', 'Define time for your notifications', 'Use actions in your notification'],
      status: 0,
      type: 'service'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Multiselect',
      description: 'Display a list of items and allows multiple selection',
      link: '/documentation/po-multiselect',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 1,
      type: 'component'
    },
    {
      favorite: [],
      component: 'PO Grid',
      description: 'Create a grid for edition',
      link: '/documentation/po-grid',
      extra: 'Features',
      extras: [],
      status: 2,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Input',
      description: 'Input for general texts',
      link: '/documentation/po-input',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Textarea',
      description: 'Larger input for big texts',
      link: '/documentation/po-textarea',
      extra: 'Best Practices',
      extras: ['Recommended to large texts like observations and details', 'For short texts use po-input'],
      status: 1,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Datepicker',
      description: 'Input with calendar for dates',
      link: '/documentation/po-datepicker',
      extra: 'Features',
      extras: ['Multiple idioms ( pt, es , en)', 'Custom date formats', 'Period validation (start date and end date)'],
      status: 1,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Email',
      description: 'Input that allows valid email texts (username@email.com)',
      link: '/documentation/po-email',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Url',
      description: 'Input that expects a valid url as text (http://www.url.com)',
      link: '/documentation/po-url',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Password',
      description: 'Input with bullet text to type passwords',
      link: '/documentation/po-password',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Login',
      description: 'Input with a user icon that represents a login field',
      link: '/documentation/po-login',
      extra: 'Features',
      extras: ['Filter options (starts, contains, ends)', 'Custom services', 'Navigation by keys'],
      status: 0,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Upload',
      description: 'Upload file(s) with a loading bar',
      link: '/documentation/po-upload',
      extra: 'Features',
      extras: ['Multiple file selection', 'Automatic upload after click', 'File format and size restriction'],
      status: 1,
      type: 'component'
    },
    {
      favorite: ['favorite', 'documentation'],
      component: 'PO Avatar',
      description: 'Creates a circle with a picture inside',
      link: '/documentation/po-avatar',
      extra: 'Features',
      extras: ['Multiple sizes', 'Default image'],
      status: 0,
      type: 'component'
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
