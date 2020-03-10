import { Component } from '@angular/core';

import { PoDialogService, PoNotificationService, PoToolbarAction, PoToolbarProfile } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-toolbar-logged',
  templateUrl: './sample-po-toolbar-logged.component.html',
  providers: [PoNotificationService]
})
export class SamplePoToolbarLoggedComponent {
  notificationActions: Array<PoToolbarAction> = [
    {
      icon: 'po-icon-portinari',
      label: 'PO news, stay tuned!',
      type: 'danger',
      action: item => this.onClickNotification(item)
    },
    { icon: 'po-icon-message', label: 'New message', type: 'danger', action: item => this.openDialog(item) }
  ];

  profile: PoToolbarProfile = {
    avatar: 'https://via.placeholder.com/48x48?text=AVATAR',
    subtitle: 'dev@portinari.com.br',
    title: 'Mr. Dev Portinari'
  };

  profileActions: Array<PoToolbarAction> = [
    { icon: 'po-icon-user', label: 'User data', action: item => this.showAction(item) },
    { icon: 'po-icon-company', label: 'Company data', action: item => this.showAction(item) },
    { icon: 'po-icon-settings', label: 'Settings', action: item => this.showAction(item) },
    { icon: 'po-icon-exit', label: 'Exit', type: 'danger', separator: true, action: item => this.showAction(item) }
  ];

  actions: Array<PoToolbarAction> = [
    { label: 'Start cash register', action: item => this.showAction(item) },
    { label: 'Finalize cash register', action: item => this.showAction(item) },
    { label: 'Cash register options', action: item => this.showAction(item) }
  ];

  title: string = 'Portinari Toolbar Logged';

  constructor(private poDialog: PoDialogService, private poNotification: PoNotificationService) {}

  getNotificationNumber() {
    return this.notificationActions.filter(not => not.type === 'danger').length;
  }

  onClickNotification(item: PoToolbarAction) {
    window.open('https://github.com/portinariui/portinari-angular/blob/master/CHANGELOG.md', '_blank');

    item.type = 'default';
  }

  openDialog(item: PoToolbarAction) {
    this.poDialog.alert({
      title: 'Welcome',
      message: `Hello Mr. Dev! Congratulations, you are a TOTVER!`,
      ok: undefined
    });

    item.type = 'default';
  }

  showAction(item: PoToolbarAction): void {
    this.poNotification.success(`Action clicked: ${item.label}`);
  }
}
