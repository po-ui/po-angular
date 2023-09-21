import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { convertToBoolean } from '../../../utils/util';
import { PoAccordionService } from '../services/po-accordion.service';
import { PoAccordionItemComponent } from './po-accordion-item.component';

describe('PoAccordionItemComponent:', () => {
  let component: PoAccordionItemComponent;
  let fixture: ComponentFixture<PoAccordionItemComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoAccordionItemComponent],
      providers: [PoAccordionService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('collapse: should set `expanded` to `false` and emits `p-collapse` event', () => {
      spyOn(component.collapseEvent, 'emit');

      component.disabledItem = false;
      component.collapse();

      expect(component.expanded).toBe(false);
      expect(component.collapseEvent.emit).toHaveBeenCalled();
    });

    it('expand: should set `expanded` to `true` and emits `p-expand` event', () => {
      spyOn(component.expandEvent, 'emit');

      component.disabledItem = false;
      component.expand();

      expect(component.expanded).toBe(true);
      expect(component.expandEvent.emit).toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    it('disabledItem: should set property `p-disabled` to `false` if invalid value', () => {
      component.disabledItem = convertToBoolean(3);

      expect(component.disabledItem).toBe(false);
    });

    it('hideRemoveAllDisclaimer: should update property `p-disabled` to `true` with valid values', () => {
      component.disabledItem = convertToBoolean(1);

      expect(component.disabledItem).toBe(true);
    });

    it('typeTag: should update property with valid values', () => {
      const validValues = ['danger', 'info', 'success', 'warning'];

      expectPropertiesValues(component, 'typeTag', validValues, validValues);
    });

    it('typeTag: should update property with `info` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, -1, 12, 15, 'aa', [], {}];

      expectPropertiesValues(component, 'typeTag', invalidValues, undefined);
    });
  });
});
