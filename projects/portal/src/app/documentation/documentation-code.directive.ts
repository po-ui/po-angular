import { Directive, ElementRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';

declare var hljs: any;

@Directive({
  selector: '[appCodeHighlight]'
})
export class HighlightCodeDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    if (this.element) {
      hljs.highlightBlock(this.element.nativeElement);
    }
  }
}
