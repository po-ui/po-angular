import { callAction, hasAction } from './po-page-util';

describe('PO Page Util', () => {
  const fakeContext = {
    getName: () => 'PO',
    getAge: () => 2
  };

  it('should call action', () => {
    spyOn(fakeContext, 'getName');

    callAction('getName', fakeContext);

    expect(fakeContext.getName).toHaveBeenCalled();
  });

  it('shouldn`t call action', () => {
    spyOn(fakeContext, 'getName');

    callAction('get', fakeContext);

    expect(fakeContext.getName).not.toHaveBeenCalled();
  });

  it('shouldn`t call action', () => {
    spyOn(fakeContext, 'getName');

    const isAction = hasAction('getAge', fakeContext);

    expect(isAction).toBeTruthy();
  });
});
