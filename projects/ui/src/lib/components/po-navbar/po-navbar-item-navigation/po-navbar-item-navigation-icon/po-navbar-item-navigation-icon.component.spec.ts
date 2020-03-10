import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoNavbarItemNavigationIconComponent } from './po-navbar-item-navigation-icon.component';

describe('PoNavbarItemNavigationIconComponent:', () => {
  let component: PoNavbarItemNavigationIconComponent;
  let fixture: ComponentFixture<PoNavbarItemNavigationIconComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarItemNavigationIconComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarItemNavigationIconComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarItemNavigationIconComponent).toBeTruthy();
  });

  describe('Templates: ', () => {
    it('should contain `po-navbar-item-navigation-icon-disabled` if disabled is true', () => {
      component.disabled = true;

      fixture.detectChanges();

      const element = nativeElement.querySelector('.po-navbar-item-navigation-icon-disabled');
      const element2 = nativeElement.querySelector('.po-clickable');

      expect(element).toBeTruthy();
      expect(element2).toBeFalsy();
    });

    it('should contain `po-clickable` if disabled is false', () => {
      component.disabled = false;

      fixture.detectChanges();

      const element = nativeElement.querySelector('.po-navbar-item-navigation-icon-disabled');
      const element2 = nativeElement.querySelector('.po-clickable');

      expect(element).toBeFalsy();
      expect(element2).toBeTruthy();
    });

    it('should emit the icon if disabled is false', () => {
      spyOn(component.click, 'emit');

      const icon = true;
      component.disabled = false;
      component.icon = icon;

      fixture.detectChanges();

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      const element = nativeElement.querySelector('.po-clickable');
      element.dispatchEvent(eventClick);

      expect(component.click.emit).toHaveBeenCalledWith(icon);
    });

    it('shouldn`t emit the icon if disabled is true', () => {
      spyOn(component.click, 'emit');

      const icon = true;
      component.disabled = true;
      component.icon = icon;

      fixture.detectChanges();

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      const element = nativeElement.querySelector('.po-navbar-item-navigation-icon-disabled');
      element.dispatchEvent(eventClick);

      expect(component.click.emit).not.toHaveBeenCalled();
    });
  });
});
