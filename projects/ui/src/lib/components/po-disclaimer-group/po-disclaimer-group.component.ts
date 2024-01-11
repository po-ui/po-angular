import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  IterableDiffers,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { Subscription, fromEvent } from 'rxjs';
import { PoDisclaimerGroupBaseComponent } from './po-disclaimer-group-base.component';
import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';

/**
 * @docsExtends PoDisclaimerGroupBaseComponent
 *
 * @example
 *
 * <example name="po-disclaimer-group-basic" title="PO Disclaimer Group Basic">
 *   <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-disclaimer-group-labs" title="PO Disclaimer Group Labs">
 *   <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-disclaimer-group-sw-planets" title="PO Disclaimer Group - Star Wars Planets">
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.html"> </file>
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.ts"> </file>
 *   <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.service.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-disclaimer-group',
  templateUrl: './po-disclaimer-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoDisclaimerGroupComponent extends PoDisclaimerGroupBaseComponent implements AfterViewInit, OnChanges {
  private subscription: Subscription = new Subscription();

  private el = inject(ElementRef);

  constructor(
    differs: IterableDiffers,
    languageService: PoLanguageService,
    protected changeDetector: ChangeDetectorRef
  ) {
    super(differs, languageService, changeDetector);
  }

  ngAfterViewInit(): void {
    this.handleKeyboardNavigationTag();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disclaimers) {
      setTimeout(() => {
        this.handleKeyboardNavigationTag();
      });
    }
  }

  onCloseAction(disclaimer: PoDisclaimer, event?) {
    const index = this.disclaimers.findIndex(option => option.value === disclaimer.value);

    this.removeDisclaimer(disclaimer);

    this.emitChangeDisclaimers();
    this.remove.emit({
      removedDisclaimer: { ...disclaimer },
      currentDisclaimers: [...this.disclaimers]
    });

    setTimeout(() => {
      this.focusOnNextTag(index, event);
    }, 300);
  }

  focusOnNextTag(indexClosed: number, clickOrEnter: string) {
    if (clickOrEnter === 'enter') {
      const tagRemoveElements: NodeListOf<Element> = this.el.nativeElement.querySelectorAll('.po-tag-remove');
      indexClosed = indexClosed || indexClosed === 0 ? indexClosed : tagRemoveElements.length;
      this.focusOnRemoveTag(tagRemoveElements, indexClosed);
    } else {
      indexClosed = 0;
    }
    this.handleKeyboardNavigationTag(indexClosed);
  }

  handleKeyboardNavigationTag(initialIndex = 0) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    const tagRemoveElements: NodeListOf<Element> = this.el.nativeElement.querySelectorAll('.po-tag-remove');
    this.initializeTagRemoveElements(tagRemoveElements, initialIndex);
  }

  private handleArrowLeft(tagRemoveElements, index) {
    if (index > 0) {
      this.setTabIndex(tagRemoveElements[index], -1);
      tagRemoveElements[index - 1].focus();
      this.setTabIndex(tagRemoveElements[index - 1], 0);
    }
  }

  private handleArrowRight(tagRemoveElements, index) {
    if (index < tagRemoveElements.length - 1) {
      this.setTabIndex(tagRemoveElements[index], -1);
      tagRemoveElements[index + 1].focus();
      this.setTabIndex(tagRemoveElements[index + 1], 0);
    }
  }

  private setTabIndex(element, tabIndex) {
    element.setAttribute('tabindex', tabIndex);
  }

  private initializeTagRemoveElements(tagRemoveElements, initialIndex) {
    tagRemoveElements.forEach((tagRemoveElement, index) => {
      if (index === initialIndex) {
        this.setTabIndex(tagRemoveElements[initialIndex], 0);
      } else if (tagRemoveElements.length === initialIndex) {
        this.setTabIndex(tagRemoveElements[initialIndex - 1], 0);
      } else {
        this.setTabIndex(tagRemoveElement, -1);
      }

      this.subscription.add(
        fromEvent(tagRemoveElement, 'keydown').subscribe((event: KeyboardEvent) => {
          this.handleKeyDown(event, tagRemoveElements, index);
        })
      );

      if (index !== 0) {
        this.subscription.add(
          fromEvent(tagRemoveElements, 'blur').subscribe(() => {
            this.setTabIndex(tagRemoveElements[index], -1);
            this.setTabIndex(tagRemoveElements[0], 0);
          })
        );
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent, tagRemoveElements, index: number) {
    const KEY_SPACE = 'Space';
    const KEY_ARROW_LEFT = 'ArrowLeft';
    const KEY_ARROW_RIGHT = 'ArrowRight';

    if (event.code === KEY_SPACE) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === KEY_ARROW_LEFT) {
      this.handleArrowLeft(tagRemoveElements, index);
    } else if (event.key === KEY_ARROW_RIGHT) {
      this.handleArrowRight(tagRemoveElements, index);
    }
  }

  private focusOnRemoveTag(tag: any, indexClosed: number) {
    if (tag.length === indexClosed) {
      tag[indexClosed - 1]?.focus();
    } else {
      tag[indexClosed]?.focus();
    }
  }
}
