import { DOCUMENT } from '@angular/common';
import { Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICONS_DICTIONARY, PoIconDictionary } from '../../components/po-icon';
import { PoThemeA11yEnum } from './enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { poThemeDefault } from './helpers/po-theme-poui.constant';
import { PoTheme } from './interfaces/po-theme.interface';
import { PoThemeService } from './po-theme.service';

class MockRenderer2 implements Renderer2 {
  data = {};
  destroyNode: ((node: any) => void) | null = null;

  selectRootElement(selectorOrNode: string | any, preserveContent?: boolean) {
    throw new Error('Method not implemented.');
  }
  parentNode(node: any) {
    throw new Error('Method not implemented.');
  }
  nextSibling(node: any) {
    throw new Error('Method not implemented.');
  }

  destroy(): void {}

  createElement(tagName: string, namespace?: string | null): any {
    return document.createElement(tagName);
  }

  createComment(value: string): any {
    return document.createComment(value);
  }

  createText(value: string): any {
    return document.createTextNode(value);
  }

  appendChild(parent: any, newChild: any): void {
    parent.appendChild(newChild);
  }

  removeChild(parent: any, oldChild: any): void {
    parent.removeChild(oldChild);
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    parent.insertBefore(newChild, refChild);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    el.setAttribute(name, value);
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    el.removeAttribute(name);
  }

  addClass(el: any, name: string): void {
    el.classList.add(name);
  }

  removeClass(el: any, name: string): void {
    el.classList.remove(name);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    el.style[style] = value;
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    el.style[style] = '';
  }

  setProperty(el: any, name: string, value: any): void {
    el[name] = value;
  }

  setValue(node: any, value: string): void {
    node.nodeValue = value;
  }

  listen(
    target: 'document' | 'window' | 'body' | any,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    return () => {};
  }
}
class MockRendererFactory2 {
  createRenderer(): Renderer2 {
    return new MockRenderer2();
  }
}

