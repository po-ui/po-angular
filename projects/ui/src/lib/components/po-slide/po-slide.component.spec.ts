import { SimpleChange } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from '../../util-test/util-expect.spec';

import { PoSlideCirclesComponent } from './po-slide-circles/po-slide-circles.component';
import { PoSlideComponent } from './po-slide.component';
import { PoSlideItemComponent } from './po-slide-item/po-slide-item.component';
import { PoSlideControlComponent } from './po-slide-control/po-slide-control.component';

describe('PoSlideComponent:', () => {
  let component: PoSlideComponent;
  let fixture: ComponentFixture<PoSlideComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      declarations: [PoSlideCirclesComponent, PoSlideComponent, PoSlideControlComponent, PoSlideItemComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSlideComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created.', () => {
    expect(component instanceof PoSlideComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    const slides = [
      { image: '/image-slide-1.jpg' },
      { image: '/image-slide-2.jpg' },
      { image: '/image-slide-3.jpg' },
      { image: '/image-slide-4.jpg' }
    ];

    it('onResize: should trigger onResize method when window is resized ', () => {
      const spyOnResize = spyOn(component, 'onResize');

      window.dispatchEvent(new Event('resize'));

      expect(spyOnResize).toHaveBeenCalled();
    });

    it('onResize: should call `setSlideItemWidth` and `goToItem` with `currentSlideIndex`', fakeAsync(() => {
      spyOn(component, <any>'setSlideItemWidth');
      spyOn(component, 'goToItem');

      component.onResize();

      tick(150);

      expect(component['setSlideItemWidth']).toHaveBeenCalled();
      expect(component.goToItem).toHaveBeenCalledWith(component.currentSlideIndex);
    }));

    it('ngOnDestroy: should call resizeSubscription.unsubscribe', fakeAsync(() => {
      const spyResizeSubscription = spyOn(component['resizeSubscription'], 'unsubscribe');

      component.onResize();

      tick(150);

      component.ngOnDestroy();

      expect(spyResizeSubscription).toHaveBeenCalled();
    }));

    it('ngOnDestroy: shouldn`t throw error if resizeSubscription is undefined', () => {
      component['resizeSubscription'] = undefined;

      const fnDestroy = () => component.ngOnDestroy();

      expect(fnDestroy).not.toThrow();
    });

    describe('ngDoCheck:', () => {
      it('should call `setSlideItemWidth` and set `isLoaded` to true if isn`t loaded and has elements', () => {
        component['isLoaded'] = false;
        spyOnProperty(component, <any>'hasElements').and.returnValue(true);

        spyOn(component, <any>'setSlideItemWidth');

        component.ngDoCheck();

        expect(component['setSlideItemWidth']).toHaveBeenCalled();
        expect(component['isLoaded']).toBe(true);
      });

      it('shouldn`t call `setSlideItemWidth` isn`t loaded but has elements', () => {
        component['isLoaded'] = false;
        spyOnProperty(component, <any>'hasElements').and.returnValue(false);

        spyOn(component, <any>'setSlideItemWidth');

        component.ngDoCheck();

        expect(component['setSlideItemWidth']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setSlideItemWidth` is loaded and doesn`t have elements', () => {
        component['isLoaded'] = true;
        spyOnProperty(component, <any>'hasElements').and.returnValue(false);

        spyOn(component, <any>'setSlideItemWidth');

        component.ngDoCheck();

        expect(component['setSlideItemWidth']).not.toHaveBeenCalled();
      });

      it('should call `startSlide` and  `setSlideItemWidth` if has slides, isn`t loaded and has elements', () => {
        component['isLoaded'] = false;
        spyOnProperty(component, <any>'hasElements').and.returnValue(true);
        spyOnProperty(component, 'hasSlides').and.returnValue(true);

        spyOn(component, <any>'setSlideItemWidth');
        spyOn(component, <any>'startSlide');

        component.ngDoCheck();

        expect(component['startSlide']).toHaveBeenCalled();
        expect(component['setSlideItemWidth']).toHaveBeenCalled();
      });

      it('shouldn`t call `startSlide` if doesn`t have slides, isn`t loaded and has elements, but should call `setSlideItemWidth`', () => {
        component['isLoaded'] = false;

        spyOnProperty(component, <any>'hasElements').and.returnValue(true);
        spyOnProperty(component, 'hasSlides').and.returnValue(false);

        spyOn(component, <any>'setSlideItemWidth');
        spyOn(component, <any>'startSlide');

        component.ngDoCheck();

        expect(component['startSlide']).not.toHaveBeenCalled();
        expect(component['setSlideItemWidth']).toHaveBeenCalled();
      });
    });

    it('ngOnChanges: should call `setSlideHeight` with `this.height` if `changes.height` is defined', () => {
      component.height = 400;
      const height = 400;

      spyOn(component, 'setSlideHeight');

      component.ngOnChanges(<any>{ height });

      expect(component['setSlideHeight']).toHaveBeenCalledWith(height);
    });

    it('ngOnChanges: should`t call `setSlideHeight` if `changes.height` is not defined', () => {
      spyOn(component, 'setSlideHeight');

      component.ngOnChanges({});

      expect(component['setSlideHeight']).not.toHaveBeenCalled();
    });

    it('getCurrentSlideIndex: should call and return current slide index', () => {
      component.currentSlideIndex = 1;

      const index = component.getCurrentSlideIndex();

      expect(index).toBe(1);
    });

    it('goToItem: should set `currentSlideIndex` and call `animate` with `offset`', () => {
      const index = 3;

      spyOn(component, <any>'animate');
      spyOn(component, <any>'startInterval');

      component.goToItem(index);

      expect(component.currentSlideIndex).toBe(index);
      expect(component['animate']).toHaveBeenCalledWith(component['offset']);
      expect(component['startInterval']).toHaveBeenCalled();
    });

    it('goToItem: should call `startInterval` if has interval greater than 1000', () => {
      const index = 3;
      component.interval = 4000;

      spyOn(component, <any>'startInterval');

      component.goToItem(index);

      expect(component['startInterval']).toHaveBeenCalled();
    });

    it('goToItem: shouldn`t call `startInterval` if has interval is less than 1000', () => {
      const index = 3;
      component.interval = 0;

      spyOn(component, <any>'startInterval');

      component.goToItem(index);

      expect(component['startInterval']).not.toHaveBeenCalled();
    });

    it('next: should set `currentSlideIndex` to `0` end call `animate` if `currentslideIndex + 1` is equal to `slideitens.length`', () => {
      component.slideItems = slides;
      component.currentSlideIndex = 3;
      const result = 0;

      spyOn(component, <any>'animate');

      component.next();

      expect(component.currentSlideIndex).toBe(result);
      expect(component['animate']).toHaveBeenCalledWith(result);
    });

    it(`next: should set 'currentSlideIndex' with 'slideItems.length' if 'currentSlideItems + 1' is less than 'slideItems.length'
    and call 'animate' with 'offset'`, () => {
      component.slideItems = slides;
      component.currentSlideIndex = 2;
      const currentLastIndexAfterNext = 3;

      spyOn(component, <any>'animate');

      component.next();

      expect(component.currentSlideIndex).toBe(currentLastIndexAfterNext);
      expect(component['animate']).toHaveBeenCalledWith(component['offset']);
    });

    it(`nextControl: should call 'next'`, () => {
      spyOn(component, 'next');

      component.nextControl();

      expect(component.next).toHaveBeenCalled();
    });

    it(`nextControl: should call 'startInterval' if interval is greater than 1000`, () => {
      component.interval = 4000;
      spyOn(component, <any>'startInterval');

      component.nextControl();

      expect(component['startInterval']).toHaveBeenCalled();
    });

    it(`nextControl: shouldn't call 'startInterval' if interval is less than 1000`, () => {
      component.interval = 0;
      spyOn(component, <any>'startInterval');

      component.nextControl();

      expect(component['startInterval']).not.toHaveBeenCalled();
    });

    it(`previous: should set 'currentSlideIndex' with 'slideItems.length -1' if 'currentSlideIndex' is equal to '0' and
    call 'animate' with 'offset' value`, () => {
      component.slideItems = slides;
      component.currentSlideIndex = 0;
      const currentSlideIndexAfterPrevious = 3;

      spyOn(component, <any>'animate');

      component.previous();

      expect(component.currentSlideIndex).toBe(currentSlideIndexAfterPrevious);
      expect(component['animate']).toHaveBeenCalledWith(component['offset']);
    });

    it(`previous: should set 'currentSlideIndex' with 'currentSlideIndex -1 + slideItems.length' and
    call 'animate' with 'offset' value`, () => {
      component.slideItems = slides;
      component.currentSlideIndex = 4;
      const currentSlideIndexAfterPrevious = 3;

      spyOn(component, <any>'animate');

      component.previous();

      expect(component.currentSlideIndex).toBe(currentSlideIndexAfterPrevious);
      expect(component['animate']).toHaveBeenCalledWith(component['offset']);
    });

    it(`previousControl: should call 'previous'`, () => {
      spyOn(component, 'previous');

      component.previousControl();

      expect(component.previous).toHaveBeenCalled();
    });

    it(`previousControl: should call 'startInterval' if interval is greater than 1000`, () => {
      component.interval = 4000;
      spyOn(component, <any>'startInterval');

      component.previousControl();

      expect(component['startInterval']).toHaveBeenCalled();
    });

    it(`previousControl: shouldn't call 'startInterval' if interval is less than 1000`, () => {
      component.interval = 0;
      spyOn(component, <any>'startInterval');

      component.previousControl();

      expect(component['startInterval']).not.toHaveBeenCalled();
    });

    it(`setSlideHeigth: should call 'setHeight' with 'heigth'`, () => {
      const slideHeight = 300;
      spyOn(component, <any>'setHeight');

      component.setSlideHeight(slideHeight);

      expect(component['setHeight']).toHaveBeenCalledWith(slideHeight);
    });

    it(`animate: should call 'buildTransitionAnimation' with offset if has elements`, () => {
      const offset = 400;

      spyOnProperty(component, <any>'hasElements').and.returnValue(true);
      spyOn(component, <any>'buildTransitionAnimation').and.callThrough();

      component['animate'](offset);

      expect(component['buildTransitionAnimation']).toHaveBeenCalledWith(offset);
    });

    it(`animate: shouldn't call 'buildTransitionAnimation' with offset if doesn't have elements`, () => {
      const offset = 400;

      spyOnProperty(component, <any>'hasElements').and.returnValue(false);
      spyOn(component, <any>'buildTransitionAnimation');

      component['animate'](offset);

      expect(component['buildTransitionAnimation']).not.toHaveBeenCalled();
    });

    it(`buildTransitionAnimation: should call builder`, () => {
      const offset = 400;

      spyOn(component['builder'], 'build').and.callThrough();

      component['buildTransitionAnimation'](offset);

      expect(component['builder'].build).toHaveBeenCalled();
    });

    it(`createArrayForTemplate: should update 'slideItems' with array of any.`, () => {
      const result = [{ label: 'imagem 1' }, { label: 'imagem 2' }, { label: 'imagem 3' }, { label: 'imagem 4' }];

      component.slideItems = [];
      component['createArrayForTemplate'](result);

      expect(component.slideItems).toEqual(result);
    });

    describe('createArrayFromSlides:', () => {
      it(`should update 'slideItems' with 'string' values.`, () => {
        const result = [{ image: 'imagem 1' }, { image: 'imagem 2' }, { image: 'imagem 3' }, { image: 'imagem 4' }];
        const slidesArray = ['imagem 1', 'imagem 2', 'imagem 3', 'imagem 4'];

        component.slideItems = [];

        component['createArrayFromSlides'](slidesArray);

        expect(component.slideItems).toEqual(result);
      });

      it(`should update 'slideItems' with array of 'PoSlideItem'.`, () => {
        const result = [{ image: 'imagem 1' }, { image: 'imagem 2' }, { image: 'imagem 3' }, { image: 'imagem 4' }];

        component.slideItems = [];

        component['createArrayFromSlides'](result);

        expect(component.slideItems).toEqual(result);
      });
    });

    describe('setDefaultHeight:', () => {
      it('should set `imageHeight` and slide height to default height if height is less than 336px and is image slide', () => {
        const height = 100;
        const defaultHeight = 336;

        component['setDefaultHeight'](height);
        expect(component.imageHeight).toBe(defaultHeight);
      });

      it('should set `imageHeight` and slide height to default height is undefined and is image slide', () => {
        const height = undefined;
        const defaultHeight = 336;

        spyOnProperty(component, <any>'isImageSlide').and.returnValue(true);
        component['setDefaultHeight'](height);
        expect(component.imageHeight).toBe(defaultHeight);
      });

      it('should set `imageHeight` to undefined if height is not defined and isn`t image slide', () => {
        const height = undefined;
        spyOnProperty(component, <any>'isImageSlide').and.returnValue(false);
        component['setDefaultHeight'](height);
        expect(component.imageHeight).toBeUndefined();
      });

      it('should set `imageHeight` to undefined if height is less than `poSlideMinHeight`', () => {
        const height = 400;
        component['setDefaultHeight'](height);
        expect(component.imageHeight).toBeUndefined();
      });

      it('should set `imageHeight` to undefined if height is undefined and isn`t image slide', () => {
        const height = undefined;
        spyOnProperty(component, <any>'isImageSlide').and.returnValue(false);
        component['setDefaultHeight'](height);
        expect(component.imageHeight).toBeUndefined();
      });
    });

    describe('setHeight:', () => {
      it('should set slide height and imageHeight, shouldn`t call `setDefaultHeight` if height is greater than 192px', () => {
        const height = 400;

        spyOn(component, <any>'setDefaultHeight');
        component['setHeight'](height);

        expect(component.imageHeight).toBe(400);
        expect(component['slide'].nativeElement.style.height).toBe('400px');
        expect(component['setDefaultHeight']).not.toHaveBeenCalled();
      });

      it('should call `setDefaultHeight` if height is not defined', () => {
        const height = undefined;

        spyOn(component, <any>'setDefaultHeight');
        component['setHeight'](height);
        expect(component['setDefaultHeight']).toHaveBeenCalled();
      });

      it('should call `setDefaultHeight` if less than 192px', () => {
        const height = 100;

        spyOn(component, <any>'setDefaultHeight');
        component['setHeight'](height);
        expect(component['setDefaultHeight']).toHaveBeenCalled();
      });
    });

    it(`setSlideItemWidth: shouldn't set 'slideItemWidth' if doesn't have elements`, () => {
      spyOnProperty(component, <any>'hasElements').and.returnValue(false);

      component['setSlideItemWidth']();

      expect(component.slideItemWidth).toBeUndefined();
    });

    it(`setSlideItemWidth: should set 'slideItemWidth' with first element if has elements`, () => {
      const fakeThis = {
        hasElements: true,
        slideItemWidth: 0,
        itemsElements: {
          first: {
            itemElement: {
              nativeElement: {
                getBoundingClientRect: () => ({ width: 300 })
              }
            }
          }
        }
      };
      component['setSlideItemWidth'].call(fakeThis);
      expect(fakeThis.slideItemWidth).toBe(300);
    });

    it(`cancelInterval: should cancel interval and shouldn't call 'next' function`, fakeAsync(() => {
      component.interval = 1000;

      spyOn(component, 'next');

      component['cancelInterval']();

      tick(2000);
      expect(component.next).not.toHaveBeenCalled();
    }));

    describe('startSlide:', () => {
      it(`should call 'setSlideHeight' and set 'currentSlideIndex' to 0`, () => {
        spyOn(component, 'setSlideHeight');

        component['startSlide']();

        expect(component['setSlideHeight']).toHaveBeenCalled();
        expect(component.currentSlideIndex).toBe(0);
      });

      it(`should call 'startInterval' if interval is greater than 1000`, () => {
        component.interval = 2000;
        spyOn(component, <any>'startInterval');

        component['startSlide']();

        expect(component['startInterval']).toHaveBeenCalled();
      });

      it(`shouldn't call 'startInterval' if interval is less than 1000`, () => {
        component.interval = 0;
        spyOn(component, <any>'startInterval');

        component['startSlide']();

        expect(component['startInterval']).not.toHaveBeenCalled();
      });
    });

    describe('setSlideItems:', () => {
      it(`should call 'createArrayFromSlides' if slides are defined and template is undefined.`, () => {
        const slidesArray = [{ alt: '1' }, { alt: '2' }, { alt: '3' }, { alt: '4' }];

        spyOnProperty(component, 'hasSlides').and.returnValue(true);

        spyOn(component, <any>'createArrayFromSlides');

        component['setSlideItems'](slidesArray);

        expect(component['createArrayFromSlides']).toHaveBeenCalled();
      });

      it(`should call 'createArrayForTemplate' if slides are defined and template is defined.`, () => {
        const slidesArray = [{ alt: '1' }, { alt: '2' }, { alt: '3' }, { alt: '4' }];
        component.slideContentTemplate = <any>{ templateRef: {} };

        spyOnProperty(component, 'hasSlides').and.returnValue(true);

        spyOn(component, <any>'createArrayForTemplate');

        component['setSlideItems'](slidesArray);

        expect(component['createArrayForTemplate']).toHaveBeenCalled();
      });

      it(`should call 'cancelInterval' and 'setSlideItems' to [].`, () => {
        const slidesArray = [];

        spyOn(component, <any>'cancelInterval');
        component['setSlideItems'](slidesArray);

        expect(component['cancelInterval']).toHaveBeenCalled();
        expect(component.slideItems).toEqual(slidesArray);
      });
    });

    describe('startInterval:', () => {
      it(`should call 'cancelInterval' if 'setInterval' is defined.`, () => {
        component['setInterval'] = () => {};
        spyOn(component, <any>'cancelInterval');

        component['startInterval']();

        expect(component['cancelInterval']).toHaveBeenCalled();
      });

      it(`should set 'setInterval' to undefined if doesn't have slides and elements.`, () => {
        component.slides = [];
        fixture.detectChanges();

        component['startInterval']();

        expect(component['setInterval']).toBeUndefined();
      });

      it(`should call 'next' after interval of 1 second if has slides and elements`, fakeAsync(() => {
        component.slides = [{ alt: '1' }, { alt: '2' }, { alt: '3' }, { alt: '4' }];
        fixture.detectChanges();

        const interval = 1000;
        spyOn(component, 'next');

        component.interval = interval;
        tick(2000);
        component['cancelInterval']();

        expect(component.next).toHaveBeenCalled();
      }));
    });
  });

  describe('Properties:', () => {
    it(`hasElements: should return true if has 'slides' to create 'itemsElements'`, () => {
      component.slides = [{ alt: '1' }, { alt: '2' }, { alt: '3' }, { alt: '4' }];
      fixture.detectChanges();

      expect(component['hasElements']).toBe(true);
    });

    it(`hasElements: should return false if doesn't have slides`, () => {
      component.slides = [];
      fixture.detectChanges();

      expect(component['hasElements']).toBe(false);
    });

    it(`isImageSlide: should return true if doesn't have template`, () => {
      component.slideContentTemplate = undefined;
      expect(component['isImageSlide']).toBe(true);
    });

    it(`isImageSlide: should return false if has template`, () => {
      component.slideContentTemplate = <any>{ templateRef: {} };
      expect(component['isImageSlide']).toBe(false);
    });

    it(`offset: should return 'currentSlideIndex' times 'slideItemWidth' `, () => {
      component.currentSlideIndex = 3;
      component.slideItemWidth = 10;
      const result = 30;

      expect(component['offset']).toBe(result);
    });

    it(`hasSlides: should return true if has 'slides'`, () => {
      component.slides = [{ alt: '1' }, { alt: '2' }, { alt: '3' }, { alt: '4' }];
      fixture.detectChanges();

      expect(component['hasSlides']).toBe(true);
    });

    it(`hasSlides: should return false if doesn't have slides`, () => {
      component.slides = [];
      fixture.detectChanges();

      expect(component['hasSlides']).toBe(false);
    });
  });

  describe('Templates:', () => {
    const arrowCircleSelector = '.po-slide-arrow-circle';
    const eventClick = document.createEvent('MouseEvents');
    eventClick.initEvent('click', false, true);

    it(`should have style height default if component height is undefined.`, () => {
      const poSlideDefaultHeight = 336;
      component.height = undefined;
      const simpleChangeHeight = new SimpleChange(undefined, component.height, true);

      component.ngOnChanges({ height: simpleChangeHeight });
      fixture.detectChanges();

      const slideInnerHeight = nativeElement.querySelector('.po-slide-inner').style.height;
      expect(slideInnerHeight).toBe(poSlideDefaultHeight + `px`);
    });

    it(`should set style height of slide to 700px.`, () => {
      const height = 700;
      component.height = height;

      component.ngOnChanges(<any>{ height });
      fixture.detectChanges();

      const slideInnerHeight = nativeElement.querySelector('.po-slide-inner').style.height;
      expect(slideInnerHeight).toBe(height + `px`);
    });

    it(`should have arrow left and arrow right if has more than 1 slide.`, () => {
      component.slides = ['item1', 'item2', 'item3'];

      fixture.detectChanges();

      const arrows = nativeElement.querySelectorAll(arrowCircleSelector);

      const slideArrowPrevious = arrows[0];
      const slideArrowNext = arrows[1];

      expect(slideArrowPrevious).toBeTruthy();
      expect(slideArrowNext).toBeTruthy();
    });

    it(`should have 'po-slide-circles' if more than 1 slide.`, () => {
      component.slides = ['item1', 'item2', 'item3'];

      fixture.detectChanges();
      const slideCircles = nativeElement.querySelectorAll('.po-slide-circle');

      expect(slideCircles.length).toBe(3);
    });

    it(`should  call 'previous' if slide arrow previous was clicked`, () => {
      component.slides = ['item1', 'item2', 'item3'];
      spyOn(component, 'previousControl');

      fixture.detectChanges();

      const slideArrowPrevious = nativeElement.querySelector(arrowCircleSelector);
      slideArrowPrevious.dispatchEvent(eventClick);

      expect(component['previousControl']).toHaveBeenCalled();
    });

    it(`should call 'next' if slide arrow next was clicked.`, () => {
      component.slides = ['item1', 'item2', 'item3'];
      spyOn(component, 'nextControl');

      fixture.detectChanges();

      const slideArrowNext = nativeElement.querySelectorAll(arrowCircleSelector)[1];
      slideArrowNext.dispatchEvent(eventClick);

      expect(component['nextControl']).toHaveBeenCalled();
    });

    it(`shouldn't show 'next' and 'previous' if doesn't have slides.`, () => {
      component.slides = [];

      fixture.detectChanges();

      const arrows = nativeElement.querySelector(arrowCircleSelector);

      expect(arrows).toBeFalsy();
    });

    it(`shouldn't show 'next' and 'previous' if has 1 slide.`, () => {
      component.slides = ['item1'];

      fixture.detectChanges();

      const arrows = nativeElement.querySelector(arrowCircleSelector);

      expect(arrows).toBeFalsy();
    });

    it(`shouldn't show 'po-slide-circles' if doesn't have slides.`, () => {
      component.slides = [];

      fixture.detectChanges();

      const slideCircle = nativeElement.querySelector('.po-slide-circle');
      const slideCircles = nativeElement.querySelector('.po-slide-circles');

      expect(slideCircle).toBeFalsy();
      expect(slideCircles).toBeFalsy();
    });

    it(`shouldn't show 'po-slide-circles' if has 1 slide.`, () => {
      component.slides = ['item1'];

      fixture.detectChanges();

      const slideCircle = nativeElement.querySelector('.po-slide-circle');
      const slideCircles = nativeElement.querySelector('.po-slide-circles');

      expect(slideCircle).toBeFalsy();
      expect(slideCircles).toBeFalsy();
    });

    it('should create a `po-slide-item` foreach slideItem', () => {
      component.slides = ['item1', 'item2', 'item3'];

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('po-slide-item').length).toBe(3);
    });

    it('shouldn`t create `po-slide-item` if SlideItems is undefined', () => {
      component.slides = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('po-slide-item').length).toBe(0);
    });
  });
});
