import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { configureTestSuite } from 'projects/ui/src/lib/util-test/util-expect.spec';
import * as utils from '../../../../utils/util';

import { PoNavbarActionComponent } from './po-navbar-action.component';
import { PoTooltipModule } from 'projects/ui/src/lib/directives';

describe('PoNavbarActionComponent:', () => {
  let component: PoNavbarActionComponent;
  let fixture: ComponentFixture<PoNavbarActionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNavbarActionComponent],
      imports: [PoTooltipModule, RouterModule.forRoot([])]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarActionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('click: should call `callFunction` with `action` and `this` if `action` is defined and `parentRef` is undefined', () => {
      component.action = () => 'action';
      component['parentRef'] = undefined;

      spyOn(utils, 'callFunction');

      component.click();

      expect(utils.callFunction).toHaveBeenCalledWith(component.action, component);
    });

    it('click: should call `callFunction` with `action` and `parentRef` if `action` and `parentRef` are defined', () => {
      component.action = () => 'action';
      component['parentRef'] = '<po-navbar></po-navbar>';

      spyOn(utils, 'callFunction');

      component.click();

      expect(utils.callFunction).toHaveBeenCalledWith(component.action, component['parentRef']);
    });

    it('click: should call and return `openUrl` with `link` if `action` is undefined and `link` is defined', () => {
      component.action = undefined;
      component.link = 'http://test.com';
      const linkReturn = 'test';

      spyOn(utils, 'callFunction');
      spyOn(component, <any>'openUrl').and.returnValue(linkReturn);

      const result = <any>component.click();

      expect(utils.callFunction).not.toHaveBeenCalled();
      expect(component['openUrl']).toHaveBeenCalledWith(component.link);
      expect(result).toBe(linkReturn);
    });

    it('click: shouldn`t call `callFunction` and `openUrl` if `action` and `link` is undefined', () => {
      component.action = undefined;
      component.link = undefined;

      spyOn(utils, 'callFunction');
      spyOn(component, <any>'openUrl');

      component.click();

      expect(utils.callFunction).not.toHaveBeenCalled();
      expect(component['openUrl']).not.toHaveBeenCalled();
    });

    it('openUrl: should call `openExternalLink` if url is external link', () => {
      const url = 'http://www.google.com';

      spyOn(utils, 'openExternalLink');
      spyOn(component['router'], 'navigate');

      component['openUrl'](url);

      expect(utils.openExternalLink).toHaveBeenCalledWith(url);
      expect(component['router'].navigate).not.toHaveBeenCalled();
    });

    it('openUrl: should call `router.navigate` if url is internal link', () => {
      const url = '/customers';

      spyOn(component['router'], 'navigate');
      spyOn(utils, 'openExternalLink');

      component['openUrl'](url);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(utils.openExternalLink).not.toHaveBeenCalledWith(url);
    });

    it('openUrl: shouldn`t call `router.navigate` and `openExternalLink` if url is undefined ', () => {
      spyOn(component['router'], 'navigate');
      spyOn(utils, 'openExternalLink');

      component['openUrl'](undefined);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(utils.openExternalLink).not.toHaveBeenCalled();
    });
  });
});
