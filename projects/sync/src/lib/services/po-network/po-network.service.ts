import { Injectable } from '@angular/core';

import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { Network } from '@capacitor/network';

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

  constructor() {
    this.initNetwork();
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

  private initNetwork() {
    this.networkTypeNow = new Subject();
    this.initSubscriber();
  }

  private async getStatus() {
    return await Network.getStatus();
  }

  private async initSubscriber() {
    const networkStatus = await this.getStatus();
    this.networkType = networkStatus.connected ? networkStatus.connectionType : 'none';
    this.networkTypeNow.next({ status: networkStatus.connected, type: this.networkType });

    /* istanbul ignore next */
    Network.addListener('networkStatusChange', status => {
      this.networkType = status.connected ? status.connectionType : 'none';
      this.networkTypeNow.next({ status: status.connected, type: this.networkType });
    });
  }
}
