import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoColorPaletteService } from './../../../services/po-color-palette/po-color-palette.service';

import { PoTableModule } from '../po-table.module';
import { PoTableSubtitleCircleComponent } from './po-table-subtitle-circle.component';
import { PoTableSubtitleColumn } from '../po-table-subtitle-footer/po-table-subtitle-column.interface';

describe('PoTableSubtitleCircleComponent:', () => {
  let component: PoTableSubtitleCircleComponent;
  let fixture: ComponentFixture<PoTableSubtitleCircleComponent>;
  let subtitles: Array<PoTableSubtitleColumn>;
  let subtitle: PoTableSubtitleColumn;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTableModule],
      providers: [PoColorPaletteService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableSubtitleCircleComponent);
    component = fixture.componentInstance;

    subtitle = { label: 'Label', value: 'value', content: 'C' };

    subtitles = [
      { value: 'success', label: 'Label', color: 'color-11', content: 'Success Content' },
      { value: 'warning', label: 'Label', color: 'color-08', content: 'Warning Content' },
      { value: 'danger', label: 'Label', color: 'color-07', content: 'Danger Content' },
      { value: 'primary', label: 'Label', color: 'color-01', content: 'Primary Content' },
      { value: 'content', label: 'Label', color: 'color-03', content: 'Content' }
    ];
  });

  it('should be created', () => {
    expect(component instanceof PoTableSubtitleCircleComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('subtitle: should call `getColor` if subtitle is defined', () => {
      spyOn(component['poColorPaletteService'], 'getColor');

      component.subtitle = subtitle;

      expect(component['poColorPaletteService'].getColor).toHaveBeenCalled();
    });

    it('subtitle: shouldn`t call `getColor` if subtitle is undefined', () => {
      spyOn(component['poColorPaletteService'], 'getColor');

      component.subtitle = undefined;

      expect(component['poColorPaletteService'].getColor).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should show "Warning Content" text', () => {
      component.subtitle = subtitles[1];

      fixture.detectChanges();

      const warningContent = fixture.debugElement.nativeElement.querySelector('.po-color-08');
      expect(warningContent.innerHTML).toContain('Warning Content');
    });

    it('should create circle with class po-color-01 if `color` is not defined', () => {
      component.subtitle = subtitles[3];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-color-01')).toBeTruthy();
    });

    it('should create circle with class po-color-11 if `color` is success', () => {
      component.subtitle = subtitles[0];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-color-11')).toBeTruthy();
    });

    it('should create circle with class po-color-08 if `color` is warning', () => {
      component.subtitle = subtitles[1];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-color-08')).toBeTruthy();
    });

    it('should create circle with class `po-color-07` if `color` is `danger`', () => {
      component.subtitle = subtitles[2];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-color-07')).toBeTruthy();
    });

    it('should create circle with class `po-color-03` if `color` is `color-03`', () => {
      component.subtitle = subtitles[4];
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-color-03')).toBeTruthy();
    });
  });
});
