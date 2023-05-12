import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';
import { PoDisclaimerComponent } from '../po-disclaimer/po-disclaimer.component';
import { PoDisclaimerGroupComponent } from './po-disclaimer-group.component';
import { PoDisclaimerRemoveComponent } from './po-disclaimer-remove/po-disclaimer-remove.component';
import { PoTagModule } from '../po-tag/po-tag.module';
import { PoDisclaimerModule } from '../po-disclaimer/po-disclaimer.module';

describe('PoDisclaimerGroupComponent:', () => {
  let component: PoDisclaimerGroupComponent;
  let fixture: ComponentFixture<PoDisclaimerGroupComponent>;
  let nativeElement: any;

  const disclaimers: Array<PoDisclaimer> = [
    { value: 'hotel', label: 'Hotel', property: 'hotel' },
    { value: '500', label: 'Price', property: 'Preço' },
    { value: 'north', label: 'Region', property: 'region' }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent, PoDisclaimerRemoveComponent, PoDisclaimerGroupComponent],
      imports: [PoTagModule, PoDisclaimerModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDisclaimerGroupComponent);
    component = fixture.componentInstance;
    component.disclaimers = [].concat(disclaimers);

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be created with title', () => {
    fakeAsync(() => {
      component.title = 'Filtros';
      fixture.detectChanges();
      tick();
      expect(nativeElement.querySelector('div.po-disclaimer-group-title').innerHTML).toContain('Filtros');
    });
  });

  it('should be created with 3 disclaimers and default removeAll', () => {
    expect(nativeElement.querySelectorAll('po-disclaimer').length).toBe(3);
    expect(nativeElement.querySelectorAll('po-tag').length).toBe(1);
  });

  it('should be created with 3 disclaimers and without removeAll disclaimer', () => {
    component.hideRemoveAll = true;
    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('po-disclaimer').length).toBe(3);
    expect(nativeElement.querySelector('.po-disclaimer-danger')).toBeFalsy();
  });

  it('should hide disclaimer-group if there are no disclaimers', () => {
    component.disclaimers = [];
    fixture.detectChanges();
    expect(nativeElement.querySelector('po-disclaimer-group')).toBeFalsy();
  });

  it('should hide disclaimer-remove if there are less than 1 disclaimers', () => {
    component.hideRemoveAll = false;
    component.disclaimers = [disclaimers[1]];
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-danger')).toBeFalsy();
  });

  it('should remove/close one disclaimers', () => {
    component.hideRemoveAll = true;

    component.onCloseAction(disclaimers[0]);
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('po-disclaimer').length).toBe(2);
  });

  it('should remove all disclaimers', () => {
    component.removeAllItems();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('po-disclaimer').length).toBe(0);
  });

  describe('Templates:', () => {
    it(`should set tabindex to 0 if have a disclaimer with 'hideClose'.`, () => {
      component.disclaimers = [{ value: 'po', hideClose: false }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeTruthy();
    });

    it(`shouldn't set tabindex if disclaimer doesn't have 'hideClose'.`, () => {
      component.disclaimers = [{ value: 'po', hideClose: true }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag[tabindex="0"]')).toBeNull();
    });

    it(`shouldn't set tabindex if doesn't have disclaimer.`, () => {
      component.disclaimers = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeNull();
    });

    it('should set disclaimer remove all with `literals.removeAll`.', () => {
      component.disclaimers = disclaimers;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tag-value span').innerHTML).toBe(component.literals.removeAll);
    });
  });
});
