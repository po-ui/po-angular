import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageAction } from '@po-ui/ng-components';
import { PoTableColumn } from '@po-ui/ng-components';

import { SampleDashboardService } from './sample-po-page-default-dashboard.service';

@Component({
  selector: 'sample-po-page-default-dashboard',
  templateUrl: './sample-po-page-default-dashboard.component.html',
  styles: [
    `
      .sample-widget-text-subtitle {
        font-family: NunitoSans;
        font-size: 14px;
        text-align: center;
        color: #9da7a9;
      }
    `
  ],
  providers: [SampleDashboardService]
})
export class SamplePoPageDefaultDashboardComponent {
  columns: Array<PoTableColumn> = this.sampleDashboardService.getColumns();
  email: string = undefined;
  isSubscribed: boolean = false;
  items: Array<object> = this.sampleDashboardService.getItems();

  public readonly actions: Array<PoPageAction> = [
    { label: 'Share', action: this.modalOpen.bind(this), icon: 'po-icon-share' },
    { label: 'GitHub', url: 'https://github.com/po-ui/po-angular' },
    { label: 'Components', url: '/documentation' },
    { label: 'Disable notification', action: this.disableNotification.bind(this), disabled: () => this.isSubscribed }
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'Dashboard' }]
  };

  public readonly cancelAction: PoModalAction = {
    action: () => {
      this.modalClose();
    },
    label: 'Cancel'
  };

  public readonly shareAction: PoModalAction = {
    action: () => {
      this.share();
    },
    label: 'Share'
  };

  @ViewChild('formShare', { static: true }) formShare: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private poNotification: PoNotificationService, private sampleDashboardService: SampleDashboardService) {}

  modalClose() {
    this.poModal.close();
    this.formShare.reset();
  }

  modalOpen() {
    this.poModal.open();
  }

  share() {
    if (this.formShare.valid) {
      this.poNotification.success(`Webpage shared successfully to: ${this.email}.`);
    } else {
      this.poNotification.error(`Email invalid.`);
    }
    this.modalClose();
  }

  private disableNotification() {
    this.isSubscribed = true;
  }
}
