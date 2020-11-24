import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from './../../util-test/util-expect.spec';

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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule, PoTooltipModule],
      declarations: [PoButtonGroupComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoButtonGroupComponent);
    component = fixture.componentInstance;

    component.buttons = fakeButtons;

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

    spyOn(fakeButtons[0], 'action');
    spyOn(fakeButtons[1], 'action');

    buttonEnabled.click();
    buttonDisabled.click();

    expect(fakeButtons[0].action).toHaveBeenCalled();
    expect(fakeButtons[1].action).not.toHaveBeenCalled();
  });

  describe('Template:', () => {
    const mouseEnter = (button: any) => {
      const event = document.createEvent('MouseEvents');
      event.initEvent('mouseenter', false, true);

      button.dispatchEvent(event);
    };

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

    it(`should contain 'tooltip' in button if button is 'enabled' and contains 'tooltip' property.`, fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('.po-button-group'));

      button.triggerEventHandler('mouseenter', null);

      fixture.detectChanges();

      tick(100);

      const poTooltip = containerButtons.querySelector('.po-tooltip');

      expect(poTooltip).toBeTruthy();
    }));

    it(
      `shouldn't contain 'tooltip' in button if button is 'disabled' and contains 'tooltip' property.`,
      waitForAsync(() => {
        const buttons = containerButtons.querySelectorAll('.po-button-group');
        const buttonDisabled = buttons[1];

        mouseEnter(buttonDisabled);

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const poTooltip = containerButtons.querySelector('.po-tooltip');

          expect(poTooltip).toBeNull();
        });
      })
    );
  });
});
