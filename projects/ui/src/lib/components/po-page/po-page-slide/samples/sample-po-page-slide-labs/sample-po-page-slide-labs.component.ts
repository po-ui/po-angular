import { Component, OnInit, ViewChild } from '@angular/core';
import { PoPageSlideComponent, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-page-slide-labs',
  templateUrl: './sample-po-page-slide-labs.component.html'
})
export class SamplePoPageSlideLabsComponent implements OnInit {
  @ViewChild(PoPageSlideComponent, { static: true }) poPageSlide: PoPageSlideComponent;

  public hideClose = false;
  public title: string;
  public subtitle: string;
  public content: string;
  public size: string;
  public align: string;

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

  ngOnInit() {
    this.restore();
  }

  public restore() {
    this.hideClose = false;
    this.title = 'Po Page Slide Labs Title!';
    this.subtitle = 'Po Page Slide Labs Subtitle';
    this.content = 'This is a content for the page slide component.';
    this.size = 'md';
    this.align = 'right';
  }
}
