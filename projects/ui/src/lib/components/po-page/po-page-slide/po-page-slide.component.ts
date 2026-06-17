import {
  AnimationCallbackEvent,
  Component,
  ContentChild,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { delay, take } from 'rxjs/operators';

import { getFocusableElements, uuid } from '../../../utils/util';

import { PoActiveOverlayService } from '../../../services/po-active-overlay/po-active-overlay.service';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoPageSlideLiterals } from './interfaces/po-page-slide-literals.interface';
import { PoPageSlideBaseComponent } from './po-page-slide-base.component';
import { PoPageSlideFooterComponent } from './po-page-slide-footer/po-page-slide-footer.component';

export const poPageSlideLiteralsDefault = {
  en: <PoPageSlideLiterals>{
    close: 'Close'
  },
  es: <PoPageSlideLiterals>{
    close: 'Cerrar'
  },
  pt: <PoPageSlideLiterals>{
    close: 'Fechar'
  },
  ru: <PoPageSlideLiterals>{
    close: 'Закрывать'
  }
};

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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoPageSlideComponent extends PoPageSlideBaseComponent {
  private readonly poActiveOverlayService = inject(PoActiveOverlayService);
  private readonly languageService = inject(PoLanguageService);

  private _pageContent: ElementRef;

  private firstElement: any;
  private readonly id: string = uuid();
  private readonly loadingCompleted = new ReplaySubject<void>();
  private sourceElement: any;
  buttonAriaLabel: string;
  duration: string = '70ms';
  timing: string = '700ms Cubic-Bezier(0.35, 0, 0.1, 1)';

  private focusEvent: EventListener;

  @ContentChild(PoPageSlideFooterComponent) pageSlideFooter: PoPageSlideFooterComponent;

  @ViewChild('pageContent', { read: ElementRef }) set pageContent(pageContent: ElementRef) {
    if (pageContent) {
      this._pageContent = pageContent;
      this.loadingCompleted.next();
    }
  }

  get pageContent(): ElementRef {
    return this._pageContent;
  }

  constructor() {
    super();
    this.setTimeFromCSS();
    this.buttonAriaLabel = this.getTextDefault();
  }

  public open(): void {
    this.sourceElement = document.activeElement;
    super.open();
    this.loadingCompleted.pipe(take(1)).pipe(delay(0)).subscribe(this.handleFocus.bind(this));
  }

  public close(): void {
    if (
      this.poActiveOverlayService.activeOverlay.length > 0 &&
      this.poActiveOverlayService.activeOverlay[this.poActiveOverlayService.activeOverlay.length - 1] === this.id
    ) {
      this.poActiveOverlayService.activeOverlay.pop();
    }

    super.close();

    this.removeEventListeners();
    this.sourceElement.focus();
  }

  public onClickOut(event: MouseEvent): void {
    if (this.clickOut && !this.pageContent.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  animateEnter(event: AnimationCallbackEvent): void {
    const rootElement = event.target as HTMLElement;
    const container = rootElement.querySelector('.po-page-slide-container') as HTMLElement;

    const fadeDuration = this.parseDuration(this.duration) || 70;
    const { duration: slideDuration, easing: slideEasing } = this.parseTiming(this.timing);

    // Animate overlay fade in
    rootElement.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: fadeDuration,
      easing: 'linear',
      fill: 'forwards'
    });

    // Animate container slide in (in parallel)
    if (container) {
      const slideAnimation = container.animate([{ transform: 'translateX(50px)' }, { transform: 'none' }], {
        duration: slideDuration,
        easing: slideEasing,
        fill: 'forwards'
      });

      slideAnimation.onfinish = () => event.animationComplete();
    } else {
      event.animationComplete();
    }
  }

  animateLeave(event: AnimationCallbackEvent): void {
    const rootElement = event.target as HTMLElement;
    const container = rootElement.querySelector('.po-page-slide-container') as HTMLElement;

    const leaveDuration = 150;

    // Animate overlay fade out and slide out in parallel
    rootElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: leaveDuration,
      easing: 'linear',
      fill: 'forwards'
    });

    if (container) {
      const slideAnimation = container.animate([{ transform: 'none' }, { transform: 'translateX(50px)' }], {
        duration: leaveDuration,
        easing: 'linear',
        fill: 'forwards'
      });

      slideAnimation.onfinish = () => event.animationComplete();
    } else {
      setTimeout(() => event.animationComplete(), leaveDuration);
    }
  }

  private parseDuration(value: string): number {
    if (!value) {
      return 70;
    }
    const match = value.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
    if (!match) {
      return 70;
    }
    return match[2] === 's' ? parseFloat(match[1]) * 1000 : parseFloat(match[1]);
  }

  private parseTiming(value: string): { duration: number; easing: string } {
    if (!value) {
      return { duration: 700, easing: 'cubic-bezier(0.35, 0, 0.1, 1)' };
    }
    const durationMatch = value.match(/^(\d+(?:\.\d+)?)(ms|s)\s+(.+)$/);
    if (!durationMatch) {
      return { duration: 700, easing: 'cubic-bezier(0.35, 0, 0.1, 1)' };
    }
    const duration = durationMatch[2] === 's' ? parseFloat(durationMatch[1]) * 1000 : parseFloat(durationMatch[1]);
    return { duration, easing: durationMatch[3] };
  }

  private setTimeFromCSS(): void {
    const rootStyles = getComputedStyle(document.documentElement);
    this.duration = rootStyles.getPropertyValue('--transition-duration').trim();
    this.timing = rootStyles.getPropertyValue('--transition-timing').trim();
  }

  private getTextDefault(): string {
    const language = this.languageService.getShortLanguage();

    return poPageSlideLiteralsDefault[language].close;
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
      const isCdkOverlayListbox = event.target['closest']('.cdk-overlay-container') !== null;
      if (
        !this.pageContent.nativeElement.contains(event.target) &&
        !isCdkOverlayListbox &&
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
      const element = elements[0] || this.pageContent.nativeElement;
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
