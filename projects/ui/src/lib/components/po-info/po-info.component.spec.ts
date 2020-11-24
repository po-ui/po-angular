import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import * as UtilsFunctions from './../../utils/util';
import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoInfoBaseComponent } from './po-info-base.component';
import { PoInfoComponent } from './po-info.component';
import { PoInfoOrientation } from './po-info-orietation.enum';

describe('PoInfoComponent', () => {
  let component: PoInfoComponent;
  let fixture: ComponentFixture<PoInfoComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })],
      declarations: [PoInfoComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoInfoComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoInfoBaseComponent).toBeTruthy();
    expect(component instanceof PoInfoComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('isExternalLink: should return true if `component.url` is truthy', () => {
      component.url = 'http://po-ui.io';

      const spyIsExternalLink = spyOn(UtilsFunctions, 'isExternalLink').and.callThrough();

      expect(component.isExternalLink).toBe(true);
      expect(spyIsExternalLink).toHaveBeenCalled();
    });

    it('isExternalLink: should return false if `component.url` is falsy', () => {
      component.url = '';

      const spyIsExternalLink = spyOn(UtilsFunctions, 'isExternalLink').and.callThrough();

      expect(component.isExternalLink).toBe(false);
      expect(spyIsExternalLink).toHaveBeenCalled();
    });
  });

  describe('Template:', () => {
    it('should only start with the default classes and elements, shouldn`t have variations', () => {
      component.label = 'Po Info';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-label').innerHTML).toContain('Po Info');
      expect(nativeElement.querySelector('.po-info-value')).toBeTruthy();

      expect(nativeElement.querySelector('.po-info-label-horizontal')).toBeFalsy();
      expect(nativeElement.querySelector('.po-info-value-horizontal')).toBeFalsy();

      expect(nativeElement.querySelector('[class*=po-sm-]')).toBeFalsy();
    });

    it('should update `p-label` with `:` when to use `PoInfoOrientation.Horizontal`', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'Po Info';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label').innerHTML).toContain('Po Info:');
    });

    it('should update `p-value`', () => {
      component.value = 'Value';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-value').innerHTML).toContain('Value');
    });

    it('should update layout with `PoInfoOrientation.Vertical`', () => {
      component.orientation = PoInfoOrientation.Vertical;
      component.label = 'PoInfoOrientation';
      component.value = 'Vertical';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label').innerHTML).toContain('PoInfoOrientation');
      expect(nativeElement.querySelector('.po-info-label-horizontal')).toBeFalsy();

      expect(nativeElement.querySelector('.po-info-value').innerHTML).toContain('Vertical');
      expect(nativeElement.querySelector('.po-info-value-horizontal')).toBeFalsy();
      expect(nativeElement.querySelector('.po-row')).toBeNull();
      expect(nativeElement.querySelector('.po-text-nowrap')).toBeNull();
    });

    it('shouldn`t use Grid System if `p-orientation` is differ `PoInfoOrientation.Horizontal`', () => {
      component.orientation = PoInfoOrientation.Vertical;
      component.labelSize = 3;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-sm-3')).toBeFalsy();
      expect(nativeElement.querySelector('.po-sm-9')).toBeFalsy();
      expect(nativeElement.querySelector('.po-info-container-content')).toBeTruthy();
    });

    it('should update layout with `PoInfoOrientation.Horizontal`', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'PoInfoOrientation';
      component.value = 'Horizontal';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label-horizontal')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-label-horizontal').innerHTML).toContain('PoInfoOrientation:');

      expect(nativeElement.querySelector('.po-info-value-horizontal')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-value-horizontal').innerHTML).toContain('Horizontal');
      expect(nativeElement.querySelector('.po-info-container-content')).toBeNull();
    });

    it('should update layout with `PoInfoOrientation.Horizontal` and 3 columns (Grid System)', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'PoInfoOrientation3';
      component.labelSize = 3;
      component.value = 'Horizontal9';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label-horizontal.po-sm-3')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-label-horizontal.po-sm-3').innerHTML).toContain(
        'PoInfoOrientation3:'
      );

      expect(nativeElement.querySelector('.po-info-value-horizontal.po-sm-9')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-value-horizontal.po-sm-9').innerHTML).toContain('Horizontal9');
    });

    it('should update layout with `PoInfoOrientation.Horizontal` and 9 columns (Grid System)', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'PoInfoOrientation9';
      component.labelSize = 9;
      component.value = 'Horizontal3';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-info-label-horizontal.po-sm-9')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-label-horizontal.po-sm-9').innerHTML).toContain(
        'PoInfoOrientation9:'
      );

      expect(nativeElement.querySelector('.po-info-value-horizontal.po-sm-3')).toBeTruthy();
      expect(nativeElement.querySelector('.po-info-value-horizontal.po-sm-3').innerHTML).toContain('Horizontal3');
    });

    it('should apply `po-row` class if `PoInfoOrientation.Horizontal` and `labelSize` is defined', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'PoInfo';
      component.labelSize = 9;
      component.value = 'Horizontal';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-row')).toBeTruthy();
    });

    it('should apply `po-text-nowrap` class if `PoInfoOrientation.Horizontal` and `labelSize` is undefined', () => {
      component.orientation = PoInfoOrientation.Horizontal;
      component.label = 'PoInfo';
      component.labelSize = undefined;
      component.value = 'Horizontal';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-text-nowrap')).toBeTruthy();
    });

    it('should find `a.po-info-link` if `component.url` is truthy', () => {
      component.value = 'John Doe';
      component.url = 'http://po-ui.io';

      fixture.detectChanges();

      expect(nativeElement.querySelector('a.po-info-link[target=_blank]')).toBeTruthy();
    });

    it('shouldn`t find `a.po-info-link` if `component.url` is falsy', () => {
      component.value = 'John Doe';
      component.url = '';

      fixture.detectChanges();

      expect(nativeElement.querySelector('a.po-info-link')).toBeNull();
    });

    it('should find `a.po-info-link` and not find `a.po-info-link[target=_blank]` if URL is an internal link ', () => {
      component.value = 'John Doe';
      component.url = '/customers';

      fixture.detectChanges();

      expect(nativeElement.querySelector('a.po-info-link[target=_blank]')).toBeNull();
      expect(nativeElement.querySelector('a.po-info-link')).toBeTruthy();
    });
  });
});
