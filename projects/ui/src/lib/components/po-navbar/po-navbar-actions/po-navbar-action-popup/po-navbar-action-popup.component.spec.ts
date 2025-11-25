import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PoNavbarActionPopupComponent } from './po-navbar-action-popup.component';
import { PoPopupModule } from '../../../po-popup';
import { PoIconComponent } from '../../../po-icon';

describe('PoNavbarActionPopupComponent:', () => {
  let component: PoNavbarActionPopupComponent;
  let fixture: ComponentFixture<PoNavbarActionPopupComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoNavbarActionPopupComponent, PoIconComponent],
      imports: [PoPopupModule, RouterModule.forRoot([], {})]
    }).compileComponents();

    fixture = TestBed.createComponent(PoNavbarActionPopupComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionPopupComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getLastIconAction: should return the last icon', () => {
      component.iconActions = [
        { label: 'eye', icon: 'an-eye' },
        { label: 'gas', icon: 'an-gas-pump' },
        { label: 'mail', icon: 'an-envelope-simple' },
        { label: 'menu', icon: 'an-list' }
      ];

      expect(component.getLastIconAction()).toEqual('an-list');
    });

    it('getLastIconAction: should return `undefined` if `iconActions` is undefined', () => {
      component.iconActions = undefined;

      expect(component.getLastIconAction()).toBeUndefined();
    });

    it('getLastIconAction: should return `undefined` if `iconActions` is empty array', () => {
      component.iconActions = [];

      expect(component.getLastIconAction()).toBeUndefined();
    });
  });

  describe('Templates:', () => {
    it('should contain the last icon', () => {
      component.iconActions = [
        { label: 'eye', icon: 'an-eye' },
        { label: 'gas', icon: 'an-gas-pump' },
        { label: 'mail', icon: 'an-envelope-simple' },
        { label: 'menu', icon: 'an-list' }
      ];

      fixture.detectChanges();

      const icon = nativeElement.querySelector('po-icon i');

      expect(icon).toBeTruthy();
      expect(icon.classList).toContain('po-fonts-icon');
      expect(icon.classList).toContain('an-list');
    });
  });
});
