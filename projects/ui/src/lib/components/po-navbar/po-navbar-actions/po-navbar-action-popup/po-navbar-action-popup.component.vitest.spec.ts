import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoNavbarActionPopupComponent } from './po-navbar-action-popup.component';

vi.mock('../../../po-popup', () => ({
  PoPopupModule: class {}
}));

describe('PoNavbarActionPopupComponent:', () => {
  let component: PoNavbarActionPopupComponent;
  let fixture: ComponentFixture<PoNavbarActionPopupComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoNavbarActionPopupComponent],
      imports: [RouterModule.forRoot([], {})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoNavbarActionPopupComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionPopupComponent).toBe(true);
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
});
