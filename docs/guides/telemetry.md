[comment]: # (@label Telemetria)
[comment]: # (@link guides/telemetry)

## Telemetria do PO UI

O PO UI oferece um serviço de telemetria **opt-in** que permite coletar dados anônimos sobre o uso dos componentes da biblioteca. Esses dados ajudam a equipe de desenvolvimento a entender quais componentes são mais utilizados, priorizar melhorias e corrigir problemas.

### O que é coletado

Os eventos de telemetria contêm apenas as seguintes informações:

| Campo | Descrição |
|---|---|
| `componentName` | Nome do componente utilizado (ex: `po-button`, `po-table`) |
| `libraryVersion` | Versão da biblioteca `@po-ui/ng-components` |
| `angularVersion` | Versão do Angular utilizada na aplicação |
| `timestamp` | Data e hora do evento em formato ISO 8601 |
| `sessionId` | Identificador aleatório da sessão do navegador |

> **Nenhum dado pessoal, de negócio ou sensível é coletado.** Não são rastreados dados de formulário, interações do usuário ou informações de identificação pessoal.

### Como habilitar

A telemetria está **desabilitada por padrão**. Para habilitá-la, utilize o `PoTelemetryModule.forRoot()` na configuração do seu módulo ou aplicação:

**Abordagem com NgModule:**

```typescript
import { PoTelemetryModule } from '@po-ui/ng-components';

@NgModule({
  imports: [
    PoModule,
    PoTelemetryModule.forRoot({
      enabled: true,
      endpointUrl: 'https://my-telemetry-api.example.com/events',
      showConsentDialog: true
    })
  ]
})
export class AppModule {}
```

**Abordagem Standalone:**

```typescript
import { importProvidersFrom } from '@angular/core';
import { PoTelemetryModule } from '@po-ui/ng-components';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(PoTelemetryModule.forRoot({
      enabled: true,
      endpointUrl: 'https://my-telemetry-api.example.com/events',
      showConsentDialog: true
    }))
  ]
});
```

### Configurações disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `enabled` | `boolean` | `false` | Habilita ou desabilita a coleta de telemetria |
| `endpointUrl` | `string` | — | URL do endpoint que receberá os eventos |
| `consentStorageKey` | `string` | `po-telemetry-consent` | Chave no `localStorage` para armazenar o consentimento |
| `batchIntervalMs` | `number` | `30000` | Intervalo em milissegundos para envio em batch |
| `showConsentDialog` | `boolean` | `true` | Exibe diálogo de consentimento na primeira vez |
| `consentDialogLiterals` | `object` | — | Literais customizadas para o diálogo de consentimento |

### Como o consentimento funciona

O serviço de telemetria implementa um mecanismo de consentimento em duas camadas:

1. **Configuração do desenvolvedor**: A telemetria só é ativada quando `enabled: true` é definido na configuração.
2. **Consentimento do usuário final**: Mesmo com a telemetria habilitada, os dados só são coletados após o consentimento explícito do usuário.

O fluxo de consentimento funciona da seguinte forma:

- Ao inicializar, o serviço verifica o `localStorage` pela chave configurada (`po-telemetry-consent` por padrão).
- Se não houver valor armazenado e `showConsentDialog` estiver habilitado, um diálogo de confirmação é exibido ao usuário utilizando o `PoDialogService`.
- Se o usuário **aceitar**, o valor `granted` é salvo no `localStorage` e a coleta de dados é iniciada.
- Se o usuário **recusar**, o valor `denied` é salvo e nenhum dado é coletado.

### Controle programático

O `PoTelemetryService` expõe métodos para controle programático do consentimento:

```typescript
import { PoTelemetryService } from '@po-ui/ng-components';

@Component({ ... })
export class SettingsComponent {
  constructor(private telemetryService: PoTelemetryService) {}

  enableTelemetry() {
    this.telemetryService.grantConsent();
  }

  disableTelemetry() {
    this.telemetryService.revokeConsent();
  }
}
```

### Como desabilitar

Para desabilitar completamente a telemetria, basta:

- **Não importar** o `PoTelemetryModule.forRoot()` na aplicação, ou
- Definir `enabled: false` na configuração

Para revogar o consentimento de um usuário que já havia consentido:

```typescript
this.telemetryService.revokeConsent();
```

### Customização do diálogo de consentimento

As literais do diálogo de consentimento podem ser customizadas:

```typescript
PoTelemetryModule.forRoot({
  enabled: true,
  endpointUrl: 'https://my-telemetry-api.example.com/events',
  consentDialogLiterals: {
    title: 'Coleta de dados de uso',
    message: 'Gostaríamos de coletar dados anônimos sobre o uso dos componentes para melhorar a experiência. Nenhum dado pessoal é coletado. Deseja permitir?',
    confirm: 'Sim, permitir',
    cancel: 'Não, obrigado'
  }
})
```

### Política de privacidade recomendada

Se a sua aplicação utiliza a telemetria do PO UI, é recomendado incluir na sua política de privacidade uma seção informando:

- Que dados anônimos de uso de componentes de interface são coletados
- Que nenhum dado pessoal ou de negócio é transmitido
- Que o usuário pode revogar o consentimento a qualquer momento
- O endpoint para o qual os dados são enviados

### Formato do payload

Os eventos são enviados em batch via `POST` para o endpoint configurado. O corpo da requisição é um array de objetos:

```json
[
  {
    "componentName": "po-table",
    "libraryVersion": "21.4.0",
    "angularVersion": "21.0.3",
    "timestamp": "2026-03-05T12:00:00.000Z",
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
]
```

Em caso de falha no envio, os eventos são mantidos em buffer e reenviados na próxima tentativa.
