import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[p-input]'
})
export class PoInputDirective {

  // Necessário manter templateRef para o funcionamento do row template.
  constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>) {
    renderer.addClass(elementRef.nativeElement, 'po-input');
  }

}
