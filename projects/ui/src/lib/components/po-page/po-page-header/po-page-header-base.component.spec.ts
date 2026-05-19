import { TestBed } from '@angular/core/testing';

import { PoPageHeaderBaseComponent } from './po-page-header-base.component';

describe('PoPageHeaderBaseComponent', () => {
  let component: PoPageHeaderBaseComponent;

  beforeEach(() => {
    component = TestBed.runInInjectionContext(() => new PoPageHeaderBaseComponent());
  });

  it('should be created', () => {
    expect(component instanceof PoPageHeaderBaseComponent).toBeTruthy();
  });

  describe('helper property:', () => {
    it('should have helper input with undefined as default value', () => {
      expect(component.helper()).toBeUndefined();
    });
  });
});
