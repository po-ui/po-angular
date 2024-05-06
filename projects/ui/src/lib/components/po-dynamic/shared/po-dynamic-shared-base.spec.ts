import { PoDynamicViewField } from '../po-dynamic-view/po-dynamic-view-field.interface';
import { PoDynamicSharedBase } from './po-dynamic-shared-base';

describe('PoDynamicSharedBase', () => {
  let component: PoDynamicSharedBase;

  beforeEach(() => {
    component = new PoDynamicSharedBase();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ensureFieldHasContainer', () => {
    it('should ensure first field has a container', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'name', label: 'Name', order: 1 },
        { property: 'age', label: 'Age', order: 2, container: 'Container 1' }
      ];

      component.ensureFieldHasContainer(fields);

      expect(fields[0].container).toBe('');
    });

    it('should not add an empty container if the first already have a container defined', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'name', label: 'Name', order: 1, container: 'Container 1' },
        { property: 'age', label: 'Age', order: 2, container: 'Container 2' }
      ];

      component.ensureFieldHasContainer(fields);

      expect(fields[0].container).toBe('Container 1');
    });

    it('should not add an empty container if no field has a container defined', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'name', label: 'Name', order: 1 },
        { property: 'age', label: 'Age', order: 2 }
      ];

      component.ensureFieldHasContainer(fields);

      expect(fields[0].container).toBeUndefined();
    });
  });

  describe('setContainerFields', () => {
    it('should set containerFields to an array of arrays of fields grouped by container', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'field1', label: 'Field 1', container: 'Container 1', order: 1 },
        { property: 'field3', label: 'Field 3', order: 2 },
        { property: 'field2', label: 'Field 2', container: 'Container 2', order: 3 }
      ];

      component.visibleFields = fields;

      component.setContainerFields();

      expect(component.containerFields).toEqual([
        [
          { property: 'field1', label: 'Field 1', container: 'Container 1', order: 1 },
          { property: 'field3', label: 'Field 3', order: 2 }
        ],
        [{ property: 'field2', label: 'Field 2', container: 'Container 2', order: 3 }]
      ]);
    });

    it('should set hasContainers to true if at least one field has a container', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'field1', label: 'Field 1', container: 'Container 1' },
        { property: 'field2', label: 'Field 2' }
      ];

      component.visibleFields = fields;

      component.setContainerFields();

      expect(component.hasContainers).toBe(true);
    });

    it('should set hasContainers to false if no fields have a container', () => {
      const fields: Array<PoDynamicViewField> = [
        { property: 'field1', label: 'Field 1' },
        { property: 'field2', label: 'Field 2' }
      ];

      component.visibleFields = fields;

      component.setContainerFields();

      expect(component.hasContainers).toBe(false);
    });
  });
});
