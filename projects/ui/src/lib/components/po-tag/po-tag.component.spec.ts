import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { PoIconModule } from '../po-icon/po-icon.module';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagComponent } from './po-tag.component';
import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';
import { PoTagLiterals } from './po-tag.literals';

@Component({
  template: ` <po-tag p-label="Mock" (p-click)="onClick()"></po-tag> `
})
class PoTagClickableComponent {
  onClick() {}
}

describe('PoTagComponent:', () => {
  const fakeEvent = { preventDefault: () => {}, stopPropagation: () => {} };

  let component: PoTagComponent;
  let fixture: ComponentFixture<PoTagComponent>;

  let fixtureClickable: ComponentFixture<PoTagClickableComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTagComponent, PoTagClickableComponent],
      imports: [PoIconModule, PoTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTagComponent);
    component = fixture.componentInstance;

    fixtureClickable = TestBed.createComponent(PoTagClickableComponent);

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created.', () => {
    expect(component instanceof PoTagBaseComponent).toBeTruthy();
    expect(component instanceof PoTagComponent).toBeTruthy();
  });

  describe('Methods:', () => {
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

    it('iconFromType: should update property with valid values', () => {
      component.type = PoTagType.Danger;
      expect(component.iconFromType).toBe(PoTagIcon.Danger);

      component.type = PoTagType.Info;
      expect(component.iconFromType).toBe(PoTagIcon.Info);

      component.type = PoTagType.Success;
      expect(component.iconFromType).toBe(PoTagIcon.Success);

      component.type = PoTagType.Warning;
      expect(component.iconFromType).toBe(PoTagIcon.Warning);
    });

    it('tagOrientation: should return true if orientation is horizontal.', () => {
      component.orientation = PoTagOrientation.Horizontal;
      expect(component.tagOrientation).toBe(true);
    });

    it('tagOrientation: should return false if orientation isn`t horizontal.', () => {
      component.orientation = PoTagOrientation.Vertical;
      expect(component.tagOrientation).toBe(false);
    });

    it('onClick: click should emit submittedTagItem value', () => {
      component.value = 'value';
      component.type = PoTagType.Danger;

      spyOn(component.click, <any>'emit');

      component.onClick();

      expect(component.click.emit).toHaveBeenCalledWith({
        'value': component.value,
        'type': component.type,
        'event': 'click'
      });
    });

    it('onKeyPressed: should call `onClick` if the event `keydown` is used with `enter` key.', () => {
      fixture.detectChanges();

      const tagElement = fixture.debugElement.query(By.css('.po-tag-wrapper'));
      const spyOnClick = spyOn(component, 'onClick');

      tagElement.triggerEventHandler('keydown.enter', fakeEvent);

      expect(spyOnClick).toHaveBeenCalled();
    });

    it('onKeyPressed: shouldn`t call `onClick` if the event `keyup` is used with other key than `enter`.', () => {
      fixture.detectChanges();

      const tagElement = fixture.debugElement.query(By.css('.po-tag'));
      const spyOnClick = spyOn(component, 'onClick');

      tagElement.triggerEventHandler('keydown.space', fakeEvent);

      expect(spyOnClick).not.toHaveBeenCalled();
    });

    it('onKeyPressed: should call `onClick` if the event `keyup` is used with `space` key.', () => {
      fixture.detectChanges();

      const tagElement = fixture.debugElement.query(By.css('.po-tag-wrapper'));
      const spyOnClick = spyOn(component, 'onClick');

      tagElement.triggerEventHandler('keyup.space', fakeEvent);

      expect(spyOnClick).toHaveBeenCalled();
    });

    it('onKeyPressed: shouldn`t call `onClick` if the event `keyup` is used with other key than `space`.', () => {
      fixture.detectChanges();

      const tagElement = fixture.debugElement.query(By.css('.po-tag'));
      const spyOnClick = spyOn(component, 'onClick');

      tagElement.triggerEventHandler('keyup.enter', fakeEvent);

      expect(spyOnClick).not.toHaveBeenCalled();
    });

    it('onClose: Should have been called onClose', () => {
      spyOn(component, <any>'onRemove');
      spyOn(component.remove, 'emit');

      component.onClose();

      expect(component['onRemove']).toHaveBeenCalled();
      expect(component.remove.emit).toHaveBeenCalledWith('click');
    });

    it('onRemove: Should remove the element if not disabled', () => {
      const mockElementRef = {
        nativeElement: {
          remove: jasmine.createSpy('remove')
        }
      };
      component['el'] = mockElementRef;
      component.disabled = false;

      component['onRemove']();

      expect(mockElementRef.nativeElement.remove).toHaveBeenCalled();
    });

    it('should set aria-label', () => {
      component.literals = {
        ...PoTagLiterals['pt']
      };
      component.label = 'Label';
      expect(component.setAriaLabel()).toContain('Label Remove');
    });

    it('should set aria-label', () => {
      component.literals = {
        ...PoTagLiterals['pt']
      };
      component.value = 'Label';
      expect(component.setAriaLabel()).toContain('Label Remove');
    });
  });

  describe('Templates:', () => {
    it('should only start with default classes, shouldn`t have variations.', () => {
      const value = 'Po Tag';
      component.value = value;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-container')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-value').innerHTML).toContain(value);

      expect(nativeElement.querySelector('.po-tag-icon')).toBeFalsy();
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
      fixture.detectChanges();

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

    it('should add `po-tag-neutral` if type is `PoTagType.Neutral`.', () => {
      component.type = PoTagType.Neutral;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-neutral')).toBeTruthy();
    });

    it('should add `PoTagIcon.Danger` if type is `PoTagType.Danger and `icon` is true`.', () => {
      component.type = PoTagType.Danger;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`[ng-reflect-icon="${PoTagIcon.Danger}"]`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Info` if type is `PoTagType.Info and `icon` is true`.', () => {
      component.type = PoTagType.Info;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`[ng-reflect-icon="${PoTagIcon.Info}"]`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Success` if type is `PoTagType.Success and `icon` is true`.', () => {
      component.type = PoTagType.Success;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`[ng-reflect-icon="${PoTagIcon.Success}"]`)).toBeTruthy();
    });

    it('should add `PoTagIcon.Warning` if type is `PoTagType.Warning and `icon` is true`.', () => {
      component.type = PoTagType.Warning;
      component.icon = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`[ng-reflect-icon="${PoTagIcon.Warning}"]`)).toBeTruthy();
    });

    it('should add `po-clickable` if `p-click` @Output is wire up`.', () => {
      fixtureClickable.detectChanges();

      expect(fixtureClickable.debugElement.nativeElement.querySelector('.po-clickable')).toBeTruthy();
    });

    it('shouldn`t add `po-clickable` if `p-click` @Output isn`t wire up`.', () => {
      component.isClickable = false;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-clickable')).toBeFalsy();
    });

    it('styleTag : should change customTextColor to white if it is not defined and customColor is defined ', () => {
      component.customTextColor = '';
      component.customColor = 'red';

      const result = component.styleTag();
      expect(result).toEqual({ 'background-color': 'red', 'color': 'white' });
    });

    it('styleTag : should return a empty object if color is defined', () => {
      component.color = 'color-01';
      component.removable = false;

      const result = component.styleTag();
      expect(result).toEqual({});
    });
  });
});
