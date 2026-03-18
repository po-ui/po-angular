import { HttpClient } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PoDialogService } from '../po-dialog/po-dialog.service';

import { PO_TELEMETRY_CONFIG } from './po-telemetry.injection-token';
import { PoTelemetryConfig } from './po-telemetry-config.interface';
import { PoTelemetryService } from './po-telemetry.service';

describe('PoTelemetryService', () => {
  let service: PoTelemetryService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dialogServiceSpy: jasmine.SpyObj<PoDialogService>;

  function createService(config: PoTelemetryConfig | null, consentValue: string | null = null): PoTelemetryService {
    if (consentValue !== null) {
      spyOn(localStorage, 'getItem').and.returnValue(consentValue);
    } else {
      spyOn(localStorage, 'getItem').and.returnValue(null);
    }
    spyOn(localStorage, 'setItem');

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({}));

    dialogServiceSpy = jasmine.createSpyObj('PoDialogService', ['confirm']);

    const providers: Array<any> = [
      PoTelemetryService,
      { provide: HttpClient, useValue: httpClientSpy },
      { provide: PoDialogService, useValue: dialogServiceSpy }
    ];

    if (config) {
      providers.push({ provide: PO_TELEMETRY_CONFIG, useValue: config });
    }

    TestBed.configureTestingModule({ providers });

    return TestBed.inject(PoTelemetryService);
  }

  afterEach(() => {
    if (service) {
      service.ngOnDestroy();
    }
    TestBed.resetTestingModule();
  });

  describe('quando enabled é false:', () => {
    it('não deve coletar eventos', () => {
      service = createService({ enabled: false, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.trackComponentUsage('po-button');

      service.flushEvents();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });
  });

  describe('quando consentimento é denied:', () => {
    it('não deve coletar eventos', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'denied');

      service.trackComponentUsage('po-button');

      service.flushEvents();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });
  });

  describe('quando enabled é true e consentimento é granted:', () => {
    it('deve coletar e enviar eventos', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.trackComponentUsage('po-button');
      service.trackComponentUsage('po-table');

      service.flushEvents();

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
      const [url, payload] = httpClientSpy.post.calls.mostRecent().args;
      expect(url).toBe('https://api.example.com/events');
      expect((payload as Array<any>).length).toBe(2);
    });

    it('deve incluir o formato correto no payload', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.trackComponentUsage('po-input');

      service.flushEvents();

      const [, payload] = httpClientSpy.post.calls.mostRecent().args;
      const events = payload as Array<any>;
      expect(events.length).toBe(1);

      const event = events[0];
      expect(event.componentName).toBe('po-input');
      expect(event.libraryVersion).toBeDefined();
      expect(event.angularVersion).toBeDefined();
      expect(event.timestamp).toBeDefined();
      expect(event.sessionId).toBeDefined();
    });
  });

  describe('diálogo de consentimento:', () => {
    it('deve exibir diálogo quando não há preferência salva e showConsentDialog é true', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        showConsentDialog: true
      });

      expect(dialogServiceSpy.confirm).toHaveBeenCalledTimes(1);
    });

    it('não deve exibir diálogo quando showConsentDialog é false', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        showConsentDialog: false
      });

      expect(dialogServiceSpy.confirm).not.toHaveBeenCalled();
    });

    it('não deve exibir diálogo quando já há consentimento registrado', () => {
      service = createService(
        {
          enabled: true,
          endpointUrl: 'https://api.example.com/events',
          showConsentDialog: true
        },
        'granted'
      );

      expect(dialogServiceSpy.confirm).not.toHaveBeenCalled();
    });

    it('deve conceder consentimento ao confirmar o diálogo', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        showConsentDialog: true
      });

      const confirmCall = dialogServiceSpy.confirm.calls.mostRecent().args[0];
      confirmCall.confirm();

      expect(localStorage.setItem).toHaveBeenCalledWith('po-telemetry-consent', 'granted');
    });

    it('deve negar consentimento ao cancelar o diálogo', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        showConsentDialog: true
      });

      const confirmCall = dialogServiceSpy.confirm.calls.mostRecent().args[0];
      if (confirmCall.cancel) {
        confirmCall.cancel();
      }

      expect(localStorage.setItem).toHaveBeenCalledWith('po-telemetry-consent', 'denied');
    });

    it('deve usar literais customizadas no diálogo', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        showConsentDialog: true,
        consentDialogLiterals: {
          title: 'Custom Title',
          message: 'Custom Message',
          confirm: 'Accept',
          cancel: 'Decline'
        }
      });

      const confirmCall = dialogServiceSpy.confirm.calls.mostRecent().args[0];
      expect(confirmCall.title).toBe('Custom Title');
      expect(confirmCall.message).toBe('Custom Message');
      expect(confirmCall.literals?.confirm).toBe('Accept');
      expect(confirmCall.literals?.cancel).toBe('Decline');
    });
  });

  describe('envio em batch:', () => {
    it('deve enviar eventos acumulados no buffer ao chamar flushEvents', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.trackComponentUsage('po-button');
      service.trackComponentUsage('po-table');
      service.trackComponentUsage('po-combo');

      service.flushEvents();

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
      const [, payload] = httpClientSpy.post.calls.mostRecent().args;
      expect((payload as Array<any>).length).toBe(3);
    });

    it('não deve enviar quando o buffer está vazio', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.flushEvents();

      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });

    it('deve limpar o buffer após envio bem-sucedido', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.trackComponentUsage('po-button');
      service.flushEvents();

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);

      service.flushEvents();
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('retry em caso de falha HTTP:', () => {
    it('deve manter eventos no buffer quando o envio falhar', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      httpClientSpy.post.and.returnValue(throwError(() => new Error('Network error')));

      service.trackComponentUsage('po-button');
      service.flushEvents();

      httpClientSpy.post.and.returnValue(of({}));

      service.flushEvents();

      expect(httpClientSpy.post).toHaveBeenCalledTimes(2);
      const [, payload] = httpClientSpy.post.calls.mostRecent().args;
      expect((payload as Array<any>).length).toBe(1);
    });
  });

  describe('controle programático de consentimento:', () => {
    it('deve permitir conceder consentimento via grantConsent()', () => {
      service = createService(
        {
          enabled: true,
          endpointUrl: 'https://api.example.com/events',
          showConsentDialog: false
        },
        null
      );

      service.grantConsent();
      service.trackComponentUsage('po-button');
      service.flushEvents();

      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith('po-telemetry-consent', 'granted');
    });

    it('deve permitir revogar consentimento via revokeConsent()', () => {
      service = createService({ enabled: true, endpointUrl: 'https://api.example.com/events' }, 'granted');

      service.revokeConsent();
      service.trackComponentUsage('po-button');
      service.flushEvents();

      expect(httpClientSpy.post).not.toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('po-telemetry-consent', 'denied');
    });
  });

  describe('sem config fornecida:', () => {
    it('deve funcionar sem config (telemetria desabilitada por padrão)', () => {
      service = createService(null);

      service.trackComponentUsage('po-button');
      service.flushEvents();

      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });
  });

  describe('consentStorageKey customizada:', () => {
    it('deve usar a chave customizada no localStorage', () => {
      service = createService({
        enabled: true,
        endpointUrl: 'https://api.example.com/events',
        consentStorageKey: 'my-app-consent',
        showConsentDialog: false
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('my-app-consent');
    });
  });
});
