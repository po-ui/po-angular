import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoToolbarActionsComponent } from './po-toolbar-actions.component';

describe('PoToolbarActionsComponent:', () => {
  let component: PoToolbarActionsComponent;

  beforeEach(() => {
    component = new PoToolbarActionsComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('actionsIcon: should update property `p-actions-icon` with `po-icon-more` if invalid values', () => {
      const invalidValues = [undefined, null, NaN, {}, 0.1, false, true];

      expectPropertiesValues(component, 'actionsIcon', invalidValues, 'po-icon-more');
    });

    it('actionsIcon: should update property `p-actions-icon` with valid values', () => {
      const validValues = ['po-icon-clock', 'po-icon-cut', 'po-icon-exit'];

      expectPropertiesValues(component, 'actionsIcon', validValues, validValues);
    });
  });
});
