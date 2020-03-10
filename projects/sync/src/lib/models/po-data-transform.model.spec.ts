import { PoDataTransform } from './po-data-transform.model';

class PoDataTransformExtends extends PoDataTransform {
  getDateFieldName(): string {
    return '';
  }
  getPageSizeParamName(): string {
    return '';
  }
  getPageParamName(): string {
    return '';
  }
  hasNext(): boolean {
    return true;
  }
  getItemsFieldName(): string {
    return '';
  }
}

describe('PoDataTransform', () => {
  const poDataTransform = new PoDataTransformExtends();

  it('should be created', () => {
    expect(poDataTransform instanceof PoDataTransform).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('getDateFieldName: should be a function', () => {
      expect(poDataTransform.getDateFieldName).toBeTruthy();
    });

    it('getItemsFieldName: should be a function', () => {
      expect(poDataTransform.getItemsFieldName).toBeTruthy();
    });

    it('getPageParamName: should be a function', () => {
      expect(poDataTransform.getPageParamName).toBeTruthy();
    });

    it('getPageSizeParamName: should be a function', () => {
      expect(poDataTransform.getPageSizeParamName).toBeTruthy();
    });

    it('hasNext: should be a function', () => {
      expect(poDataTransform.hasNext).toBeTruthy();
    });

    it('transform: should set data with transform param', () => {
      poDataTransform.transform(jasmine.anything());

      expect(poDataTransform['data']).toEqual(jasmine.anything());
    });
  });
});
