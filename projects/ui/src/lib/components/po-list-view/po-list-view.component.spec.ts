import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import * as UtilsFunctions from '../../utils/util';
import { PoButtonModule } from '../po-button';
import { PoPopupModule } from '../po-popup';

import { PoListViewBaseComponent } from './po-list-view-base.component';
import { PoListViewComponent } from './po-list-view.component';

describe('PoListViewComponent:', () => {
  let component: PoListViewComponent;
  let fixture: ComponentFixture<PoListViewComponent>;
  let debugElement;

  const item = { id: 1, name: 'register' };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoListViewComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule.withRoutes([]), PoButtonModule, PoPopupModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoListViewComponent);

    component = fixture.componentInstance;
    component.items = [item];

    debugElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoListViewBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hasContentTemplate: should return `true` if `listViewContentTemplate` is truthy', () => {
      component.listViewContentTemplate = <any>{ templateRef: '<span></span>' };

      expect(component.hasContentTemplate).toBe(true);
    });

    it('hasContentTemplate: should return `false` if `listViewContentTemplate` is undefined', () => {
      component.listViewContentTemplate = undefined;

      expect(component.hasContentTemplate).toBe(false);
    });

    it('hasDetailTemplate: should return `true` if `listViewDetailTemplate` is truthy', () => {
      component.listViewDetailTemplate = <any>{ templateRef: '<span></span>' };

      expect(component.hasDetailTemplate).toBe(true);
    });

    it('hasDetailTemplate: should return `false` if `listViewDetailTemplate` is undefined', () => {
      component.listViewDetailTemplate = undefined;

      expect(component.hasDetailTemplate).toBe(false);
    });

    it('displayShowMoreButton: should return `false` if `showMore.observers.length` is lower than 1', () => {
      expect(component.displayShowMoreButton).toBe(false);
    });

    it('displayShowMoreButton: should return `true` if contains `items` and `showMore.observers.length` is greater than 0', () => {
      component.showMore.observers.push(<any>[new Observable()]);

      expect(component.displayShowMoreButton).toBe(true);
    });

    it('showButtonsActions: should return `false` if not contains `actions`', () => {
      component.actions = [];

      expect(component.showButtonsActions).toBe(false);
    });

    it('showButtonsActions: should return `true` if `actions.length` is greater than 0 and lower than 2', () => {
      component.actions = [{ label: 'Label 01' }, { label: 'Label 02' }];

      expect(component.showButtonsActions).toBe(true);
    });

    it('showButtonsActions: should return `false` if `actions.length` is greater than 2', () => {
      component.actions = [{ label: 'Label 01' }, { label: 'Label 02' }, { label: 'Label 03' }];

      expect(component.showButtonsActions).toBe(false);
    });

    it('showButtonsActions: should return `true` if `actions.length` is greater than 2 but one action isn`t visible', () => {
      component.actions = [{ label: 'Label 01', visible: false }, { label: 'Label 02' }, { label: 'Label 03' }];

      expect(component.showButtonsActions).toBe(true);
    });

    it('showPopupActions: should return `true` if `actions.length` is greater than 2', () => {
      component.actions = [{ label: 'Label 01' }, { label: 'Label 02' }, { label: 'Label 03' }];

      expect(component.showPopupActions).toBe(true);
    });

    it('showPopupActions: should return `false` if `actions.length` is greater than 2 but one action isn`t visible', () => {
      component.actions = [{ label: 'Label 01', visible: false }, { label: 'Label 02' }, { label: 'Label 03' }];

      expect(component.showPopupActions).toBe(false);
    });

    it('showPopupActions: should return `false` if `actions.length` is lower than 2', () => {
      component.actions = [];

      expect(component.showPopupActions).toBe(false);
    });

    it('titleHasAction: should return `false` if `titleAction.observers.length` is lower than 1', () => {
      component.titleAction.observers = [];

      expect(component.titleHasAction).toBe(false);
    });

    it('titleHasAction: should return `true` if `titleAction.observers.length` is greater than 0', () => {
      component.titleAction.observers.push(<any>[new Observable()]);

      expect(component.titleHasAction).toBe(true);
    });
  });

  describe('Methods:', () => {
    it('ngDoCheck: should call `checkItemsChange`.', () => {
      spyOn(component, <any>'checkItemsChange');

      component.ngDoCheck();

      expect(component['checkItemsChange']).toHaveBeenCalled();
    });

    it('ngAfterContentInit: should call `initShowDetail`.', () => {
      spyOn(component, <any>'initShowDetail');

      component.ngAfterContentInit();

      expect(component['initShowDetail']).toHaveBeenCalled();
    });

    it('returnBooleanValue: should return `false` if `listViewAction.disabled` is `false`.', () => {
      const listViewAction = { label: 'PO ', disabled: false };

      spyOn(UtilsFunctions, 'isTypeof').and.returnValue(false);

      expect(component.returnBooleanValue(listViewAction, item)).toBe(listViewAction.disabled);
      expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
    });

    it('returnBooleanValue: should return `true` if `listViewAction.disabled` function return `true`.', () => {
      const listViewAction = { label: 'PO ', disabled: () => true };

      spyOn(listViewAction, 'disabled').and.returnValue(true);
      spyOn(UtilsFunctions, 'isTypeof').and.returnValue(true);

      expect(component.returnBooleanValue(listViewAction, item)).toBe(true);
      expect(listViewAction.disabled).toHaveBeenCalled();
      expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
    });

    it(`togglePopup: shoud call 'poPopupComponent.toggle' and 'changeDetector.detectChanges' and
      set 'popupTarget' with target param `, () => {
      const targetRef = '<span></span>';

      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(component.poPopupComponent, 'toggle');

      component.popupTarget = undefined;
      component.togglePopup(item, <any>targetRef);

      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      expect(component.poPopupComponent.toggle).toHaveBeenCalledWith(item);
      expect(component.popupTarget).toEqual(targetRef);
    });

    it('trackBy: should return `index`', () => {
      const index = 1;

      expect(component.trackBy(index)).toBe(index);
    });

    it('visibleActions: should be `false` if doesn`t have action.', () => {
      component.actions = undefined;

      expect(component.visibleActions).toEqual([]);
    });

    it('visibleActions: shouldn`t return action if visible is `false`.', () => {
      component.actions = [
        { label: 'PO1', visible: false },
        { label: 'PO2', visible: true }
      ];

      expect(component.visibleActions).toEqual([{ label: 'PO2', visible: true }]);
    });

    describe('checkItemsChange:', () => {
      const itemTest = [{ name: 'Name 1', email: 'email 1' }];

      it('should set `selectAll` to null if items are changed and `selectAll` is true.', () => {
        component.selectAll = true;

        component.items = [];
        component.items.push(itemTest);

        component['checkItemsChange']();

        expect(component.selectAll).toBeNull();
      });

      it('shouldn`t set `selectAll` to null if items are changed and `selectAll` is false.', () => {
        component.selectAll = false;

        component.items = [];
        component.items.push(itemTest);

        component['checkItemsChange']();

        expect(component.selectAll).toBe(false);
      });

      it('shouldn`t set `selectAll` to null if items aren`t changed and `selectAll` is false.', () => {
        component.selectAll = false;

        component.items = [];

        component['checkItemsChange']();

        expect(component.selectAll).toBe(false);
      });

      it(`should set 'showHeader' to 'true' if items are changed, have items, 'select' is 'true' and 'hideSelectAll' is 'false' .`, () => {
        component.hideSelectAll = false;
        component.select = true;

        component.items = [];
        component.items.push(itemTest);

        component['checkItemsChange']();

        expect(component.showHeader).toBe(true);
      });

      it(`shouldn't set 'showHeader' to 'true' if items are changed, have items, 'select' is 'true' and 'hideSelectAll' is 'true'`, () => {
        component.hideSelectAll = true;
        component.select = true;

        component.items = [];
        component.items.push(itemTest);

        component['checkItemsChange']();

        expect(component.showHeader).toBe(false);
      });

      it(`shouldn't set 'showHeader' to 'true' if items are changed, have items, 'select' is 'false'
      and 'hideSelectAll' is 'false'`, () => {
        component.hideSelectAll = false;
        component.select = false;

        component.items = [];
        component.items.push(itemTest);

        component['checkItemsChange']();

        expect(component.showHeader).toBe(false);
      });

      it(`shouldn't set 'showHeader' to 'true' if not have items, 'select' is 'true' and 'hideSelectAll' is 'false' .`, () => {
        component.hideSelectAll = false;
        component.select = false;

        component.items = [];

        component['checkItemsChange']();

        expect(component.showHeader).toBe(false);
      });
    });

    it('checkTitleType: should return title`s type with "externalLink"', () => {
      const register: any = { url: 'http://www.uol.com.br' };
      component.propertyLink = 'url';

      expect(component['checkTitleType'](register)).toBe('externalLink');
    });

    it('checkTitleType: should return title`s type with "internalLink"', () => {
      const register: any = { url: '/home' };
      component.propertyLink = 'url';

      expect(component['checkTitleType'](register)).toBe('internalLink');
    });

    it('checkTitleType: should return title`s type with "noLink" if propertyLink doesn`t have value', () => {
      const register: any = { url: '/home' };
      component.propertyLink = null;

      expect(component['checkTitleType'](register)).toBe('noLink');
    });

    it('checkTitleType: should return title`s type with "noLink" if regiter doesn`t have `url` property', () => {
      const register: any = { route: '/home' };
      component.propertyLink = 'url';

      expect(component['checkTitleType'](register)).toBe('noLink');
    });

    it(`getItemTitle: should call the formatting function of the title and return its value if 'hasContentTemplate' is true and
      'listViewContentTemplate.title' is defined`, () => {
      const title = 'Title value';

      component.listViewContentTemplate = { title: () => '', templateRef: undefined };

      spyOn(component.listViewContentTemplate, 'title').and.returnValue(title);
      spyOnProperty(component, 'hasContentTemplate').and.returnValue(true);

      const result = component.getItemTitle(item);

      expect(component.listViewContentTemplate.title).toHaveBeenCalledWith(item);
      expect(result).toBe(title);
    });

    it(`getItemTitle: should return title of item and not call the formatting function of the title if 'hasContentTemplate' is false and
      'listViewContentTemplate.title' is defined`, () => {
      component.propertyTitle = 'name';
      component.listViewContentTemplate = { title: () => '', templateRef: undefined };

      spyOn(component.listViewContentTemplate, 'title');
      spyOnProperty(component, 'hasContentTemplate').and.returnValue(false);

      const result = component.getItemTitle(item);

      expect(component.listViewContentTemplate.title).not.toHaveBeenCalled();
      expect(result).toBe(item.name);
    });

    it(`getItemTitle: should return title of item if 'hasContentTemplate' is true and 'listViewContentTemplate.title'
      is undefined`, () => {
      component.propertyTitle = 'name';
      component.listViewContentTemplate = { title: undefined, templateRef: undefined };

      spyOnProperty(component, 'hasContentTemplate').and.returnValue(true);

      const result = component.getItemTitle(item);

      expect(result).toBe(item.name);
    });

    it(`getItemTitle: should return title of item if 'hasContentTemplate' is false and 'listViewContentTemplate.title'
      is undefined`, () => {
      component.propertyTitle = 'name';
      component.listViewContentTemplate = { title: undefined, templateRef: undefined };

      spyOnProperty(component, 'hasContentTemplate').and.returnValue(false);

      const result = component.getItemTitle(item);

      expect(result).toBe(item.name);
    });

    it(`hasItems: should return 'true' if items is defined`, () => {
      component.items = [{ name: '1', $showDetail: true }];

      expect(component.hasItems()).toBe(true);
    });

    it(`hasItems: should return 'false' if items is undefined`, () => {
      component.items = undefined;

      expect(component.hasItems()).toBe(false);
    });

    it(`initShowDetail: should call 'showDetail' if property 'items' is defined.`, () => {
      component.items = [{ name: '1', $showDetail: true }];
      component.listViewDetailTemplate = <any>{ showDetail: () => true, templateRef: '<span></span>' };

      spyOn(component.listViewDetailTemplate, 'showDetail');

      component['initShowDetail']();

      expect(component.listViewDetailTemplate.showDetail).toHaveBeenCalled();
    });

    it(`initShowDetail: shouldn't call 'showDetail' if property 'items' is undefined.`, () => {
      component.items = undefined;
      component.listViewDetailTemplate = <any>{ showDetail: () => false, templateRef: undefined };

      spyOn(component.listViewDetailTemplate, 'showDetail');

      component['initShowDetail']();

      expect(component.listViewDetailTemplate.showDetail).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    const listViewAction = { label: 'PO ', action: () => {} };

    it('should find `po-list-view-actions` if contains actions', () => {
      component.actions = [listViewAction];

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-actions')).toBeTruthy();
    });

    it('shouldn`t find `po-list-view-actions` if doesn`t contain actions', () => {
      component.actions = [];

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-actions')).toBeNull();
    });

    it('should find `po-list-view-more-actions` if `actions.length` is greater than 2', () => {
      component.actions = [{ label: 'Ação 1' }, { label: 'Ação 2' }, { label: 'Ação 3' }];

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-more-actions')).toBeTruthy();
    });

    it('should find `po-list-view-detail` if `showDetail` is true.', () => {
      component.items = [{ name: '1', $showDetail: true }];
      component.listViewDetailTemplate = <any>{ showDetail: () => true };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeTruthy();
    });

    it('shouldn`t find `po-list-view-detail` if `showDetail` is false.', () => {
      component.listViewDetailTemplate = <any>{ showDetail: () => false };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeFalsy();
    });

    it('shouldn`t find `po-list-view-more-actions` if `actions.length` is lower than 3', () => {
      component.actions = [listViewAction, listViewAction];

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-more-actions')).toBeNull();
    });

    it('should find `po-list-view-detail-button` if contains listViewDetailTemplate', () => {
      component.listViewDetailTemplate = { showDetail: () => true, templateRef: null };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail-button')).toBeTruthy();
    });

    it('shouldn`t find `po-list-view-detail-button` if doesn`t contain listViewDetailTemplate', () => {
      component.listViewDetailTemplate = null;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail-button')).toBeNull();
    });

    it('should find `po-list-view-content` if contains listViewContentTemplate', () => {
      component.listViewContentTemplate = { templateRef: null, title: null };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-content')).toBeTruthy();
    });

    it('shouldn`t find `po-list-view-content` if doesn`t contain listViewContentTemplate', () => {
      component.listViewContentTemplate = null;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-content')).toBeNull();
    });

    it('should find `po-list-view-detail` if contains listViewDetailTemplate and `item.$showDetail` is true', () => {
      component.items = [{ name: '1', $showDetail: true }];
      component.listViewDetailTemplate = { showDetail: () => true, templateRef: null };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeTruthy();
    });

    it('shouldn`t find `po-list-view-detail` if contains listViewDetailTemplate and `item.$showDetail` is false', () => {
      component.items = [{ name: '1', $showDetail: false }];
      component.listViewDetailTemplate = { showDetail: () => true, templateRef: null };

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeNull();
    });

    it('shouldn`t find `po-list-view-detail` if doesn`t contain listViewDetailTemplate', () => {
      component.items = [{ name: '1' }];
      component.listViewDetailTemplate = null;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeNull();
    });

    it('should apply `po-list-view-main-container-header` to main container if `showHeader` is `true`.', () => {
      component.showHeader = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-main-container-header')).toBeTruthy();
    });

    it('should apply `po-list-view-main-container` to main container if `showHeader` is `false`.', () => {
      component.showHeader = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-main-container')).toBeTruthy();
    });

    it('should set main container offsetHeight to 200 if component.height is 200.', () => {
      component.showHeader = true;
      component.height = 200;

      fixture.detectChanges();

      expect(debugElement.offsetHeight).toBe(200);
    });

    it('should show main header if `showHeader` is `true`.', () => {
      component.showHeader = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-main-header')).toBeTruthy();
    });

    it('shouldn`t show main header if `showHeader` is `false`.', () => {
      component.showHeader = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-main-header')).toBeNull();
    });

    it('should show select if `select` is `true`.', () => {
      component.select = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-select')).toBeTruthy();
    });

    it('shouldn`t show select if `select` is `false`.', () => {
      component.select = false;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-select')).toBeNull();
    });

    it('should apply `po-checkbox-group-input-checked` if `showHeader` and `selectAll` are `true`.', () => {
      component.showHeader = true;
      component.selectAll = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-checkbox-group-input-checked')).toBeTruthy();
    });

    it('should apply `po-checkbox-group-input-indeterminate` if `showHeader` is true and `selectAll` is `null`.', () => {
      component.showHeader = true;
      component.selectAll = null;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-checkbox-group-input-indeterminate')).toBeTruthy();
    });

    it('shouldn`t apply `po-checkbox-group-input-checked` if showHeader is false.', () => {
      component.showHeader = false;
      component.selectAll = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-checkbox-group-input-checked')).toBeNull();
    });

    it('shouldn`t apply `po-checkbox-group-input-indeterminate` if showHeader is false.', () => {
      component.showHeader = false;
      component.selectAll = null;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-checkbox-group-input-indeterminate')).toBeNull();
    });

    it('should contain the attributes `href` and `target` if title is an external link and call getItemTitle with lisItem', () => {
      spyOn(component, 'getItemTitle');
      spyOn(component, 'checkTitleType').and.returnValue('externalLink');

      const listItem = { id: 1, name: 'register', url: 'http://po.com.br' };
      component.propertyLink = 'url';
      component.items = [listItem];

      fixture.detectChanges();

      let link = debugElement.querySelector('.po-list-view-title-link[ng-reflect-router-link="null"]');
      expect(link).toBeFalsy();

      link = debugElement.querySelector('.po-list-view-title-no-link');
      expect(link).toBeFalsy();

      link = debugElement.querySelector('.po-list-view-title-link[href="http://po.com.br"][target="_blank"]');
      expect(link).toBeTruthy();

      expect(component.getItemTitle).toHaveBeenCalledWith(listItem);
    });

    it('should contain the attribute `routerLink` if title is an internal link and call getItemTitle with lisItem', () => {
      spyOn(component, 'getItemTitle');
      spyOn(component, 'checkTitleType').and.returnValue('internalLink');

      const listItem = { id: 1, name: 'register', url: '/home' };
      component.propertyLink = 'url';
      component.items = [listItem];

      fixture.detectChanges();

      let link = debugElement.querySelector('.po-list-view-title-link[ng-reflect-router-link="/home"]');
      expect(link).toBeTruthy();

      link = debugElement.querySelector('.po-list-view-title-no-link');
      expect(link).toBeFalsy();

      link = debugElement.querySelector('.po-list-view-title-link[href="null"][target="_blank"]');
      expect(link).toBeFalsy();

      expect(component.getItemTitle).toHaveBeenCalledWith(listItem);
    });

    it('should contain class `po-list-view-title-no-link` if title doesn`t have link and call getItemTitle with lisItem', () => {
      spyOn(component, 'getItemTitle');
      spyOn(component, 'checkTitleType').and.returnValue('noLink');

      const listItem = { id: 1, name: 'register', url: 'http://po.com.br' };
      component.items = [listItem];

      fixture.detectChanges();

      let link = debugElement.querySelector('.po-list-view-title-link[ng-reflect-router-link="null"]');
      expect(link).toBeFalsy();

      link = debugElement.querySelector('.po-list-view-title-no-link');
      expect(link).toBeTruthy();

      link = debugElement.querySelector('.po-list-view-title-link[href="null"][target="_blank"]');
      expect(link).toBeFalsy();

      expect(component.getItemTitle).toHaveBeenCalledWith(listItem);
    });

    it('should apply class `po-list-view-title-no-link` if `titleHasAction` is true', () => {
      component.titleAction.observers.push(<any>[new Observable()]);

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-title-link')).toBeTruthy();
    });

    it('shouldn`t apply class `po-list-view-title-no-link` if `titleHasAction` is not true', () => {
      component.titleAction = null;

      expect(debugElement.querySelector('.po-list-view-title-link')).toBeFalsy();
    });

    it(
      `should call 'runTitleAction' with 'clickableItem' if 'titleAction' is clicked, 'titleHasAction' return
      true and 'checkTitleType' return noLink`,
      waitForAsync(() => {
        const clickableItem = { label: 'item label' };
        component.items = [clickableItem];

        spyOn(component, 'runTitleAction');
        spyOnProperty(component, 'titleHasAction').and.returnValue(true);
        spyOn(component, 'checkTitleType').and.returnValue('noLink');

        fixture.detectChanges();

        const titleAction = fixture.debugElement.nativeElement.querySelector('.po-list-view-title-no-link');
        titleAction.click();

        fixture.whenStable().then(() => {
          expect(component.runTitleAction).toHaveBeenCalledWith(clickableItem);
        });
      })
    );

    it(
      `should not call 'runTitleAction' if 'titleAction' is clicked, 'titleHasAction' return false and 'checkTitleType' return
      noLink`,
      waitForAsync(() => {
        spyOnProperty(component, 'titleHasAction').and.returnValue(false);
        spyOn(component, 'checkTitleType').and.returnValue('noLink');
        spyOn(component, 'runTitleAction');

        fixture.detectChanges();

        const titleAction = fixture.debugElement.nativeElement.querySelector('.po-list-view-title-no-link');
        titleAction.click();

        fixture.whenStable().then(() => {
          expect(component.runTitleAction).not.toHaveBeenCalled();
        });
      })
    );

    it(
      `should aply class 'po-list-view-container-no-data' if items is undefined`,
      waitForAsync(() => {
        component.items = undefined;

        fixture.detectChanges();

        const noDatacontainer = fixture.debugElement.nativeElement.querySelector('.po-list-view-container-no-data');

        expect(noDatacontainer).toBeTruthy();
      })
    );

    it(
      `shouldn't aply class 'po-list-view-container-no-data' if items is defined`,
      waitForAsync(() => {
        component.items = [{ name: '1', $showDetail: true }];

        fixture.detectChanges();

        const noDatacontainer = fixture.debugElement.nativeElement.querySelector('.po-list-view-container-no-data');

        expect(noDatacontainer).toBeFalsy();
      })
    );
  });
});
