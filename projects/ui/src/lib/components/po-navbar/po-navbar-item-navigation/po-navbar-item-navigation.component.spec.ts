import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoNavbarItemNavigationComponent } from './po-navbar-item-navigation.component';
import { PoNavbarItemNavigationIconComponent } from './po-navbar-item-navigation-icon/po-navbar-item-navigation-icon.component';

describe('PoNavbarItemNavigationComponent:', () => {
  let component: PoNavbarItemNavigationComponent;
  let fixture: ComponentFixture<PoNavbarItemNavigationComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarItemNavigationComponent, PoNavbarItemNavigationIconComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarItemNavigationComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarItemNavigationComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should contain two `po-navbar-item-navigation-icon` elements', () => {
      const elements = nativeElement.querySelectorAll('po-navbar-item-navigation-icon');

      expect(elements.length).toBe(2);

      expect(elements[0].classList).toContain('po-navbar-item-navigation-icon');
      expect(elements[1].classList).toContain('po-navbar-item-navigation-icon');
    });
  });
});
