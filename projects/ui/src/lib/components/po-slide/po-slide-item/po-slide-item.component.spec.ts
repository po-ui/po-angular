import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoSlideItemComponent } from './po-slide-item.component';

describe('PoSlideItemComponent:', () => {
  let component: PoSlideItemComponent;
  let fixture: ComponentFixture<PoSlideItemComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoSlideItemComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSlideItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('setLinkType: should return `noLink` if `template` is `defined`', () => {
      component.template = <any>{ templateRef: {} };
      component.link = 'link';

      expect(component.setLinkType()).toBe('noLink');
    });

    it('setLinkType: should return `noLink` if `template` and `link` are `undefined`', () => {
      component.template = undefined;
      component.link = undefined;

      expect(component.setLinkType()).toBe('noLink');
    });

    it('setLinkType: should return `externalLink` if `template` is `undefined` and link starts with http', () => {
      component.template = undefined;
      component.link = 'http://teste';

      expect(component.setLinkType()).toBe('externalLink');
    });

    it('setLinkType: should return `internalLink` if `template` is `undefined` and link doesn`t start with http', () => {
      component.template = undefined;
      component.link = '//teste';

      expect(component.setLinkType()).toBe('internalLink');
    });
  });

  describe('Template:', () => {
    it(`should aplly 'po-slide-item-background-image' if 'template' is 'undefined' and 'isIEOrEdge' is 'true'`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;

      fixture.detectChanges();

      const slideItemBackground = nativeElement.querySelector('.po-slide-item-background-image');

      expect(slideItemBackground).toBeTruthy();
    });

    it(`should apply 'background-image' if 'template' is 'undefined' and 'isIEOrEdge' is 'true'`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;
      component.link = 'http://';
      component.image = 'imageUrl';

      fixture.detectChanges();

      const slideItemBackground = nativeElement.querySelector('.po-slide-item').style.backgroundImage;

      expect(slideItemBackground).toBeTruthy();
    });

    it(`should contain the attribute 'ng-reflect-router-link' with internal link if 'setLinkType' returns 'internalLink'`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;
      component.link = '//internal';

      fixture.detectChanges();

      const ngReflectAttribute = nativeElement.querySelector(
        '.po-slide-item-link[ng-reflect-router-link="//internal"]'
      );

      expect(ngReflectAttribute).toBeTruthy();
    });

    it(`should contain the attribute 'href' with external link if 'setLinkType' returns 'externalLink'`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;
      component.link = 'http://external';

      fixture.detectChanges();

      const hrefAttribute = nativeElement.querySelector('.po-slide-item-link[href="http://external"]');

      expect(hrefAttribute).toBeTruthy();
    });

    it(`should apply 'po-slide-item-link' and call action if click`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;
      component.link = undefined;
      component.action = () => {};

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      spyOn(component, 'action');

      fixture.detectChanges();

      const slideItemElement = nativeElement.querySelector('.po-slide-item-link');

      slideItemElement.dispatchEvent(eventClick);

      expect(slideItemElement).toBeTruthy();
      expect(component.action).toHaveBeenCalled();
    });

    it(`should apply 'po-slide-item-no-link' if 'setLinkType' return 'noLink' and action is 'undefined'`, () => {
      component.template = undefined;
      component.isIEOrEdge = true;
      component.link = undefined;
      component.action = undefined;

      fixture.detectChanges();

      const slideItemElementLink = nativeElement.querySelector('.po-slide-item-link');
      const slideItemElementNoLink = nativeElement.querySelector('.po-slide-item-no-link');

      expect(slideItemElementLink).toBeFalsy();
      expect(slideItemElementNoLink).toBeTruthy();
    });

    it(`should contain 'po-slide-image' in tag '<img>' if 'template' is 'undefined',
      'image' is 'defined' and 'isIEOrEdge' is 'false'`, () => {
      component.template = undefined;
      component.image = 'imageUrl';
      component.isIEOrEdge = false;

      fixture.detectChanges();

      const slideItemImage = nativeElement.querySelector('.po-slide-image');
      const slideItemTemplate = nativeElement.querySelector('.po-slide-item-content');

      expect(slideItemImage).toBeTruthy();
      expect(slideItemTemplate).toBeFalsy();
    });

    it(`should apply 'item.alt' in tag '<img>' if 'template' is 'undefined',
      'image' is 'defined' and 'isIEOrEdge' is 'false'`, () => {
      component.template = undefined;
      component.image = 'imageUrl';
      component.alt = 'alt';
      component.isIEOrEdge = false;

      fixture.detectChanges();

      const slideItemImageAlt = nativeElement.querySelector('.po-slide-image').alt;

      expect(slideItemImageAlt).toBe('alt');
    });

    it(`should apply 'imageHeight' in tag '<img>' 'style.height.px' if 'template' is 'undefined',
      'image' is 'defined' and 'isIEOrEdge' is 'false'`, () => {
      component.template = undefined;
      component.image = 'imageUrl';
      component.imageHeight = 20;
      component.isIEOrEdge = false;

      fixture.detectChanges();

      const slideItemImageHeight = nativeElement.querySelector('.po-slide-image').style.height;

      expect(slideItemImageHeight).toBe('20px');
    });

    it(`should apply 'item.image' in tag '<img>' src if 'template' is 'undefined',
      'image' is 'defined' and 'isIEOrEdge' is 'false'`, () => {
      component.template = undefined;
      component.image = 'imageUrl';
      component.alt = 'alt';
      component.isIEOrEdge = false;

      fixture.detectChanges();

      const slideItemImageSrc = nativeElement.querySelector('.po-slide-image').src;

      expect(slideItemImageSrc).toBeTruthy();
    });
  });
});
