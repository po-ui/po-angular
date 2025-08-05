import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoLanguageService } from '../../services';
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

  it('should emit event when calling collapsedMenuEvent.emit', () => {
    spyOn(component.colapsedMenuEvent, 'emit');
    component.colapsedMenuEvent.emit(true);
    expect(component.colapsedMenuEvent.emit).toHaveBeenCalledWith(true);
  });
});
