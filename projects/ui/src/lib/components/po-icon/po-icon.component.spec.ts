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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoIconComponent]
    }).compileComponents();
  }));

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

    describe('processIcon', () => {
      it('should add classes correctly for single icon', () => {
        component['processIcon']('my-icon');
        expect(component.class).toEqual('po-fonts-icon my-icon');
      });

      it('should add classes correctly for tokenized icons', () => {
        component['processIcon']('ICON_OK');
        expect(component.class).toEqual('po-icon po-icon-ok');
      });
    });

    describe('processIconTokens', () => {
      it('should return a string for single icon token', () => {
        const result = component['processIconTokens']('ICON_OK');
        expect(result).toEqual('po-icon po-icon-ok');
      });

      it('should return a string for multiple icon tokens', () => {
        const result = component['processIconTokens']('ICON_ARROW_RIGHT po-breadcrumb-icon-arrow');
        expect(result).toEqual('po-icon po-icon-arrow-right po-breadcrumb-icon-arrow');
      });
    });

    describe('splitIconNames', () => {
      it('should split icon names correctly', () => {
        const result = component['splitIconNames']('icon1 icon2');
        expect(result).toEqual(['icon1', 'icon2']);
      });

      it('should return a string if no space is found', () => {
        const result = component['splitIconNames']('icon');
        expect(result).toEqual('icon');
      });
    });

    describe('getIcon', () => {
      it('should return the icon name if it exists in the service', () => {
        const iconName = 'ICON_BOOK';
        const mockIconService = { icons: { ICON_BOOK: 'book' } };
        component = new PoIconComponent(mockIconService as any);
        const result = component['getIcon'](iconName);
        expect(result).toEqual('po-fonts-icon book');
      });

      it('should return an empty string if the icon does not exist in the service', () => {
        const iconName = 'non-existing-icon';
        const mockIconService = { icons: { ICON_BOOK: 'book' } };
        component = new PoIconComponent(mockIconService as any);
        const result = component['getIcon'](iconName);
        expect(result).toEqual('');
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
