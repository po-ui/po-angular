import { By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PoButtonModule } from '../po-button';

import { PoActiveOverlayService } from '../../services/po-active-overlay/po-active-overlay.service';
import { PoCleanComponent } from './../po-field/po-clean/po-clean.component';
import { PoFieldContainerBottomComponent } from './../po-field/po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from './../po-field/po-field-container/po-field-container.component';
import { PoInputComponent } from './../po-field/po-input/po-input.component';

import { PoModalAction } from './po-modal-action.interface';
import { PoModalBaseComponent } from './po-modal-base.component';
import { PoModalComponent } from './po-modal.component';

@Component({
  template: `
    <po-modal p-title="i'm the title" [p-primary-action]="primaryAction">
      <form #f="ngForm">
        <po-input name="teste" [(ngModel)]="teste" p-label="Teste"></po-input>
        <po-input name="userName" [(ngModel)]="userName" p-label="Nome"></po-input>
      </form>
    </po-modal>
  `
})
class ContentProjectionComponent {
  primaryAction: PoModalAction = { label: 'action', action: () => {} };
  @ViewChild(PoModalComponent, { static: true }) poModal;
  teste;
  userName;
  openModal() {
    this.poModal.open();
  }
}

describe('PoModalComponent:', () => {
  let component: PoModalComponent;
  let fixture: ComponentFixture<PoModalComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PoButtonModule],
      declarations: [
        PoModalComponent,
        PoInputComponent,
        PoCleanComponent,
        PoFieldContainerComponent,
        ContentProjectionComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [PoActiveOverlayService]
    });
    fixture = TestBed.createComponent(PoModalComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    component.primaryAction = { label: 'primaryLabel', action: () => {} };

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component instanceof PoModalBaseComponent).toBeTruthy();
    expect(component instanceof PoModalComponent).toBeTruthy();
  });

  it('should be loaded with title bar', () => {
    component.title = 'title';
    component.open();
    fixture.detectChanges();
    expect(element.query(By.css('.po-modal-title')).nativeElement.textContent).toContain('title');
  });

  it('should be loaded with just primaryAction', () => {
    component.open();
    fixture.detectChanges();
    expect(element.query(By.css('.po-modal-footer')).nativeElement.textContent).toContain('primaryLabel');
  });

  it('should be loaded with primaryAction and secondaryAction', () => {
    component.secondaryAction = { label: 'secondaryLabel', action: () => {} };
    component.open();
    fixture.detectChanges();
    expect(element.query(By.css('.po-modal-footer')).nativeElement.textContent).toContain('primaryLabel');
    expect(element.query(By.css('.po-modal-footer')).nativeElement.textContent).toContain('secondaryLabel');
  });

  it('should call primaryAction() method', () => {
    spyOn(component.primaryAction, 'action');
    component.primaryAction.action();
    expect(component.primaryAction.action).toHaveBeenCalled();
  });

  it('should call secondaryAction() method', () => {
    component.secondaryAction = { label: 'secondaryLabel', action: () => {} };
    spyOn(component.secondaryAction, 'action');
    component.secondaryAction.action();
    expect(component.secondaryAction.action).toHaveBeenCalled();
  });

  it('should call close() method', () => {
    component.open();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('po-modal');
    component.close();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('po-modal');
  });

  it('should call open() method', () => {
    expect(fixture.nativeElement.innerHTML).not.toContain('po-modal');
    component.open();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('po-modal');
  });

  it('should focus on modal when opened', fakeAsync(() => {
    component.open();
    fixture.detectChanges();
    const modal = element.nativeElement;
    const modalFooterButton = modal.querySelector('.po-button-modal-first-action');

    tick(0);
    expect(modal.ownerDocument.activeElement).toBe(modalFooterButton.ownerDocument.activeElement);
  }));

  it('should keep focus on element inside modal', fakeAsync(() => {
    component.secondaryAction = { label: 'secondaryLabel', action: () => {} };
    component.open();
    fixture.detectChanges();

    const modal = element.nativeElement;
    const modalFooterButton = modal.querySelectorAll('.po-button')[1];

    tick(0);

    modalFooterButton.focus();

    expect(modal.ownerDocument.activeElement).toBe(modalFooterButton);
  }));

  it('should not focus on element outside modal', fakeAsync(() => {
    component.open();
    fixture.detectChanges();

    const modal = element.nativeElement;
    const modalFooterButton = modal.querySelector('.po-button-modal-first-action');

    const outsideElement = modal.ownerDocument.querySelector('div');

    tick(0);

    outsideElement.focus();
    expect(modal.ownerDocument.activeElement).toBe(modalFooterButton.ownerDocument.activeElement);
  }));

  it('should focus on first input of modal', fakeAsync(() => {
    const fixtureTest = TestBed.createComponent(ContentProjectionComponent);
    const testComponent = fixtureTest.componentInstance;

    testComponent.openModal();
    fixtureTest.detectChanges();

    const modal = fixtureTest.debugElement.nativeElement;
    const inputElement = modal.querySelector('input');

    tick(0);

    expect(modal.ownerDocument.activeElement).toBe(inputElement);
  }));

  it('should be modal with medium size', () => {
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-md');
  });

  it('should be modal with small size', () => {
    component.size = 'sm';
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-sm');
  });

  it('should be modal with medium size', () => {
    component.size = 'md';
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-md');
  });

  it('should be modal with large size', () => {
    component.size = 'lg';
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-lg');
  });

  it('should be modal with extra-large size', () => {
    component.size = 'xl';
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-xl');
  });

  it('should be modal with auto size', () => {
    component.size = 'auto';
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain('po-modal-auto');
  });

  it('should be modal with close button', () => {
    component.open();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain(
      'po-modal-header-close-button'
    );
  });

  it('should be one button in modal', () => {
    component.primaryAction = { label: 'primaryLabel', action: () => {} };
    component.secondaryAction = undefined;
    component.open();
    fixture.detectChanges();

    expect(element.nativeElement.querySelector('.po-button-modal-first-action')).toBeTruthy();
    expect(element.nativeElement.querySelectorAll('.po-button').length).toBe(1);
  });

  it(`focusFunction: should call 'stopPropagation' if 'activeOverlay' is equal to id`, () => {
    const fakeEvent = {
      target: 'click',
      stopPropagation: () => {}
    };

    component['firstElement'] = <any>{
      focus: () => {}
    };
    component['id'] = '1';
    component['poActiveOverlayService'] = { activeOverlay: ['1'] };
    component['modalContent'] = {
      nativeElement: {
        contains: () => 0
      }
    };
    component['setFirstElement'] = () => {};

    const spyEvent = spyOn(fakeEvent, 'stopPropagation');

    component.hideClose = true;
    component['initFocus']();

    fixture.detectChanges();

    component['focusFunction'](fakeEvent);

    expect(spyEvent).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('onClickOut: shouldn`t call close when clickOut is true and click in modal content.', () => {
      const fakeEvent = {
        target: 10
      };

      const fakeThis = {
        modalContent: {
          nativeElement: {
            contains: () => 10
          }
        },
        clickOut: true,
        close: () => {}
      };

      spyOn(fakeThis, 'close');

      component.onClickOut.call(fakeThis, fakeEvent);

      expect(fakeThis.close).not.toHaveBeenCalled();
    });

    it('onClickOut: shouldn`t call close when clickOut is false.', () => {
      const fakeEvent = {
        target: 10
      };

      const fakeThis = {
        modalContent: {
          nativeElement: {
            contains: () => 0
          }
        },
        clickOut: false,
        close: () => {}
      };

      spyOn(fakeThis, 'close');
      fixture.detectChanges();

      component.onClickOut.call(fakeThis, fakeEvent);

      expect(fakeThis.close).not.toHaveBeenCalled();
    });

    it('onClickOut: should call close when clickOut is true and not click in modal.', () => {
      const fakeEvent = {
        target: 10
      };

      const fakeThis = {
        modalContent: {
          nativeElement: {
            contains: () => 0
          }
        },
        clickOut: true,
        close: () => {}
      };

      spyOn(fakeThis, 'close');
      fixture.detectChanges();

      component.onClickOut.call(fakeThis, fakeEvent);

      expect(fakeThis.close).toHaveBeenCalled();
    });

    it('open: should set source element as document.ActiveElement', () => {
      component.open();
      expect(component['sourceElement']).toBe(document.activeElement);
    });

    it(`open: should call 'handleFocus'.`, () => {
      const spyOnHandleFocus = spyOn(component, <any>'handleFocus');

      component.open();

      expect(spyOnHandleFocus).toHaveBeenCalled();
    });

    it(`open: should append id to 'poActiveOverlayService.activeOverlay'.`, () => {
      const expectedResult = [component['id']];

      component.open();

      expect(component['poActiveOverlayService'].activeOverlay).toEqual(expectedResult);
    });

    it('close: should focus on source element ', () => {
      component.open();
      spyOn(component['sourceElement'], 'focus');
      component.close();
      expect(component['sourceElement'].focus).toHaveBeenCalled();
    });

    it('close: should remove id from `poActiveOverlayService.activeOverlay` list', () => {
      component.open();

      fixture.detectChanges();

      component.close();

      expect(component['poActiveOverlayService'].activeOverlay).toEqual([]);
    });

    describe('closeModalOnEscapeKey:', () => {
      const eventEscapeKey = new KeyboardEvent('keydown', { 'key': 'Esc' });
      const eventEnterKey = new KeyboardEvent('keydown', { 'key': 'Enter' });

      it('should call `close` when typed escape key and `hideClose` is false.', () => {
        component.hideClose = false;
        component.open();
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('.po-modal')).nativeElement;
        spyOn(component, 'close');
        modal.dispatchEvent(eventEscapeKey);

        expect(component.close).toHaveBeenCalled();
      });

      it('shouldn`t call `close` when typed other than escape key and `hideClose` is false.', () => {
        component.hideClose = false;
        component.open();
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('.po-modal')).nativeElement;
        spyOn(component, 'close');
        modal.dispatchEvent(eventEnterKey);

        expect(component.close).not.toHaveBeenCalled();
      });

      it('shouldn`t call `close` when typed escape key and `hideClose` is true.', () => {
        component.hideClose = true;
        component.open();
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css('.po-modal')).nativeElement;
        spyOn(component, 'close');
        modal.dispatchEvent(eventEscapeKey);

        expect(component.close).not.toHaveBeenCalled();
      });

      it('should call preventDefault and stopPropagation of event.', () => {
        const fakeEvent = {
          preventDefault: () => {},
          stopPropagation: () => {}
        };

        spyOn(fakeEvent, 'preventDefault');
        spyOn(fakeEvent, 'stopPropagation');

        component.closeModalOnEscapeKey(fakeEvent);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('shouldn`t call preventDefault and stopPropagation of event if `hideClose` is true.', () => {
        const fakeEvent = {
          preventDefault: () => {},
          stopPropagation: () => {}
        };

        spyOn(fakeEvent, 'preventDefault');
        spyOn(fakeEvent, 'stopPropagation');

        component.hideClose = true;
        component.closeModalOnEscapeKey(fakeEvent);

        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
        expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
      });
    });

    it('getPrimaryActionButtonType: should return `danger` if `primaryAction.danger` is `true`', () => {
      component.primaryAction.danger = true;

      expect(component.getPrimaryActionButtonType()).toBe('danger');
    });

    it('getPrimaryActionButtonType: should return `primary` if `primaryAction.danger` is `false`', () => {
      component.primaryAction.danger = false;

      expect(component.getPrimaryActionButtonType()).toBe('primary');
    });

    it('getPrimaryActionButtonType: should return `primary` if `primaryAction.danger` is `undefined`', () => {
      component.primaryAction.danger = undefined;

      expect(component.getPrimaryActionButtonType()).toBe('primary');
    });

    it(`getSecondaryActionButtonType: should return 'danger' if 'primaryAction.danger' is 'false'
    and 'secondaryAction.danger' is 'true'`, () => {
      component.primaryAction.danger = false;
      component.secondaryAction = { action: () => {}, label: 'primaryLabel', danger: true };

      expect(component.getSecondaryActionButtonType()).toBe('danger');
    });

    it(`getSecondaryActionButtonType: should return 'default' if 'primaryAction.danger' is 'true'
    and 'secondaryAction.danger' is 'false'`, () => {
      component.primaryAction.danger = true;
      component.secondaryAction = { action: () => {}, label: 'primaryLabel', danger: false };

      expect(component.getSecondaryActionButtonType()).toBe('default');
    });

    it(`getSecondaryActionButtonType: should return 'default' if 'primaryAction.danger' is 'true'
    and 'secondaryAction.danger' is 'true'`, () => {
      component.primaryAction.danger = true;
      component.secondaryAction = { action: () => {}, label: 'primaryLabel', danger: true };

      expect(component.getSecondaryActionButtonType()).toBe('default');
    });

    it(`removeEventListeners: should call 'removeEventListener' with 'focus', 'focusFunction' and 'true' params.`, () => {
      const spyRemoveEventListener = spyOn(document, 'removeEventListener');

      component['removeEventListeners']();

      expect(spyRemoveEventListener).toHaveBeenCalledWith('focus', component['focusFunction'], true);
    });

    it('setFirstElement: should focus on modal if haven`t a focusable elements.', () => {
      component.hideClose = true;
      component.primaryAction.loading = true;
      component.open();
      fixture.detectChanges();
      const modal = element.nativeElement.querySelector('.po-modal .po-modal-content');

      component['setFirstElement']();

      expect(component['firstElement']).toEqual(modal);
    });
  });

  describe('Templates:', () => {
    function getModalActionDisabled() {
      return element.nativeElement.querySelector(
        '.po-modal .po-modal-footer .po-button-modal-first-action button:disabled'
      );
    }

    function getModalActionIconLoading() {
      return element.nativeElement.querySelector(`
        .po-modal .po-modal-footer .po-button-modal-first-action button:disabled div.po-button-loading-icon
      `);
    }

    it('iconClose: should display close when `hideClose` is true.', () => {
      component.hideClose = true;
      component.open();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).not.toContain(
        'po-modal-header-close-button'
      );
    });

    it('iconClose: should display close when `hideClose` is false.', () => {
      component.hideClose = false;
      component.open();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.po-modal')).nativeElement.innerHTML).toContain(
        'po-modal-header-close-button'
      );
    });

    it('action disabled: should disabled primary action if `primaryAction.disabled` is `true`.', () => {
      component.primaryAction = { action: () => {}, label: 'primaryLabel', disabled: true };
      component.open();
      fixture.detectChanges();

      expect(getModalActionDisabled()).toBeTruthy();
    });

    it('action loading: should disabled primary action if `primaryAction.loading` is `true`.', () => {
      component.primaryAction = { action: () => {}, label: 'primaryLabel', loading: true };
      component.open();
      fixture.detectChanges();

      expect(getModalActionDisabled()).toBeTruthy();
      expect(getModalActionIconLoading()).toBeTruthy();
    });

    it('should call `onClickOut` on mousedown', () => {
      component.open();
      fixture.detectChanges();

      const containerElement = fixture.debugElement.query(By.css('.po-modal-container')).nativeElement;

      spyOn(component, 'onClickOut');

      containerElement.dispatchEvent(new Event('mousedown'));

      expect(component.onClickOut).toHaveBeenCalled();
    });
  });
});
