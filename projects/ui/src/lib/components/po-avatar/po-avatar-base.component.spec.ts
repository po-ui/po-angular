import { PoAvatarBaseComponent } from './po-avatar-base.component';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

describe('PoAvatarBaseComponent', () => {
  const component = new PoAvatarBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoAvatarBaseComponent).toBeTruthy();
  });

  it('should update property `p-size` with `md` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

    expectPropertiesValues(component, 'size', invalidValues, 'md');
  });

  it('should update property `p-size` with valid values', () => {
    const validValues = ['xs', 'sm', 'md', 'lg', 'xl'];

    expectPropertiesValues(component, 'size', validValues, validValues);
  });
});
