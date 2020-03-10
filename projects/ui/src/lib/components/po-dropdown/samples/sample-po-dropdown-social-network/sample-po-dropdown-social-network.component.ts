import { Component, OnInit } from '@angular/core';

import { PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-dropdown-social-network',
  templateUrl: './sample-po-dropdown-social-network.component.html'
})
export class SamplePoDropdownSocialNetworkComponent implements OnInit {
  currentFriend: object;
  userAvatar: string = 'https://lorempixel.com/144/144/';

  public readonly answers: Array<object> = [
    { label: 'Confirm', action: this.notification.bind(this, 'added', 'success') },
    { label: 'Ignore', action: this.notification.bind(this, 'ignored', 'warning') },
    { label: 'Block', action: this.notification.bind(this, 'blocked', 'information') }
  ];

  public readonly newFriends: Array<object> = [
    { name: 'Mr. Dev Portinari', mutualFriends: '7', reside: 'Mountain View, CA' },
    { name: 'Mr. AI Portinari', mutualFriends: '99+', reside: 'New York City, NY' },
    { name: 'Mr. UX Portinari', mutualFriends: '14', reside: 'Los Angeles, CA' }
  ];

  private indexFriend: number = 0;

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.setCurrentFriend(0);
  }

  private notification(action: string, notificationType: string) {
    this.poNotification[notificationType](`User ${action} successfully!`);

    this.indexFriend++;
    this.setCurrentFriend(this.indexFriend);
  }

  private setCurrentFriend(index: number) {
    this.currentFriend = this.newFriends[index];
  }
}
