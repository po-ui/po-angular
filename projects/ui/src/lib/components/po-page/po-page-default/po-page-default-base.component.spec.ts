import { fakeAsync, tick } from '@angular/core/testing';

import { PoPageDefaultBaseComponent } from './po-page-default-base.component';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

class PoPageDefaultComponent extends PoPageDefaultBaseComponent {
  setDropdownActions() {}
}

describe('PoPageDefaultBaseComponent:', () => {
  const component = new PoPageDefaultComponent();

  it('should be created', () => {
    expect(component instanceof PoPageDefaultBaseComponent).toBeTruthy();
  });

  it('should be array empty', () => {
    expectPropertiesValues(component, 'actions', [], []);
  });

  it('should get title and call recalculateHeaderSize when set title', fakeAsync(() => {
    component.poPageContent = <any>{
      recalculateHeaderSize: () => {}
    };

    spyOn(component.poPageContent, 'recalculateHeaderSize');

    component.title = 'teste';

    tick();

    expect(component.title).toBe('teste');
    expect(component.poPageContent.recalculateHeaderSize).toHaveBeenCalled();
  }));

  describe('Properties:', () => {
    it('should update property `p-actions` to empty if is invalid values.', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('should update property `p-actions` if is valid values.', () => {
      const validValues = [[{ label: 'Share', icon: 'po-icon-share' }]];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });
  });
});
