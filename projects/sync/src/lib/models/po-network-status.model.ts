import { PoNetworkType } from './po-network-type.enum';

/**
 * @description
 *
 * Classe responsável por identificar a conexão de rede disponível no dispositivo.
 */
export class PoNetworkStatus {
  private _type: PoNetworkType;

  constructor(networtkType) {
    this.setNetworkConnection(networtkType);
  }

  /**
   * Retorna se o dispositivo está conectado na rede.
   *
   * @returns {boolean} Status da conexão com a rede.
   */
  get status(): boolean {
    return this.type !== PoNetworkType.none;
  }

  /**
   * Retorna o tipo de conexão do dispositivo.
   *
   * @returns {PoNetworkType} Tipo da conexão com a rede.
   */
  get type(): PoNetworkType {
    return this._type;
  }

  set type(type: PoNetworkType) {
    this._type = type;
  }

  /* istanbul ignore next */
  private setDefaultTypeNavigation() {
    return navigator.onLine ? PoNetworkType['ethernet'] : PoNetworkType.none;
  }

  private setNetworkConnection(networtkType): void {
    if (!networtkType) {
      this.type = this.setDefaultTypeNavigation();
    } else {
      const isGenerationMobile = ['2g', '3g', '4g'].includes(networtkType);

      this.type = isGenerationMobile ? PoNetworkType['_' + networtkType] : PoNetworkType[String(networtkType)];
    }
  }
}
