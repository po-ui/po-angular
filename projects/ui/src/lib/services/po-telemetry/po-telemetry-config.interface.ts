/**
 * @usedBy PoTelemetryModule, PoTelemetryService
 *
 * @description
 *
 * Interface de configuração do serviço de telemetria.
 */
export interface PoTelemetryConfig {
  /** Se a telemetria está habilitada (default: false — opt-in). */
  enabled: boolean;

  /** URL do endpoint que receberá os eventos. */
  endpointUrl: string;

  /**
   * Chave no `localStorage` para armazenar consentimento do usuário.
   *
   * @default `po-telemetry-consent`
   */
  consentStorageKey?: string;

  /**
   * Intervalo em milissegundos para envio em batch.
   *
   * @default `30000`
   */
  batchIntervalMs?: number;

  /**
   * Exibir diálogo de consentimento ao usuário na primeira vez.
   *
   * @default `true`
   */
  showConsentDialog?: boolean;

  /** Literais customizadas para o diálogo de consentimento. */
  consentDialogLiterals?: {
    title?: string;
    message?: string;
    confirm?: string;
    cancel?: string;
  };
}
