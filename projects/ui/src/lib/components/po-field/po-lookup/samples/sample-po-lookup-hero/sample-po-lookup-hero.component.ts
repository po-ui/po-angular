import { Component } from '@angular/core';

import { PoLookupColumn, PoSelectOption } from '@portinari/portinari-ui';

import { PoNotificationService } from '@portinari/portinari-ui';

import { SamplePoLookupService } from '../sample-po-lookup.service';

@Component({
  selector: 'sample-po-lookup-hero',
  templateUrl: './sample-po-lookup-hero.component.html',
  providers: [SamplePoLookupService]
})
export class SamplePoLookupHeroComponent {
  hero: string;
  vehicle: string;

  public readonly columns: Array<PoLookupColumn> = [
    { property: 'nickname', label: 'Hero' },
    { property: 'name', label: 'Name' }
  ];

  public readonly vehicles: Array<PoSelectOption> = [
    { label: 'Airplane', value: 'airplane' },
    { label: 'Boat', value: 'boat' },
    { label: 'Car', value: 'car' },
    { label: 'Helicopter', value: 'helicopter' },
    { label: 'Motorcycle', value: 'motorcycle' },
    { label: 'Rocket', value: 'rocket' },
    { label: 'Spaceship', value: 'spaceship' },
    { label: 'Submarine', value: 'submarine' },
    { label: 'Truck', value: 'truck' }
  ];

  constructor(public service: SamplePoLookupService, public notification: PoNotificationService) {}

  fieldFormat(value) {
    return `${value.nickname} - ${value.label}`;
  }

  startMission() {
    if (this.hero.length % 2 === 0) {
      this.notification.success(
        `Mission started with hero ${this.hero} ${this.vehicle ? 'with vehicle: ' + this.vehicle : ''}.`
      );
    } else {
      this.notification.error(`Choose another hero because ${this.hero} is in other mission.`);
    }

    this.hero = undefined;
    this.vehicle = undefined;
  }
}
