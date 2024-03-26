import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { PoThemeService } from './po-theme.service';
import { PoThemeTokens } from './interfaces/po-theme-tokens.interface';

describe('PoThemeService:', () => {
  let service: PoThemeService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj<Renderer2>('Renderer2', [
      'setProperty',
      'createElement',
      'appendChild',
      'createText',
      'removeChild'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: 'Window', useValue: { document: { head: {} } } },
        { provide: RendererFactory2, useValue: { createRenderer: () => mockRenderer } },
        PoThemeService
      ]
    });

    service = TestBed.inject(PoThemeService);
  });

  it('should be load `service` correctly', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('should set a theme empty', () => {
      service.setTheme({});
      expect(mockRenderer.setProperty).not.toHaveBeenCalled();
    });

    it('should set theme with background image in PoSelect', fakeAsync(() => {
      const themeWithColorBrand: PoThemeTokens = {
        '--color-brand-01-dark': '#123456'
      };

      service.setTheme(themeWithColorBrand);
      tick();

      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        document.documentElement,
        'style',
        '--color-brand-01-dark: #123456;'
      );
      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));

    it('should not set theme with empty color brand property in PoSelect', fakeAsync(() => {
      const themeWithColorBrand: PoThemeTokens = {
        '--color-brand-01-dark': ''
      };

      service.setTheme(themeWithColorBrand);
      tick();

      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.setProperty).not.toHaveBeenCalled();
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));

    it('should clean background image style in PoSelect', fakeAsync(() => {
      const getBGImageStyleSpy = spyOn<any>(service, 'getBGImageStyleInPoSelect').and.returnValue(
        {} as HTMLStyleElement
      );
      tick();

      service['cleanBGImageStyleInPoSelect']();

      expect(getBGImageStyleSpy).toHaveBeenCalled();
      expect(mockRenderer.removeChild).toHaveBeenCalled();
    }));

    it('should get background image style in PoSelect', fakeAsync(() => {
      const css = 'select {--background-image: url(xpto)}';
      const style = document.createElement('style');

      document.head.appendChild(style);
      style.appendChild(document.createTextNode(css));

      const result = service['getBGImageStyleInPoSelect']();
      tick();

      expect(result?.textContent).toEqual(`select {--background-image: url(xpto)}`);

      document.head.removeChild(style);
    }));

    it('should be set theme sunset', fakeAsync(() => {
      const spyChangeBGImg = spyOn<any>(service, 'changeBGImagemInPoSelect').and.callThrough();
      service.setSunsetTheme();
      tick();
      expect(spyChangeBGImg).toHaveBeenCalledWith('#a5131a');
      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.setProperty).toHaveBeenCalled();
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));

    it('should be set theme sunset dark', fakeAsync(() => {
      const spyChangeBGImg = spyOn<any>(service, 'changeBGImagemInPoSelect').and.callThrough();
      service.setSunsetDarkTheme();
      tick();
      expect(spyChangeBGImg).toHaveBeenCalledWith('#a5131a');
      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.setProperty).toHaveBeenCalled();
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));

    it('should be set theme TOTVS', fakeAsync(() => {
      const spyChangeBGImg = spyOn<any>(service, 'changeBGImagemInPoSelect').and.callThrough();
      service.setTotvsTheme();
      tick();
      expect(spyChangeBGImg).toHaveBeenCalledWith('#013f65');
      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.setProperty).toHaveBeenCalled();
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));

    it('should be set theme TOTVS dark', fakeAsync(() => {
      const spyChangeBGImg = spyOn<any>(service, 'changeBGImagemInPoSelect').and.callThrough();
      service.setTotvsDarkTheme();
      tick();
      expect(spyChangeBGImg).toHaveBeenCalledWith('#013f65');
      expect(mockRenderer.createElement).toHaveBeenCalledWith('style');
      expect(mockRenderer.setProperty).toHaveBeenCalled();
      expect(mockRenderer.appendChild).toHaveBeenCalled();
      expect(mockRenderer.createText).toHaveBeenCalled();
    }));
  });
});
