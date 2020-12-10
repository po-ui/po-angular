import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { changeBrowserInnerWidth, configureTestSuite } from '../../../util-test/util-expect.spec';

import * as UtilsFunction from '../../../utils/util';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../../po-button';
import { PoDropdownModule } from '../../po-dropdown/po-dropdown.module';

import { PoPageDefaultComponent } from './po-page-default.component';
import { PoPageComponent } from '../po-page.component';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageHeaderComponent } from '../po-page-header/po-page-header.component';

let eventClick;
let eventResize;

eventClick = document.createEvent('Event');
eventClick.initEvent('click', false, true);

eventResize = document.createEvent('Event');
eventResize.initEvent('resize', false, true);

@Component({
  template: ` <po-page-default p-title="Unit Test" [p-actions]="actions"> </po-page-default> `
})
class MobileComponent {
  public actions: Array<{}> = [
    { label: 'Save', action: 'save' },
    { label: 'Cancel', action: this.cancel },
    { label: 'Save New', action: this.saveNew }
  ];

  cancel(): boolean {
    return true;
  }

  save(): boolean {
    return true;
  }

  saveNew(): boolean {
    return true;
  }
}
describe('PoPageDefaultComponent mobile', () => {
  let component: PoPageDefaultComponent;
  let fixture: ComponentFixture<PoPageDefaultComponent>;

  let mobileFixture: ComponentFixture<MobileComponent>;

  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoBreadcrumbModule, PoButtonModule, PoDropdownModule],
      declarations: [
        MobileComponent,
        PoPageDefaultComponent,
        PoPageComponent,
        PoPageContentComponent,
        PoPageHeaderComponent
      ],
      providers: [{ provide: Router, useValue: routerStub }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDefaultComponent);
    component = fixture.componentInstance;

    mobileFixture = TestBed.createComponent(MobileComponent);

    changeBrowserInnerWidth(450);

    window.dispatchEvent(eventResize);

    component.actions = [
      { label: 'Save', action: () => {} },
      { label: 'Cancel', action: () => {} },
      { label: 'Save New', action: () => {} },
      { label: 'Exceed Limit', action: () => {} }
    ];

    fixture.detectChanges();
    mobileFixture.detectChanges();
  });

  it('should be created', () => {
    changeBrowserInnerWidth(450);
    window.dispatchEvent(eventResize);

    expect(component instanceof PoPageDefaultComponent).toBeTruthy();
  });

  it('should be call method of parent passing string', () => {
    const poButton = mobileFixture.debugElement.nativeElement.querySelectorAll('po-button > button')[0];

    spyOn(poButton, 'dispatchEvent');

    poButton.dispatchEvent(new Event('click'));

    mobileFixture.detectChanges();

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  });

  it('should be call method of parent passsing url', () => {
    component.callAction({ label: 'Somewhere', url: '/somewhere' });

    expect(routerStub.navigate).toHaveBeenCalledWith(['/somewhere']);
  });

  it('should limit primary actions when screen width is mobile', () => {
    expect(component.isMobile).toBe(true);
    expect(component.limitPrimaryActions).toBe(2);
    expect(component.dropdownActions.length).toBe(3);
  });

  it('should call action', () => {
    const fakeThis = {
      saveAction: function (val) {},
      undefinedAction: undefined
    };

    spyOn(fakeThis, 'saveAction');
    component.callAction({ label: 'Save', url: null, action: fakeThis.saveAction });
    component.callAction.call(fakeThis, '');
    expect(fakeThis.saveAction).toHaveBeenCalled();

    component.callAction({ label: 'Save', url: null, action: fakeThis.undefinedAction });
  });
});

@Component({
  template: ` <po-page-default p-title="Unit Test" [p-actions]="actions"> </po-page-default> `
})
class DesktopComponent {
  public actions: Array<{}> = [
    { label: 'Save', action: this.save },
    { label: 'Null', action: null }
  ];

