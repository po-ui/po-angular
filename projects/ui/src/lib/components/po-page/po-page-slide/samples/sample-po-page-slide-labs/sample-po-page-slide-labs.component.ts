import { Component, OnInit, ViewChild } from '@angular/core';
import { PoPageSlideComponent, PoRadioGroupOption } from '@portinari/portinari-ui';

import { PoCheckboxGroupOption } from '../../../../po-field';

@Component({
  selector: 'sample-po-page-slide-labs',
  templateUrl: './sample-po-page-slide-labs.component.html'
})
export class SamplePoPageSlideLabsComponent implements OnInit {
  public hideClose = false;
  public title: string;
  public subtitle: string;
  public content: string;
  public size: string;
  public align: string;
  public properties: Array<string>;

  public propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'hide-close', label: 'Hide Close' }
  ];

  public sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
    { label: 'Automatic', value: 'auto' }
  ];

  public alignOptions: Array<PoRadioGroupOption> = [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' }
  ];

  @ViewChild('poPageSlide', { static: true }) poPageSlide: PoPageSlideComponent;

  ngOnInit() {
    this.restore();
  }

  public openPage() {
    this.poPageSlide.open();

    if (this.properties.includes('hide-close')) {
      setTimeout(() => this.poPageSlide.close(), 3_000);
    }
  }

  public restore() {
    this.hideClose = false;
    this.title = '';
    this.subtitle = '';
    this.content = '';
    this.size = 'md';
    this.align = 'right';
    this.properties = [];
  }
}
