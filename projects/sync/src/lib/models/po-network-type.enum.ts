/**
 * @usedBy PoSyncConfig, PoNetworkStatus
 *
 * @description
 *
 * Tipos de rede existentes no dispositivo.
 */

export enum PoNetworkType {
  /** Define o tipo de rede como desconhecido (`unknown`). */
  unknown,

  /** Define o tipo de rede como `Ethernet`. */
  ethernet,

  /** Define o tipo de rede como `WiFi`. */
  wifi,

  /** Define o tipo de rede como `2G`. */
  _2g,

  /** Define o tipo de rede como `3G`. */
  _3g,

  /** Define o tipo de rede como `4G`. */
  _4g,

  /**
   * Define o tipo de rede como `cellular`. Isso acontece na utilização dos navegadores
   * dentro do dispositvo móvel, com exceção do *web view*.
   */
  cellular,

  /** Define o tipo de rede como `none`. */
  none
}