  save(): boolean {
    return true;
  }
}
describe('PoPageDefaultComponent desktop', () => {
  let component: PoPageDefaultComponent;
  let fixture: ComponentFixture<PoPageDefaultComponent>;
  let desktopFixture: ComponentFixture<DesktopComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoBreadcrumbModule, PoButtonModule, PoDropdownModule],
      declarations: [
        DesktopComponent,
        PoPageDefaultComponent,
        PoPageComponent,
        PoPageContentComponent,
        PoPageHeaderComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDefaultComponent);
    component = fixture.componentInstance;

    desktopFixture = TestBed.createComponent(DesktopComponent);

    changeBrowserInnerWidth(1024);

    window.dispatchEvent(eventResize);

    fixture.detectChanges();
    desktopFixture.detectChanges();
  });

  it('should be created', () => {
    changeBrowserInnerWidth(1024);
    window.dispatchEvent(eventResize);

    expect(component instanceof PoPageDefaultComponent).toBeTruthy();
  });

  it('should be call function of parent passsing function reference', () => {
    const poButton = desktopFixture.debugElement.nativeElement.querySelectorAll('po-button > button')[0];

    spyOn(poButton, 'dispatchEvent');

    poButton.dispatchEvent(eventClick);

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  });

  it('should be call function of parent passing null', () => {
    const poButton = desktopFixture.debugElement.nativeElement.querySelectorAll('po-button > button')[1];

    spyOn(poButton, 'dispatchEvent');

    poButton.dispatchEvent(eventClick);

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  });

  describe('Template', () => {
    it('actionIsDisabled: should disable page button with boolean value', () => {
      component.visibleActions[0] = { label: 'First Action', disabled: true };
      component.visibleActions[1] = { label: 'Second Action', disabled: true };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(2);
    });

    it('actionIsDisabled: should disable page button with function value', () => {
      component.visibleActions[0] = { label: 'First Action', disabled: () => true };
      component.visibleActions[1] = { label: 'Second Action', disabled: () => true };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(2);
    });

    it('actionIsDisabled: should not disable page buttons with boolean value', () => {
      component.actions[0] = { label: 'First Action', disabled: false };
      component.actions[1] = { label: 'Second Action', disabled: false };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(0);
    });

    it('actionIsDisabled: should not disable page buttons with function value', () => {
      component.actions[0] = { label: 'First Action', disabled: () => false };
      component.actions[1] = { label: 'Second Action', disabled: () => false };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(0);
    });

    it('should show page header if `hasPageHeader` return true', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(true);
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-page-header')).toBeTruthy();
    });

    it('should hide page header if `hasPageHeader` return false', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(false);
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-page-header')).toBeFalsy();
    });

    it('should show only one icon in button actions.', () => {
      component.visibleActions[0] = { label: 'action 1', icon: 'po-icon-news' };
      component.visibleActions[1] = { label: 'action 2', icon: 'po-icon-news' };
      component.visibleActions[2] = { label: 'action 3', icon: 'po-icon-news' };

      fixture.detectChanges();

      const icons = fixture.debugElement.nativeElement.querySelectorAll('.po-icon-news');

      expect(icons.length).toBe(1);
    });

    it('should not display buttons that have visible equal to false', () => {
      component.actions = [
        { label: 'action 1', visible: true },
        { label: 'action 2', visible: false },
        { label: 'action 3', visible: null },
        { label: 'action 4', visible: undefined }
      ];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelectorAll('po-button').length).toBe(3);
    });
  });

  describe('Methods', () => {
    it('callAction: should open an external URL in a new tab in the browser by calling Utils`s openExternalLink method', () => {
      const url = 'http://po-ui.io';

      spyOn(UtilsFunction, 'openExternalLink');

      component.callAction({ label: 'PO', url });

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(url);
    });

    it('actionIsDisabled: should return boolean value', () => {
      const action = { disabled: true };

      const returnValue = component.actionIsDisabled(action);

      expect(returnValue).toBeTruthy(true);
    });

    it('actionIsDisabled: should return true in function result', () => {
      const action = { disabled: () => true };

      const returnValue = component.actionIsDisabled(action);

      expect(returnValue).toBeTruthy(true);
    });

    it('hasPageHeader: should return true if has breadcrumb', () => {
      component.actions = [];
      component.title = undefined;
      component.breadcrumb = { items: [{ label: 'Breadcrumb' }] };

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has actions', () => {
      component.breadcrumb = undefined;
      component.title = undefined;
      component.actions = [{ label: 'action' }];

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has title', () => {
      component.actions = [];
      component.breadcrumb = undefined;
      component.title = 'Title';

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return false if doesn`t have actions, breadcrumb and title', () => {
      component.actions = [];
      component.breadcrumb = undefined;
      component.title = undefined;

      expect(component.hasPageHeader()).toBe(false);
    });
  });
});
