import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import * as util from '../../../utils/util';
import { PoPopoverComponent } from '../../po-popover';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderActionTool } from '../interfaces/po-header-action-tool.interface';
import { PoHeaderToolsComponent } from './po-header-tools.component';

describe('PoHeaderToolsComponent', () => {
  let component: PoHeaderToolsComponent;
  let fixture: ComponentFixture<PoHeaderToolsComponent>;
  let router: Router;

  class MockPoPopupComponent {
    showPopup = false;
    toggle = jasmine.createSpy('toggle');
  }

  class MockPoPopoverComponent {
    isHidden = true;
    close = jasmine.createSpy('close');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderToolsComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderToolsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set actionTools and limit to 3', () => {
    const actions = Array(5).fill({}) as Array<PoHeaderActionTool>;
    component.actionTools = actions;
    expect(component.actionTools.length).toBe(3);
  });

  it('should set actionTools and do not limit the value if forceActionTools is true', () => {
    const actions = Array(5).fill({}) as Array<PoHeaderActionTool>;
    component.forceActionTools = true;
    component.actionTools = actions;
    expect(component.actionTools.length).toBe(5);
  });

  it('should return correct popoverIndexes', () => {
    component._actionTools = [{ popover: true } as any, { popover: false } as any, { popover: true } as any];
    expect(component.popoverIndexes).toEqual([0, 2]);
  });

  it('should call action and toggle popup if items and not popover', () => {
    const mockPopup = new MockPoPopupComponent();
    const popupList = new QueryList<PoPopupComponent>();
    popupList.reset([mockPopup as any]);
    component.poPopupActions = popupList;

    const actionSpy = jasmine.createSpy('action');
    component._actionTools = [{ action: actionSpy, items: [{}], popover: false } as any];

    component.onClickAction(0);

    expect(actionSpy).toHaveBeenCalled();
    expect(mockPopup.toggle).toHaveBeenCalled();
  });

  it('should call action but not toggle popup if popover is true', () => {
    const mockPopup = new MockPoPopupComponent();
    const popupList = new QueryList<PoPopupComponent>();
    popupList.reset([mockPopup as any]);
    component.poPopupActions = popupList;

    const actionSpy = jasmine.createSpy('action');
    component._actionTools = [{ action: actionSpy, items: [{}], popover: true } as any];

    component.onClickAction(0);

    expect(actionSpy).toHaveBeenCalled();
    expect(mockPopup.toggle).not.toHaveBeenCalled();
  });

  it('checkSelected should return true if popup.showPopup is true', () => {
    const mockPopup = new MockPoPopupComponent();
    mockPopup.showPopup = true;
    const popupList = new QueryList<PoPopupComponent>();
    popupList.reset([mockPopup as any]);
    component.poPopupActions = popupList;

    component._actionTools = [{ items: [{}], popover: false } as any];

    expect(component.checkSelected(0)).toBeTrue();
  });

  it('checkSelected should return true if popover is visible', () => {
    const mockPopover = new MockPoPopoverComponent();
    mockPopover.isHidden = false;
    const popoverList = new QueryList<PoPopoverComponent>();
    popoverList.reset([mockPopover as any]);
    component.poPopoverActions = popoverList;

    component._actionTools = [{ popover: true } as any];

    expect(component.checkSelected(0)).toBeTrue();
  });

  it('checkSelected should return false if nothing is open', () => {
    const mockPopover = new MockPoPopoverComponent();
    mockPopover.isHidden = true;
    const popoverList = new QueryList<PoPopoverComponent>();
    popoverList.reset([mockPopover as any]);
    component.poPopoverActions = popoverList;

    const mockPopup = new MockPoPopupComponent();
    mockPopup.showPopup = false;
    const popupList = new QueryList<PoPopupComponent>();
    popupList.reset([mockPopup as any]);
    component.poPopupActions = popupList;

    component._actionTools = [{ items: [{}], popover: false } as any, { popover: true } as any];

    expect(component.checkSelected(0)).toBeFalse();
    expect(component.checkSelected(1)).toBeFalse();
  });

  it('should open external link in new tab when isExternalLink is true', () => {
    const item: PoHeaderActionTool = { link: 'http://external.com' } as any;

    spyOn(util, 'isExternalLink').and.returnValue(true);
    const windowSpy = spyOn(window, 'open');

    (component as any).checkLink(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(windowSpy).toHaveBeenCalledWith(item.link, '_blank');
  });

  it('should navigate using router when isExternalLink is false', () => {
    const item: PoHeaderActionTool = { link: '/internal' } as any;

    spyOn(util, 'isExternalLink').and.returnValue(false);
    const routerSpy = spyOn(router, 'navigateByUrl');

    (component as any).checkLink(item);

    expect(util.isExternalLink).toHaveBeenCalledWith(item.link);
    expect(routerSpy).toHaveBeenCalledWith(item.link);
  });

  it('should return aria label', () => {
    component.literals = { notifications: 'notificações' };
    const item: PoHeaderActionTool = { link: '/internal', badge: 5, tooltip: 'test' };

    const expectedValue = component.getAriaLabel(item);

    expect(expectedValue).toBe('test, 5 notificações');
  });

  it('should return aria label', () => {
    component.literals = { notifications: 'notificações' };
    const item: PoHeaderActionTool = { link: '/internal', badge: 5, tooltip: 'test' };

    const expectedValue = component.getAriaLabel(item);

    expect(expectedValue).toBe('test, 5 notificações');
  });

  it('should call focus of popup', () => {
    const focusSpy = jasmine.createSpy('focus');

    const fakethis = {
      buttonActionComponents: {
        get: (i: number) => ({ focus: focusSpy })
      }
    };

    component.onClosePopup.call(fakethis, 0);

    expect(focusSpy).toHaveBeenCalled();
  });
});