describe('PoThemeService:', () => {
  let service: PoThemeService;
  let renderer: MockRenderer2;
  let styleElement: HTMLStyleElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoThemeService,
        { provide: 'Window', useValue: window },
        { provide: DOCUMENT, useValue: document },
        { provide: RendererFactory2, useClass: MockRendererFactory2 },
        { provide: 'poThemeDefault', useValue: poThemeDefault },
        { provide: ICONS_DICTIONARY, useValue: PoIconDictionary }
      ]
    });

    renderer = TestBed.inject(RendererFactory2).createRenderer(null, null) as MockRenderer2;
    service = TestBed.inject(PoThemeService);

    spyOn(renderer, 'createText').and.callFake(css => document.createTextNode(css));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default theme', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    const theme = service.getThemeActive();

    expect(theme).toBeTruthy();
    expect(theme.active).toEqual({
      type: PoThemeTypeEnum.light,
      a11y: PoThemeA11yEnum.AAA
    });
  });

  it('should change current theme type', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    service.changeCurrentThemeType(PoThemeTypeEnum.dark);

    const theme = service.getThemeActive();

    expect(theme.active).toEqual({
      type: PoThemeTypeEnum.dark,
      a11y: PoThemeA11yEnum.AAA
    });
  });

  describe('Custom Theme:', () => {
    let poThemeTest: PoTheme;
    let poThemeInit: PoTheme;
    let poThemeTestDark: PoTheme;
    let poThemeWithJustAdditionalStyles: PoTheme;

    beforeEach(() => {
      poThemeTest = {
        name: 'test',
        type: {
          light: {
            color: {
              brand: {
                '01': {
                  lightest: '#051f31',
                  lighter: '#004064',
                  light: '#00659a',
                  base: '#0079b8',
                  dark: '#3dadfa',
                  darker: '#afd3fa',
                  darkest: '#e3eefb'
                },
                '02': {
                  base: '#0079b8'
                },
                '03': {
                  base: '#0079b8'
                }
              },
              action: {
                disabled: 'var(--color-neutral-mid-40)'
              },
              feedback: {
                info: {
                  base: '#0079b8'
                }
              },
              neutral: {
                light: {
                  '00': '#1c1c1c',
                  '05': '#202020',
                  '10': '#2b2b2b',
                  '20': '#3b3b3b',
                  '30': '#5a5a5a'
                },
                mid: {
                  '40': '#7c7c7c',
                  '60': '#a1a1a1'
                },
                dark: {
                  '70': '#c1c1c1',
                  '80': '#d9d9d9',
                  '90': '#eeeeee',
                  '95': '#fbfbfb'
                }
              }
            },
            onRoot: {
              '--color-page-background-color-page': 'var(--color-neutral-light-00)'
            },
            perComponent: {
              'po-container': {
                '--background': 'var(--color-neutral-light-00);'
              }
            }
          },
          dark: {},
          a11y: PoThemeA11yEnum.AAA
        },
        active: {
          type: PoThemeTypeEnum.light,
          a11y: PoThemeA11yEnum.AAA
        }
      };

      poThemeTestDark = {
        ...poThemeTest,
        active: {
          type: PoThemeTypeEnum.dark,
          a11y: PoThemeA11yEnum.AAA
        }
      };

      poThemeWithJustAdditionalStyles = {
        name: 'justAdditionalStyles',
        type: {
          light: {
            '--color-page-background-color-page': 'var(--color-neutral-light-00)'
          },
          a11y: PoThemeA11yEnum.AAA
        },
        active: {
          type: PoThemeTypeEnum.light,
          a11y: PoThemeA11yEnum.AAA
        }
      };

      poThemeInit = {
        name: 'custom',
        type: [
          {
            light: {},
            dark: {},
            a11y: PoThemeA11yEnum.AA
          },
          {
            light: {},
            dark: {},
            a11y: PoThemeA11yEnum.AAA
          }
        ],
        active: {
          type: PoThemeTypeEnum.light,
          a11y: PoThemeA11yEnum.AAA
        }
      };
    });

    it('should set custom theme', () => {
      service.setTheme(poThemeTest);

      const theme = service.getThemeActive();
      expect(theme).toEqual(poThemeTest);
    });

    it('should not set the custom theme, if it was send with a PoThemeTypeEnum that the theme does not have', () => {
      spyOn(console, 'error');
      service.setTheme(poThemeTest, 1);

      expect(console.error).not.toHaveBeenCalled();
    });

    it('should set custom theme, but only with the additional styles', () => {
      service.setTheme(poThemeWithJustAdditionalStyles);

      const theme = service.getThemeActive();
      expect(theme).toEqual(poThemeWithJustAdditionalStyles);
    });

    it('should set custom theme and change theme type', () => {
      service.setTheme(poThemeTest, PoThemeTypeEnum.light);
      service.changeCurrentThemeType(PoThemeTypeEnum.dark);

      const theme = service.getThemeActive();
      expect(theme).toEqual(poThemeTest);
      expect(typeof theme.active === 'object' ? theme.active.type : theme.active).toEqual(PoThemeTypeEnum.dark);
    });

    it('should set theme default, and get the active type and accessibility', () => {
      const _theme = {
        name: 'customOld',
        type: {
          light: {},
          dark: {}
        },
        active: PoThemeTypeEnum.light
      };
      spyOn(service, 'getThemeActive').and.returnValue(_theme);
      service.changeCurrentThemeType(PoThemeTypeEnum.dark);

      const activeTypeFromTheme = service['getActiveTypeFromTheme'](_theme.active);
      const activeAccessibilityFromTheme = service['getActiveA11yFromTheme'](_theme.active);

      const theme = service.getThemeActive();
      expect(theme).toEqual(_theme);
      expect(activeTypeFromTheme).toEqual(PoThemeTypeEnum.dark);
      expect(activeAccessibilityFromTheme).toEqual(PoThemeA11yEnum.AAA);
    });

    it('should set custom theme, theme type and accessibility', () => {
      service.setTheme(poThemeInit, PoThemeTypeEnum.light, PoThemeA11yEnum.AA);
      service.setCurrentThemeType(PoThemeTypeEnum.dark);
      service.setCurrentThemeA11y(PoThemeA11yEnum.AAA);

      const theme = service.getThemeActive();
      expect(theme).toEqual(poThemeInit);
      expect(typeof theme.active === 'object' ? theme.active.type : theme.active).toEqual(PoThemeTypeEnum.dark);
      expect(typeof theme.active === 'object' ? theme.active.a11y : PoThemeA11yEnum.AAA).toEqual(PoThemeA11yEnum.AAA);
    });

    it('setTheme: should return if the type dont exist', () => {
      spyOn(service, 'getThemeActive').and.returnValue(undefined);
      const theme = service.setTheme(poThemeInit, 2 as PoThemeTypeEnum, PoThemeA11yEnum.AA);

      expect(theme).toEqual(undefined);
    });

    describe('Local Saved Theme Methods:', () => {
      it('applyTheme: should persist and define the active theme', () => {
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);
        spyOn(service, 'setTheme');

        const result = service.applyTheme();

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(service.setTheme).toHaveBeenCalledWith(
          poThemeTest,
          typeof poThemeTest.active === 'object' ? poThemeTest.active.type : poThemeTest.active,
          typeof poThemeTest.active === 'object' ? poThemeTest.active.a11y : PoThemeA11yEnum.AAA
        );
        expect(result).toEqual(poThemeTest);
      });

      it('applyTheme: should apply local theme, if theme passed is the same saved', () => {
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);
        spyOn(service, 'setTheme');

        const result = service.applyTheme(poThemeTest);

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(service.setTheme).toHaveBeenCalledWith(
          poThemeTest,
          typeof poThemeTest.active === 'object' ? poThemeTest.active.type : poThemeTest.active,
          typeof poThemeTest.active === 'object' ? poThemeTest.active.a11y : PoThemeA11yEnum.AAA
        );
        expect(result).toEqual(poThemeTest);
      });

      it('applyTheme: should apply new theme and persist and define as active theme', () => {
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);
        spyOn(service, 'setTheme');

        const result = service.applyTheme(poThemeInit);

        expect(service.setTheme).toHaveBeenCalledWith(
          poThemeInit,
          typeof poThemeInit.active === 'object' ? poThemeInit.active.type : poThemeInit.active,
          typeof poThemeInit.active === 'object' ? poThemeInit.active.a11y : PoThemeA11yEnum.AAA
        );
        expect(result).toEqual(poThemeInit);
      });

      it('applyTheme: should not apply theme if none is passed and there is none local saved', () => {
        spyOn(service, 'getThemeActive').and.returnValue(undefined);
        spyOn(service, 'setTheme');

        const result = service.applyTheme();

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(result).toEqual(undefined);
      });

      it('changeCurrentThemeType: should change current theme type', () => {
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);
        spyOn(service, <any>'changeThemeType');
        service.changeCurrentThemeType(PoThemeTypeEnum.dark);

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(service['changeThemeType']).toHaveBeenCalledWith(poThemeTestDark);
      });

      it('cleanThemeActive: should clean active theme', () => {
        poThemeTest.name = 'test';
        poThemeTest.active['type'] = PoThemeTypeEnum.light;
        poThemeTest.active['a11y'] = PoThemeA11yEnum.AAA;

        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.classList.add('test-light-AAA');
        const removeClassSpy = spyOn(htmlElement.classList, 'remove').and.callThrough();
        const localStorageSpy = spyOn(localStorage, 'removeItem');

        service.cleanThemeActive();

        expect(removeClassSpy).toHaveBeenCalledWith('test-light-AAA');
        expect(localStorageSpy).toHaveBeenCalledWith('totvs-theme');
      });

      it('setThemeLocal: should set active theme', () => {
        const theme: PoTheme = poThemeTest;
        const setItemSpy = spyOn(localStorage, 'setItem');

        service['setThemeLocal'](theme);

        expect(setItemSpy).toHaveBeenCalledWith('totvs-theme', JSON.stringify(theme));
        expect(service['theme']).toEqual(theme);
      });

      it('getThemeActive: should get active theme', () => {
        const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(poThemeTest));
        const result = service.getThemeActive();

        // Expectations
        expect(localStorageSpy).toHaveBeenCalledWith('totvs-theme');
        expect(result).toEqual(poThemeTest);
      });

      it('getThemeActive: should catch error when localStorage is corrupted', () => {
        spyOn(localStorage, 'getItem').and.throwError('Corrupted localStorage');
        const consoleSpy = spyOn(console, 'error');
        service.getThemeActive();

        expect(consoleSpy).toHaveBeenCalledWith('Erro ao obter o tema do armazenamento local:', jasmine.any(Error));
      });
    });

    describe('setThemeType', () => {
      beforeEach(() => {
        spyOn(service, 'setTheme');
      });

      it('should set theme type to light by default, if it is not defined', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme;

        service.setThemeType(theme);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeA11yEnum.AAA);
      });

      it('should set theme type to dark', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.dark } as PoTheme;

        service.setThemeType(theme, PoThemeTypeEnum.dark);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeA11yEnum.AAA);
      });

      it('should use accessibility from theme if available', () => {
        const theme = {
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AA }
        } as PoTheme;

        service.setThemeType(theme);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeA11yEnum.AA);
      });
    });

    describe('setCurrentThemeType', () => {
      beforeEach(() => {
        spyOn(service, 'getThemeActive').and.returnValue({ ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme);
        spyOn(service, 'setThemeType');
      });

      it('should set current theme type to light by default', () => {
        service.setCurrentThemeType();

        expect(service.setThemeType).toHaveBeenCalledWith(
          { ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme,
          PoThemeTypeEnum.light
        );
      });

      it('should set current theme type to dark', () => {
        service.setCurrentThemeType(PoThemeTypeEnum.dark);

        expect(service.setThemeType).toHaveBeenCalledWith(
          { ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme,
          PoThemeTypeEnum.dark
        );
      });
    });

    describe('setThemeA11y', () => {
      beforeEach(() => {
        spyOn(service, 'setTheme');
      });

      it('should set theme accessibility to AAA by default, if it is not defined', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme;

        service.setThemeA11y(theme);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeA11yEnum.AAA);
      });

      it('should set theme accessibility to AA', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.dark } as PoTheme;

        service.setThemeA11y(theme, PoThemeA11yEnum.AA);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeA11yEnum.AA);
      });

      it('should use type from theme if available', () => {
        const theme = {
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.dark, a11y: PoThemeA11yEnum.AA }
        } as PoTheme;

        service.setThemeA11y(theme, PoThemeA11yEnum.AA);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeA11yEnum.AA);
      });
    });

    describe('setCurrentThemeA11y', () => {
      beforeEach(() => {
        spyOn(service, 'getThemeActive').and.returnValue({
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.light }
        } as PoTheme);
        spyOn(service, 'setThemeA11y');
      });

      it('should set current theme accessibility to AAA by default', () => {
        service.setCurrentThemeA11y();

        expect(service.setThemeA11y).toHaveBeenCalledWith(
          { ...poThemeInit, active: { type: PoThemeTypeEnum.light } } as PoTheme,
          PoThemeA11yEnum.AAA
        );
      });

      it('should set current theme accessibility to AA', () => {
        service.setCurrentThemeA11y(PoThemeA11yEnum.AA);

        expect(service.setThemeA11y).toHaveBeenCalledWith(
          { ...poThemeInit, active: { type: PoThemeTypeEnum.light } } as PoTheme,
          PoThemeA11yEnum.AA
        );
      });
    });

    describe('setPerComponentAndOnRoot: ', () => {
      let active: any;
      let perComponent: any;
      let onRoot: any;

      beforeEach(() => {
        document.head.querySelector('#baseStyle')?.remove();

        active = { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA };
        perComponent = { 'po-listbox': { display: 'flex' } };
        onRoot = { '--font-family': 'Roboto' };
      });

      const validateStyleContent = (expectedCss: string) => {
        const styleElement = document.head.querySelector('#baseStyle');
        expect(styleElement).toBeTruthy(); // Verifica se o elemento foi criado
        expect(styleElement.textContent?.replace(/\s+/g, ' ').trim()).toContain(
          expectedCss.replace(/\s+/g, ' ').trim()
        );
      };

      it('should apply both type and accessibility when both are present', () => {
        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-light-AAA"]:root {
            po-listbox {display: flex;};
            --font-family: Roboto;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should apply accessibility only when type is not present', () => {
        active.type = undefined;

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class$="-AAA"]:root {
            po-listbox {display: flex;};
            --font-family: Roboto;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should apply type only when accessibility is not present', () => {
        active.a11y = undefined;
        active.type = PoThemeTypeEnum.dark;
        onRoot = { '--font-family': 'Arial' };

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-dark"]:root {
            po-listbox {display: flex;};
            --font-family: Arial;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should not apply type or accessibility when both are undefined', () => {
        active = { type: undefined, a11y: undefined };
        perComponent = { 'po-listbox': { display: 'none' } };
        onRoot = { '--font-family': 'Helvetica' };

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html:root {
            po-listbox {display: none;};
            --font-family: Helvetica;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should append styles to existing style element if it exists', () => {
        // Simula estilo pré-existente
        const existingStyle = document.createElement('style');
        existingStyle.id = 'baseStyle';
        document.head.appendChild(existingStyle);

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-light-AAA"]:root {
            po-listbox {display: flex;};
            --font-family: Roboto;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should use empty perComponentStyles and onRootStyles when both are undefined', () => {
        perComponent = undefined;
        onRoot = undefined;

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-light-AAA"]:root {
            
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should use empty perComponentStyles when perComponent is undefined', () => {
        perComponent = undefined;

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-light-AAA"]:root {
            --font-family: Roboto;
          }
        `;
        validateStyleContent(expectedCss);
      });

      it('should use empty onRootStyles when onRoot is undefined', () => {
        onRoot = undefined;

        service.setPerComponentAndOnRoot(active, perComponent, onRoot);

        const expectedCss = `
          html[class*="-light-AAA"]:root {
            po-listbox {display: flex;};
          }
        `;
        validateStyleContent(expectedCss);
      });
    });
  });
});

describe(`PoThemeService with 'PhosphorIconDictionary':`, () => {
  let service: PoThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoThemeService,
        { provide: 'Window', useValue: window },
        { provide: DOCUMENT, useValue: document },
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: 'poThemeDefault', useValue: poThemeDefault }
      ]
    });

    service = TestBed.inject(PoThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default theme', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    const theme = service.getThemeActive();

    expect(theme).toBeTruthy();
    expect(typeof theme.active === 'object' ? theme.active.type : theme.active).toEqual(PoThemeTypeEnum.light);
  });
});
