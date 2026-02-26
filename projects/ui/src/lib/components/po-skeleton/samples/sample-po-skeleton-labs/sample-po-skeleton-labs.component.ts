import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sample-po-skeleton-labs',
  templateUrl: './sample-po-skeleton-labs.component.html',
  standalone: false
})
export class SamplePoSkeletonLabsComponent implements OnInit {
  animation: string;
  borderRadius: string;
  height: string;
  variant: string;
  width: string;

  readonly animationOptions = [
    { label: 'Shimmer', value: 'shimmer' },
    { label: 'Pulse', value: 'pulse' },
    { label: 'None', value: 'none' }
  ];

  readonly variantOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Rectangle', value: 'rect' },
    { label: 'Circle', value: 'circle' }
  ];

  ngOnInit() {
    this.restore();
  }

  get modelValue() {
    return JSON.stringify(
      {
        variant: this.variant,
        animation: this.animation,
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius
      },
      null,
      2
    );
  }

  restore() {
    this.variant = 'text';
    this.animation = 'shimmer';
    this.width = '100%';
    this.height = undefined;
    this.borderRadius = undefined;
  }
}
