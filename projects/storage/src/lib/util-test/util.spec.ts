import { handleThrowError } from './util';

describe('Utils: ', () => {
  it('handleThrowError: should return a function with the word "resolve" ', async () => {
    const functionTest = Promise.resolve('resolve');
    const result = await handleThrowError(functionTest);

    expect(result()).toBe('resolve');
  });

  it('handleThrowError: should return a throw when functionTest is a Promise.reject', async () => {
    const functionTest = Promise.reject('Error');

    expect(await handleThrowError(functionTest)).toThrow('Error');
  });
});
