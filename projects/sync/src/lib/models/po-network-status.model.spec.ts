import { PoNetworkStatus } from './po-network-status.model';
import { PoNetworkType } from './po-network-type.enum';

describe('PoNetworkStatus', () => {
  let poNetworkStatus: PoNetworkStatus;

  beforeEach(() => {
    poNetworkStatus = new PoNetworkStatus(null);
  });

  it('should be created', () => {
    expect(poNetworkStatus instanceof PoNetworkStatus).toBeTruthy();
  });

  describe('Properties:', () => {
    it('status: should return true when type is different of PoNetworkType.none', () => {
      poNetworkStatus.type = PoNetworkType.ethernet;

      const result = poNetworkStatus.status;

      expect(result).toBeTruthy();
    });

    it('status: should return false when type is PoNetworkType.none', () => {
      poNetworkStatus.type = PoNetworkType.none;

      const result = poNetworkStatus.status;

      expect(result).toBeFalsy();
    });
  });

  describe('Methods: ', () => {
    it('setNetworkConnection: should set type with setDefaultTypeNavigation return', () => {
      spyOn(poNetworkStatus, <any>'setDefaultTypeNavigation').and.returnValue(PoNetworkType.ethernet);

      poNetworkStatus['setNetworkConnection'](undefined);

      expect(poNetworkStatus.type).toBe(PoNetworkType.ethernet);
    });

    it('setNetworkConnection: should set type with PoNetworkType._2g', () => {
      poNetworkStatus['setNetworkConnection']('2g');

      expect(poNetworkStatus.type).toBe(PoNetworkType._2g);
    });

    it('setNetworkConnection: should set type with PoNetworkType.wifi', () => {
      poNetworkStatus['setNetworkConnection']('wifi');

      expect(poNetworkStatus.type).toBe(PoNetworkType.wifi);
    });
  });
});
