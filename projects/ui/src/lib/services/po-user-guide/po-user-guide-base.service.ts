import { Observable, Subject } from 'rxjs';

import {
  PoUserGuideEndEvent,
  PoUserGuideEvent,
  PoUserGuideOptions,
  PoUserGuideStep,
  PoUserGuideStepChangeEvent
} from './po-user-guide.interface';

/**
 * @description
 *
 * Serviço responsável por criar e controlar tours guiados na interface da aplicação.
 *
 * O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
 * o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
 * Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
 * primeiro acesso ou destacar pontos importantes da interface.
 *
 * O serviço centraliza a configuração do guia do usuário, incluindo:
 *
 * - os passos que serão exibidos;
 * - as opções gerais de comportamento;
 * - o controle do passo ativo;
 * - os eventos emitidos durante o ciclo de vida do tour.
 *
 * A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
 * dos eventos públicos `tourStart$`, `stepChange$` e `tourEnd$`.
 *
 * Como o serviço é disponibilizado com `providedIn: 'root'`, não é necessário declará-lo em
 * `providers` nem importá-lo manualmente em módulos específicos. A mesma instância é
 * compartilhada por toda a aplicação, facilitando o controle do tour entre diferentes
 * componentes.
 *
 * #### Uso típico
 *
 * O fluxo recomendado de utilização do serviço, que pode ser encadeado fluentemente, configura os
 * passos do tour, ajusta opções globais e dispara a execução em uma única expressão:
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { PoUserGuideService } from '@po-ui/ng-components';
 *
 * @Component({ selector: 'app-onboarding', templateUrl: './onboarding.component.html' })
 * export class OnboardingComponent {
 *   constructor(private PoUserGuide: PoUserGuideService) {}
 *
 *   startTour(): void {
 *     this.PoUserGuide
 *       .setSteps([
 *         { element: '#header', title: 'Bem-vindo!', content: 'Esta é a barra superior.' },
 *         { element: '.po-menu', title: 'Menu', content: 'Acesse aqui as funcionalidades do sistema.' },
 *         { element: '#user-profile', title: 'Perfil', content: 'Configure suas preferências.' }
 *       ])
 *       .setOptions({ showProgress: true, allowClose: true })
 *       .start();
 *   }
 * }
 * ```
 *
 * #### Aviso de segurança: HTML em `step.content`
 *
 * O PO UI sanitiza o conteúdo HTML informado em `step.content` antes de exibi-lo no
 * *popover* do tour, ajudando a prevenir vulnerabilidades de *Cross-Site Scripting* (XSS).
 *
 * A mesma proteção é aplicada aos *labels* definidos em `PoUserGuideStep` e
 * `PoUserGuideOptions` quando construídos dinamicamente.
 *
 * Ainda assim, recomenda-se validar conteúdos vindos de fontes não confiáveis, como entrada
 * do usuário, APIs externas ou *query strings*, preservando a segurança desde a origem dos dados.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar a aparência do *popover* renderizado pelo `PoUserGuideService` através dos tokens
 * (CSS) consumidos pelo arquivo `po-user-guide.css` distribuído via `@po-ui/style`.
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                | Descrição                                                          | Valor Padrão                                          |
 * |--------------------------------------------|--------------------------------------------------------------------|-------------------------------------------------------|
 * | **Overlay**                                |                                                                    |                                                       |
 * | `--color-secondary-dark-60-alpha-70`       | Cor do *overlay* que escurece a página durante o tour              | `rgba(59, 28, 74, 0.7)`                               |
 * | **Popover**                                |                                                                    |                                                       |
 * | `--color-neutral-light-00`                 | Cor de fundo do *popover*                                          | `#ffffff`                                             |
 * | `--color-neutral-light-20`                 | Cor da borda do *popover*                                          | `#c9d2d4`                                             |
 * | `--border-radius-md`                       | Raio dos cantos do *popover* e dos botões                          | `4px`                                                 |
 * | `--shadow-lg`                              | Sombra projetada pelo *popover*                                    | `0 8px 16px rgba(0, 0, 0, 0.16)`                      |
 * | `--font-family-theme`                      | Família tipográfica do título, descrição, progresso e botões       | `Roboto, 'Helvetica Neue', Arial, sans-serif`         |
 * | `--color-neutral-dark-70`                  | Cor do texto da descrição do passo                                 | `#2c3739`                                             |
 * | `--color-neutral-dark-95`                  | Cor do texto do título do passo                                    | `#1d2426`                                             |
 * | `--color-neutral-mid-60`                   | Cor do texto do indicador de progresso e do ícone do botão fechar  | `#4a5c60`                                             |
 * | **Botão primário (`Próximo` / `Finalizar`)** |                                                                  |                                                       |
 * | `--color-action-default`                   | Cor de fundo e da borda do botão primário                          | `#002a8d`                                             |
 * | `--color-action-hover`                     | Cor de fundo e da borda do botão primário no estado *hover*        | `#00368a`                                             |
 * | `--color-action-pressed`                   | Cor de fundo e da borda do botão primário no estado *pressed*      | `#001f6c`                                             |
 * | **Botão secundário (`Anterior`)**          |                                                                    |                                                       |
 * | `--color-action-default`                   | Cor do texto e da borda do botão secundário                        | `#002a8d`                                             |
 * | `--color-action-hover`                     | Cor de fundo, do texto e da borda do botão secundário no *hover*   | `#00368a`                                             |
 * | `--color-action-pressed`                   | Cor de fundo, do texto e da borda do botão secundário no *pressed* | `#001f6c`                                             |
 * | **Botão terciário (`Fechar` / `X`)**       |                                                                    |                                                       |
 * | `--color-neutral-light-10`                 | Cor de fundo do botão fechar no estado *hover*                     | `#dee9eb`                                             |
 * | `--color-neutral-light-20`                 | Cor de fundo do botão fechar no estado *pressed*                   | `#c9d2d4`                                             |
 * | **Foco visível**                           |                                                                    |                                                       |
 * | `--outline-color-focused`                  | Cor do *outline* aplicado a botões em foco                         | `var(--color-action-focus)` (`#c9357d`)               |
 *
 */
