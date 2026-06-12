import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PoUtils as utils } from '../../../../utils/util';

import { PoNavbarActionComponent } from './po-navbar-action.component';
import { PoTooltipModule } from 'projects/ui/src/lib/directives';

describe('PoNavbarActionComponent:', () => {
  let component: PoNavbarActionComponent;
  let fixture: ComponentFixture<PoNavbarActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoNavbarActionComponent],
      imports: [PoTooltipModule, RouterModule.forRoot([], {})]
    }).compileComponents();

    fixture = TestBed.createComponent(PoNavbarActionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('click: should call `action` if `action` is defined', () => {
      component.action = () => 'action';

      const actionSpy = vi.spyOn(component as any, 'action');

      component.click();

      expect(actionSpy).toHaveBeenCalled();
    });

    it('click: should call and return `openUrl` with `link` if `action` is undefined and `link` is defined', () => {
      component.action = undefined;
      component.link = 'http://fakeUrlPo.com';
      const linkReturn = 'test';

      vi.spyOn(component as any, 'openUrl').mockReturnValue(linkReturn);

      const result = <any>component.click();

      expect(component['openUrl']).toHaveBeenCalledWith(component.link);
      expect(result).toBe(linkReturn);
    });

    it('click: shouldn`t call `action` and `openUrl` if `action` and `link` is undefined', () => {
      component.action = undefined;
      component.link = undefined;

      vi.spyOn(component as any, 'openUrl');

      expect(component.click.bind(this)).not.toThrowError();
      expect(component['openUrl']).not.toHaveBeenCalled();
    });

    it('openUrl: should call `openExternalLink` if url is external link', () => {
      const url = 'http://www.fakeUrlPo.com';

      vi.spyOn(utils as any, 'openExternalLink');
      vi.spyOn(component['router'] as any, 'navigate');

      component['openUrl'](url);

      expect(utils.openExternalLink).toHaveBeenCalledWith(url);
      expect(component['router'].navigate).not.toHaveBeenCalled();
    });

    it('openUrl: should call `router.navigate` if url is internal link', () => {
      const url = '/customers';

      vi.spyOn(component['router'] as any, 'navigate');
      vi.spyOn(utils as any, 'openExternalLink');

      component['openUrl'](url);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(utils.openExternalLink).not.toHaveBeenCalledWith(url);
    });

    it('openUrl: shouldn`t call `router.navigate` and `openExternalLink` if url is undefined ', () => {
      vi.spyOn(component['router'] as any, 'navigate');
      vi.spyOn(utils as any, 'openExternalLink');

      component['openUrl'](undefined);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(utils.openExternalLink).not.toHaveBeenCalled();
    });
  });
});
