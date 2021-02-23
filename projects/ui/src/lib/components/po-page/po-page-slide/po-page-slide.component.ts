import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { delay, take } from 'rxjs/operators';

import { getFocusableElements, uuid } from '../../../utils/util';

import { PoActiveOverlayService } from '../../../services/po-active-overlay/po-active-overlay.service';
import { PoPageSlideBaseComponent } from './po-page-slide-base.component';

/**
 * @docsExtends PoPageSlideBaseComponent
 *
 * @example
 *
 * <example name="po-page-slide-basic" title="PO Page Slide Basic">
 *  <file name="sample-po-page-slide-basic/sample-po-page-slide-basic.component.html"> </file>
 *  <file name="sample-po-page-slide-basic/sample-po-page-slide-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-slide-labs" title="PO Page Slide Labs">
 *  <file name="sample-po-page-slide-labs/sample-po-page-slide-labs.component.html"> </file>
 *  <file name="sample-po-page-slide-labs/sample-po-page-slide-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-slide-configuration" title="PO Page Slide - Configuration">
 *  <file name="sample-po-page-slide-configuration/sample-po-page-slide-configuration.component.html"> </file>
 *  <file name="sample-po-page-slide-configuration/sample-po-page-slide-configuration.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-slide',
  templateUrl: './po-page-slide.component.html',
  providers: [],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        group([animate('150ms', style({ opacity: 1 })), query('@slide', animateChild())])
      ]),
      transition(':leave', group([query('@slide', animateChild()), animate('150ms', style({ opacity: 0 }))]))
    ]),
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateX(50px)' }),
        animate('691ms ease-in-out', style({ transform: 'none' }))
      ]),
      transition(':leave', [animate('150ms', style({ transform: 'translateX(50px)' }))])
    ])
  ]
})
export class PoPageSlideComponent extends PoPageSlideBaseComponent {
  private _pageContent: ElementRef;

  private firstElement: any;
  private id: string = uuid();
  private loadingCompleted = new ReplaySubject<void>();
  private sourceElement: any;

  private focusEvent: EventListener;

  @ViewChild('pageContent', { read: ElementRef }) set pageContent(pageContent: ElementRef) {
    if (pageContent) {
      this._pageContent = pageContent;
      this.loadingCompleted.next();
    }
  }

  get pageContent(): ElementRef {
    return this._pageContent;
  }

  constructor(private poActiveOverlayService: PoActiveOverlayService) {
    super();
  }

  public open(): void {
    this.sourceElement = document.activeElement;
    super.open();
    this.loadingCompleted.pipe(take(1)).pipe(delay(0)).subscribe(this.handleFocus.bind(this));
  }

  public close(): void {
    this.poActiveOverlayService.activeOverlay.pop();
    super.close();

    this.removeEventListeners();
    this.sourceElement.focus();
  }

  public onClickOut(event: MouseEvent): void {
    if (this.clickOut && !this.pageContent.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  private handleFocus(): void {
    this.poActiveOverlayService.activeOverlay.push(this.id);
    this.loadFirstElement();
    this.initFocus();

    document.addEventListener('focus', this.focusEvent, true);
  }

  private initFocus() {
    // O foco não pode sair da página.
    this.focusEvent = (event: Event) => {
      if (
        !this.pageContent.nativeElement.contains(event.target) &&
        this.poActiveOverlayService.activeOverlay[this.poActiveOverlayService.activeOverlay.length - 1] === this.id
      ) {
        event.stopPropagation();
        this.firstElement.focus();
      }
    };

    if (this.hideClose) {
      this.firstElement.focus();
    } else {
      const elements = getFocusableElements(this.pageContent.nativeElement);
      const element = elements[1] || this.pageContent.nativeElement;
      element.focus();
    }
  }

  private loadFirstElement(): void {
    this.firstElement = getFocusableElements(this.pageContent.nativeElement)[0] || this.pageContent.nativeElement;
  }

  private removeEventListeners(): void {
    document.removeEventListener('focus', this.focusEvent, true);
    this.loadingCompleted.complete();
  }
}