export abstract class PoUserGuideBaseService {
  protected static readonly DEFAULT_OPTIONS: PoUserGuideOptions = {
    allowClose: true,
    showProgress: true,
    keyboardControl: true,
    overlayOpacity: 0.7,
    nextLabel: 'Próximo',
    previousLabel: 'Anterior',
    doneLabel: 'Finalizar',
    closeLabel: 'Fechar',
    progressTemplate: '{{current}} de {{total}}'
  };

  /**
   * @docsPrivate
   *
   * Lista de passos do tour configurada pela aplicação consumidora através do método `setSteps`.
   * É reinicializada como um array vazio enquanto nenhum passo é configurado.
   */
  protected steps: Array<PoUserGuideStep> = [];

  /**
   * @docsPrivate
   *
   * Opções globais do tour configuradas pela aplicação consumidora através do método `setOptions`.
   */
  protected options: PoUserGuideOptions = {};

  /**
   * @docsPrivate
   *
   * Índice, com base zero, do passo ativo durante a execução do tour.
   *
   * Permanece em `-1` enquanto não houver tour em andamento, sinalizando ausência de execução para os
   * métodos de consulta de estado expostos pela classe PoUserGuideService.
   */
  protected currentIndex: number = -1;

  /**
   * @docsPrivate
   *
   * `Subject` interno utilizado pela classe PoUserGuideService para emitir o evento de início do tour.
   *
   * É exposto publicamente apenas como `Observable` somente leitura através da propriedade `tourStart$`.
   */
  protected readonly _tourStart = new Subject<PoUserGuideEvent>();

