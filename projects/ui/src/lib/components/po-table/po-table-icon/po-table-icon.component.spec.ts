import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoTableIconComponent } from './po-table-icon.component';
import { PoTableModule } from '../po-table.module';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoTableIconComponent:', () => {
  let component: PoTableIconComponent;
  let fixture: ComponentFixture<PoTableIconComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTableModule, PoTooltipModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableIconComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableIconComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('allowTooltip: should return true if `disabled` is false and `iconTooltip` is true.', () => {
      component.disabled = false;
      component.iconTooltip = 'teste';

      expect(component['allowTooltip']).toBeTruthy();
    });

    it('allowTooltip: should return false if `disabled` and `iconTooltip` are true.', () => {
      component.disabled = true;
      component.iconTooltip = 'teste';

      expect(component['allowTooltip']).toBeFalsy();
    });

    it('allowTooltip: should return false if `disabled` is false and `iconTooltip` is undefined.', () => {
      component.disabled = false;
      component.iconTooltip = undefined;

      expect(component['allowTooltip']).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it('onClick: should call `click` and `emit` if `clickable`.', () => {
      const event = {};
      component.clickable = true;

      spyOn(component.click, 'emit');

      component.onClick(event);

      expect(component.click.emit).toHaveBeenCalledWith(event);
    });

    it('onClick: shouldn`t call `click` and `emit`.', () => {
      const event = {};
      component.clickable = false;

      spyOn(component.click, 'emit');

      component.onClick(event);

      expect(component.click.emit).not.toHaveBeenCalled();
    });

    it('tooltipMouseEnter: should update value of `tooltip`.', () => {
      component.disabled = false;
      const expectedValue = (component.iconTooltip = 'teste');

      component.tooltipMouseEnter();

      expect(component.tooltip).toEqual(expectedValue);
    });

    it('tooltipMouseEnter: shouldn`t update value of `tooltip`.', () => {
      component.disabled = true;
      const expectedValue = (component.iconTooltip = 'teste');

      component.tooltipMouseEnter();

      expect(component.tooltip).not.toEqual(expectedValue);
    });

    it('tooltipMouseLeave: should update value of `tooltip`.', () => {
      component.tooltipMouseLeave();

      expect(component.tooltip).toBeUndefined();
    });
  });

  describe('Templates:', () => {
    function getNativeElement(elementClass: string) {
      return nativeElement.querySelector(elementClass);
    }

    it('Should have `po-icon`.', () => {
      fixture.detectChanges();
      expect(getNativeElement('.po-icon')).toBeTruthy();
    });

    it('Should have `po-icon-copy`.', () => {
      component.icon = 'po-icon-copy';

      fixture.detectChanges();
      expect(getNativeElement('.po-icon-copy')).toBeTruthy();
    });

    it('Should have `po-text-color-11`.', () => {
      component.icon = 'po-icon-copy';
      component.color = 'po-text-color-11';
      fixture.detectChanges();
      expect(getNativeElement('.po-text-color-11')).toBeTruthy();
    });

    it('Should have `po-clickable`.', () => {
      component.clickable = true;

      fixture.detectChanges();
      expect(getNativeElement('.po-clickable')).toBeTruthy();
    });

    it('Shouldn`t have `po-clickable`.', () => {
      component.clickable = false;

      fixture.detectChanges();
      expect(getNativeElement('.po-clickable')).toBeFalsy();
    });

    it('Should have `po-table-icon-disabled`.', () => {
      component.disabled = true;

      fixture.detectChanges();
      expect(getNativeElement('.po-table-icon-disabled')).toBeTruthy();
    });

    it('Shouldn`t have `po-table-icon-disabled`.', () => {
      component.disabled = false;

      fixture.detectChanges();
      expect(getNativeElement('.po-table-icon-disabled')).toBeFalsy();
    });
  });
});
