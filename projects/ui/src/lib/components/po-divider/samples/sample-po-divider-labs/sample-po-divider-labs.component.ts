import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sample-po-divider-labs',
  templateUrl: './sample-po-divider-labs.component.html'
})
export class SamplePoDividerLabsComponent implements OnInit {
  label: string;

  ngOnInit() {
    this.restore();
  }

  restore() {
    this.label = undefined;
  }
}
