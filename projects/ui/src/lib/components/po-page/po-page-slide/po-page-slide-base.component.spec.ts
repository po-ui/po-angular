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

  it('should update property `p-size` with valid values', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'auto'];
    expectPropertiesValues(component, 'size', sizes, sizes);
  });

  it('should update property `p-size` with `md` when invalid values', () => {
    const invalidSizes = ['ms', 'dm', 'gl', 'lx', 'otua'];
    expectPropertiesValues(component, 'size', invalidSizes, 'md');
  });

  it('should update property `p-align` with valid values', () => {
    const aligns = ['left', 'right'];
    expectPropertiesValues(component, 'align', aligns, aligns);
  });

  it('should update property `p-align` with `right` when invalid values', () => {
    const invalidAligns = ['tfel', 'thgir'];
    expectPropertiesValues(component, 'align', invalidAligns, 'right');
  });

  it('should be call open method', () => {
    component.open();
    expect(component.hidden).toBe(false);
  });

  it('should be call close method', () => {
    component.close();
    expect(component.hidden).toBe(true);
  });
});
