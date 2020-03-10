import { PoLoadingBaseComponent } from './po-loading-base.component';

describe('PoLoadingBaseComponent', () => {
  let component: PoLoadingBaseComponent;

  beforeEach(() => {
    component = new PoLoadingBaseComponent();
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingBaseComponent).toBeTruthy();
  });

  it('property text should be `Carregando`', () => {
    const defaultText = 'Carregando';

    expect(component.text).toBe(defaultText);
  });

  it('property text should be `Carregando clientes`', () => {
    const defaultText = 'Carregando clientes';

    component.text = defaultText;

    expect(component.text).toBe(defaultText);
  });
});
