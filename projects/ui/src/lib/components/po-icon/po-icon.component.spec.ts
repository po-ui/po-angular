import { TemplateRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import { PoIconComponent } from './po-icon.component';

class TemplateA extends TemplateRef<void> {
  elementRef;
  createEmbeddedView(context) {
    return <any>null;
  }
}

describe('PoIconComponent: ', () => {
  let component: PoIconComponent;
  let fixture: ComponentFixture<PoIconComponent>;

  let nativeElement: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoIconComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoIconComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', fakeAsync(() => {
    expect(component instanceof PoIconComponent).toBeTruthy();
  }));

  describe('Properties: ', () => {
    describe('p-icon: ', () => {
      it('should call `addClasses` if value is a string.', () => {
        spyOn(component, <any>'addClasses');

        const iconString = 'po-icon-user';
        component.icon = iconString;

        expect(component['addClasses']).toHaveBeenCalledWith(iconString);
      });

      it('should update `icon` value if value is a TemplateRef.', () => {
        spyOn(component, <any>'addClasses');

        const expectedResult = new TemplateA();
        component.icon = expectedResult;

        expect(component['addClasses']).not.toHaveBeenCalled();
        expect(component.icon).toEqual(expectedResult);
      });

      it('shouldn`t update `icon` value if value isn`t a TemplateRef or string.', () => {
        spyOn(component, <any>'addClasses');

        component.icon = <any>2;

        expect(component['addClasses']).not.toHaveBeenCalled();
        expect(component.icon).toEqual(undefined);
      });
    });
  });

  describe('Methods:', () => {
    describe('addClasses: ', () => {
      it('should update `class` if icon class starts with `po-icon`.', () => {
        const iconString = 'po-icon-user';
        const expectedValue = 'po-icon po-icon-user';
        component['addClasses'](iconString);

        expect(component.class).toBe(expectedValue);
      });

      it('should update `class` if icon class don`t starts with `po-icon`.', () => {
        const iconString = 'fa fa-podcast';
        const expectedResult = 'po-fonts-icon fa fa-podcast';
        component['addClasses'](iconString);

        expect(component.class).toBe(expectedResult);
      });
    });
  });

  describe('Template:', () => {
    it('should contain the `po-icon` selector.', () => {
      const iconString = 'po-icon-user';
      component.icon = iconString;
      fixture.detectChanges();
      const icon = nativeElement.querySelector('i.po-icon');

      expect(icon).toBeTruthy();
    });

    it('shouldn`t contain the `po-icon` selector.', () => {
      const iconString = 'fa fa-podcast';
      component.icon = iconString;

      fixture.detectChanges();

      const poClass = nativeElement.querySelector('i.po-icon');
      const fontClass = nativeElement.querySelector('i.fa');

      expect(poClass).toBeFalsy();
      expect(fontClass).toBeTruthy();
    });
  });
});
