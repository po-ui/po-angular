/* eslint-disable no-unused-expressions */
import { poThemeSharedBase } from './base.constant';

describe('poThemeSharedBase: ', () => {
  describe('perComponent: ', () => {
    describe('BUTTON:', () => {
      it('should define pill border-radius for header nav selectors', () => {
        const selector =
          '.po-header-nav-submenu-more:focus, .po-header-nav-customer-container:focus, .po-header-nav-submenu:focus, .po-header-nav-submenu-button-more:hover .po-header-nav-submenu-more-icon, .po-header-nav-submenu-button-more:hover, .po-header-nav-submenu-button:hover, .po-header-nav-submenu-button, .po-header-nav-submenu-button-more';

        expect(poThemeSharedBase.perComponent[selector]).toEqual({
          '--border-radius': 'var(--border-radius-pill)'
        });
      });

      it('should define xxl border-radius for po-button', () => {
        expect(poThemeSharedBase.perComponent['po-button']).toEqual({
          '--border-radius': 'var(--border-radius-xxl)'
        });
      });

      it('should define pill border-radius for po-button-group .po-button', () => {
        expect(poThemeSharedBase.perComponent['po-button-group .po-button']).toEqual({
          '--border-radius': 'var(--border-radius-pill)'
        });
      });
    });

    describe('INPUT:', () => {
      it('should define pill border-radius for input selectors', () => {
        const selector =
          '.po-input, .po-combo-input, .po-select, .po-search .po-search-input, .po-dropdown-button';

        expect(poThemeSharedBase.perComponent[selector]).toEqual({
          'border-radius': 'var(--border-radius-pill)'
        });
      });

      it('should define pill border-radius for combo, dropdown and search', () => {
        expect(poThemeSharedBase.perComponent['po-combo, po-dropdown, po-search']).toEqual({
          '--border-radius': 'var(--border-radius-pill)'
        });
      });

      it('should define xxl border-radius for po-lookup', () => {
        expect(poThemeSharedBase.perComponent['po-lookup']).toEqual({
          '--border-radius': 'var(--border-radius-xxl)'
        });
      });
    });

    describe('CONTAINER:', () => {
      it('should define xl border-radius for container, modal and widget', () => {
        expect(poThemeSharedBase.perComponent['po-container, po-modal, po-widget']).toEqual({
          '--border-radius': 'var(--border-radius-xl)',
          'border-radius': 'var(--border-radius)'
        });
      });

      it('should define light-05 background for po-container', () => {
        expect(poThemeSharedBase.perComponent['po-container']).toEqual({
          '--background': 'var(--color-neutral-light-05)'
        });
      });
    });

    describe('SKELETON:', () => {
      it('should define lg border-radius tokens for po-skeleton', () => {
        expect(poThemeSharedBase.perComponent['po-skeleton']).toEqual({
          '--border-radius': 'var(--border-radius-lg)',
          '--border-radius-text': 'var(--border-radius-lg)',
          '--border-radius-primary': 'var(--border-radius-lg)'
        });
      });
    });

    describe('USER GUIDE:', () => {
      it('should define lg button border-radius for po-user-guide-popover', () => {
        expect(poThemeSharedBase.perComponent['.po-user-guide-popover']).toEqual({
          '--button-border-radius': 'var(--border-radius-lg)'
        });
      });
    });
  });

  describe('onRoot: ', () => {
    it('should define the page background color', () => {
      expect(poThemeSharedBase.onRoot).toEqual({
        '--color-page-background-color-page': 'var(--color-neutral-light-05)'
      });
    });
  });
});
