import { Directive, Input } from '@angular/core';

/**
 * Stub directive for [routerLink] used in Vitest specs.
 * Avoids importing RouterTestingModule which deadlocks zone.js in jsdom.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink]',
  standalone: false
})
export class RouterLinkStubDirective {
  @Input() routerLink: any;
}
