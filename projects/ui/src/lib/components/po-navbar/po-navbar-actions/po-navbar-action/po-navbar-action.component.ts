import { Component, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Router } from '@angular/router';

import { isExternalLink, PoUtils } from '../../../../utils/util';

@Component({
  selector: 'po-navbar-action',
  templateUrl: './po-navbar-action.component.html',
  standalone: false
})
export class PoNavbarActionComponent {
  private router = inject(Router);

  @Input('p-action') action?: Function;

  @Input('p-icon') icon: string | TemplateRef<void>;

  @Input('p-label') label: string;

  @Input('p-link') link?: string;

  @Input('p-tooltip-text') tooltip?: string;

  click() {
    if (this?.action) {
      this.action();
      return;
    }

    if (this?.link) {
      return this.openUrl(this.link);
    }
  }

  private openUrl(url: string) {
    if (isExternalLink(url)) {
      return PoUtils.openExternalLink(url);
    }

    if (url) {
      return this.router.navigate([url]);
    }
  }
}
