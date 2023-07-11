import { Observable, of, Subject } from 'rxjs';
import * as TypeMoq from 'typemoq';

import { PoNetworkStatus } from '../../models';
import { PoNetworkType } from './../../models/po-network-type.enum';
import { PoNetworkService } from './po-network.service';

import { ConnectionStatus } from '@capacitor/network';

describe('PoNetworkService:', () => {
  let poNetworkService: PoNetworkService;
  const network = TypeMoq.Mock.ofType();
  beforeEach(() => {
    poNetworkService = new PoNetworkService();
  });

  it('should be created', () => {
    expect(poNetworkService instanceof PoNetworkService).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getConnectionStatus: should returns poNetworkStatus instance', () => {
      poNetworkService['networkType'] = 'ethernet';

      const poNetworkStatus: PoNetworkStatus = poNetworkService.getConnectionStatus();

      expect(poNetworkStatus instanceof PoNetworkStatus).toBeTruthy();
      expect(poNetworkStatus.status).toBeTruthy();
      expect(poNetworkStatus.type).toEqual(PoNetworkType.ethernet);
    });

    it('initNetwork: should init networkTypeNow and call initSubscriber', () => {
      const networkService = new PoNetworkService();

      spyOn(networkService, <any>'initSubscriber');

      networkService['initNetwork']();

      expect(networkService['networkTypeNow'] instanceof Subject).toBeTruthy();
      expect(networkService['initSubscriber']).toHaveBeenCalled();
    });

    it('initSubscriber: should call subscribe, set networkType and call next from networkTypeNow when network is false', async () => {
      const networkStatus: ConnectionStatus = { connected: false, connectionType: 'none' };
      spyOn(poNetworkService, <any>'getStatus').and.returnValue(networkStatus);

      const spyNetworkTypeNow = spyOn(poNetworkService['networkTypeNow'], <any>'next');

      await poNetworkService['initSubscriber']();

      expect(poNetworkService['networkType']).toBe('none');
      expect(spyNetworkTypeNow).toHaveBeenCalledWith({ status: false, type: 'none' });
    });

    it('initSubscriber: should call subscribe, set networkType and call next from networkTypeNow when network is true', async () => {
      const networkStatus: ConnectionStatus = { connected: true, connectionType: 'wifi' };
      spyOn(poNetworkService, <any>'getStatus').and.returnValue(networkStatus);

      const spyNetworkTypeNow = spyOn(poNetworkService['networkTypeNow'], <any>'next');

      await poNetworkService['initSubscriber']();

      expect(poNetworkService['networkType']).toBe('wifi');
      expect(spyNetworkTypeNow).toHaveBeenCalledWith({ status: true, type: 'wifi' });
    });

    it('onChange: should returns an Observable', () => {
      spyOn(poNetworkService['networkTypeNow'], <any>'asObservable').and.returnValue(of());

      const observable = poNetworkService.onChange();

      expect(poNetworkService['networkTypeNow']['asObservable']).toHaveBeenCalled();
      expect(observable instanceof Observable).toBeTruthy();
    });
  });
});
