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

  describe('toBase64:', () => {
    function handleThrowError(testFunction) {
      return testFunction
        .then(response => () => response)
        .catch(error => () => {
          throw error;
        });
    }

    it(`should resolve of promise if file is defined.`, async () => {
      const file = new File([''], 'filename', { type: 'text/html' });

      const result = await utilsFunctions.toBase64(file);

      expect(result).toBeDefined();
    });

    it(`should return a error if file is invalid.`, async () => {
      const file = <any>'invalid file';

      const result = await handleThrowError(utilsFunctions.toBase64(file));

      expect(result).toThrow();
    });
  });

  describe('toFile:', () => {
    let result;
    let promiseHelper;

    const url = 'http://teste.com.br';
    const fileName = 'meu_arquivo.png';
    const mimeType = 'image/png';

    beforeEach(() => {
      const fetchPromise = new Promise((resolve, reject) => {
        promiseHelper = {
          resolve: resolve,
          reject: reject
        };
      });
      spyOn(window, 'fetch').and.returnValue(<any>fetchPromise);
      result = utilsFunctions.toFile(url, fileName, mimeType);
    });

    it('should call fetch with url', () => {
      expect(window.fetch).toHaveBeenCalledWith(url);
    });

    it('should return a promise', () => {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('on successful fetch', () => {
      const file = new File([''], 'filename', { type: 'text/html' });

      beforeEach(() => {
        const response = new Response(file);
        promiseHelper.resolve(response);
      });

      it('should return a file', done => {
        result.then(response => {
          expect(response).toEqual(file);
          done();
        });
      });
    });

    describe('on unsuccessful fetch', () => {
      const errorObj = { msg: 'failed!' };

      beforeEach(() => {
        promiseHelper.reject(errorObj);
      });

      it('should return an error', done => {
        result.catch(error => {
          expect(error).toEqual(errorObj);
          done();
        });
      });
    });
  });
});
