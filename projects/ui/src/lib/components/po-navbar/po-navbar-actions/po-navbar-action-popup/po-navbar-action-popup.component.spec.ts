import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoNavbarActionPopupComponent } from './po-navbar-action-popup.component';
import { PoPopupModule } from '../../../po-popup';

describe('PoNavbarActionPopupComponent:', () => {
  let component: PoNavbarActionPopupComponent;
  let fixture: ComponentFixture<PoNavbarActionPopupComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarActionPopupComponent],
      imports: [PoPopupModule, RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
    });
  });

  beforeEach(() => {
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
        { label: 'eye', icon: 'po-icon-eye' },
        { label: 'gas', icon: 'po-icon-gas' },
        { label: 'mail', icon: 'po-icon-mail' },
        { label: 'menu', icon: 'po-icon-menu' }
      ];

      expect(component.getLastIconAction()).toEqual('po-icon-menu');
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
        { label: 'eye', icon: 'po-icon-eye' },
        { label: 'gas', icon: 'po-icon-gas' },
        { label: 'mail', icon: 'po-icon-mail' },
        { label: 'menu', icon: 'po-icon-menu' }
      ];

      fixture.detectChanges();

      const icon = nativeElement.querySelector('span.po-icon');
      expect(icon.classList).toContain('po-icon-menu');
    });
  });
});
