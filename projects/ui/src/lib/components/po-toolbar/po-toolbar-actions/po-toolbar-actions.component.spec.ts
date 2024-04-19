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
    it('actionsIcon: should update property `p-actions-icon` with `ICON_MORE` if invalid values', () => {
      const invalidValues = [undefined, null, NaN, {}, 0.1, false, true];

      expectPropertiesValues(component, 'actionsIcon', invalidValues, 'ICON_MORE');
    });

    it('actionsIcon: should update property `p-actions-icon` with valid values', () => {
      const validValues = ['ICON_CLOCK', 'ICON_CUT', 'ICON_EXIT'];

      expectPropertiesValues(component, 'actionsIcon', validValues, validValues);
    });
  });
});
