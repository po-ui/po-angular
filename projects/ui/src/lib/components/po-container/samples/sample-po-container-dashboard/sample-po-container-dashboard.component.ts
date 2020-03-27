import { AfterContentChecked, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SampleDashboardService } from './sample-po-container-dashboard.service';

import {
  PoBreadcrumb,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoTableColumn
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-container-dashboard',
  templateUrl: './sample-po-container-dashboard.component.html',
  styles: [
    `
      .sample-container-dashboard {
        color: #9da7a9;
        font-family: NunitoSans;
        font-size: 14px;
      }
    `
  ],
  providers: [SampleDashboardService]
})
export class SamplePoContainerDashboardComponent implements AfterContentChecked {
  columns: Array<PoTableColumn> = this.sampleDashboardService.getColumns();
  email: string = undefined;
  isSubscribed: boolean = false;
  items: Array<object> = this.sampleDashboardService.getItems();

  public readonly actions: Array<PoPageAction> = [
    { label: 'Share', action: this.modalOpen.bind(this), icon: 'po-icon-share' },
    {
      label: 'Disable notification',
      icon: 'po-icon-notification',
      action: this.disableNotification.bind(this),
      disabled: () => this.isSubscribed
    }
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
  @ViewChild(PoModalComponent) poModal: PoModalComponent;

  constructor(private poNotification: PoNotificationService, private sampleDashboardService: SampleDashboardService) {}

  ngAfterContentChecked() {
    this.shareAction.danger = this.formShare.invalid;
  }

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
      this.poNotification.error(`Invalid email.`);
    }
    this.modalClose();
  }

  private disableNotification() {
    this.isSubscribed = true;
  }
}
