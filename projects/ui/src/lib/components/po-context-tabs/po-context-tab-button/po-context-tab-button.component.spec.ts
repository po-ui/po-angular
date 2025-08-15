import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';
import { PoContextTabButtonComponent } from './po-context-tab-button.component';

describe('PoContextTabButtonComponent:', () => {
  let component: PoContextTabButtonComponent;
  let fixture: ComponentFixture<PoContextTabButtonComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoContextTabButtonComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoContextTabButtonComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('afterViewInit: should apply initial properties', () => {
      component.ngAfterViewInit();

      expect(component.afterViewChecked).toBeTrue();
    });

    it('ngOnChanges: should emit `changeState` if hide currentValue is true', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ hide: { currentValue: true } });

      expect(component.changeState.emit).toHaveBeenCalled();
    });

    it('ngOnChanges: should emit `changeState` if disabled currentValue is true', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ disabled: { currentValue: true } });

      expect(component.changeState.emit).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t emit `changeState` if hide or disabled currentValue is false', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ disabled: { currentValue: false }, hide: { currentValue: false } });

      expect(component.changeState.emit).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should emit `changeVisible` if hide currentValue is true', () => {
      spyOn(component.changeVisible, 'emit');

      component.afterViewChecked = true;
      component.ngOnChanges(<any>{ hide: { currentValue: true } });

      expect(component.changeVisible.emit).toHaveBeenCalled();
    });

    it('should emit close when closeTab is called with Enter key and not disabled', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      spyOn(component.close, 'emit');

      component.disabled = false;

      component.closeTab(event as any);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should stopPropagation when closeTab is called with ArrowLeft or ArrowRight key', () => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft', key: 'ArrowLeft' });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      spyOn(component.close, 'emit');

      component.closeTab(event as any);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.close.emit).not.toHaveBeenCalled();

      const event2 = new KeyboardEvent('keydown', { code: 'ArrowRight', key: 'ArrowLeft' });
      spyOn(event2, 'preventDefault');
      spyOn(event2, 'stopPropagation');

      component.closeTab(event2 as any);

      expect(event2.preventDefault).toHaveBeenCalled();
      expect(event2.stopPropagation).toHaveBeenCalled();
    });

    it('should not emit close if component is disabled', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(component.close, 'emit');

      component.disabled = true;

      component.closeTab(event as any);

      expect(component.close.emit).not.toHaveBeenCalled();
    });

    it('should activate close icon on focus in and deactivate on focus out', () => {
      component.disabled = false;

      component.onFocusIn();
      expect(component.activeCloseIcon).toBeTrue();

      component.onFocusOut();
      expect(component.activeCloseIcon).toBeFalse();
    });
  });
});
