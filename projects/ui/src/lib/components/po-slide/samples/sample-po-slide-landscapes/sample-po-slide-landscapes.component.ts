import { Component, ViewChild } from '@angular/core';

import { PoModalComponent, PoSlideItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-slide-landscapes',
  templateUrl: './sample-po-slide-landscapes.component.html'
})
export class SamplePoSlideLandscapesComponent {
  landscapes: Array<PoSlideItem> = [
    { image: '/assets/graphics/landscape-01.jpeg', alt: 'On the road', action: this.aboutLandscape.bind(this) },
    {
      image: '/assets/graphics/landscape-02.jpeg',
      alt: 'Birds flying over trees',
      action: this.aboutLandscape.bind(this)
    },
    { image: '/assets/graphics/landscape-03.jpeg', alt: 'That`s a great sea', action: this.aboutLandscape.bind(this) }
  ];

  modalText: string;

  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;

  aboutLandscape(item: PoSlideItem) {
    this.modalText = item.alt;
    this.modal.open();
  }
}
