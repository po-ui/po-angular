import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { getFocusableElements } from '../../../utils/util';
import { PoPageSlideBaseComponent } from './po-page-slide-base.component';
import { PoPageSlideService } from './po-page-slide.service';

@Component({
  selector: 'po-page-slide',
  templateUrl: './po-page-slide.component.html',
  providers: [],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('100ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))])
    ])
  ]
})
export class PoPageSlideComponent extends PoPageSlideBaseComponent {
  private id = uuid();
  private sourceElement: HTMLElement;
  private focusEvent: EventListener;
  private firstElement: HTMLElement;

  @ViewChild('pageContent', { read: ElementRef, static: false }) pageContent: ElementRef;

  constructor(private poPageSlideService: PoPageSlideService) {
    super();
  }

  public open() {
    // Nao permitir a abertura de dois "po-page-slide" simultâneas.
    if (this.poPageSlideService.isAnyPageActive()) {
      throw new TypeError('It\'s not possible to have two "po-page-slide" simultaneously activated.');
    }

    super.open();

    this.poPageSlideService.activePage(this.id);
    this.sourceElement = document.activeElement as HTMLElement;

    setTimeout(() => this.handleFocus());
  }

  public close() {
    super.close();

    this.poPageSlideService.deactivePage();
    this.removeEventListeners();

    if (this.sourceElement && this.sourceElement.focus) {
      this.sourceElement.focus();
    }
  }

  private handleFocus() {
    this.focusEvent = (event: Event) => {
      const pageElement = this.pageContent.nativeElement;

      if (!pageElement.contains(event.target) && this.poPageSlideService.getAtivePage() === this.id) {
        event.stopPropagation();
        this.firstElement.focus();
      }
    };

    const elements = getFocusableElements(this.pageContent.nativeElement);
    this.firstElement = (this.hideClose ? elements[0] : elements[1]) || this.pageContent.nativeElement;
    this.firstElement.focus();

    document.addEventListener('focus', this.focusEvent, true);
  }

  private removeEventListeners() {
    document.removeEventListener('focus', this.focusEvent, true);
  }
}
