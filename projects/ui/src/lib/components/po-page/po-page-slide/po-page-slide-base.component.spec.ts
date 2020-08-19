import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoPageSlideBaseComponent } from './po-page-slide-base.component';

describe('PoPageSlideBaseComponent', () => {
  let component: PoPageSlideBaseComponent;

  beforeEach(() => {
    component = new PoPageSlideBaseComponent();
  });

  it('should create component as hidden', () => {
    expect(component).toBeTruthy();
    expect(component.hidden).toBe(true);
  });

  it('should update property size with valid values', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'auto'];
    expectPropertiesValues(component, 'size', sizes, sizes);
  });

  it('should update property size with md when invalid values', () => {
    const invalidSizes = ['ms', 'dm', 'gl', 'lx', 'otua'];
    expectPropertiesValues(component, 'size', invalidSizes, 'md');
  });

  it('should update property clickOut`', () => {
    component.clickOut = undefined;
    expect(component.clickOut).toBe(false);

    component.clickOut = ('false' as unknown) as boolean;
    expect(component.clickOut).toBe(false);

    component.clickOut = (0 as unknown) as boolean;
    expect(component.clickOut).toBe(false);

    component.clickOut = false;
    expect(component.clickOut).toBe(false);

    component.clickOut = (1 as unknown) as boolean;
    expect(component.clickOut).toBe(true);

    component.clickOut = ('true' as unknown) as boolean;
    expect(component.clickOut).toBe(true);

    component.clickOut = true;
    expect(component.clickOut).toBe(true);
  });

  it('should call open method', () => {
    component.open();
    expect(component.hidden).toBe(false);
  });

  it('should call close method', () => {
    component.close();
    expect(component.hidden).toBe(true);
  });
});
