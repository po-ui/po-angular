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
  template: `
    <po-page-list p-title="Unit Test" [p-actions]="actions"> </po-page-list>
  `
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

  it('should be call method of parent passsing string', () => {
    const poButton = mobileFixture.debugElement.nativeElement.querySelectorAll('po-button > button')[0];

    spyOn(poButton, 'dispatchEvent');

    poButton.click();
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
});

@Component({
  template: `
    <po-page-list p-title="Unit Test" [p-filter]="filter" [p-actions]="actions"> </po-page-list>
  `
})
class DesktopComponent {
  public model = '123';

  public filter = {
    placeholder: 'Pesquise',
    action: this.action,
    ngModel: 'model'
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

  it('should call parent function', () => {
    const context = {
      getName: function() {
        return 'PO';
      }
    };
    const fakeThis = {
      parentRef: context,
      filter: { 'funcao': 'getName' },
      callFunction: component.callFunction
    };

    spyOn(context, 'getName');
    component.callActionFilter.call(fakeThis, 'funcao');
    expect(context.getName).toHaveBeenCalled();
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

  it('should change model in parentRef', () => {
    const fakeThis = {
      parentRef: {
        modelFilter: 'filter'
      },
      filter: {
        ngModel: 'modelFilter'
      }
    };

    component.changeModel.call(fakeThis, 'new filter');
    expect(fakeThis.parentRef.modelFilter).toBe('new filter');
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

  describe('Templates:', () => {
    const fakeFilter = {
      advancedAction: 'xxx',
      ngModel: 'model'
    };

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
      component.filter = fakeFilter;
      component.actions = [];
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-list-header-padding')).toBeTruthy();
    });

    it('should add class `po-page-list-actions-padding` if has filter.', () => {
      component.filter = fakeFilter;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-page-list-actions-padding')).toBeTruthy();
    });

    it('should show only one icon in button actions.', () => {
      component.actions[0].icon = 'po-icon-portinari';
      component.actions[1].icon = 'po-icon-portinari';
      component.actions[2].icon = 'po-icon-portinari';

      fixture.detectChanges();

      const icons = nativeElement.querySelectorAll('.po-icon-portinari');

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
    it('callAction: should open an external URL in a new tab in the browser by calling Utils`s openExternalLink method', () => {
      const url = 'http://portinari.io';

      spyOn(UtilsFunction, 'openExternalLink');

      component.callAction({ label: 'Portinari', url });

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
