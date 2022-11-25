import { AfterViewInit, Component, ElementRef, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { PoListboxBaseComponent } from './po-listbox-base.component';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html',
  styleUrls: ['./po-listbox.component.css']
})
export class PoListboxComponent extends PoListboxBaseComponent implements AfterViewInit, OnChanges {
  @ViewChild('listbox', { static: true }) listbox: ElementRef;

  constructor(private renderer: Renderer2) {
    super();
    console.log('', { items: this.items });
  }

  ngAfterViewInit(): void {
    // this.setListboxMaxHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.setListboxMaxHeight();
    }
  }

  private setListboxMaxHeight(): void {
    const itemsLength = this.items.length;
    if (itemsLength > 6) {
      // this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${(2.75 * 6) - (2.75 / 3)}em`);
      this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
    }
  }
}
