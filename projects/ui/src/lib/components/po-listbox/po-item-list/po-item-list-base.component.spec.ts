import { PoItemListBaseComponent } from './po-item-list-base.component';

describe('PoListboxBaseComponent', () => {
  const component = new PoItemListBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoItemListBaseComponent).toBeTruthy();
  });
});
