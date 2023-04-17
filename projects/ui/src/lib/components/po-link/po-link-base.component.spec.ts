import { PoLinkBaseComponent } from './po-link-base.component';

describe('PoLinkBaseComponent:', () => {
  const component = new PoLinkBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoLinkBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('should set type with "externalLink"', () => {
      component.url = 'https://po-ui.io';
      component.label = 'link';

      expect(component.type).toBe('externalLink');
    });

    it('should set type with "internalLink"', () => {
      component.url = '/home';
      component.label = 'link';

      expect(component.type).toBe('internalLink');
    });

    it('should set type with "internalLink" if url is empty', () => {
      component.url = '';
      component.label = 'link';

      expect(component.type).toBe('internalLink');
    });
  });
});
