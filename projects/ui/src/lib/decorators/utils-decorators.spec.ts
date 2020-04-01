import * as UtilsDecorators from './utils-decorators';

describe('validatePropertyOnLifeCycle:', () => {
  it('should call callback on call ngOnInit', () => {
    const target = {
      ngOnInit: () => {},
      myProperty: undefined
    };

    const callback = jasmine.createSpy('callback');

    const decoratorProperties = { target, property: 'myProperty' };
    UtilsDecorators.validatePropertyOnLifeCycle(decoratorProperties, 'ngOnInit', callback);

    expect(callback).not.toHaveBeenCalled();

    target.ngOnInit();

    expect(callback).toHaveBeenCalled();
  });

  it('should create ngOnInit to call callback', () => {
    const target = {
      myProperty: undefined
    };

    const callback = jasmine.createSpy('callback');

    const decoratorProperties = { target, property: 'myProperty' };
    UtilsDecorators.validatePropertyOnLifeCycle(decoratorProperties, 'ngOnInit', callback);

    expect(callback).not.toHaveBeenCalled();

    target['ngOnInit']();

    expect(callback).toHaveBeenCalled();
  });

  it('should keep implementation of ngOnInit', () => {
    const target = {
      myProperty: undefined,
      ngOnInit: function () {
        this.myProperty = true;
      }
    };

    const callback = jasmine.createSpy('callback');

    const decoratorProperties = { target, property: 'myProperty' };
    UtilsDecorators.validatePropertyOnLifeCycle(decoratorProperties, 'ngOnInit', callback);

    expect(callback).not.toHaveBeenCalled();

    target['ngOnInit']();

    expect(target.myProperty).toBe(true);
  });
});

describe('changeValueByCallback:', () => {
  it('should set value of validation return', () => {
    const validation = () => 'validation return';

    const target = {
      myProperty: undefined
    };

    const decoratorProperties = { target, originalDescriptor: {} };

    const descriptor = UtilsDecorators.changeValueByCallback(decoratorProperties, 'decoratorName', validation);

    Object.defineProperty(target, 'myProperty', descriptor);

    target.myProperty = 'new value';

    expect(target.myProperty).toBe('validation return');
  });

  it('should call set with validation return', () => {
    const validation = () => 'validation return';

    const target = {
      myProperty: undefined
    };

    const originalSetSpy = jasmine.createSpy('set');
    const decoratorProperties = { target, originalDescriptor: { set: originalSetSpy } };

    const descriptor = UtilsDecorators.changeValueByCallback(decoratorProperties, 'decoratorName', validation);

    Object.defineProperty(target, 'myProperty', descriptor);

    target.myProperty = 'new value';

    expect(originalSetSpy).toHaveBeenCalledWith('validation return');
  });

  it('should return original get value if get of object is defined', () => {
    const validation = () => 'validation return';
    const originalGetValue = 'original';

    const target = {
      myProperty: undefined
    };

    const decoratorProperties = { target, originalDescriptor: { get: () => originalGetValue } };
    const descriptor = UtilsDecorators.changeValueByCallback(decoratorProperties, 'decoratorName', validation);

    Object.defineProperty(target, 'myProperty', descriptor);

    expect(target.myProperty).toBe(originalGetValue);
  });
});

describe('createPrivateProperty:', () => {
  it('should return private property name with undescore', () => {
    const privatePropertyName = '$$__property';
    const propertyName = 'property';

    const target = {
      property: 'value'
    };

    const result = UtilsDecorators['createPrivateProperty'](target, propertyName, undefined);

    expect(result).toBe(privatePropertyName);
  });

  it('should create private property in target', () => {
    const privatePropertyName = '$$__property';
    const propertyName = 'property';

    const target = {
      property: 'value'
    };

    UtilsDecorators['createPrivateProperty'](target, propertyName, undefined);

    expect(target.hasOwnProperty(privatePropertyName)).toBe(true);
  });

  it('should call console.warn if private property name already exists', () => {
    const propertyName = 'property';

    const target = {
      property: 'value',
      $$__property: 'value'
    };

    spyOn(console, 'warn');

    UtilsDecorators['createPrivateProperty'](target, propertyName, undefined);

    expect(console.warn).toHaveBeenCalled();
  });
});
