import { Component, Input, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { callFunction, isExternalLink, openExternalLink } from '../../../../utils/util';

@Component({
  selector: 'po-navbar-action',
  templateUrl: './po-navbar-action.component.html'
})
export class PoNavbarActionComponent {

  private parentRef: any;

  @Input('p-action') action?: Function;

  @Input('p-icon') icon: string;

  @Input('p-label') label: string;

  @Input('p-link') link?: string;

  @Input('p-tooltip-text') tooltip?: string;

  constructor(viewContainerRef: ViewContainerRef, private router: Router) {
    this.parentRef = viewContainerRef['_view']['component'];
  }

  click() {
    if (this.action) {
      callFunction(this.action, this.parentRef || this);
      return;
    }

    if (this.link) {
      return this.openUrl(this.link);
    }
  }

  private openUrl(url: string) {

    if (isExternalLink(url)) {
      return openExternalLink(url);
    }

    if (url) {
      return this.router.navigate([url]);
    }
  }

}
