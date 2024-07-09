import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoTabsBaseComponent } from './po-tabs-base.component';

describe('PoTabsBaseComponent:', () => {
  const component = new PoTabsBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoTabsBaseComponent).toBeTruthy();
  });
});
