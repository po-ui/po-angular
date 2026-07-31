import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PoColorPaletteEnum } from '../../../enums/po-color-palette.enum';
import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';

import { PoTableColumnLabel } from './po-table-column-label.interface';
import { PoTableColumnLabelComponent } from './po-table-column-label.component';
import { PoTagModule } from '../../po-tag/po-tag.module';

// Mock CSS.supports for jsdom environment (used by po-tag)
if (typeof globalThis.CSS === 'undefined') {
  (globalThis as any).CSS = { supports: () => false };
}

describe('PoTableColumnLabelComponent:', () => {
  let labels: Array<PoTableColumnLabel>;
  let component: PoTableColumnLabelComponent;
  let fixture: ComponentFixture<PoTableColumnLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoTagModule],
      declarations: [PoTableColumnLabelComponent],
      providers: [PoColorPaletteService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTableColumnLabelComponent);
    component = fixture.componentInstance;

    labels = [
      { value: 'success', label: 'Success', color: 'color-11' },
      { value: 'warning', label: 'Warning', color: 'color-08' },
      { value: 1, label: 'Danger', color: 'color-07' },
      { value: 2, label: undefined, color: 'color-07' },
      { value: 5, label: ' ', color: 'color-07' }
    ];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnLabelComponent).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('should return false if value property contains a label with only whitespace', () => {
      component.value = labels[4];
      const result = component.checkValueHasLabel();
      expect(result).toBe(false);
    });

    it('should return true if value property contains a label', () => {
      component.value = labels[1];
      const result = component.checkValueHasLabel();
      expect(result).toBe(true);
    });

    it('should returns false if value is undefined', () => {
      component.value = undefined;
      const result = component.checkValueHasLabel();
      expect(result).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should show "Warning" text', () => {
      component.value = labels[1];
      fixture.detectChanges();
      const warningContent = fixture.debugElement.nativeElement.querySelector(`.po-${PoColorPaletteEnum.Color08}`);
      expect(warningContent.innerHTML).toContain('Warning');
    });

    it('should create circle with class po-color-11', () => {
      component.value = labels[0];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector(`.po-${PoColorPaletteEnum.Color11}`)).toBeTruthy();
    });

    it('should create circle with class po-color-08', () => {
      component.value = labels[1];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector(`.po-${PoColorPaletteEnum.Color08}`)).toBeTruthy();
    });

    it('should create circle with class po-color-07', () => {
      component.value = labels[2];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector(`.po-${PoColorPaletteEnum.Color07}`)).toBeTruthy();
    });

    it('should not render a tag component if the value property has not a label', () => {
      component.value = labels[3];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector(`.po-tag`)).toBeFalsy();
    });
  });
});
