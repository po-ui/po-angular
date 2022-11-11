import { PoDividerBaseComponent } from './po-divider-base.component';

describe('PoDividerComponent:', () => {
  const component = new PoDividerBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoDividerBaseComponent).toBeTruthy();
  });

  it('should set Coordinates to divider small', () => {
    component.borderWidth = 'small';

    expect(component.coordinateX1).toEqual('0.1%');
    expect(component.coordinateX2).toEqual('99.9%');
  });

  it('should set Coordinates to divider small if value invalid', () => {
    component.borderWidth = 'extra-large';

    expect(component.coordinateX1).toEqual('0.1%');
    expect(component.coordinateX2).toEqual('99.9%');
  });

  it('should set Coordinates to divider medium', () => {
    component.borderWidth = 'medium';

    expect(component.coordinateX1).toEqual('0.2%');
    expect(component.coordinateX2).toEqual('99.8%');
  });

  it('should set Coordinates to divider large', () => {
    component.borderWidth = 'large';

    expect(component.coordinateX1).toEqual('0.3%');
    expect(component.coordinateX2).toEqual('99.7%');
  });
});
