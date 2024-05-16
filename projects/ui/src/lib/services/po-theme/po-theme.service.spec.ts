import { Renderer2, RendererFactory2, RendererType2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PoThemeTypeEnum } from './enum/po-theme-type.enum';
import { PoThemeService } from './po-theme.service';
import { PoTheme } from './interfaces/po-theme.interface';
import { DOCUMENT } from '@angular/common';
import { poThemeDefault } from './helpers/po-theme-poui.constant';
import { ICONS_DICTIONARY, PhosphorIconDictionary } from '../../components/po-icon';

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
    expect(theme.active).toEqual(PoThemeTypeEnum.light);
  });

  it('should change current theme type', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    service.changeCurrentThemeType(PoThemeTypeEnum.dark);

    const theme = service.getThemeActive();

    expect(theme.active).toEqual(PoThemeTypeEnum.dark);
  });

  describe('Custom Theme:', () => {
    let poThemeTest: PoTheme;
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
          }
        },
        active: PoThemeTypeEnum.light
      };
      poThemeTestDark = { ...poThemeTest, active: PoThemeTypeEnum.dark };
      poThemeWithJustAdditionalStyles = {
        name: 'justAdditionalStyles',
        type: {
          light: {
            '--color-page-background-color-page': 'var(--color-neutral-light-00)'
          }
        },
        active: PoThemeTypeEnum.light
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
      expect(theme.active).toEqual(PoThemeTypeEnum.dark);
    });

    describe('Local Saved Theme Methods:', () => {
      it('persistThemeActive: should persist and define the active theme', () => {
        spyOn(service, 'getThemeActive').and.returnValue(poThemeTest);
        spyOn(service, 'setTheme');

        const result = service.persistThemeActive();

        expect(service.getThemeActive).toHaveBeenCalled();
        expect(service.setTheme).toHaveBeenCalledWith(poThemeTest, poThemeTest.active);
        expect(result).toEqual(poThemeTest);
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

      it('setThemeActive: should set active theme', () => {
        const theme: PoTheme = poThemeTest;
        const setItemSpy = spyOn(localStorage, 'setItem');

        service['setThemeActive'](theme);

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
        { provide: 'poThemeDefault', useValue: poThemeDefault },
        { provide: ICONS_DICTIONARY, useValue: PhosphorIconDictionary }
      ]
    });

    service = TestBed.inject(PoThemeService);
  });

  it('should set default theme', () => {
    service.setDefaultTheme(PoThemeTypeEnum.light);
    const theme = service.getThemeActive();

    expect(theme).toBeTruthy();
    expect(theme.active).toEqual(PoThemeTypeEnum.light);
  });
});
