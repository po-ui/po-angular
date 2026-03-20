import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { PoLanguageService, PoThemeA11yEnum } from '../../services';
import { PoHeaderLiterals } from './interfaces/po-header-literals.interface';
import { PoHeaderBaseComponent, poNavbarLiteralsDefault } from './po-header-base.component';

@Component({
  template: '',
  standalone: false
})
class TestHostComponent extends PoHeaderBaseComponent {
  constructor(languageService: PoLanguageService) {
    super(languageService);
  }

  updateMenu() {}
}

describe('PoHeaderBaseComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let languageServiceSpy: jasmine.SpyObj<PoLanguageService>;

  beforeEach(() => {
    languageServiceSpy = jasmine.createSpyObj('PoLanguageService', ['getShortLanguage']);
    languageServiceSpy.getShortLanguage.and.returnValue('pt');

    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      providers: [{ provide: PoLanguageService, useValue: languageServiceSpy }]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with service language', () => {
    expect(languageServiceSpy.getShortLanguage).toHaveBeenCalled();
    expect(component.literals).toEqual(poNavbarLiteralsDefault['pt']);
  });

  describe('brand', () => {
    it('should accept string and transform into object with default link "/"', () => {
      component.brand = 'logo.png';
      expect(component.brand).toEqual({ logo: 'logo.png', link: '/' } as any);
    });

    it('should accept object and keep link informed', () => {
      component.brand = { logo: 'logo.png', link: '/home' };
      expect(component.brand).toEqual({ logo: 'logo.png', link: '/home' });
    });

    it('should assign "/" as link if not informed', () => {
      component.brand = { logo: 'logo.png' };
      expect(component.brand.link).toBe('/');
    });
  });

  describe('menuItems', () => {
    it('should generate random id when not informed', () => {
      component.menuItems = [{ label: 'Item' }];
      expect(component.menuItems[0].id).toBeDefined();
    });

    it('should set $internalRoute to true if link is not external', () => {
      component.menuItems = [{ label: 'Home', link: '/home' }];
      expect(component.menuItems[0].$internalRoute).toBeTrue();
    });

    it('should set $internalRoute to false if link is external', () => {
      component.menuItems = [{ label: 'Google', link: 'http://google.com' }];
      expect(component.menuItems[0].$internalRoute).toBeFalse();
    });
  });

  describe('literals', () => {
    it('should set custom literals correctly', () => {
      const custom: PoHeaderLiterals = { headerLinks: 'Links', notifications: 'Avisos' };
      component.literals = custom;
      expect(component.literals.headerLinks).toBe('Links');
      expect(component.literals.notifications).toBe('Avisos');
    });

    it('should return default literals if invalid value is passed', () => {
      component.literals = null;
      expect(component.literals).toEqual(poNavbarLiteralsDefault['pt']);
    });
  });

  describe('p-size', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    it('should set property with valid values for accessibility level is AA', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

      fixture.componentRef.setInput('p-size', 'small');
      fixture.detectChanges();
      expect(component.sizeInput()).toBe('small');
      expect(component.size()).toBe('small');

      fixture.componentRef.setInput('p-size', 'medium');
      fixture.detectChanges();
      expect(component.sizeInput()).toBe('medium');
      expect(component.size()).toBe('medium');
    });

    it('should set property with valid values for accessibility level is AAA', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

      fixture.componentRef.setInput('p-size', 'small');
      fixture.detectChanges();
      expect(component.sizeInput()).toBe('small');
      expect(component.size()).toBe('medium');

      fixture.componentRef.setInput('p-size', 'medium');
      fixture.detectChanges();
      expect(component.sizeInput()).toBe('medium');
      expect(component.size()).toBe('medium');
    });

    it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
      localStorage.setItem('po-default-size', 'small');

      fixture.componentRef.setInput('p-size', '');
      fixture.detectChanges();
      expect(component.size()).toBe('small');
    });

    it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
      localStorage.setItem('po-default-size', 'medium');

      fixture.componentRef.setInput('p-size', '');
      fixture.detectChanges();
      expect(component.size()).toBe('medium');
    });

    it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

      fixture.componentRef.setInput('p-size', '');
      fixture.detectChanges();
      expect(component.size()).toBe('medium');
    });

    it('onThemeChange: should recalculate size when theme changes', fakeAsync(() => {
      const spy1 = spyOn<any>(component['themeChangeSignal'], 'update').and.callThrough();
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

      fixture.componentRef.setInput('p-size', 'small');
      fixture.detectChanges();
      component['onThemeChange']();
      flush();
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

      expect(component.size()).toBe('medium');
      expect(spy1).toHaveBeenCalled();
    }));

    it('onThemeChange: should return an error when calling updateMenu', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(component, 'updateMenu').and.throwError('DOM not ready');

      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      component['onThemeChange']();

      expect(consoleSpy).toHaveBeenCalledWith(
        'updateMenu with errors. probably tried to execute before the component was rendered.'
      );
    });
  });

  it('should emit event when calling collapsedMenuEvent.emit', () => {
    spyOn(component.colapsedMenuEvent, 'emit');
    component.colapsedMenuEvent.emit(true);
    expect(component.colapsedMenuEvent.emit).toHaveBeenCalledWith(true);
  });
});
