import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'sample-po-popup-basic',
  templateUrl: './sample-po-popup-basic.component.html',
  standalone: false
})
export class SamplePoPopupBasicComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('target', { read: ElementRef }) targetRef: ElementRef;

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
