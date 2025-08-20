import { Component } from '@angular/core';

import { PoHelperOptions } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-helper-labs',
  templateUrl: './sample-po-helper-labs.component.html',
  standalone: false
})
export class SamplePoHelperLabsComponent {
  helperSize: 'medium';

  helperOptions: PoHelperOptions = {
    title: '',
    content: '',
    type: 'help'
  };

  footerTitle: string = '';

  footerAction() {
    alert(`Footer action clicked`);
  }

  setFooterTitle(title: string) {
    if (title.length === 0) {
      this.footerTitle = '';
      delete this.helperOptions.footerAction;
    } else {
      this.helperOptions.footerAction = {
        label: this.footerTitle,
        action: this.footerAction.bind(this)
      };
    }
  }

  reset() {
    this.helperOptions = {
      title: '',
      content: '',
      type: 'help'
    };
    this.helperSize = 'medium';
    this.footerTitle = '';
  }
}
