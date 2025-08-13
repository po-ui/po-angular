import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoPopoverComponent } from '../../po-popover';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderToolsComponent } from './po-header-tools.component';
import { PoHeaderActionTool } from '../interfaces/po-header-action-tool.interface';

describe('PoHeaderToolsComponent', () => {
  let component: PoHeaderToolsComponent;
  let fixture: ComponentFixture<PoHeaderToolsComponent>;

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
      declarations: [PoHeaderToolsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderToolsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set actionTools and limit to 3', () => {
    const actions = Array(5).fill({}) as Array<PoHeaderActionTool>;
    component.actionTools = actions;
    expect(component.actionTools.length).toBe(3);
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

    component.onClickFirstAction(0);

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

    component.onClickFirstAction(0);

    expect(actionSpy).toHaveBeenCalled();
    expect(mockPopup.toggle).not.toHaveBeenCalled();
  });

  it('should close the correct popover on onClickFirstActionClosePopover', () => {
    const mockPopover = new MockPoPopoverComponent();
    const popoverList = new QueryList<PoPopoverComponent>();
    popoverList.reset([mockPopover as any]);
    component.poPopoverActions = popoverList;

    component._actionTools = [{ popover: true } as any];

    component.onClickFirstActionClosePopover(0);

    expect(mockPopover.close).toHaveBeenCalled();
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
});
