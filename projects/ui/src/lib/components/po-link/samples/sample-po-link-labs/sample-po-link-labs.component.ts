import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sample-po-link-labs',
  templateUrl: './sample-po-link-labs.component.html'
})
export class SamplePoLinkLabsComponent implements OnInit {
  url: string;
  label: string = 'PO Link';
  openNewTab: boolean = false;

  ngOnInit(): void {
    this.restore();
  }

  restore() {
    this.url = undefined;
    this.label = 'PO Link';
    this.openNewTab = false;
  }
}
