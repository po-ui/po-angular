import {
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, keyframes, style } from '@angular/animations';

import { PoSlideBaseComponent } from './po-slide-base.component';
import { PoSlideContentTemplateDirective } from './directives/po-slide-content-template.directive';
import { PoSlideItem } from './interfaces/po-slide-item.interface';
import { PoSlideItemComponent } from './po-slide-item/po-slide-item.component';

const poSlideDefaultHeight = 336;
const poSlideIntervalMin = 1000;
const poSlideMinHeight = 192;
const poSlideTiming = '250ms ease';

/**
 * @docsExtends PoSlideBaseComponent
 *
 * @example
 * <example name="po-slide-basic" title="Portinari Slide Basic">
 *   <file name="sample-po-slide-basic/sample-po-slide-basic.component.html"> </file>
 *   <file name="sample-po-slide-basic/sample-po-slide-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-slide-labs" title="Portinari Slide Labs">
 *   <file name="sample-po-slide-labs/sample-po-slide-labs.component.html"> </file>
 *   <file name="sample-po-slide-labs/sample-po-slide-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-slide-useful-articles" title="Portinari Slide - Useful articles">
 *   <file name="sample-po-slide-useful-articles/sample-po-slide-useful-articles.component.html"> </file>
 *   <file name="sample-po-slide-useful-articles/sample-po-slide-useful-articles.component.ts"> </file>
 * </example>
 *
 * <example name="po-slide-landscapes" title="Portinari Slide - Landscapes">
 *   <file name="sample-po-slide-landscapes/sample-po-slide-landscapes.component.html"> </file>
 *   <file name="sample-po-slide-landscapes/sample-po-slide-landscapes.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-slide',
  templateUrl: './po-slide.component.html'
})
export class PoSlideComponent extends PoSlideBaseComponent implements DoCheck {
  private isLoaded: boolean = false;
  private player: AnimationPlayer;
  private setInterval: any;

  private get hasElements() {
    return !!this.slide.nativeElement.offsetWidth && !!this.itemsElements && !!this.itemsElements.length;
  }

  private get isImageSlide() {
    return !this.slideContentTemplate;
  }

  private get offset() {
    return this.currentSlideIndex * this.slideItemWidth;
  }

  get hasSlides() {
    return !!this.slides && !!this.slides.length;
  }

  currentSlideIndex = 0;
  imageHeight: number;
  slideItems: Array<PoSlideItem | any> = [];
  slideItemWidth: number;

  @ContentChild(PoSlideContentTemplateDirective, { static: true })
  slideContentTemplate: PoSlideContentTemplateDirective;

  @ViewChild('slide', { static: true }) private slide: ElementRef;

  @ViewChildren(PoSlideItemComponent) private itemsElements: QueryList<PoSlideItemComponent>;

  @HostListener('window:resize') onResize() {
    if (this.slide) {
      this.setSlideItemWidth();
      this.goToItem(this.currentSlideIndex);
    }
  }

  constructor(private builder: AnimationBuilder) {
    super();
  }

  ngDoCheck() {
    if (!this.isLoaded && this.hasElements) {
      this.setSlideItemWidth();
      this.isLoaded = true;

      if (this.hasSlides) {
        this.startSlide();
      }
    }
  }

  goToItem(index: number) {
    if (this.interval > poSlideIntervalMin) {
      this.startInterval();
    }

    this.currentSlideIndex = index;
    this.animate(this.offset);
  }

  nextControl() {
    if (this.interval > poSlideIntervalMin) {
      this.startInterval();
    }

    this.next();
  }

  next() {
    if (this.currentSlideIndex + 1 === this.slideItems.length) {
      this.currentSlideIndex = 0;
      this.animate(0);
      return;
    }
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideItems.length;
    this.animate(this.offset);
  }

  previous() {
    if (this.currentSlideIndex === 0) {
      this.currentSlideIndex = this.slideItems.length - 1;
      this.animate(this.offset);
      return;
    }
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slideItems.length) % this.slideItems.length;
    this.animate(this.offset);
  }

  previousControl() {
    if (this.interval > poSlideIntervalMin) {
      this.startInterval();
    }

    this.previous();
  }

  setSlideHeight(height: number) {
    this.setHeight(height);
  }

  private animate(offset: number) {
    if (this.hasElements) {
      const animation: AnimationFactory = this.buildTransitionAnimation(offset);

      this.player = animation.create(this.slide.nativeElement);
      this.player.play();
    }
  }

  private buildTransitionAnimation(offset: number) {
    return this.builder.build([animate(poSlideTiming, keyframes([style({ transform: `translateX(-${offset}px)` })]))]);
  }

  private createArrayForTemplate(slides: Array<any>) {
    this.slideItems = [...slides];
  }

  private createArrayFromSlides(slides: Array<PoSlideItem | string | any>) {
    const isStringArray = slides.every(item => typeof item === 'string');

    if (isStringArray) {
      slides.forEach(element => this.slideItems.push({ image: `${element}` }));
    } else {
      this.slideItems = [...(<Array<PoSlideItem>>slides)];
    }
  }

  private setDefaultHeight(height: number) {
    if ((height && height <= poSlideMinHeight) || (!height && this.isImageSlide)) {
      this.slide.nativeElement.style.height = `${poSlideDefaultHeight}px`;
      this.imageHeight = poSlideDefaultHeight;
    } else {
      this.imageHeight = undefined;
    }
  }

  private setHeight(height: number) {
    if (height && height > poSlideMinHeight) {
      this.slide.nativeElement.style.height = `${height}px`;
      this.imageHeight = height;
    } else {
      this.setDefaultHeight(height);
    }
  }

  private setSlideItemWidth() {
    if (this.hasElements) {
      this.slideItemWidth = this.itemsElements.first.itemElement.nativeElement.getBoundingClientRect().width;
    }
  }

  protected cancelInterval() {
    clearInterval(this.setInterval);
  }

  protected setSlideItems(slides: Array<PoSlideItem | string | any>) {
    if (this.hasSlides) {
      this.slideContentTemplate ? this.createArrayForTemplate(slides) : this.createArrayFromSlides(slides);
    } else {
      this.slideItems = [];
      this.cancelInterval();
    }
  }

  protected startSlide() {
    this.setSlideHeight(this.height);

    if (this.interval > poSlideIntervalMin) {
      this.startInterval();
    }

    this.currentSlideIndex = 0;
  }

  protected startInterval() {
    if (this.setInterval) {
      this.cancelInterval();
    }

    this.setInterval =
      this.hasSlides && this.hasElements
        ? setInterval(() => {
            this.next();
          }, this.interval)
        : undefined;
  }
}
