import * as utilsFunctions from './utils';

describe('Utils:', () => {
  it('validateParameter: should return throw error if param value is undefined', () => {
    const param = { key: undefined };

    const result = () => utilsFunctions.validateParameter(param);

    expect(result).toThrowError('The key parameter cannot be undefined or null');
  });

  it('validateParameter: should return throw error if param value is null', () => {
    const param = { key: null };

    const result = () => utilsFunctions.validateParameter(param);

    expect(result).toThrowError('The key parameter cannot be undefined or null');
  });

  it('validateParameter: should not return throw error if param value is defined', () => {
    const param = { key: 'value' };

    const result = () => utilsFunctions.validateParameter(param);

    expect(result).not.toThrowError();
  });

  it('validateArray: should return throw error if param value not is Array instance', () => {
    const param = { key: 'value string' };

    const result = () => utilsFunctions.validateArray(param);

    expect(result).toThrowError('key is not an Array instance');
  });

  it('validateArray: should return throw error if param value is empty Array', () => {
    const param = { key: [] };

    const result = () => utilsFunctions.validateArray(param);

    expect(result).toThrowError('key cannot be empty array');
  });

  it('validateArray: should call validateParameter with param', () => {
    const param = { key: ['value'] };

    spyOn(utilsFunctions, 'validateParameter');
    spyOn(utilsFunctions, 'getObjectEntries').and.returnValue(['key', ['value']]);

    utilsFunctions.validateArray(param);

    expect(utilsFunctions.validateParameter).toHaveBeenCalledWith(param);
    expect(utilsFunctions.getObjectEntries).toHaveBeenCalledWith(param);
  });

  it('getObjectEntries: should return name key and object value', () => {
    const object = { key: 'value' };
    const objectEntries = ['key', 'value'];

    expect(utilsFunctions.getObjectEntries(object)).toEqual(objectEntries);
  });
});