  /**
   * @docsPrivate
   *
   * `Subject` interno utilizado pela classe PoUserGuideService para emitir o evento de encerramento do tour.
   *
   * É exposto publicamente apenas como `Observable` somente leitura através da propriedade `tourEnd$`.
   */
  protected readonly _tourEnd = new Subject<PoUserGuideEndEvent>();

  /**
   * @docsPrivate
   *
   * `Subject` interno utilizado pela classe PoUserGuideService para emitir os eventos de mudança de passo
   * durante a execução do tour.
   *
   * É exposto publicamente apenas como `Observable` somente leitura através da propriedade `stepChange$`.
   */
  protected readonly _stepChange = new Subject<PoUserGuideStepChangeEvent>();

  /**
   * `Observable` que emite um `PoUserGuideEvent` no início de cada execução do tour.
   *
   * É emitido exatamente uma vez por execução, imediatamente após a configuração da instância do tour
   * e antes da primeira emissão de `stepChange$`. As aplicações consumidoras podem assinar este
   * `Observable` para registrar telemetria do início do tour, exibir mensagens contextuais ou disparar
   * lógica de negócio dependente do início da jornada do usuário.
   */
  readonly tourStart$: Observable<PoUserGuideEvent> = this._tourStart.asObservable();

  /**
   * `Observable` que emite um `PoUserGuideEndEvent` no encerramento de cada execução do tour.
   *
   * É emitido exatamente uma vez por execução, sempre após a última emissão de `stepChange$` e após a
   * limpeza do estado interno do serviço. As aplicações consumidoras podem assinar este `Observable`
   * para registrar telemetria de conclusão ou de abandono do tour, executar limpezas de UI ou disparar
   * lógica de negócio dependente do encerramento da jornada do usuário.
   */
  readonly tourEnd$: Observable<PoUserGuideEndEvent> = this._tourEnd.asObservable();

  /**
   * `Observable` que emite um `PoUserGuideStepChangeEvent` a cada mudança de passo durante a execução do tour.
   *
   * As aplicações consumidoras podem assinar este `Observable` para reagir à navegação do usuário,
   * atualizar a UI conforme o passo ativo, registrar telemetria de progresso ou disparar lógica de
   * negócio contextual ao passo corrente.
   */
  readonly stepChange$: Observable<PoUserGuideStepChangeEvent> = this._stepChange.asObservable();

  protected validateSteps(steps: Array<PoUserGuideStep>): void {
    if (steps === null || steps === undefined) {
      throw new Error('PoUserGuideService: a lista de passos é obrigatória.');
    }

    if (!Array.isArray(steps)) {
      throw new Error('PoUserGuideService: a lista de passos deve ser um array.');
    }

    if (steps.length === 0) {
      throw new Error('PoUserGuideService: a lista de passos não pode ser vazia.');
    }

    const isBrowser = typeof document !== 'undefined';

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step === null || step === undefined || typeof step !== 'object') {
        throw new Error(`PoUserGuideService: passo no índice ${i} é inválido.`);
      }

      if (step.content === null || step.content === undefined || step.content.trim() === '') {
        throw new Error(`PoUserGuideService: o passo no índice ${i} precisa ter a propriedade 'content' definida.`);
      }

