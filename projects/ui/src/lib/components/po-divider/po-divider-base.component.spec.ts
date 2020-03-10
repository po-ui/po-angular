import { PoDividerBaseComponent } from './po-divider-base.component';

describe('PoDividerComponent:', () => {
  const component = new PoDividerBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoDividerBaseComponent).toBeTruthy();
  });
});
