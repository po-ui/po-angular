import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { changeBrowserInnerWidth, configureTestSuite } from '../../../util-test/util-expect.spec';

import * as UtilsFunction from '../../../utils/util';

import { PoBreadcrumbModule } from '../../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../../po-button/po-button.module';
import { PoDisclaimerGroupModule } from './../../po-disclaimer-group/po-disclaimer-group.module';
import { PoDropdownModule } from '../../po-dropdown/po-dropdown.module';

import { PoDisclaimer } from '../../po-disclaimer/po-disclaimer.interface';
import { PoPageComponent } from '../po-page.component';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageHeaderComponent } from '../po-page-header/po-page-header.component';
import { PoPageListComponent } from './po-page-list.component';

let routerStub;
let eventClick;
let eventResize;
let eventInput;
let eventSubmit;

routerStub = {
  navigate: jasmine.createSpy('navigate')
};

eventClick = document.createEvent('Event');
eventClick.initEvent('click', false, true);

eventResize = document.createEvent('Event');
eventResize.initEvent('resize', false, true);

eventInput = document.createEvent('Event');
eventInput.initEvent('input', true, false);

eventSubmit = document.createEvent('Event');
eventSubmit.initEvent('submit', true, false);

@Component({
  template: ` <po-page-list p-title="Unit Test" [p-actions]="actions"> </po-page-list> `
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
describe('PoPageListComponent - Mobile:', () => {
  let component: PoPageListComponent;
  let fixture: ComponentFixture<PoPageListComponent>;
  let mobileFixture: ComponentFixture<MobileComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([]),
        PoBreadcrumbModule,
        PoButtonModule,
        PoDisclaimerGroupModule,
        PoDropdownModule
      ],
      declarations: [
        MobileComponent,
        PoPageComponent,
        PoPageListComponent,
        PoPageHeaderComponent,
        PoPageContentComponent
      ],
      providers: [{ provide: Router, useValue: routerStub }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageListComponent);
    component = fixture.componentInstance;

    mobileFixture = TestBed.createComponent(MobileComponent);

    component.actions = [
      { label: 'Save', action: () => {} },
      { label: 'Cancel', action: () => {} },
      { label: 'Save New', action: () => {} },
      { label: 'Exceed Limit', action: () => {} }
    ];

    changeBrowserInnerWidth(400);
    window.dispatchEvent(eventResize);
    component['initializeListeners']();

    fixture.detectChanges();
    mobileFixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
});

@Component({
  template: ` <po-page-list p-title="Unit Test" [p-filter]="filter" [p-actions]="actions"> </po-page-list> `
})
class DesktopComponent {
  public model = '123';

  public filter = {
    placeholder: 'Pesquise',
    action: this.action
  };

  public actions: Array<{}> = [
    { label: 'Save', action: this.save },
    { label: 'Null', action: null }
  ];

  save(): boolean {
    return true;
  }

  action(): boolean {
    return true;
  }
}
describe('PoPageListComponent - Desktop:', () => {
  let component: PoPageListComponent;
  let fixture: ComponentFixture<PoPageListComponent>;
  let desktopFixture: ComponentFixture<DesktopComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        PoBreadcrumbModule,
        PoButtonModule,
        PoDisclaimerGroupModule,
        PoDropdownModule
      ],
      declarations: [
        DesktopComponent,
        PoPageComponent,
        PoPageListComponent,
        PoPageHeaderComponent,
        PoPageContentComponent
      ],
      providers: [{ provide: Router, useValue: routerStub }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageListComponent);
    component = fixture.componentInstance;

    component.actions = [
      { label: 'Save', action: () => {} },
      { label: 'Cancel', action: () => {} },
      { label: 'Save New', action: () => {} },
      { label: 'Exceed Limit', action: () => {} }
    ];

    changeBrowserInnerWidth(1024);

    window.dispatchEvent(eventResize);

    desktopFixture = TestBed.createComponent(DesktopComponent);

    fixture.detectChanges();
    desktopFixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should limit primary actions when screen width is desktop', () => {
    expect(component.isMobile).toBeFalsy();
    expect(component.limitPrimaryActions).toBe(3);
    expect(component.dropdownActions.length).toBe(2);
  });

  it('should be call method of parent passsing function', fakeAsync(() => {
    const element = desktopFixture.debugElement.nativeElement;
    const poButton = element.querySelectorAll('po-button > button')[0];

    spyOn(poButton, 'dispatchEvent');

    poButton.click();
    poButton.dispatchEvent(event);

    desktopFixture.detectChanges();

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  }));

  it('should be call method of parent passing null', () => {
    const poButton = desktopFixture.debugElement.nativeElement.querySelectorAll('po-button > button')[1];

    spyOn(poButton, 'dispatchEvent');

    poButton.click();
    poButton.dispatchEvent(event);

    desktopFixture.detectChanges();

    expect(poButton.dispatchEvent).toHaveBeenCalled();
  });

  it('should call callActionFilter on key press', () => {
    spyOn(component, 'callActionFilter');

    component.onkeypress(15);
    expect(component.callActionFilter).not.toHaveBeenCalled();
    component.onkeypress(13);
    expect(component.callActionFilter).toHaveBeenCalled();
  });

  it('should be change model', done => {
    const input = desktopFixture.nativeElement.querySelector('input');
    desktopFixture.whenStable().then(() => {
      input.value = 'Ola mundo';

      input.dispatchEvent(eventInput);
      expect(input.value).toEqual('Ola mundo');

      done();
    });
  });

  it('onChangeDisclaimerGroup: should call recalculateHeaderSize when have disclaimers and isRecalculate is true', () => {
    component['isRecalculate'] = true;
    const disclaimers: Array<PoDisclaimer> = [{ value: 'hotel', label: 'Hotel', property: 'hotel' }];

    spyOn(component.poPageContent, 'recalculateHeaderSize');
    component.onChangeDisclaimerGroup(disclaimers);

    expect(component.poPageContent.recalculateHeaderSize).toHaveBeenCalled();
  });

  it('onChangeDisclaimerGroup: should call recalculateHeaderSize when have 0 disclaimers and isRecalculate is false ', () => {
    component['isRecalculate'] = false;
    const disclaimers: Array<PoDisclaimer> = [];

    spyOn(component.poPageContent, 'recalculateHeaderSize');
    component.onChangeDisclaimerGroup(disclaimers);

    expect(component.poPageContent.recalculateHeaderSize).toHaveBeenCalled();
  });

  it('onChangeDisclaimerGroup: should not call recalculateHeaderSize when have disclaimers and isRecalculate is false', () => {
    component['isRecalculate'] = false;
    const disclaimers: Array<PoDisclaimer> = [
      { value: 'hotel', label: 'Hotel', property: 'hotel' },
      { value: 'teste2', label: 'teste2', property: 'teste2' },
      { value: 'teste3', label: 'teste3', property: 'teste3' }
    ];

    spyOn(component.poPageContent, 'recalculateHeaderSize');
    component.onChangeDisclaimerGroup(disclaimers);

    expect(component.poPageContent.recalculateHeaderSize).not.toHaveBeenCalled();
  });

  it('onChangeDisclaimerGroup: should not call recalculateHeaderSize when not have disclaimers and call change of disclaimerGroup', () => {
    const disclaimers: Array<PoDisclaimer> = [];
    component.disclaimerGroup = { change: () => {}, disclaimers, title: 'teste' };

    spyOn(component.poPageContent, 'recalculateHeaderSize');
    spyOn(component.disclaimerGroup, 'change');

    component.onChangeDisclaimerGroup(disclaimers);

    expect(component.poPageContent.recalculateHeaderSize).not.toHaveBeenCalled();
    expect(component.disclaimerGroup.change).toHaveBeenCalled();
  });

  it('onRemoveDisclaimer: should call disclaimerGroup.remove if it`s defined', () => {
    const currentDisclaimers: Array<PoDisclaimer> = [{ value: 'test2' }, { value: 'test3' }];

    const removedDisclaimer = { value: 'hotel' };

    component.disclaimerGroup = {
      remove: () => {},
      disclaimers: currentDisclaimers,
      title: 'test'
    };

    const removeData = { removedDisclaimer, currentDisclaimers };

    spyOn(component.disclaimerGroup, 'remove');

    component.onRemoveDisclaimer(removeData);

    expect(component.disclaimerGroup.remove).toHaveBeenCalledWith(removeData);
  });

  it('onRemoveDisclaimer: shouldn`t return an error if disclaimerGroup.remove is undefined', () => {
    component.disclaimerGroup = {
      remove: undefined,
      disclaimers: [],
      title: 'test'
    };

    const result = () => component.onRemoveDisclaimer(undefined);

    expect(result).not.toThrowError();
  });

  it('onRemoveAllDisclaimers: shouldn`t return an error disclaimerGroup.removeAll is undefined', () => {
    component.disclaimerGroup = {
      removeAll: undefined,
      disclaimers: [],
      title: 'test'
    };

    const result = () => component.onRemoveAllDisclaimers(undefined);

    expect(result).not.toThrowError();
  });

  it('onRemoveAllDisclaimers: should call disclaimerGroup.removeAll if it`s defined', () => {
    const removedDisclaimers: Array<PoDisclaimer> = [{ value: 'test2' }, { value: 'test3' }];

    component.disclaimerGroup = {
      removeAll: () => {},
      disclaimers: removedDisclaimers,
      title: 'test'
    };

    spyOn(component.disclaimerGroup, 'removeAll');

    component.onRemoveAllDisclaimers(removedDisclaimers);

    expect(component.disclaimerGroup.removeAll).toHaveBeenCalledWith(removedDisclaimers);
  });

  describe('Templates:', () => {
    it('po-disclaimer-group: should check if the po-disclaimer-group is visible ', () => {
      component.disclaimerGroup = { change: () => {}, disclaimers: [], title: 'teste' };

      fixture.detectChanges();
      expect(nativeElement.querySelector('po-disclaimer-group')).toBeTruthy();
    });

    it('actionIsDisabled: should disable page button with boolean value', () => {
      component.actions[0] = { label: 'First Action', disabled: true };
      component.actions[1] = { label: 'Second Action', disabled: true };

      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(2);
    });

    it('actionIsDisabled: should disable page button with function value', () => {
      component.actions[0] = { label: 'First Action', disabled: () => true };
      component.actions[1] = { label: 'Second Action', disabled: () => true };

      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(2);
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

    it('actionIsDisabled: should not disable page buttons with boolean value', () => {
      component.actions[0] = { label: 'First Action', disabled: false };
      component.actions[1] = { label: 'Second Action', disabled: false };

      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(0);
    });

    it('actionIsDisabled: should not disable page buttons with function value', () => {
      component.actions[0] = { label: 'First Action', disabled: () => false };
      component.actions[1] = { label: 'Second Action', disabled: () => false };

      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('.po-button:disabled');
      expect(buttons.length).toBe(0);
    });

    it('should show page header if `hasPageHeader` return true', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(true);
      fixture.detectChanges();
      expect(nativeElement.querySelector('po-page-header')).toBeTruthy();
    });

    it('should hide page header if `hasPageHeader` return false', () => {
      spyOn(component, 'hasPageHeader').and.returnValue(false);
      fixture.detectChanges();
      expect(nativeElement.querySelector('po-page-header')).toBeFalsy();
    });

    it('should add class `po-page-list-header-padding` if has filter and doesn`t have action.', () => {
      component.title = 'Title';
      component.filter = { action: () => {} };
      component.actions = [];
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-list-header-padding')).toBeTruthy();
    });

    it('should add class `po-page-list-actions-padding` if has filter.', () => {
      component.filter = { action: () => {} };
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-list-actions-padding')).toBeTruthy();
    });

    it('should show only one icon in button actions.', () => {
      component.actions[0].icon = 'po-icon-news';
      component.actions[1].icon = 'po-icon-news';
      component.actions[2].icon = 'po-icon-news';

      fixture.detectChanges();

      const icons = nativeElement.querySelectorAll('.po-icon-news');

      expect(icons.length).toBe(1);
    });

    it('should show `filter.placeholder` value if has `filter.placeholder`.', () => {
      component.filter = { placeholder: 'placeholder input' };
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input').placeholder).toBe('placeholder input');
    });

    it('should show `` empty value if filter.placeholder is undefined.', () => {
      component.filter = {};
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input').placeholder).toBe('');
    });
  });

  describe('Methods:', () => {
    it('callActionFilter: should call `filter.action` and `ChangeDetectorRef.detectChanges`', () => {
      component.filter = { action: () => {} };
      component.filterInput = <any>{
        nativeElement: { value: 'test filter' }
      };
      const fieldProperty = 'action';

      const changeDetectorSpy = spyOn(component['changeDetector'], 'detectChanges');
      const filterActionSpy = spyOn(component.filter, <any>fieldProperty);

      component.callActionFilter(fieldProperty);

      expect(filterActionSpy).toHaveBeenCalledBefore(changeDetectorSpy);
      expect(filterActionSpy).toHaveBeenCalledWith('test filter');
      expect(changeDetectorSpy).toHaveBeenCalled();
    });

    it('clearInputSearch: should call and clear input', () => {
      component.filterInput = <any>{
        nativeElement: { value: 'test filter' }
      };

      component.clearInputSearch();

      expect(component.filterInput.nativeElement.value).toBe(null);
    });

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

    it('filterSizeClass: should return `po-sm-6 po-md-6 po-lg-6 po-xl-6` when width is 6', () => {
      component.filter = { width: 6 };
      expect(component.filterSizeClass(6)).toBe('po-sm-6 po-md-6 po-lg-6 po-xl-6');
    });

    it('filterSizeClass: should return `po-sm-6 po-md-6 po-lg-6 po-xl-6` when width is 6 and has advancedAction', () => {
      component.filter = { width: 6, advancedAction: () => {} };
      expect(component.filterSizeClass(6)).toBe('po-sm-6 po-md-6 po-lg-6 po-xl-6');
    });

    it('filterSizeClass: should return `po-sm-2 po-md-1 po-lg-1 po-xl-1` when width is 1', () => {
      component.filter = { width: 1 };
      expect(component.filterSizeClass(1)).toBe('po-sm-2 po-md-1 po-lg-1 po-xl-1');
    });

    it('filterSizeClass: should return `po-sm-6 po-md-4 po-lg-2 po-xl-2` when width is 1 and has advancedAction', () => {
      component.filter = { width: 1, advancedAction: () => {} };
      expect(component.filterSizeClass(1)).toBe('po-sm-6 po-md-4 po-lg-2 po-xl-2');
    });

    it('filterSizeClass: should return `po-sm-3 po-md-3 po-lg-3 po-xl-3` when width is 3', () => {
      component.filter = { width: 3 };
      expect(component.filterSizeClass(3)).toBe('po-sm-3 po-md-3 po-lg-3 po-xl-3');
    });

    it('filterSizeClass: should return `po-sm-6 po-md-4 po-lg-3 po-xl-3` when width is 3 and has advancedAction', () => {
      component.filter = { width: 3, advancedAction: () => {} };
      expect(component.filterSizeClass(3)).toBe('po-sm-6 po-md-4 po-lg-3 po-xl-3');
    });

    it('filterSizeClass: should return `po-sm-6 po-md-6 po-lg-6 po-xl-6` when doesn`t have filter', () => {
      component.filter = {};
      expect(component.filterSizeClass(6)).toBe('po-sm-6 po-md-6 po-lg-6 po-xl-6');
    });

    it('filterSizeClass: should return `po-sm-6 po-md-6 po-lg-6 po-xl-6` when doesn`t have filter', () => {
      component.filter = undefined;
      expect(component.filterSizeClass(6)).toBe('po-sm-6 po-md-6 po-lg-6 po-xl-6');
    });

    it('filterSizeClass: should return `po-sm-2 po-md-1 po-lg-1 po-xl-1` when doesn`t have filter', () => {
      component.filter = undefined;
      expect(component.filterSizeClass(1)).toBe('po-sm-2 po-md-1 po-lg-1 po-xl-1');
    });

    it('hasCustomFilterSize: should return `true` when has filter.width', () => {
      component.filter = { width: 3 };
      expect(component.hasCustomFilterSize()).toBe(true);
    });

    it('hasCustomFilterSize: should return `false` when filter.width is out of range', () => {
      component.filter = { width: 0 };
      expect(component.hasCustomFilterSize()).toBe(false);
    });

    it('hasCustomFilterSize: should return `false` when filter.width is out of range', () => {
      component.filter = { width: 99 };
      expect(component.hasCustomFilterSize()).toBe(false);
    });

    it('hasCustomFilterSize: should return `false` when doesn`t have filter.width', () => {
      component.filter = {};
      expect(component.hasCustomFilterSize()).toBe(false);
    });

    it('hasCustomFilterSize: should return `false` when doesn`t have filter.width', () => {
      component.filter = undefined;
      expect(component.hasCustomFilterSize()).toBe(false);
    });

    describe('initializeFixedLiterals:', () => {
      it('should return the advanced filter label by `pt` language.', () => {
        component['language'] = 'pt';

        expect(component['initializeFixedLiterals']()).toBe('Busca avançada');
      });

      it('should return the advanced filter label by `en` language.', () => {
        component['language'] = 'en';

        expect(component['initializeFixedLiterals']()).toBe('Advanced search');
      });

      it('should return the advanced filter label by `es` language.', () => {
        component['language'] = 'es';

        expect(component['initializeFixedLiterals']()).toBe('Búsqueda avanzada');
      });

      it('should return the advanced filter label by `ru` language.', () => {
        component['language'] = 'ru';

        expect(component['initializeFixedLiterals']()).toBe('полный поиск');
      });
    });
  });
});
