import { provideNgReflectAttributes } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import fc from 'fast-check';

import { PoUtils as UtilsFunctions } from '../../utils/util';
import { PoButtonModule } from '../po-button';
import { PoModalModule } from '../po-modal';
import { PoPopupModule } from '../po-popup';
import { PoWidgetModule } from '../po-widget';

import { PoListViewBaseComponent } from './po-list-view-base.component';
import { PoListViewComponent } from './po-list-view.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('PoListViewComponent:', () => {
  let component: PoListViewComponent;
  let fixture: ComponentFixture<PoListViewComponent>;
  let debugElement;
  let event: any;
  let detail: any;

  const item = { id: 1, name: 'register' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoListViewComponent],
      imports: [
        NoopAnimationsModule, // <- ADICIONADO AQUI: Resolve o erro de synthetic listener
        PoButtonModule,
        PoPopupModule,
        PoModalModule,
        PoWidgetModule
      ],
      providers: [provideNgReflectAttributes(), provideRouter([])]
    }).compileComponents();

    detail = { test: 'test' };
    event = {
      fromState: 'void',
      toState: '*',
      totalTime: 100,
      phaseName: 'start',
      element: null,
      triggerName: 'showHideDetail',
      disabled: false
    };

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

  describe('Selection mode template:', () => {
    it('should render `po-checkbox` per item when selection mode is `multiple` (default)', () => {
      component.select = true;
      fixture.detectChanges();

      expect(debugElement.querySelector('po-checkbox')).toBeTruthy();
      expect(debugElement.querySelector('.po-list-view-select po-radio')).toBeNull();
    });

    it('should render `po-radio` per item when selection mode is `single`', () => {
      fixture.componentRef.setInput('p-selection-mode', 'single');
      component.select = true;
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-select po-radio')).toBeTruthy();
    });
  });

  describe('Subtitle template:', () => {
    it('should render `.po-list-view-subtitle` when `p-property-subtitle` is set and item has value', () => {
      component.items = [{ id: 1, name: 'register', createdAt: 'Há 5 min' }];
      fixture.componentRef.setInput('p-property-subtitle', 'createdAt');
      fixture.detectChanges();

      const subtitle = debugElement.querySelector('.po-list-view-subtitle');

      expect(subtitle).toBeTruthy();
      expect(subtitle.textContent.trim()).toBe('Há 5 min');
    });

    it('should not render `.po-list-view-subtitle` when `p-property-subtitle` is not set', () => {
      component.items = [{ id: 1, name: 'register', createdAt: 'Há 5 min' }];
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-subtitle')).toBeNull();
    });

    it('should not render `.po-list-view-subtitle` when item does not have the subtitle value', () => {
      component.items = [{ id: 1, name: 'register' }];
      fixture.componentRef.setInput('p-property-subtitle', 'createdAt');
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-subtitle')).toBeNull();
    });
  });

  describe('Highlighted item:', () => {
    it('should apply `po-list-view-highlighted` class when the highlighted property is truthy', () => {
      component.items = [{ id: 1, name: 'register', unread: true }];
      fixture.componentRef.setInput('p-property-highlighted', 'unread');
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-item-wrapper.po-list-view-highlighted')).toBeTruthy();
    });

    it('should not apply `po-list-view-highlighted` class when the highlighted property is falsy', () => {
      component.items = [{ id: 1, name: 'register', unread: false }];
      fixture.componentRef.setInput('p-property-highlighted', 'unread');
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-item-wrapper.po-list-view-highlighted')).toBeNull();
    });

    it('should not apply `po-list-view-highlighted` class based on selection (highlight is independent of `p-select`)', () => {
      component.items = [{ id: 1, name: 'register', $selected: true }];
      component.select = true;
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-item-wrapper.po-list-view-highlighted')).toBeNull();
    });

    it('should not apply `po-list-view-highlighted` class when `p-property-highlighted` is not set', () => {
      component.items = [{ id: 1, name: 'register' }];
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-highlighted')).toBeNull();
    });
  });

  describe('Detail display modal:', () => {
    beforeEach(() => {
      component.listViewDetailTemplate = <any>{ templateRef: null };
      fixture.componentRef.setInput('p-detail-display', 'modal');
      fixture.detectChanges();
    });

    it('openDetailModal: should set item and index, emit `p-show-detail` and open the modal', () => {
      spyOn(component.showDetail, 'emit');
      spyOn(component.detailModal, 'open');
      const listItem = { id: 5, name: 'x' };

      component.openDetailModal(listItem, 2);

      expect(component.detailModalItem).toBe(listItem);
      expect(component.detailModalIndex).toBe(2);
      expect(component.showDetail.emit).toHaveBeenCalledWith(listItem);
      expect(component.detailModal.open).toHaveBeenCalled();
    });

    it('onCloseDetailModal: should reset `detailModalItem` to `null`', () => {
      component.detailModalItem = { id: 1 };

      component.onCloseDetailModal();

      expect(component.detailModalItem).toBeNull();
    });

    it('should not render the inline detail (`.po-list-view-detail`) when detail display is `modal`', () => {
      component.items = [{ id: 1, name: 'x', $showDetail: true }];
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-detail')).toBeNull();
    });
  });

  describe('Actions layout:', () => {
    it('getItemActionType: should return `multiple` when there are two or more visible actions', () => {
      component.actions = [{ label: 'a' }, { label: 'b' }];

      expect(component.getItemActionType(item)).toBe('multiple');
    });

    it('getItemActionType: should return `advanced` when there is one visible action', () => {
      component.actions = [{ label: 'a' }];

      expect(component.getItemActionType(item)).toBe('advanced');
    });

    it('getItemActionType: should return `none` when there is no action but the title has an action', () => {
      component.actions = [];
      spyOnProperty(component, 'titleHasAction', 'get').and.returnValue(true);

      expect(component.getItemActionType(item)).toBe('none');
    });

    it('getItemActionType: should return `none` when there is no action and no title action', () => {
      component.actions = [];
      spyOnProperty(component, 'titleHasAction', 'get').and.returnValue(false);

      expect(component.getItemActionType(item)).toBe('none');
    });

    it('should not render the advanced arrow-right button when only the title has an action', () => {
      component.actions = [];
      component.titleAction.observers.push(<any>[new Observable()]);
      component.items = [{ id: 1, name: 'x' }];
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-action-advanced')).toBeFalsy();
    });

    it('should render a single button when there is one action', () => {
      component.actions = [{ label: 'Edit', action: () => {} }];
      component.items = [{ id: 1, name: 'x' }];
      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
      const arrowButton = debugElement.querySelector('.po-list-view-action-advanced');
      expect(arrowButton).toBeTruthy('arrow button (.po-list-view-action-advanced) should be in the DOM');
    });

    it('should render the three-dots popup (via widget) when there are two or more actions', () => {
      component.actions = [{ label: 'a' }, { label: 'b' }];
      component.items = [{ id: 1, name: 'x' }];
      component.propertyTitle = 'name';
      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();

      const buttonWrapper = debugElement.querySelector('.po-widget-button-wrapper');
      expect(buttonWrapper).toBeTruthy('po-widget-button-wrapper should be in the DOM when 2+ actions');
    });

    it('should apply the `po-list-view-widget-mode` host class', () => {
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('po-list-view-widget-mode')).toBe(true);
    });

    it('should render `po-widget` per item (default)', () => {
      component.items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      component.propertyTitle = 'name';
      fixture.detectChanges();

      const widgets = debugElement.querySelectorAll('po-widget');

      expect(widgets.length).toBe(2);
    });

    it('getItemAvatar: should return undefined when p-property-avatar is not set', () => {
      expect(component.getItemAvatar({ avatar: 'http://img.png' })).toBeUndefined();
    });

    it('getItemAvatar: should return object with `src` and `size` when item value is a string', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ avatar: 'http://img.png' })).toEqual({ src: 'http://img.png', size: 'md' });
    });

    it('getItemAvatar: should return the object with `size` added when item value is an object', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      const avatarObj = { src: 'http://img.png', size: 'sm' };
      const result = component.getItemAvatar({ avatar: avatarObj });
      expect(result.src).toBe('http://img.png');
      expect(result.size).toBe('md');
    });

    it('getWidgetActions: should map visible actions wrapping each action callback when 2+ actions', () => {
      const actionSpy = jasmine.createSpy('actionSpy');
      component.actions = [
        { label: 'a', action: actionSpy },
        { label: 'b', action: () => {} }
      ];

      const result = component.getWidgetActions(item);

      expect(result.length).toBe(2);
      expect(result[0].label).toBe('a');

      result[0].action();
      expect(actionSpy).toHaveBeenCalledWith(item);
    });

    it('getWidgetActions: should return empty array when no visible actions and no title action', () => {
      component.actions = [];
      component.titleAction.observers = [];

      expect(component.getWidgetActions(item)).toEqual([]);
    });

    it('getWidgetActions: should return empty array when no visible actions but title has action (advanced renders arrow outside)', () => {
      component.actions = [];
      component.titleAction.observers.push(<any>[new Observable()]);

      const result = component.getWidgetActions(item);

      expect(result).toEqual([]);
    });

    it('getItemAvatar: should return undefined when item has no value for the avatar property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ name: 'x' })).toBeUndefined();
    });

    it('getItemActionType: should return `none` when there are no actions and no title action observer', () => {
      component.actions = [];
      component.titleAction.observers = [];

      expect(component.getItemActionType(item)).toBe('none');
    });

    it('should emit `p-title-action` when widget title action is triggered', () => {
      component.items = [{ id: 1, name: 'Test' }];
      component.propertyTitle = 'name';
      component.titleAction.observers.push(<any>[new Observable()]);
      fixture.detectChanges();

      spyOn(component.titleAction, 'emit');
      component.runTitleAction(component.items[0]);

      expect(component.titleAction.emit).toHaveBeenCalled();
    });

    it('should render the title as plain text (no title-action) when `itemClickable` is true', () => {
      component.items = [{ id: 1, name: 'Test' }];
      component.propertyTitle = 'name';
      component.itemClick.subscribe(() => {});
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-widget-title-action')).toBeNull();
      expect(debugElement.querySelector('.po-widget-text')).toBeTruthy();
    });

    it('should render the title as an action (title-action) when `itemClickable` is false and title has action', () => {
      component.items = [{ id: 1, name: 'Test' }];
      component.propertyTitle = 'name';
      component.titleAction.observers.push(<any>[new Observable()]);
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-widget-title-action')).toBeTruthy();
    });

    it('should apply the `po-list-view-selected` class on the selected item', () => {
      component.select = true;
      component.items = [{ id: 1, name: 'x', $selected: true }];
      fixture.detectChanges();

      expect(debugElement.querySelector('.po-list-view-item-wrapper.po-list-view-selected')).toBeTruthy();
    });
  });

  describe('Avatar helpers:', () => {
    it('getAvatarType: should return empty string when p-property-avatar is not set', () => {
      expect(component.getAvatarType(item)).toBe('');
    });

    it('getAvatarType: should return "image" when item value is a string', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ avatar: 'http://img.png' })).toBe('image');
    });

    it('getAvatarType: should return "icon" when item value has icon property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ avatar: { icon: 'an an-user' } })).toBe('icon');
    });

    it('getAvatarType: should return "progress" when item value has progress property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ avatar: { progress: 50 } })).toBe('progress');
    });

    it('getAvatarType: should return "progress" when item value has indeterminate property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ avatar: { indeterminate: true } })).toBe('progress');
    });

    it('getAvatarType: should return "custom" when item value is an object without icon/progress', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ avatar: { customTemplate: {} } })).toBe('custom');
    });

    it('getAvatarType: should return empty string when item has no value for the property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getAvatarType({ name: 'x' })).toBe('');
    });

    it('getAvatarData: should return undefined when p-property-avatar is not set', () => {
      expect(component.getAvatarData(item)).toBeUndefined();
    });

    it('getAvatarData: should return the avatar value from the item', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      const data = { icon: 'an an-user', color: '#fff' };
      expect(component.getAvatarData({ avatar: data })).toBe(data);
    });

    it('getItemAvatar: should return object with src and size when item value is a string', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      const result = component.getItemAvatar({ avatar: 'http://img.png' });
      expect(result.src).toBe('http://img.png');
      expect(result.size).toBeDefined();
    });

    it('getItemAvatar: should return undefined when item value is icon', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ avatar: { icon: 'an an-user' } })).toBeUndefined();
    });

    it('getItemAvatar: should return undefined when item value is progress', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ avatar: { progress: 50 } })).toBeUndefined();
    });

    it('getItemAvatar: should return undefined when item value is indeterminate', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ avatar: { indeterminate: true } })).toBeUndefined();
    });

    it('getItemAvatar: should return avatar object with size for custom template', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      const result = component.getItemAvatar({ avatar: { customTemplate: {} } });
      expect(result.customTemplate).toBeDefined();
      expect(result.size).toBeDefined();
    });
  });

  describe('Type-safe helpers:', () => {
    it('getItemTag: should return undefined when p-property-tag is not set', () => {
      expect(component.getItemTag(item)).toBeUndefined();
    });

    it('getItemTag: should return tag value from item', () => {
      fixture.componentRef.setInput('p-property-tag', 'tag');
      fixture.detectChanges();

      expect(component.getItemTag({ tag: 'Success' })).toBe('Success');
    });

    it('getItemTagType: should return empty string when p-property-tag-type is not set', () => {
      expect(component.getItemTagType(item)).toBe('');
    });

    it('getItemTagType: should return tag type value from item', () => {
      fixture.componentRef.setInput('p-property-tag-type', 'tagType');
      fixture.detectChanges();

      expect(component.getItemTagType({ tagType: 'success' })).toBe('success');
    });

    it('getItemSubtitle: should return undefined when p-property-subtitle is not set', () => {
      expect(component.getItemSubtitle(item)).toBeUndefined();
    });

    it('getItemSubtitle: should return subtitle value from item', () => {
      fixture.componentRef.setInput('p-property-subtitle', 'subtitle');
      fixture.detectChanges();

      expect(component.getItemSubtitle({ subtitle: 'Há 5 min' })).toBe('Há 5 min');
    });

    it('getItemHighlighted: should return false when p-property-highlighted is not set', () => {
      expect(component.getItemHighlighted(item)).toBe(false);
    });

    it('getItemHighlighted: should return true when item field is truthy', () => {
      fixture.componentRef.setInput('p-property-highlighted', 'unread');
      fixture.detectChanges();

      expect(component.getItemHighlighted({ unread: true })).toBe(true);
    });

    it('getItemHighlighted: should return false when item field is falsy', () => {
      fixture.componentRef.setInput('p-property-highlighted', 'unread');
      fixture.detectChanges();

      expect(component.getItemHighlighted({ unread: false })).toBe(false);
    });
  });

  describe('Widget actions cache:', () => {
    it('should return cached result on second call with same item', () => {
      component.actions = [{ label: 'a' }, { label: 'b' }];
      const testItem = { id: 99, name: 'cache-test' };

      const first = component.getWidgetActions(testItem);
      const second = component.getWidgetActions(testItem);

      expect(first).toBe(second);
    });

    it('should invalidate cache when actions reference changes', () => {
      const testItem = { id: 99, name: 'cache-test' };
      component.actions = [{ label: 'a' }, { label: 'b' }];
      const first = component.getWidgetActions(testItem);

      component.actions = [{ label: 'x' }, { label: 'y' }, { label: 'z' }];
      const second = component.getWidgetActions(testItem);

      expect(first).not.toBe(second);
      expect(second.length).toBe(3);
    });

    it('should return empty array for 0-1 actions', () => {
      component.actions = [{ label: 'only-one' }];
      expect(component.getWidgetActions(item)).toEqual([]);
    });
  });

  describe('onClickAction with url:', () => {
    it('should navigate internally when action has internal url', () => {
      spyOn(component['router'], 'navigate');
      const action = { label: 'Go', url: '/documentation/po-button' };

      component.onClickAction(action, item);

      expect(component['router'].navigate).toHaveBeenCalledWith(['/documentation/po-button']);
    });

    it('should open external link when action has external url', () => {
      const action = { label: 'Go', url: 'https://po-ui.io' };

      spyOn<any>(window, 'open');
      component.onClickAction(action, item);

      expect(window.open).toHaveBeenCalled();
    });

    it('should call super.onClickAction when action has no url', () => {
      const actionSpy = jasmine.createSpy('action');
      const action = { label: 'Do', action: actionSpy };

      component.onClickAction(action, item);

      expect(actionSpy).toHaveBeenCalled();
    });

    it('should not call action when action has url (url takes priority)', () => {
      const actionSpy = jasmine.createSpy('action');
      spyOn(component['router'], 'navigate');
      const action = { label: 'Go', url: '/page', action: actionSpy };

      component.onClickAction(action, item);

      expect(component['router'].navigate).toHaveBeenCalledWith(['/page']);
      expect(actionSpy).not.toHaveBeenCalled();
    });
  });

  describe('selectListItem override:', () => {
    it('should call detectChanges after selection', () => {
      component.select = true;
      component.items = [{ name: 'A', $selected: false }];
      spyOn(component['changeDetector'], 'detectChanges');

      component.selectListItem(component.items[0]);

      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });
  });

  describe('getItemAvatar edge cases:', () => {
    it('should return undefined when p-property-avatar is not set', () => {
      expect(component.getItemAvatar(item)).toBeUndefined();
    });

    it('should return undefined when item has no value for avatar property', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ name: 'x' })).toBeUndefined();
    });

    it('should return undefined when item avatar value is null', () => {
      fixture.componentRef.setInput('p-property-avatar', 'avatar');
      fixture.detectChanges();

      expect(component.getItemAvatar({ avatar: null })).toBeUndefined();
    });
  });

  describe('getWidgetActions mapped action execution:', () => {
    it('should execute action with clean item when mapped action is called', () => {
      const actionSpy = jasmine.createSpy('action');
      const testItem = { id: 1, name: 'test', $selected: true };
      component.actions = [
        { label: 'a', action: actionSpy },
        { label: 'b', action: () => {} }
      ];

      const result = component.getWidgetActions(testItem);
      result[0].action();

      expect(actionSpy).toHaveBeenCalledWith({ id: 1, name: 'test' });
    });

    it('should navigate when mapped action with url is called', () => {
      spyOn(component['router'], 'navigate');
      const testItem = { id: 1, name: 'test' };
      component.actions = [
        { label: 'a', url: '/page' },
        { label: 'b', url: '/other' }
      ];

      const result = component.getWidgetActions(testItem);
      result[0].action();

      expect(component['router'].navigate).toHaveBeenCalledWith(['/page']);
    });

    it('should open external link when mapped action with external url is called', () => {
      spyOn<any>(window, 'open');
      const testItem = { id: 1, name: 'test' };
      component.actions = [
        { label: 'a', url: 'https://po-ui.io' },
        { label: 'b', url: 'https://other.com' }
      ];

      const result = component.getWidgetActions(testItem);
      result[0].action();

      expect(window.open).toHaveBeenCalled();
    });
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

    it('getVisibleActions: should return `[]` if `actions` is empty', () => {
      component.actions = [];

      expect(component['getVisibleActions'](item)).toEqual([]);
    });

    it('getVisibleActions: should return all actions if none of them has `visible` literal `false`', () => {
      component.actions = [{ label: 'Label 01' }, { label: 'Label 02' }, { label: 'Label 03' }];

      expect(component['getVisibleActions'](item)).toEqual(component.actions);
    });

    it('titleHasAction: should return `false` if `titleAction.observers.length` is lower than 1', () => {
      component.titleAction.observers = [];

      expect(component.titleHasAction).toBe(false);
    });

    it('titleHasAction: should return `true` if `titleAction.observers.length` is greater than 0', () => {
      component.titleAction.observers.push(<any>[new Observable()]);

      expect(component.titleHasAction).toBe(true);
    });

    it('itemClickable: should return `true` when `itemClick` has observers', () => {
      component.itemClick.subscribe(() => {});

      expect(component.itemClickable).toBe(true);
    });

    it('itemClickable: should return `false` when `itemClick` has no observers', () => {
      expect(component.itemClickable).toBe(false);
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

      expect(component.returnBooleanValue(listViewAction, item, 'disabled')).toBe(listViewAction.disabled);
      expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
    });

    it('returnBooleanValue: should return `true` if `listViewAction.disabled` function return `true`.', () => {
      const listViewAction = { label: 'PO ', disabled: () => true };

      spyOn(listViewAction, 'disabled').and.returnValue(true);
      spyOn(UtilsFunctions, 'isTypeof').and.returnValue(true);

      expect(component.returnBooleanValue(listViewAction, item, 'disabled')).toBe(true);
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

    it(`onAnimationEvent: should emit detail on showDetail`, () => {
      spyOn(component.showDetail, 'emit');

      component.onAnimationEvent(event, detail);

      expect(component.showDetail.emit).toHaveBeenCalledWith(detail);
    });

    it('trackBy: should return `index`', () => {
      const index = 1;

      expect(component.trackBy(index)).toBe(index);
    });

    it('onItemClick: should emit `itemClick` with clean item when `isItemClickable` returns true', () => {
      const testItem = { id: 1, name: 'test', $selected: true };
      const expectedItem = { id: 1, name: 'test' };

      spyOn(component.itemClick, 'emit');
      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(expectedItem);
      spyOn(component, 'isItemClickable').and.returnValue(true);

      component.onItemClick(testItem, {} as MouseEvent);

      expect(component['deleteInternalAttrs']).toHaveBeenCalledWith(testItem);
      expect(component.itemClick.emit).toHaveBeenCalledWith(expectedItem);
    });

    it('onItemClick: should not emit `itemClick` when `itemClickable` is false', () => {
      spyOn(component.itemClick, 'emit');
      spyOnProperty(component, 'itemClickable').and.returnValue(false);

      component.onItemClick(item, new MouseEvent('click'));

      expect(component.itemClick.emit).not.toHaveBeenCalled();
    });

    it('onItemKeyDown: should emit `itemClick` with clean item when key is Enter and `isItemClickable` returns true', () => {
      const testItem = { id: 1, name: 'test', $selected: true };
      const expectedItem = { id: 1, name: 'test' };

      const keyEvent = {
        key: 'Enter',
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;

      spyOn(component.itemClick, 'emit');
      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(expectedItem);

      spyOn(component, 'isItemClickable').and.returnValue(true);

      component.onItemKeyDown(testItem, keyEvent);

      expect(keyEvent.preventDefault).toHaveBeenCalled();
      expect(component['deleteInternalAttrs']).toHaveBeenCalledWith(testItem);
      expect(component.itemClick.emit).toHaveBeenCalledWith(expectedItem);
    });

    it('onItemKeyDown: should emit `itemClick` with clean item when key is Space and `isItemClickable` returns true', () => {
      const testItem = { id: 1, name: 'test' };
      const expectedItem = { id: 1, name: 'test' };

      const keyEvent = {
        key: ' ',
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;

      spyOn(component.itemClick, 'emit');
      spyOn(component, <any>'deleteInternalAttrs').and.returnValue(expectedItem);

      spyOn(component, 'isItemClickable').and.returnValue(true);

      component.onItemKeyDown(testItem, keyEvent);

      expect(keyEvent.preventDefault).toHaveBeenCalled();
      expect(component['deleteInternalAttrs']).toHaveBeenCalledWith(testItem);
      expect(component.itemClick.emit).toHaveBeenCalledWith(expectedItem);
    });

    describe('onAdvancedArrowClick:', () => {
      it('should call `onClickAction` with the action and item when `getVisibleActions` returns exactly 1 action', () => {
        const item = { id: 1, name: 'Item 1' };
        const mockActions = [{ label: 'Edit', action: () => {} }];

        spyOn<any>(component, 'getVisibleActions').and.returnValue(mockActions);
        spyOn(component, 'onClickAction');
        spyOn<any>(component, 'runTitleAction');

        component.onAdvancedArrowClick(item);

        expect(component['getVisibleActions']).toHaveBeenCalledWith(item);
        expect(component.onClickAction).toHaveBeenCalledWith(mockActions[0], item);
        expect(component['runTitleAction']).not.toHaveBeenCalled();
      });

      it('should call `runTitleAction` when `getVisibleActions` returns 0 actions', () => {
        const item = { id: 2, name: 'Item 2' };
        const mockActions = []; // Nenhuma ação

        spyOn<any>(component, 'getVisibleActions').and.returnValue(mockActions);
        spyOn(component, 'onClickAction');
        spyOn<any>(component, 'runTitleAction');

        component.onAdvancedArrowClick(item);

        expect(component['getVisibleActions']).toHaveBeenCalledWith(item);
        expect(component['runTitleAction']).toHaveBeenCalledWith(item);
        expect(component.onClickAction).not.toHaveBeenCalled();
      });

      it('should call `runTitleAction` when `getVisibleActions` returns more than 1 action', () => {
        const item = { id: 3, name: 'Item 3' };
        const mockActions = [{ label: 'Edit' }, { label: 'Delete' }]; // Duas ações

        spyOn<any>(component, 'getVisibleActions').and.returnValue(mockActions);
        spyOn(component, 'onClickAction');
        spyOn<any>(component, 'runTitleAction');

        component.onAdvancedArrowClick(item);

        expect(component['getVisibleActions']).toHaveBeenCalledWith(item);
        expect(component['runTitleAction']).toHaveBeenCalledWith(item);
        expect(component.onClickAction).not.toHaveBeenCalled();
      });
    });

    it('onItemKeyDown: should not emit `itemClick` when `itemClickable` is false', () => {
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      spyOn(component.itemClick, 'emit');
      spyOnProperty(component, 'itemClickable').and.returnValue(false);

      component.onItemKeyDown(item, keyEvent);

      expect(component.itemClick.emit).not.toHaveBeenCalled();
    });

    it('onItemKeyDown: should not emit `itemClick` when key is not Enter or Space', () => {
      const keyEvent = new KeyboardEvent('keydown', { key: 'Tab' });

      spyOn(component.itemClick, 'emit');
      spyOnProperty(component, 'itemClickable').and.returnValue(true);

      component.onItemKeyDown(item, keyEvent);

      expect(component.itemClick.emit).not.toHaveBeenCalled();
    });

    it('getVisibleActions: should return `[]` if doesn`t have action.', () => {
      component.actions = undefined;

      expect(component['getVisibleActions'](item)).toEqual([]);
    });

    it('getVisibleActions: shouldn`t return action if visible is `false`.', () => {
      component.actions = [
        { label: 'PO1', visible: false },
        { label: 'PO2', visible: true }
      ];

      expect(component['getVisibleActions'](item)).toEqual([{ label: 'PO2', visible: true }]);
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
      component.listViewDetailTemplate = { showDetail: () => false, templateRef: undefined };

      spyOn(component.listViewDetailTemplate, 'showDetail');

      component['initShowDetail']();

      expect(component.listViewDetailTemplate.showDetail).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    const listViewAction = { label: 'PO ', action: () => {} };

    it('should find `po-widget` with actions when actions are provided', () => {
      component.actions = [listViewAction];

      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
    });

    it('shouldn`t find action-advanced if doesn`t contain actions and no title action', () => {
      component.actions = [];
      component.titleAction.observers = [];

      fixture.detectChanges();

      expect(component.getWidgetActions(item)).toEqual([]);
    });

    it('should pass actions to po-widget `p-actions` when 2+ actions', () => {
      component.actions = [{ label: 'Ação 1' }, { label: 'Ação 2' }, { label: 'Ação 3' }];

      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
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

    it('should render po-widget for items with 2 or fewer actions', () => {
      component.actions = [listViewAction, listViewAction];

      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
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

    it('should render content inside po-widget if contains listViewContentTemplate', () => {
      component.listViewContentTemplate = { templateRef: null, title: null };

      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
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

    it('should pass the title to po-widget via `p-title`', () => {
      component.propertyTitle = 'name';
      component.items = [{ id: 1, name: 'register', url: 'http://po.com.br' }];

      fixture.detectChanges();

      const widget = debugElement.querySelector('po-widget');
      expect(widget).toBeTruthy();
    });

    it('should call runTitleAction when title action is triggered', () => {
      spyOn(component, 'runTitleAction');
      const listItem = { id: 1, name: 'register' };
      component.items = [listItem];

      component.runTitleAction(listItem);

      expect(component.runTitleAction).toHaveBeenCalledWith(listItem);
    });

    it('should render po-widget with p-title-action binding', () => {
      component.titleAction.observers.push(<any>[new Observable()]);
      component.items = [{ id: 1, name: 'test' }];

      fixture.detectChanges();

      expect(debugElement.querySelector('po-widget')).toBeTruthy();
    });

    it(`should call 'runTitleAction' with item when invoked directly`, () => {
      const clickableItem = { label: 'item label' };
      component.items = [clickableItem];

      spyOn(component, 'runTitleAction');

      component.runTitleAction(clickableItem);

      expect(component.runTitleAction).toHaveBeenCalledWith(clickableItem);
    });

    it(`should not emit titleAction if titleAction has no observers`, () => {
      spyOn(component.titleAction, 'emit');
      component.titleAction.observers = [];

      expect(component.titleHasAction).toBe(false);
    });

    it(`should aply class 'po-list-view-container-no-data' if items is undefined`, waitForAsync(() => {
      component.items = undefined;

      fixture.detectChanges();

      const noDatacontainer = fixture.debugElement.nativeElement.querySelector('.po-list-view-container-no-data');

      expect(noDatacontainer).toBeTruthy();
    }));

    it(`shouldn't aply class 'po-list-view-container-no-data' if items is defined`, waitForAsync(() => {
      component.items = [{ name: '1', $showDetail: true }];

      fixture.detectChanges();

      const noDatacontainer = fixture.debugElement.nativeElement.querySelector('.po-list-view-container-no-data');

      expect(noDatacontainer).toBeFalsy();
    }));
  });

  describe('Visible as function:', () => {
    function getItemContainers(): Array<HTMLElement> {
      return Array.from(debugElement.querySelectorAll('.po-list-view-item-wrapper'));
    }

    it(`should show the action in the item where 'visible' function returns 'true' and hide it in the item
      where it returns 'false'`, () => {
      component.items = [
        { id: 1, name: 'Active', ativo: true },
        { id: 2, name: 'Inactive', ativo: false }
      ];
      component.actions = [{ label: 'Editar', visible: (item: any) => item.ativo }];

      fixture.detectChanges();

      const containers = getItemContainers();
      const activeActions = component['getVisibleActions'](component.items[0]);
      const inactiveActions = component['getVisibleActions'](component.items[1]);

      expect(activeActions).toHaveSize(1);
      expect(inactiveActions).toHaveSize(0);
    });

    it(`should call the 'visible' function with the list item instead of the function itself`, () => {
      const visibleSpy = jasmine.createSpy('visible').and.callFake((item: any) => item.ativo);
      component.items = [
        { id: 1, ativo: true },
        { id: 2, ativo: false }
      ];
      component.actions = [{ label: 'Editar', visible: visibleSpy }];

      fixture.detectChanges();

      const calledWith = visibleSpy.calls.allArgs().map(args => args[0]);

      expect(calledWith).toContain(component.items[0]);
      expect(calledWith).toContain(component.items[1]);
      expect(calledWith).not.toContain(visibleSpy);
    });

    it(`should render po-widget for each item, with actions passed to widget p-actions based on visibility`, () => {
      component.items = [
        { id: 1, perm: true },
        { id: 2, perm: false }
      ];
      component.actions = [{ label: 'A' }, { label: 'B' }, { label: 'C', visible: (item: any) => item.perm }];

      fixture.detectChanges();

      const containers = getItemContainers();

      expect(containers[0].querySelector('po-widget')).toBeTruthy();
      expect(containers[1].querySelector('po-widget')).toBeTruthy();
    });

    it(`should pass only visible actions to widget via getWidgetActions`, () => {
      component.items = [{ id: 1, perm: false }];
      component.actions = [{ label: 'A' }, { label: 'B' }, { label: 'C', visible: (item: any) => item.perm }];

      fixture.detectChanges();

      const widgetActions = component.getWidgetActions(component.items[0]);
      const labels = widgetActions.map((a: any) => a.label);

      expect(widgetActions).toHaveSize(2);
      expect(labels).not.toContain('C');
    });

    it(`shouldn't render action-advanced if all actions are hidden for the item and no title action`, () => {
      component.items = [{ id: 1, perm: false }];
      component.actions = [
        { label: 'A', visible: (item: any) => item.perm },
        { label: 'B', visible: (item: any) => item.perm },
        { label: 'C', visible: (item: any) => item.perm }
      ];
      component.titleAction.observers = [];

      fixture.detectChanges();

      const widgetActions = component.getWidgetActions(component.items[0]);
      expect(widgetActions).toEqual([]);
    });
  });

  describe('Visible/disabled preservation:', () => {
    const numRuns = 40;

    const visibleArb = fc.constantFrom<boolean | undefined>(true, false, undefined);

    function buildActionsFromVisibles(visibles: Array<boolean | undefined>): Array<any> {
      return visibles.map((visible, index) =>
        visible === undefined ? { label: `Action ${index}` } : { label: `Action ${index}`, visible }
      );
    }

    function getFirstContainer(): HTMLElement {
      return debugElement.querySelector('.po-list-view-item-wrapper');
    }

    it(`should keep showing the inline buttons or the popup icon by the count of actions where 'visible' is
      not literal 'false', when 'visible' is boolean or undefined`, () => {
      fc.assert(
        fc.property(fc.array(visibleArb, { minLength: 0, maxLength: 5 }), visibles => {
          const actions = buildActionsFromVisibles(visibles);
          const expectedVisibleCount = actions.filter(action => action.visible !== false).length;

          component.items = [{ id: 1, name: 'register' }];
          component.actions = actions;
          fixture.detectChanges();

          const visibleActions = component['getVisibleActions'](component.items[0]);

          expect(visibleActions.length).toBe(expectedVisibleCount);
        }),
        { numRuns }
      );
    });

    it(`should keep resolving 'disabled' per item through 'returnBooleanValue', when 'disabled' is boolean or
      function`, () => {
      const disabledArb = fc.oneof(
        fc.record({ kind: fc.constant<'boolean'>('boolean'), value: fc.boolean() }),
        fc.record({ kind: fc.constant<'function'>('function'), value: fc.boolean() })
      );

      fc.assert(
        fc.property(disabledArb, spec => {
          const listItem = { id: 1, blocked: spec.value };
          const action =
            spec.kind === 'function'
              ? { label: 'PO', disabled: (currentItem: any) => currentItem.blocked }
              : { label: 'PO', disabled: spec.value };

          const expected = spec.value;

          expect(component.returnBooleanValue(action, listItem, 'disabled')).toBe(expected);
        }),
        { numRuns }
      );
    });

    it(`should keep evaluating 'checkAllActionIsInvisible' of 'po-popup' only by literal 'visible === false',
      without treating a 'visible' function as invisible`, () => {
      const popup = component.poPopupComponent;

      popup.actions = [
        { label: 'A', visible: false },
        { label: 'B', visible: false }
      ];
      expect(popup['checkAllActionIsInvisible']()).toBeTruthy();

      popup.actions = [
        { label: 'A', visible: false },
        { label: 'B', visible: true }
      ];
      expect(popup['checkAllActionIsInvisible']()).toBeFalsy();

      popup.actions = [{ label: 'A', visible: () => false }];
      expect(popup['checkAllActionIsInvisible']()).toBeFalsy();
    });
  });
});
