import { Injectable } from '@angular/core';

import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { Network } from '@ionic-native/network/ngx';

import { PoNetworkStatus } from './../../models';

/**
 * @description
 *
 * O `PoNetworkService` é utilizado para verificar o status e o tipo da conexão de rede do dispositivo.
 */

@Injectable()
export class PoNetworkService {
  private networkType: string;
  private networkTypeNow: Subject<{ status: boolean; type: string }>;
  private poNetworkStatus: PoNetworkStatus;

  constructor(network: Network) {
    this.initNetwork(network);
  }

  /**
   * Retorna as propriedades tipo e status da conexão do dispositivo no momento da chamada.
   *
   * @returns {PoNetworkStatus} Instância de [PoNetworkStatus](/documentation/po-network-status) com as
   * propriedades da conexão.
   */
  getConnectionStatus(): PoNetworkStatus {
    this.poNetworkStatus = new PoNetworkStatus(this.networkType);
    return this.poNetworkStatus;
  }

  /**
   * Notifica as mudanças no tipo de conexão de rede do dispositivo.
   *
   * @returns {Observable<{ status: boolean, type: string }>} Observable com as propriedades da conexão.
   */
  onChange(): Observable<{ status: boolean; type: string }> {
    return this.networkTypeNow.asObservable();
  }

  private getNavigatorStatus(): Observable<any> {
    return merge(
      fromEvent(window, 'offline').pipe(mapTo(false)),
      fromEvent(window, 'online').pipe(mapTo(true)),
      Observable.create(sub => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  private initNetwork(network: Network) {
    this.networkTypeNow = new Subject();
    this.initSubscriber(network);
  }

  private initSubscriber(network: Network) {
    if (network) {
      this.getNavigatorStatus().subscribe(status => {
        this.networkType = network.type;
        this.networkTypeNow.next({ status: status, type: this.networkType });
      });
    }
  }
}
