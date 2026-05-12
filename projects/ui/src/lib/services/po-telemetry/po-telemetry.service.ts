import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { VERSION } from '@angular/core';

import { PoDialogService } from '../po-dialog/po-dialog.service';

import { PO_UI_VERSION } from '../../utils/po-version';
import { PO_TELEMETRY_CONFIG } from './po-telemetry.injection-token';
import { PoTelemetryConfig } from './po-telemetry-config.interface';

interface PoTelemetryEvent {
  componentName: string;
  libraryVersion: string;
  angularVersion: string;
  timestamp: string;
  sessionId: string;
}

const DEFAULT_CONSENT_STORAGE_KEY = 'po-telemetry-consent';
const DEFAULT_BATCH_INTERVAL_MS = 30000;

/**
 * @description
 *
 * Serviço responsável por coletar e enviar dados de telemetria sobre o uso dos componentes PO UI.
 *
 * A telemetria é **opt-in**, ou seja, está desabilitada por padrão e só é ativada quando
 * explicitamente configurada pelo consumidor da biblioteca via `PoTelemetryModule.forRoot()`.
 *
 * Além da configuração programática, o serviço também respeita o consentimento do usuário final,
 * armazenado no `localStorage`. Caso `showConsentDialog` esteja habilitado e não exista
 * consentimento registrado, um diálogo será exibido ao usuário.
 *
 * Os eventos coletados são enviados em batch para o endpoint configurado.
 */
@Injectable()
export class PoTelemetryService implements OnDestroy {
  private buffer: Array<PoTelemetryEvent> = [];
  private consentStorageKey: string;
  private batchIntervalMs: number;
  private endpointUrl: string;
  private enabled: boolean;
  private showConsentDialog: boolean;
  private sessionId: string;
  private intervalId: any;
  private userConsent: boolean | null = null;
  private consentDialogLiterals: PoTelemetryConfig['consentDialogLiterals'];

  constructor(
    @Optional() @Inject(PO_TELEMETRY_CONFIG) private config: PoTelemetryConfig,
    @Optional() private httpClient: HttpClient,
    @Optional() private poDialogService: PoDialogService,
    private ngZone: NgZone
  ) {
    this.enabled = this.config?.enabled ?? false;
    this.endpointUrl = this.config?.endpointUrl ?? '';
    this.consentStorageKey = this.config?.consentStorageKey ?? DEFAULT_CONSENT_STORAGE_KEY;
    this.batchIntervalMs = this.config?.batchIntervalMs ?? DEFAULT_BATCH_INTERVAL_MS;
    this.showConsentDialog = this.config?.showConsentDialog ?? true;
    this.consentDialogLiterals = this.config?.consentDialogLiterals;
    this.sessionId = this.generateSessionId();

    this.initConsent();
    this.startBatchInterval();
  }

  /**
   * Registra o uso de um componente para telemetria.
   *
   * @param componentName Nome do componente utilizado.
   */
  trackComponentUsage(componentName: string): void {
    if (!this.enabled || this.userConsent !== true) {
      return;
    }

    const event: PoTelemetryEvent = {
      componentName,
      libraryVersion: PO_UI_VERSION,
      angularVersion: VERSION.full,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.buffer.push(event);
  }

  /**
   * Concede consentimento programaticamente.
   */
  grantConsent(): void {
    this.userConsent = true;
    this.setConsentInStorage('granted');
  }

  /**
   * Revoga consentimento programaticamente.
   */
  revokeConsent(): void {
    this.userConsent = false;
    this.setConsentInStorage('denied');
  }

  ngOnDestroy(): void {
    this.clearBatchInterval();
    this.flushEvents();
  }

  /** @docsPrivate */
  flushEvents(): void {
    if (!this.enabled || this.userConsent !== true || this.buffer.length === 0) {
      return;
    }

    this.sendEvents();
  }

  private initConsent(): void {
    if (!this.enabled) {
      return;
    }

    const storedConsent = this.getConsentFromStorage();

    if (storedConsent === 'granted') {
      this.userConsent = true;
    } else if (storedConsent === 'denied') {
      this.userConsent = false;
    } else if (this.showConsentDialog && this.poDialogService) {
      this.showConsentPrompt();
    }
  }

  private showConsentPrompt(): void {
    const title = this.consentDialogLiterals?.title ?? 'Telemetria';
    const message =
      this.consentDialogLiterals?.message ??
      'Este aplicativo coleta dados anônimos de uso dos componentes para melhorar a experiência. Deseja permitir?';
    const confirmLabel = this.consentDialogLiterals?.confirm ?? 'Permitir';
    const cancelLabel = this.consentDialogLiterals?.cancel ?? 'Negar';

    this.poDialogService.confirm({
      title,
      message,
      confirm: () => this.grantConsent(),
      cancel: () => this.revokeConsent(),
      literals: {
        confirm: confirmLabel,
        cancel: cancelLabel
      }
    });
  }

  private startBatchInterval(): void {
    if (!this.enabled) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.flushEvents(), this.batchIntervalMs);
    });
  }

  private clearBatchInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private sendEvents(): void {
    if (!this.httpClient || !this.endpointUrl) {
      return;
    }

    const eventsToSend = [...this.buffer];
    this.buffer = [];

    this.httpClient.post(this.endpointUrl, eventsToSend).subscribe({
      error: () => {
        this.buffer = [...eventsToSend, ...this.buffer];
      }
    });
  }

  private getConsentFromStorage(): string | null {
    try {
      return localStorage.getItem(this.consentStorageKey);
    } catch {
      return null;
    }
  }

  private setConsentInStorage(value: string): void {
    try {
      localStorage.setItem(this.consentStorageKey, value);
    } catch {
      // Ignora erros de acesso ao localStorage (ex: modo privado em alguns navegadores)
    }
  }

  private generateSessionId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return this.generateFallbackId();
    }
  }

  private generateFallbackId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
