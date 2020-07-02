import { PoTableRowTemplateDirective } from './po-table-row-template.directive';
import { PoTableRowTemplateArrowDirection } from '../enums/po-table-row-template-arrow-direction.enum';

describe('PoTableRowTemplateDirective', () => {
  const component = new PoTableRowTemplateDirective(null);

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('tableRowTemplateArrowDirection: should be right', () => {
    component.tableRowTemplateArrowDirection = PoTableRowTemplateArrowDirection.Right;
    expect(component.tableRowTemplateArrowDirection).toEqual('RIGHT');
  });

  it('tableRowTemplateArrowDirection: should be left', () => {
    component.tableRowTemplateArrowDirection = PoTableRowTemplateArrowDirection.Left;
    expect(component.tableRowTemplateArrowDirection).toEqual('LEFT');
  });

  it('tableRowTemplateArrowDirection: should be left when value is null', () => {
    component.tableRowTemplateArrowDirection = null;
    expect(component.tableRowTemplateArrowDirection).toEqual('LEFT');
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
