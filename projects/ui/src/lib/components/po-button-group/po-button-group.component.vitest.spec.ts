import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoButtonModule } from '../po-button/po-button.module';

import { PoButtonGroupBaseComponent } from './po-button-group-base.component';
import { PoButtonGroupComponent } from './po-button-group.component';
import { PoButtonGroupItem } from './po-button-group-item.interface';
import { PoTooltipModule } from './../../directives/po-tooltip/po-tooltip.module';

describe('PoButtonGroupComponent:', () => {
  let component: PoButtonGroupComponent;
  let fixture: ComponentFixture<PoButtonGroupComponent>;
  let nativeElement: any;
  let containerButtons: any;

  const fakeButtons: Array<PoButtonGroupItem> = [
    {
      label: 'enabled',
      action: () => {},
      selected: true,
      tooltip: 'teste 1'
    },
    {
      label: 'disabled',
      disabled: true,
      action: () => {},
      selected: false,
      tooltip: 'teste 2'
    },
    {
      label: 'other',
      action: () => {}
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoButtonModule, PoTooltipModule],
      declarations: [PoButtonGroupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoButtonGroupComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('p-buttons', fakeButtons);

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;

    containerButtons = nativeElement.querySelector('.po-button-group-container');
  });

  it('should be created', () => {
    expect(component instanceof PoButtonGroupBaseComponent).toBeTruthy();
    expect(component instanceof PoButtonGroupComponent).toBeTruthy();
  });

  it('should create a container for po-button-group', () => {
    expect(containerButtons).toBeTruthy();
  });

  it('should create buttons in container', () => {
    const buttons = containerButtons.querySelectorAll('.po-button-group .po-button');

    const buttonEnabled = buttons[0];
    const buttonDisabled = buttons[1];

    expect(buttons.length).toBe(3);

    expect(buttonEnabled.disabled).toBeFalsy();
    expect(buttonEnabled.innerHTML).toContain('enabled');

    expect(buttonDisabled.disabled).toBeTruthy();
    expect(buttonDisabled.innerHTML).toContain('disabled');
  });

  it('should call actions of enabled buttons, disabled ones should not be called', () => {
    const buttons = containerButtons.querySelectorAll('.po-button-group .po-button');

    const buttonEnabled = buttons[0];
    const buttonDisabled = buttons[1];

    const actionEnabledSpy = vi.spyOn(fakeButtons[0], 'action');
    const actionDisabledSpy = vi.spyOn(fakeButtons[1], 'action');

    buttonEnabled.click();
    buttonDisabled.click();

    expect(actionEnabledSpy).toHaveBeenCalled();
    expect(actionDisabledSpy).not.toHaveBeenCalled();
  });

  describe('Template:', () => {
    it('should apply po-button-group-button-selected class when button is selected', () => {
      const buttons = containerButtons.querySelectorAll('.po-button-group.po-button-group-button-selected');

      expect(buttons[0]).toBeTruthy();
    });

    it('should´nt apply po-button-group-button-selected class when button is not selected', () => {
      const buttons = containerButtons.querySelectorAll('.po-button-group.po-button-group-button-selected');

      expect(buttons[1]).toBeFalsy();
    });

    it('should contain tooltip directive', () => {
      const buttons = containerButtons.querySelectorAll('.po-button-group');

      const buttonEnabled = buttons[0];

      expect(buttonEnabled.outerHTML).toContain('p-tooltip');
    });

    it(`should contain 'tooltip' in button if button is 'enabled' and contains 'tooltip' property.`, async () => {
      vi.useFakeTimers();

      const button = fixture.debugElement.query(By.css('.po-button-group'));

      button.triggerEventHandler('mouseenter', null);

      fixture.detectChanges();

      vi.advanceTimersByTime(100);
      fixture.detectChanges();

      const poTooltip = containerButtons.querySelector('.po-tooltip');

      expect(poTooltip).toBeTruthy();
      vi.useRealTimers();
    });

    it(`shouldn't contain 'tooltip' in button if button is 'disabled' and contains 'tooltip' property.`, async () => {
      const buttons = containerButtons.querySelectorAll('.po-button-group');
      const buttonDisabled = buttons[1];

      const event = document.createEvent('MouseEvents');
      event.initEvent('mouseenter', false, true);
      buttonDisabled.dispatchEvent(event);

      fixture.detectChanges();
      await fixture.whenStable();

      const poTooltip = containerButtons.querySelector('.po-tooltip');

      expect(poTooltip).toBeNull();
    });
  });
});
