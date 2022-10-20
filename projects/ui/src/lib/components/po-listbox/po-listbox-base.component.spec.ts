import { PoListboxBaseComponent } from './po-listbox-base-component';

describe('PoListboxBaseComponent', () => {
  const component = new PoListBoxBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoListBoxBaseComponent).toBeTruthy();
  });
});