      if (typeof step.element === 'string' && isBrowser) {
        try {
          document.querySelector(step.element);
        } catch {
          throw new Error(`PoUserGuideService: seletor CSS inválido no passo no índice ${i}: "${step.element}".`);
        }
      }
    }
  }

  protected resolveOptions(options?: PoUserGuideOptions): PoUserGuideOptions {
    const userProgressTemplate = options?.progressTemplate;

    const resolved: PoUserGuideOptions = {
      ...PoUserGuideBaseService.DEFAULT_OPTIONS,
      ...(options ?? {})
    };

    const overlayOpacity = resolved.overlayOpacity;

    if (typeof overlayOpacity !== 'number' || !Number.isFinite(overlayOpacity)) {
      resolved.overlayOpacity = PoUserGuideBaseService.DEFAULT_OPTIONS.overlayOpacity;
    } else {
      resolved.overlayOpacity = Math.min(1, Math.max(0, overlayOpacity));
    }

    if (
      typeof userProgressTemplate === 'string' &&
      !userProgressTemplate.includes('{{current}}') &&
      !userProgressTemplate.includes('{{total}}')
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `PoUserGuideService: o progressTemplate "${userProgressTemplate}" não contém os placeholders {{current}} ou {{total}}; o texto será exibido literalmente.`
      );
    }

    return resolved;
  }

  /**
   * @description
   *
   * Inicia a execução do tour previamente configurado por meio dos métodos `setSteps` e, opcionalmente,
   * `setOptions`.
   *
   * Quando invocado sem argumentos, o tour é iniciado a partir do primeiro passo (`startIndex = 0`).
   * Caso um valor seja informado, a execução começa diretamente no passo correspondente. O método
   * exibe a camada de *overlay* sobre a aplicação, renderiza o *popover* destacando o elemento do passo
   * inicial e emite uma única notificação em `tourStart$` antes da primeira emissão em `stepChange$`.
   *
   * Quando invocado com um tour já em execução, a implementação concreta encerra o tour atual
   * (equivalente a `close()` com `reason: 'closed'`) antes de iniciar o novo tour, preservando a
   * propriedade de reentrância documentada no design do serviço.
   *
   * @param {number} [startIndex=0] Índice, com base zero, do passo a partir do qual o tour deve iniciar.
   * Deve estar contido no intervalo `[0, steps.length - 1]`.
   *
   * @throws {Error} Quando a lista de passos ainda não foi configurada ou está vazia.
   * @throws {Error} Quando `startIndex` está fora do intervalo `[0, steps.length - 1]`.
   */
  abstract start(startIndex?: number): void;

  /**
   * @description
   *
   * Encerra o tour em execução, removendo a camada de *overlay* e o *popover* do DOM e zerando o estado
   * interno do serviço.
   *
   * O método emite uma única notificação em `tourEnd$` com `reason: 'closed'` e atualiza
   * `getCurrentIndex()` para `-1`, fazendo `isActive()` retornar `false` em chamadas subsequentes.
   *
   */
  abstract close(): void;

  /**
   * @description
   *
   * Avança o tour em execução para o próximo passo, atualizando o estado interno e emitindo uma
   * notificação em `stepChange$` com `direction: 'next'` para o passo recém-ativado.
   *
   * Quando o passo ativo é o último da lista (`currentIndex === steps.length - 1`), o método encerra o
   * tour com `reason: 'completed'` e emite `tourEnd$`, sinalizando que o usuário concluiu integralmente
   * a jornada configurada.
   *
   */
  abstract next(): void;

  /**
   * @description
   *
   * Retrocede o tour em execução para o passo anterior, atualizando o estado interno e emitindo uma
   * notificação em `stepChange$` com `direction: 'previous'` para o passo recém-ativado.
   *
   */
  abstract previous(): void;

  /**
   * @description
   *
   * Navega o tour diretamente para o passo localizado em `index`, sem percorrer os passos intermediários.
   *
   * Quando há tour em execução, o método atualiza o estado interno e emite uma notificação em
   * `stepChange$` com `direction: 'goto'` para o passo recém-ativado. Quando não há tour em execução, o
   * método inicia o tour a partir do índice informado, seguindo o mesmo fluxo de `start(index)`.
   *
   * @param {number} index Índice, com base zero, do passo de destino. Deve estar contido no intervalo
   * `[0, steps.length - 1]`.
   *
   * @throws {Error} Quando `index` está fora do intervalo `[0, steps.length - 1]`.
   */
  abstract goTo(index: number): void;
}
