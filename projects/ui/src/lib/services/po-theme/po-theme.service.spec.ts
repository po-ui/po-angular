import { DOCUMENT } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICONS_DICTIONARY, PoIconDictionary } from '../../components/po-icon';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { poThemeDefault } from './helpers/po-theme-poui.constant';
import { PoTheme } from './interfaces/po-theme.interface';
import { PoThemeService } from './po-theme.service';
import { PoThemeAccessibilityEnum } from './enum/po-theme-accessibility.enum';

class MockRenderer2 {
  createElement(): any {}
  appendChild(): any {}
  removeChild(): any {}
  addClass(): any {}
  removeClass(): any {}
  setStyle(): any {}
}

describe('PoThemeService:', () => {
  let service: PoThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoThemeService,
        { provide: 'Window', useValue: window },
        { provide: DOCUMENT, useValue: document },
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: 'poThemeDefault', useValue: poThemeDefault },
        { provide: ICONS_DICTIONARY, useValue: PoIconDictionary }
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
    expect(theme.active).toEqual({
      type: PoThemeTypeEnum.light,
      accessibility: PoThemeAccessibilityEnum.AAA
    });
  });

  it('should change current theme type', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    service.changeCurrentThemeType(PoThemeTypeEnum.dark);

    const theme = service.getThemeActive();

    expect(theme.active).toEqual({
      type: PoThemeTypeEnum.dark,
      accessibility: PoThemeAccessibilityEnum.AAA
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
          accessibility: PoThemeAccessibilityEnum.AAA
        },
        active: {
          type: PoThemeTypeEnum.light,
          accessibility: PoThemeAccessibilityEnum.AAA
        }
      };
      poThemeTestDark = {
        ...poThemeTest,
        active: {
          type: PoThemeTypeEnum.dark,
          accessibility: PoThemeAccessibilityEnum.AAA
        }
      };
      poThemeWithJustAdditionalStyles = {
        name: 'justAdditionalStyles',
        type: {
          light: {
            '--color-page-background-color-page': 'var(--color-neutral-light-00)'
          },
          accessibility: PoThemeAccessibilityEnum.AAA
        },
        active: {
          type: PoThemeTypeEnum.light,
          accessibility: PoThemeAccessibilityEnum.AAA
        }
      };
      poThemeInit = {
        name: 'custom',
        type: [
          {
            light: {},
            dark: {},
            accessibility: PoThemeAccessibilityEnum.AA
          },
          {
            light: {},
            dark: {},
            accessibility: PoThemeAccessibilityEnum.AAA
          }
        ],
        active: {
          type: PoThemeTypeEnum.light,
          accessibility: PoThemeAccessibilityEnum.AAA
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
      const activeAccessibilityFromTheme = service['getActiveAccessibilityFromTheme'](_theme.active);

      const theme = service.getThemeActive();
      expect(theme).toEqual(_theme);
      expect(activeTypeFromTheme).toEqual(PoThemeTypeEnum.dark);
      expect(activeAccessibilityFromTheme).toEqual(PoThemeAccessibilityEnum.AAA);
    });

    it('should set custom theme, theme type and accessibility', () => {
      service.setTheme(poThemeInit, PoThemeTypeEnum.light, PoThemeAccessibilityEnum.AA);
      service.setCurrentThemeType(PoThemeTypeEnum.dark);
      service.setCurrentThemeAccessibility(PoThemeAccessibilityEnum.AAA);

      const theme = service.getThemeActive();
      expect(theme).toEqual(poThemeInit);
      expect(typeof theme.active === 'object' ? theme.active.type : theme.active).toEqual(PoThemeTypeEnum.dark);
      expect(typeof theme.active === 'object' ? theme.active.accessibility : PoThemeAccessibilityEnum.AAA).toEqual(
        PoThemeAccessibilityEnum.AAA
      );
    });

    it('setTheme: should return if the type dont exist', () => {
      spyOn(service, 'getThemeActive').and.returnValue(undefined);
      const theme = service.setTheme(poThemeInit, 2 as PoThemeTypeEnum, PoThemeAccessibilityEnum.AA);

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
          typeof poThemeTest.active === 'object' ? poThemeTest.active.accessibility : PoThemeAccessibilityEnum.AAA
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
          typeof poThemeTest.active === 'object' ? poThemeTest.active.accessibility : PoThemeAccessibilityEnum.AAA
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
          typeof poThemeInit.active === 'object' ? poThemeInit.active.accessibility : PoThemeAccessibilityEnum.AAA
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
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);

        const removeSpy = spyOn(document.getElementsByTagName('html')[0].classList, 'remove');
        const localStorageSpy = spyOn(localStorage, 'removeItem');

        service.cleanThemeActive();

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('test-light');
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

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeAccessibilityEnum.AAA);
      });

      it('should set theme type to dark', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.dark } as PoTheme;

        service.setThemeType(theme, PoThemeTypeEnum.dark);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeAccessibilityEnum.AAA);
      });

      it('should use accessibility from theme if available', () => {
        const theme = {
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.light, accessibility: PoThemeAccessibilityEnum.AA }
        } as PoTheme;

        service.setThemeType(theme);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeAccessibilityEnum.AA);
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

    describe('setThemeAccessibility', () => {
      beforeEach(() => {
        spyOn(service, 'setTheme');
      });

      it('should set theme accessibility to AAA by default, if it is not defined', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.light } as PoTheme;

        service.setThemeAccessibility(theme);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.light, PoThemeAccessibilityEnum.AAA);
      });

      it('should set theme accessibility to AA', () => {
        const theme = { ...poThemeInit, active: PoThemeTypeEnum.dark } as PoTheme;

        service.setThemeAccessibility(theme, PoThemeAccessibilityEnum.AA);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeAccessibilityEnum.AA);
      });

      it('should use type from theme if available', () => {
        const theme = {
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.dark, accessibility: PoThemeAccessibilityEnum.AA }
        } as PoTheme;

        service.setThemeAccessibility(theme, PoThemeAccessibilityEnum.AA);

        expect(service.setTheme).toHaveBeenCalledWith(theme, PoThemeTypeEnum.dark, PoThemeAccessibilityEnum.AA);
      });
    });

    describe('setCurrentThemeAccessibility', () => {
      beforeEach(() => {
        spyOn(service, 'getThemeActive').and.returnValue({
          ...poThemeInit,
          active: { type: PoThemeTypeEnum.light }
        } as PoTheme);
        spyOn(service, 'setThemeAccessibility');
      });

      it('should set current theme accessibility to AAA by default', () => {
        service.setCurrentThemeAccessibility();

        expect(service.setThemeAccessibility).toHaveBeenCalledWith(
          { ...poThemeInit, active: { type: PoThemeTypeEnum.light } } as PoTheme,
          PoThemeAccessibilityEnum.AAA
        );
      });

      it('should set current theme accessibility to AA', () => {
        service.setCurrentThemeAccessibility(PoThemeAccessibilityEnum.AA);

        expect(service.setThemeAccessibility).toHaveBeenCalledWith(
          { ...poThemeInit, active: { type: PoThemeTypeEnum.light } } as PoTheme,
          PoThemeAccessibilityEnum.AA
        );
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
