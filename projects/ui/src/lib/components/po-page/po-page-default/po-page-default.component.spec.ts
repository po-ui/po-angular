import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { changeBrowserInnerWidth } from '../../../util-test/util-expect.spec';

import { PoUtils as UtilsFunction } from '../../../utils/util';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../../po-button';
import { PoDropdownModule } from '../../po-dropdown/po-dropdown.module';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoPageDefaultComponent } from './po-page-default.component';
import { PoPageComponent } from '../po-page.component';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageHeaderComponent } from '../po-page-header/po-page-header.component';
import { backNavigationAriaLabels } from './po-page-default-base.component';

const eventClick = document.createEvent('Event');
eventClick.initEvent('click', false, true);

const eventResize = document.createEvent('Event');
eventResize.initEvent('resize', false, true);

@Component({
  template: ` <po-page-default p-title="Unit Test" [p-actions]="actions"> </po-page-default> `,
  standalone: false
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), PoBreadcrumbModule, PoButtonModule, PoDropdownModule],
      declarations: [
        MobileComponent,
        PoPageDefaultComponent,
        PoPageComponent,
        PoPageContentComponent,
        PoPageHeaderComponent
      ],
      providers: [{ provide: Router, useValue: routerStub }]
    }).compileComponents();

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
    //expect(component.dropdownActions.length).toBe(3);
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
  template: ` <po-page-default p-title="Unit Test" [p-actions]="actions"> </po-page-default> `,
  standalone: false
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), PoBreadcrumbModule, PoButtonModule, PoDropdownModule],
      declarations: [
        DesktopComponent,
        PoPageDefaultComponent,
        PoPageComponent,
        PoPageContentComponent,
        PoPageHeaderComponent
      ]
    }).compileComponents();

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
    it('actionIsVisible: should visible page button with boolean value', () => {
      component.actions[0] = { label: 'First Action', visible: true };
      component.actions[1] = { label: 'Second Action', visible: true };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button');
      expect(buttons.length).toBe(2);
    });

    it('actionIsVisible: should visible page button with function value', () => {
      component.actions[0] = { label: 'First Action', visible: () => true };
      component.actions[1] = { label: 'Second Action', visible: () => true };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button');
      expect(buttons.length).toBe(2);
    });

    it('actionIsVisible: should not visible page buttons with boolean value', () => {
      component.actions[0] = { label: 'First Action', visible: false };
      component.actions[1] = { label: 'Second Action', visible: false };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button');
      expect(buttons.length).toBe(0);
    });

    it('actionIsVisible: should not visible page buttons with function value', () => {
      component.actions[0] = { label: 'First Action', visible: () => false };
      component.actions[1] = { label: 'Second Action', visible: () => false };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button');
      expect(buttons.length).toBe(0);
    });

    it('actionIsDisabled: should disable page button with boolean value', () => {
      component.actions[0] = { label: 'First Action', disabled: true };
      component.actions[1] = { label: 'Second Action', disabled: true };

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(2);
    });

    it('actionIsDisabled: should disable page button with function value', () => {
      component.actions[0] = { label: 'First Action', disabled: () => true };
      component.actions[1] = { label: 'Second Action', disabled: () => true };

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

    it('should show icons in all visible button actions.', () => {
      component.actions[0] = { label: 'action 1', icon: 'an-newspaper' };
      component.actions[1] = { label: 'action 2', icon: 'an-newspaper' };
      component.actions[2] = { label: 'action 3', icon: 'an-newspaper' };

      fixture.detectChanges();

      const icons = fixture.debugElement.nativeElement.querySelectorAll('.an-newspaper');

      expect(icons.length).toBe(3);
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

    it('actionIsVisible: should return boolean value', () => {
      const action = { visible: true };

      const returnValue = component.actionIsVisible(action);

      expect(returnValue).toBeTruthy(true);
    });

    it('actionIsVisible: should return true in function result', () => {
      const action = { visible: () => true };

      const returnValue = component.actionIsVisible(action);

      expect(returnValue).toBeTruthy(true);
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

    it('hasPageHeader: should return true through visibleActions length in primary header', () => {
      component.pageHeaderType = 'primary';
      component.breadcrumb = undefined;
      component.title = undefined;

      spyOn(component, 'getVisibleActions').and.returnValue([{ label: 'action' } as any]);

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true if has title', () => {
      component.actions = [];
      component.breadcrumb = undefined;
      component.title = 'Title';

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return true for tertiary header when title is empty and has visible actions', () => {
      component.pageHeaderType = 'tertiary';
      component.title = undefined;
      component.breadcrumb = undefined;

      spyOn(component, 'getVisibleActions').and.returnValue([{ label: 'action' } as any]);

      expect(component.hasPageHeader()).toBe(true);
    });

    it('hasPageHeader: should return false for tertiary header when title is empty and has no visible actions', () => {
      component.pageHeaderType = 'tertiary';
      component.title = undefined;
      component.breadcrumb = { items: [{ label: 'Breadcrumb' }] };

      spyOn(component, 'getVisibleActions').and.returnValue([]);

      expect(component.hasPageHeader()).toBe(false);
    });

    it('hasPageHeader: should return false if doesn`t have actions, breadcrumb and title', () => {
      component.actions = [];
      component.breadcrumb = undefined;
      component.title = undefined;

      expect(component.hasPageHeader()).toBe(false);
    });

    it('hasPageHeader: should return true for secondary header even without title, actions and breadcrumb', () => {
      component.actions = [];
      component.breadcrumb = undefined;
      component.title = undefined;
      component.pageHeaderType = 'secondary';

      expect(component.hasPageHeader()).toBe(true);
    });

    it('setDropdownActions: should put all actions in dropdown when pageActionsLayout is `dropdown`', () => {
      component.actions = [{ label: 'action1' }, { label: 'action2' }, { label: 'action3' }];
      component.pageActionsLayout = 'dropdown';
      component.setDropdownActions();

      expect(component.dropdownActions).toEqual(component.visibleActions);
    });

    it('setDropdownActions: should put all actions except first in dropdown when pageActionsLayout is `mixed`', () => {
      component.actions = [{ label: 'action1' }, { label: 'action2' }, { label: 'action3' }];
      component.pageActionsLayout = 'mixed';
      component.setDropdownActions();

      expect(component.dropdownActions).toEqual(component.visibleActions.slice(1));
    });

    it('setDropdownActions: should use default behavior when pageActionsLayout is `default`', () => {
      component.actions = [{ label: 'action1' }, { label: 'action2' }, { label: 'action3' }, { label: 'action4' }];
      component.pageActionsLayout = 'default';
      component.setDropdownActions();

      expect(component.dropdownActions).toEqual(component.visibleActions.slice(component.limitPrimaryActions - 1));
    });
  });

  describe('Template - Secondary Header', () => {
    it('should render back button with icon-only (no label) by default when pageHeaderType is secondary', () => {
      component.pageHeaderType = 'secondary';
      component.title = 'Secondary Page';
      component.actions = [];

      fixture.detectChanges();

      const backButton = fixture.debugElement.nativeElement.querySelector('po-button[po-page-header-navigation]');
      expect(backButton).toBeTruthy();

      const buttonEl = backButton.querySelector('button');
      expect(buttonEl).toBeTruthy();
    });

    it('should emit `back` event when back button is clicked on secondary header', () => {
      component.pageHeaderType = 'secondary';
      component.title = 'Secondary Page';
      component.actions = [];

      fixture.detectChanges();

      spyOn(component.back, 'emit');

      const backButton = fixture.debugElement.nativeElement.querySelector(
        'po-button[po-page-header-navigation] button'
      );
      if (backButton) {
        backButton.click();
        expect(component.back.emit).toHaveBeenCalled();
      }
    });

    it('should not render breadcrumb when pageHeaderType is secondary', () => {
      component.pageHeaderType = 'secondary';
      component.title = 'Secondary Page';
      component.breadcrumb = { items: [{ label: 'Home' }] };
      component.actions = [];

      fixture.detectChanges();

      const breadcrumb = fixture.debugElement.nativeElement.querySelector('.po-page-header-breadcrumb');
      expect(breadcrumb).toBeFalsy();
    });

    it('should default action buttons to secondary kind when pageHeaderType is secondary', () => {
      component.pageHeaderType = 'secondary';
      component.title = 'Secondary Page';
      component.actions = [{ label: 'Action 1' }, { label: 'Action 2' }];

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-page-header-actions po-button');
      buttons.forEach(button => {
        const buttonEl = button.querySelector('button');
        if (buttonEl) {
          expect(buttonEl.classList.contains('po-button-primary')).toBeFalsy();
        }
      });
    });

    it('should respect individual kind from PoPageAction when pageHeaderType is secondary', () => {
      component.pageHeaderType = 'secondary';
      component.title = 'Secondary Page';
      component.actions = [{ label: 'Action 1', kind: 'primary' }, { label: 'Action 2' }];

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-page-header-actions po-button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should not render breadcrumb when pageHeaderType is tertiary', () => {
      component.pageHeaderType = 'tertiary';
      component.title = 'Tertiary Page';
      component.breadcrumb = { items: [{ label: 'Home' }] };
      component.actions = [];

      fixture.detectChanges();

      const breadcrumb = fixture.debugElement.nativeElement.querySelector('.po-page-header-breadcrumb');
      expect(breadcrumb).toBeFalsy();
    });

    it('should not render back button when pageHeaderType is tertiary', () => {
      component.pageHeaderType = 'tertiary';
      component.title = 'Tertiary Page';
      component.actions = [{ label: 'Action 1' }];

      fixture.detectChanges();

      const backButton = fixture.debugElement.nativeElement.querySelector('po-button[po-page-header-navigation]');
      expect(backButton).toBeFalsy();
    });

    it('should respect individual `kind` from PoPageAction when pageHeaderType is tertiary', () => {
      component.pageHeaderType = 'tertiary';
      component.title = 'Tertiary Page';
      component.actions = [{ label: 'Action 1', kind: 'primary' }];

      fixture.detectChanges();

      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.po-page-header-actions po-button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('backNavigationLabel', () => {
    it('should fallback to english label when language is not mapped in backNavigationAriaLabels', () => {
      const languageService = TestBed.inject(PoLanguageService);
      spyOn(languageService, 'getShortLanguage').and.returnValue('de');

      const newFixture = TestBed.createComponent(PoPageDefaultComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.backNavigationLabel).toBe('Back');
    });
  });

  describe('getActionKind', () => {
    it('should return "primary" when action.kind is "primary"', () => {
      expect(component.getActionKind({ label: 'A', kind: 'primary' }, 'secondary')).toBe('primary');
    });

    it('should return "secondary" when action.kind is "secondary"', () => {
      expect(component.getActionKind({ label: 'A', kind: 'secondary' }, 'primary')).toBe('secondary');
    });

    it('should return fallback when action.kind is "tertiary" (invalid)', () => {
      expect(component.getActionKind({ label: 'A', kind: 'tertiary' }, 'primary')).toBe('primary');
    });

    it('should return fallback when action.kind is undefined', () => {
      expect(component.getActionKind({ label: 'A' }, 'secondary')).toBe('secondary');
    });

    it('should return fallback when action.kind is an invalid string', () => {
      expect(component.getActionKind({ label: 'A', kind: 'invalid' }, 'primary')).toBe('primary');
    });

    it('should return fallback when action.kind is empty string', () => {
      expect(component.getActionKind({ label: 'A', kind: '' }, 'secondary')).toBe('secondary');
    });

    it('should allow only one primary kind - second primary falls back to secondary', () => {
      component.hasPageHeader();
      expect(component.getActionKind({ label: 'A', kind: 'primary' }, 'secondary')).toBe('primary');
      expect(component.getActionKind({ label: 'B', kind: 'primary' }, 'secondary')).toBe('secondary');
    });
  });
});

describe('PoPageDefaultComponent i18n fallback', () => {
  let fixture: ComponentFixture<PoPageDefaultComponent>;
  let component: PoPageDefaultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), PoBreadcrumbModule, PoButtonModule, PoDropdownModule],
      declarations: [PoPageDefaultComponent, PoPageComponent, PoPageContentComponent, PoPageHeaderComponent],
      providers: [{ provide: PoLanguageService, useValue: { getShortLanguage: () => 'fr' } }]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('constructor: should fallback back navigation aria label to english when language key is not found', () => {
    expect(component['backNavigationLabel']).toBe(backNavigationAriaLabels['en']);
  });
});
