import { Network } from '@ionic-native/network/ngx';

import { fromEvent, Observable, of, Subject } from 'rxjs';
import * as rxjs from 'rxjs';
import * as TypeMoq from 'typemoq';

import { PoNetworkService } from './po-network.service';
import { PoNetworkStatus } from '../../models';
import { PoNetworkType } from './../../models/po-network-type.enum';

describe('PoNetworkService:', () => {
  let poNetworkService: PoNetworkService;
  const network = TypeMoq.Mock.ofType(Network);

  beforeEach(() => {
    poNetworkService = new PoNetworkService(network.object);
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

    it('getNavigatorStatus: should returns Observable', () => {
      poNetworkService['getNavigatorStatus']().subscribe(() => {
        const fromEventSpy = jasmine.createSpy('fromEvent').and.returnValue(of());

        spyOnProperty(rxjs, 'fromEvent', 'get').and.returnValue(fromEventSpy);
        spyOn(Observable, 'create').and.callThrough();

        expect(<any>fromEvent).toHaveBeenCalledWith(window, 'offline');
        expect(<any>fromEvent).toHaveBeenCalledWith(window, 'online');
        expect(Observable.create).toHaveBeenCalled();
      });
    });

    it('initNetwork: should init networkTypeNow and call initSubscriber', () => {
      const networkService = new PoNetworkService(network.object);

      spyOn(networkService, <any>'initSubscriber');

      networkService['initNetwork'](network.object);

      expect(networkService['networkTypeNow'] instanceof Subject).toBeTruthy();
      expect(networkService['initSubscriber']).toHaveBeenCalled();
    });

    it('initSubscriber: should call subscribe, set networkType and call next from networkTypeNow when network is not undefined', () => {
      const networkType = 'wifi';
      const fakeThis = {
        getNavigatorStatus: () => {},
        networkType: undefined,
        networkTypeNow: { next: objeto => {} }
      };

      spyOn(fakeThis, 'getNavigatorStatus').and.returnValue(<any>{ subscribe: callback => callback(true) });
      spyOn(fakeThis['networkTypeNow'], 'next');

      poNetworkService['initSubscriber'].apply(fakeThis, [{ type: networkType }]);

      expect(fakeThis['getNavigatorStatus']).toHaveBeenCalled();
      expect(fakeThis.networkType).toBe(networkType);
      expect(fakeThis.networkTypeNow.next).toHaveBeenCalledWith({ status: true, type: networkType });
    });

    it('initSubscriber: should not call subscribe and dont call next from networkTypeNow when network is undefined', () => {
      const fakeThis = {
        getNavigatorStatus: () => {},
        networkType: undefined,
        networkTypeNow: { next: objeto => {} }
      };

      spyOn(fakeThis, 'getNavigatorStatus');
      spyOn(fakeThis['networkTypeNow'], 'next');

      poNetworkService['initSubscriber'].apply(fakeThis, undefined);

      expect(fakeThis.getNavigatorStatus).not.toHaveBeenCalled();
      expect(fakeThis.networkType).toBeUndefined();
      expect(fakeThis.networkTypeNow.next).not.toHaveBeenCalled();
    });

    it('onChange: should returns an Observable', () => {
      spyOn(poNetworkService['networkTypeNow'], <any>'asObservable').and.returnValue(of());

      const observable = poNetworkService.onChange();

      expect(poNetworkService['networkTypeNow']['asObservable']).toHaveBeenCalled();
      expect(observable instanceof Observable).toBeTruthy();
    });
  });
});
