import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoMediaQueryTokens } from './po-media-query.interface';
import { PoMediaQueryService } from './po-media-query.service';

describe('PoMediaQueryService:', () => {
  let service: PoMediaQueryService;
  let renderer: Renderer2;
  let rendererFactory: RendererFactory2;

  const mockTokens: PoMediaQueryTokens = {
    md: {
      gridSystemMdMinWidth: '1024px',
      gridSystemMdMaxWidth: '1366px'
    }
  };

  const mockCssRules = {
    media: {
      mediaText: '(min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth))'
    },
    cssText:
      '@media (min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth)) { body { color: black; } }'
  } as unknown as CSSMediaRule;

  const mockMediaRule = {
    media: {
      mediaText: '(min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth))'
    },
    cssRules: [mockCssRules],
    cssText:
      '@media (min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth)) { body { color: black; } }'
  } as unknown as CSSMediaRule;

  let styleSheet: CSSStyleSheet;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoMediaQueryService,
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: () => ({
              createElement: (name: string) => document.createElement(name),
              appendChild: (parent: HTMLElement, child: HTMLElement) => parent.appendChild(child)
            })
          }
        }
      ]
    });
    service = TestBed.inject(PoMediaQueryService);
    rendererFactory = TestBed.inject(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);

    const styleElement = renderer.createElement('style');
    renderer.appendChild(document.head, styleElement);
    styleSheet = styleElement.sheet as CSSStyleSheet;
  });

  describe('Methods:', () => {
    it('buildMediaQuery: should return max-width media query for "sm" token', () => {
      const token = 'system-grid-sm';
      const variable = '--gridSystemSmMaxWidth';
      const value = '600px';
      const existingQuery = '';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe('@media (max-width: 600px)');
    });

    it('buildMediaQuery: should return min-width media query for "xl" token', () => {
      const token = 'system-grid-xl';
      const variable = '--gridSystemXlMinWidth';
      const value = '1200px';
      const existingQuery = '';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe('@media (min-width: 1200px)');
    });

    it('buildMediaQuery: should return combined min-width and max-width media query for "md" token', () => {
      const token = 'system-grid-md';
      const variable = '--gridSystemMdMaxWidth';
      const value = '960px';
      const existingQuery = '@media (min-width: 600px)';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe('@media (min-width: 600px) and (max-width: 960px)');
    });

    it('buildMediaQuery: should return combined query if token contains "lg" with existingQuery', () => {
      const token = 'system-grid-lg';
      const variable = '--gridSystemLgMaxWidth';
      const value = '1280px';
      const existingQuery = '@media (min-width: 960px)';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe('@media (min-width: 960px) and (max-width: 1280px)');
    });

    it('buildMediaQuery: should return the existing query if no matching token is found', () => {
      const token = 'system-grid-unknown';
      const variable = '--gridSystemUnknownWidth';
      const value = '100px';
      const existingQuery = '@media (min-width: 400px)';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe(existingQuery);
    });

    it('buildMediaQuery: should return the existing query if token does not match "sm", "md", "lg", or "xl"', () => {
      const token = 'other-grid';
      const variable = '--otherGridWidth';
      const value = '1000px';
      const existingQuery = '@media (min-width: 800px)';

      const result = service['buildMediaQuery'](token, value, existingQuery);

      expect(result).toBe(existingQuery);
    });

    it('buildMediaQuery: should not call buildMediaQuery when no CSS variables are present in the mediaText', () => {
      const mediaRule = {
        media: {
          mediaText: '(min-width: 1026px) and (max-width: 1365px)'
        },
        cssRules: [{ cssText: 'body { color: black; }' }]
      } as unknown as CSSMediaRule;

      const tokens: PoMediaQueryTokens = {
        md: {
          gridSystemMdMinWidth: '1024px',
          gridSystemMdMaxWidth: '1366px'
        }
      };

      const dynamicSheet = {
        insertRule: jasmine.createSpy('insertRule')
      } as unknown as CSSStyleSheet;

      spyOn<any>(service, 'buildMediaQuery').and.returnValue('(min-width: 1026px)');

      service['updateTokensMediaRule'](mediaRule, tokens, dynamicSheet);

      expect(service['buildMediaQuery']).not.toHaveBeenCalled();
    });

    it('updateTokensMediaRule: should insert a media rule and check the cssText', () => {
      const tokens: PoMediaQueryTokens = {
        md: {
          gridSystemMdMinWidth: '1024px',
          gridSystemMdMaxWidth: '1366px'
        }
      };
      const mediaQuery = '(min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth))';
      const rule = 'body { background-color: blue; }';

      styleSheet.insertRule(`@media ${mediaQuery} { ${rule} }`, styleSheet.cssRules.length);

      const insertedRule = styleSheet.cssRules[0];

      if (insertedRule instanceof CSSMediaRule) {
        const expectedCssText = `@media ${mediaQuery} { ${rule} }`.replace(/\s+/g, ' ').trim();
        const actualCssText = insertedRule.cssText.replace(/\s+/g, ' ').trim();

        expect(insertedRule.media.mediaText).toBe(mediaQuery);
        expect(actualCssText).toBe(expectedCssText);

        spyOn<any>(service, 'updateTokensMediaRule').and.callThrough();
        service.updateTokens(tokens);

        expect(service['updateTokensMediaRule']).toHaveBeenCalledWith(
          jasmine.objectContaining({
            media: jasmine.objectContaining({
              mediaText: '(min-width: var(--gridSystemMdMinWidth)) and (max-width: var(--gridSystemMdMaxWidth))'
            }),
            cssText: jasmine.any(String)
          }),
          tokens,
          styleSheet
        );
      } else {
        fail('The rule entered is not a MediaRule');
      }
    });

    it('processStyleSheet: should warn and return when no rules are found', () => {
      const styleSheetMock = {
        rules: undefined,
        cssRules: undefined
      } as unknown as CSSStyleSheet;

      const consoleWarnSpy = spyOn(console, 'warn');
      const tokensMock: PoMediaQueryTokens = {};

      service['processStyleSheet'](styleSheetMock, tokensMock, styleSheet);

      expect(consoleWarnSpy).toHaveBeenCalledWith('No rules found in stylesheet');
    });

    it('updateTokensMediaRule: should handle the case when dynamicSheet is null', () => {
      const mockStyleSheet = {
        cssRules: [mockMediaRule]
      } as unknown as CSSStyleSheet;

      Object.defineProperty(document, 'styleSheets', {
        value: [mockStyleSheet],
        writable: true
      });

      const spyConsoleError = spyOn(console, 'error');

      (service as any).updateTokensMediaRule(mockMediaRule, mockTokens, null);

      expect(spyConsoleError).toHaveBeenCalledWith('dynamicSheet is null or undefined. Cannot insert rule.');
    });
  });
});
