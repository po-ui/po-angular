import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoHeaderMenuItemComponent } from './po-header-menu-item.component';

describe('PoHeaderMenuItemComponent', () => {
  let component: PoHeaderMenuItemComponent;
  let fixture: ComponentFixture<PoHeaderMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoHeaderMenuItemComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoHeaderMenuItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    component.poPopupElement = { toggle: jasmine.createSpy('toggle') } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call detectChanges when itemOverFlow is changed', () => {
    spyOn(component['cd'], 'detectChanges');

    component.ngOnChanges({
      itemOverFlow: {
        currentValue: [{ label: 'label' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('should call detectChanges and toggle Popup', () => {
    spyOn(component['cd'], 'detectChanges');

    component.openListButtonMore();

    expect(component['cd'].detectChanges).toHaveBeenCalled();
    expect(component.poPopupElement.toggle).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Space', () => {
    spyOn(component, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Space', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call openListButtonMore when event is Enter', () => {
    spyOn(component, 'openListButtonMore');

    component.onKeyDownButtonMore({ code: 'Enter', preventDefault: () => {} });

    expect(component.openListButtonMore).toHaveBeenCalled();
  });

  it('should call action when event is Enter', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component.itemClick, 'emit');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });

  it('should call onAction when event is Enter', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component, 'onAction');

    component.onKeyDownButtonList({ code: 'Enter', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should call onAction when event is Space', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component, 'onAction');

    component.onKeyDownButtonList({ code: 'Space', preventDefault: () => {} }, item);

    expect(component.onAction).toHaveBeenCalled();
  });

  it('should call action and emit event', () => {
    const item = {
      label: 'test',
      action: jasmine.createSpy('action')
    };

    component.item = item as any;
    spyOn(component.itemClick, 'emit');

    component.onAction(item);

    expect(item.action).toHaveBeenCalled();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });
});
