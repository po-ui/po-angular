import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PoUtils as utils } from '../../../../utils/util';

import { PoNavbarActionComponent } from './po-navbar-action.component';
import { PoTooltipModule } from '../../../../directives';

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionComponent).toBe(true);
  });

  describe('Methods:', () => {
    it('click: should call `action` if `action` is defined', () => {
      component.action = () => 'action';

      const actionSpy = vi.spyOn(component, 'action');

      component.click();

      expect(actionSpy).toHaveBeenCalled();
    });

    it('click: should call and return `openUrl` with `link` if `action` is undefined and `link` is defined', () => {
      component.action = undefined;
      component.link = 'http://fakeUrlPo.com';
      const linkReturn = 'test';

      const spy = vi.spyOn(component as any, 'openUrl').mockReturnValue(linkReturn);

      const result = component.click() as any;

      expect(spy).toHaveBeenCalledWith(component.link);
      expect(result).toBe(linkReturn);
    });

    it('click: shouldn`t call `action` and `openUrl` if `action` and `link` is undefined', () => {
      component.action = undefined;
      component.link = undefined;

      const spy = vi.spyOn(component as any, 'openUrl');

      expect(component.click.bind(component)).not.toThrowError();
      expect(spy).not.toHaveBeenCalled();
    });

    it('openUrl: should call `openExternalLink` if url is external link', () => {
      const url = 'http://www.fakeUrlPo.com';

      const externalSpy = vi.spyOn(utils, 'openExternalLink').mockImplementation(() => {});
      const navigateSpy = vi.spyOn(component['router'], 'navigate');

      component['openUrl'](url);

      expect(externalSpy).toHaveBeenCalledWith(url);
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('openUrl: should call `router.navigate` if url is internal link', () => {
      const url = '/customers';

      const navigateSpy = vi.spyOn(component['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
      const externalSpy = vi.spyOn(utils, 'openExternalLink');

      component['openUrl'](url);

      expect(navigateSpy).toHaveBeenCalled();
      expect(externalSpy).not.toHaveBeenCalledWith(url);
    });

    it('openUrl: shouldn`t call `router.navigate` and `openExternalLink` if url is undefined ', () => {
      const navigateSpy = vi.spyOn(component['router'], 'navigate');
      const externalSpy = vi.spyOn(utils, 'openExternalLink');

      component['openUrl'](undefined);

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(externalSpy).not.toHaveBeenCalled();
    });
  });
});
