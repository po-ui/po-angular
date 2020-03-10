import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

import { changeBrowserInnerWidth, configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoPageContentComponent } from './po-page-content.component';

@Component({
  template: `
    <div class="po-toolbar"></div>
    <div class="po-page-header"></div>
  `,
  styles: [
    `
      .po-page-header {
        height: 100px;
        width: 100%;
      }
      .po-toolbar {
        height: 33px;
        width: 100%;
      }
    `
  ]
})
class ContentDivComponent {}

describe('PoPageContentComponent:', () => {
  let component: PoPageContentComponent;
  let fixture: ComponentFixture<PoPageContentComponent>;

  let fixtureDiv: ComponentFixture<ContentDivComponent>;

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ContentDivComponent, PoPageContentComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageContentComponent);
    component = fixture.componentInstance;

    fixtureDiv = TestBed.createComponent(ContentDivComponent);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoPageContentComponent).toBeTruthy();
  });

  it('constructor: should call recalculateHeaderSize', () => {
    component['initializeListeners']();
    spyOn(component, 'recalculateHeaderSize');

    changeBrowserInnerWidth(450);
    window.dispatchEvent(eventResize);

    expect(component.recalculateHeaderSize).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('recalculateHeaderSize: should call setHeightContent and set `contentOpacity` to equal 1.', fakeAsync(() => {
      spyOn(component, 'setHeightContent');
      component.recalculateHeaderSize();
      tick(100);
      expect(component.setHeightContent).toHaveBeenCalled();
      expect(component.contentOpacity).toBe(1);
    }));

    it('ngAfterViewInit: should call recalculateHeaderSize', () => {
      spyOn(component, 'recalculateHeaderSize');

      component.ngAfterViewInit();

      expect(component.recalculateHeaderSize).toHaveBeenCalled();
    });

    it('setHeightContent: should calculate height without pageHeader', () => {
      component.setHeightContent(undefined);

      const bodyHeight = document.body.clientHeight;
      const valueExpected = bodyHeight;

      expect(component.height).toBe(`${valueExpected}px`);
    });

    it('setHeightContent: should calculate height with bottom actions', () => {
      const pageHeaderElement = fixtureDiv.debugElement.nativeElement.querySelector('.po-page-header') as HTMLElement;
      const pageHeaderHeight = pageHeaderElement.offsetTop + pageHeaderElement.offsetHeight;
      const bodyHeight = document.body.clientHeight;
      const valueExpected = bodyHeight - pageHeaderHeight;

      component.setHeightContent(pageHeaderElement);

      expect(component.height).toBe(`${valueExpected}px`);
    });
  });
});
