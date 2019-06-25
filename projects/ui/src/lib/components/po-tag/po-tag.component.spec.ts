import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagComponent } from './po-tag.component';
import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';

describe('PoTagComponent:', () => {
  let component: PoTagComponent;
  let fixture: ComponentFixture<PoTagComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ PoTagComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTagComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created.', () => {
    expect(component instanceof PoTagBaseComponent).toBeTruthy();
    expect(component instanceof PoTagComponent).toBeTruthy();
  });

  describe('Methods', () => {
    it('ngOnInit: should set `isClickable` with `true` if `p-click` @Output is wire up', () => {
      component.click.observers.push(<any>[new Observable()]);

      component.ngOnInit();

      expect(component.isClickable).toBe(true);
    });

    it('ngOnInit: should set `isClickable` with `false` if `p-click` @Output isn`t wire up', () => {
      component.click.observers.length = 0;

      component.ngOnInit();

      expect(component.isClickable).toBe(false);
    });

    it('onClick: click should emit submittedTagItem value', () => {
      component.value = 'value';
      component.type = PoTagType.Danger;

      spyOn(component.click, <any> 'emit');

      component.onClick();

      expect(component.click.emit).toHaveBeenCalledWith({ 'value': component.value, 'type': component.type });
    });
  });

  describe('Template:', () => {
    it('should only start with default classes, shouldn`t have variations.', () => {
      const value = 'Po Tag';
      component.value = value;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-container')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-value').innerHTML).toContain(value);

      expect(nativeElement.querySelector('.po-icon')).toBeFalsy();
      expect(nativeElement.querySelector('.po-tag-title')).toBeFalsy();
      expect(nativeElement.querySelector('.po-tag-label')).toBeFalsy();
    });

    it('should add `po-tag-container-horizontal` class if orientation is `PoTagOrientation.Horizontal`.', () => {
      component.orientation = PoTagOrientation.Horizontal;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-container-horizontal')).toBeTruthy();
    });

    it('shouldn`t add `po-tag-container-horizontal` class if orientation is `PoTagOrientation.Vertical`.', () => {
      component.orientation = PoTagOrientation.Vertical;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-container-horizontal')).toBeFalsy();
    });

    it('should show `po-tag-label` and `po-tag-title` classes if has label.', () => {
      const label = 'Label';
      component.label = label;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-title')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-label').innerHTML).toContain(label);
    });

    it('should add `:` to `po-tag-label` if orientation is PoTagOrientation.Horizontal.', () => {
      const label = 'Label';
      component.label = label;
      component.orientation = PoTagOrientation.Horizontal;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-label').innerHTML).toContain(':');
    });

    it('shouldn`t add `:` to `po-tag-label` if orientation is PoTagOrientation.Vertical.', () => {
      const label = 'Label';
      component.label = label;
      component.orientation = PoTagOrientation.Vertical;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-label').innerHTML).not.toContain(':');
    });

    it('should add `po-tag-info` as default.', () => {
      expect(nativeElement.querySelector('.po-tag-info')).toBeTruthy();
    });

    it('should add `po-tag-danger` if type is `PoTagType.Danger`.', () => {
      component.type = PoTagType.Danger;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-danger')).toBeTruthy();
    });

    it('should add `po-tag-info` class if type is `PoTagType.Info`.', () => {
      component.type = PoTagType.Info;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-info')).toBeTruthy();
    });

    it('should add `po-tag-success` class if type is `PoTagType.Success`.', () => {
      component.type = PoTagType.Success;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-success')).toBeTruthy();
    });

    it('should add `po-tag-warning` class if type is `PoTagType.Warning`.', () => {
      component.type = PoTagType.Warning;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-warning')).toBeTruthy();
    });

    it('should add `po-icon` and `po-icon-info` default icon if `icon` is true.', () => {
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon')).toBeTruthy();
      expect(nativeElement.querySelector(`.po-icon-${PoTagIcon.Info}`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Danger` if type is `PoTagType.Danger and `icon` is true`.', () => {
      component.type = PoTagType.Danger;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`.po-icon-${PoTagIcon.Danger}`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Info` if type is `PoTagType.Info and `icon` is true`.', () => {
      component.type = PoTagType.Info;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`.po-icon-${PoTagIcon.Info}`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Success` if type is `PoTagType.Success and `icon` is true`.', () => {
      component.type = PoTagType.Success;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`.po-icon-${PoTagIcon.Success}`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Warning` if type is `PoTagType.Warning and `icon` is true`.', () => {
      component.type = PoTagType.Warning;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`.po-icon-${PoTagIcon.Warning}`)).toBeTruthy();
    });

    it('should add `po-clickable` if `p-click` @Output is wire up`.', () => {
      component.isClickable = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-clickable')).toBeTruthy();
    });

    it('shouldn`t add `po-clickable` if `p-click` @Output isn`t wire up`.', () => {
      component.isClickable = false;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-clickable')).toBeFalsy();
    });
  });

});
