import { Component } from '@angular/core';

import { PoListViewFieldProperties } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-list-view-field-properties',
  templateUrl: './sample-po-list-view-field-properties.component.html',
  standalone: false
})
export class SamplePoListViewFieldPropertiesComponent {
  fieldProperties: PoListViewFieldProperties = {
    title: 'name',
    subtitle: 'subtitle',
    avatar: 'avatar',
    tag: { value: 'tag', type: 'tagType' }
  };

  items = [
    {
      name: 'Billing report',
      subtitle: '5 min ago',
      tag: 'Completed',
      tagType: 'success',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Vacation request',
      subtitle: '12 min ago',
      tag: 'In progress',
      tagType: 'info',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'System update',
      subtitle: '30 min ago',
      tag: 'Warning',
      tagType: 'warning',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];
}
