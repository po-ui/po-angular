import { PoThemeA11yEnum, PoThemeService } from '../../../services';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { convertToBoolean } from '../../../utils/util';
import { PoPageSlideBaseComponent } from './po-page-slide-base.component';

describe('PoPageSlideBaseComponent', () => {
  let component: PoPageSlideBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoPageSlideBaseComponent(poThemeServiceMock);
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

  describe('p-components-size', () => {
    it('should set property with valid values for accessibility level is AA', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

      component.componentsSize = 'small';
      expect(component.componentsSize).toBe('small');

      component.componentsSize = 'medium';
      expect(component.componentsSize).toBe('medium');
    });

    it('should set property with valid values for accessibility level is AAA', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

      component.componentsSize = 'small';
      expect(component.componentsSize).toBe('medium');

      component.componentsSize = 'medium';
      expect(component.componentsSize).toBe('medium');
    });

    it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
      poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

      component['_componentsSize'] = undefined;
      expect(component.componentsSize).toBe('small');
    });

    it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
      poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

      component['_componentsSize'] = undefined;
      expect(component.componentsSize).toBe('medium');
    });

    it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
      component['_componentsSize'] = undefined;
      expect(component.componentsSize).toBe('medium');
    });
  });

  it('should update property clickOut`', () => {
    component.clickOut = convertToBoolean(555);
    expect(component.clickOut).toBe(false);

    component.clickOut = convertToBoolean('false');
    expect(component.clickOut).toBe(false);

    component.clickOut = convertToBoolean(0);
    expect(component.clickOut).toBe(false);

    component.clickOut = false;
    expect(component.clickOut).toBe(false);

    component.clickOut = convertToBoolean(1);
    expect(component.clickOut).toBe(true);

    component.clickOut = convertToBoolean('true');
    expect(component.clickOut).toBe(true);

    component.clickOut = true;
    expect(component.clickOut).toBe(true);
  });

  it('should call open method', () => {
    component.open();
    expect(component.hidden).toBe(false);
  });

  it('close: should call close method and emit output p-close', () => {
    spyOn(component.closePageSlide, 'emit');

    component.close();

    expect(component.hidden).toBe(true);
    expect(component.closePageSlide.emit).toHaveBeenCalled();
  });
});
