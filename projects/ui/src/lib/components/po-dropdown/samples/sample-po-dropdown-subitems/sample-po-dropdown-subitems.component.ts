import { Component } from '@angular/core';
import { PoDropdownAction } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-dropdown-subitems',
  templateUrl: './sample-po-dropdown-subitems.component.html',
  standalone: false
})
export class SamplePoDropdownSubitemsComponent {
  actions: Array<PoDropdownAction> = [
    { label: 'New Sale', action: () => console.log('New Sale') },
    { label: 'New Cancellation', action: () => console.log('New Cancellation'), type: 'danger' },
    {
      label: 'Reports',
      subItems: [
        { label: 'Monthly Sales', action: () => console.log('Monthly Sales'), icon: 'an an-chart-line-up' },
        { label: 'Annual Sales', action: () => console.log('Annual Sales'), icon: 'an an-chart-line-up' }
      ]
    },
    {
      label: 'Settings',
      subItems: [
        { label: 'Users', action: () => console.log('Users') },
        {
          label: 'System',
          subItems: [
            { label: 'Backup', action: () => console.log('Backup') },
            { label: 'Logs', action: () => console.log('Logs') }
          ]
        }
      ]
    }
  ];
}
