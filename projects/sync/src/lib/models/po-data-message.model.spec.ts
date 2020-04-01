import { PoDataMessage } from './po-data-message.model';

describe('PoDataMessage: ', () => {
  const poDataMessage = new PoDataMessage();

  it('should be created', () => {
    expect(poDataMessage instanceof PoDataMessage).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('getDateFieldName: should return the word `po_sync_date`', () => {
      expect(poDataMessage.getDateFieldName()).toEqual('po_sync_date');
    });

    it('getItemsFieldName: should return the word `items`', () => {
      expect(poDataMessage.getItemsFieldName()).toEqual('items');
    });

    it('getPageParamName: should return the word `page`', () => {
      expect(poDataMessage.getPageParamName()).toEqual('page');
    });

    it('getPageSizeParamName: should return the word `pageSize`', () => {
      expect(poDataMessage.getPageSizeParamName()).toEqual('pageSize');
    });

    it('hasNext: should return the value of data.hasNext', () => {
      const anyValue = jasmine.anything();
      const fakeThis = {
        data: { hasNext: anyValue }
      };

      const resultHasNext = poDataMessage.hasNext.apply(fakeThis);

      expect(resultHasNext).toBe(anyValue);
    });
  });
});
