import { PoTableRowTemplateDirective } from './po-table-row-template.directive';

describe('PoTableRowTemplateDirective', () => {
  const component = new PoTableRowTemplateDirective(null);

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('poTableRowTemplateShow: should call `poTableRowTemplateShow` and return your boolean value', () => {
      component.poTableRowTemplateShow = (row, index) => {
        return row.name === 'teste';
      };

      expect(component.poTableRowTemplateShow({ name: 'teste' }, 1)).toBeTruthy();
    });
  });
});
