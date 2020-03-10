import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoTabComponent } from './po-tab.component';

describe('PoTabComponent:', () => {
  let component: PoTabComponent;
  let fixture: ComponentFixture<PoTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoTabComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterContentInit: shoud call `setDisplayOnActive`', () => {
      spyOn(component, <any>'setDisplayOnActive');
      component.ngAfterContentInit();
      expect(component['setDisplayOnActive']).toHaveBeenCalled();
    });

    it('setDisplayOnActive: should set `elementRef` display none if `active` is false', () => {
      component.active = false;
      component['setDisplayOnActive']();

      expect(component['elementRef'].nativeElement.style.display).toBe('none');
    });

    it('setDisplayOnActive: should set `elementRef` display empty if `active` is true', () => {
      component.active = true;
      component['setDisplayOnActive']();

      expect(component['elementRef'].nativeElement.style.display).toBe('');
    });
  });
});
