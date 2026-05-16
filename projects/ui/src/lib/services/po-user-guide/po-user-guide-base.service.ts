import { Observable, Subject } from 'rxjs';

import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoUserGuideLiterals } from './interfaces/po-user-guide-literals.interface';

import { poUserGuideLiteralsDefault } from './po-user-guide.literals';
import {
  PoUserGuideEndEvent,
  PoUserGuideOptions,
  PoUserGuideStartEvent,
  PoUserGuideStep,
  PoUserGuideStepChangeEvent
} from './interfaces';

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
 * `providers` nem importá-lo manualmente em módulos específicos.
 * Ele pode ser injetado diretamente em qualquer componente, serviço ou diretiva da aplicação.
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
 *         { element: '<po-menu>', title: 'Menu', content: 'Acesse aqui as funcionalidades do sistema.' },
 *         { element: '#user-profile', title: 'Perfil', content: 'Configure suas preferências.' }
 *       ])
 *       .setOptions({ showProgress: true, allowClose: true })
 *       .start();
 *   }
 * }
 * ```
 *
 * #### Boas práticas para seleção de elementos
 *
 * Ao configurar o elemento que será destacado em cada passo do tour, recomenda-se evitar
 * seletores baseados em classes internas, estruturas de HTML ou elementos muito genéricos,
 * como `.minha-classe`, `div`, `span` ou combinações dependentes da hierarquia da página.
 *
 * Esses seletores podem ser sensíveis a mudanças de implementação, refatorações visuais ou
 * alterações nos nomes de classes, o que pode fazer com que o passo deixe de encontrar o
 * elemento esperado.
 *
 * Quando o passo destacar um componente do PO-UI, prefira utilizar o próprio seletor do
 * componente, como: `po-button`, `po-input`, `po-combo` ou `po-table`, sempre que isso for
 * suficiente para identificar o elemento corretamente.
 *
 * Quando houver mais de um componente igual na tela ou quando for necessário apontar para
 * um elemento específico, recomenda-se adicionar um `id` no elemento alvo ou encapsular a
 * área desejada em um elemento próprio da aplicação.
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
 * | Propriedade                                      | Descrição                                                                | Valor Padrão                                           |
 * |--------------------------------------------------|--------------------------------------------------------------------------|--------------------------------------------------------|
 * | **Overlay**                                      |                                                                          |                                                        |
 * | `--color-po-user-guide-overlay`                  | Cor do *overlay* que escurece a página durante o tour                    | `var(--color-neutral-dark-80)`                         |
 * | **Popover**                                      |                                                                          |                                                        |
 * | `--font-family`                                  | Família tipográfica usada no *popover*                                   | `var(--font-family-theme)`                             |
 * | `--color`                                        | Cor padrão do texto do *popover*                                         | `var(--color-neutral-dark-70)`                         |
 * | `--background-color`                             | Cor de fundo do *popover*                                                | `var(--color-neutral-light-00)`                        |
 * | `--border-color`                                 | Cor da borda do *popover*                                                | `var(--color-neutral-light-20)`                        |
 * | `--border-width`                                 | Espessura da borda do *popover*                                          | `var(--border-width-sm)`                               |
 * | `--border-radius`                                | Raio dos cantos do *popover*                                             | `var(--border-radius-md)`                              |
 * | `--shadow`                                       | Sombra projetada pelo *popover*                                          | `var(--shadow-lg)`                                     |
 * | `--padding`                                      | Espaçamento interno do *popover*                                         | `var(--spacing-sm)`                                    |
 * | `--max-width`                                    | Largura máxima do *popover*                                              | `360px`                                                |
 * | `--arrow-color`                                  | Cor da seta que aponta para o elemento destacado                         | `var(--color-neutral-light-00)`                        |
 * | **Título**                                       |                                                                          |                                                        |
 * | `--title-font-size`                              | Tamanho da fonte do título                                               | `var(--font-size-default)`                             |
 * | `--title-font-weight`                            | Peso da fonte do título                                                  | `var(--font-weight-bold)`                              |
 * | `--title-line-height`                            | Altura de linha do título                                                | `var(--line-height-sm)`                                |
 * | `--title-color`                                  | Cor do texto do título                                                   | `var(--color-neutral-dark-95)`                         |
 * | `--title-margin-bottom`                          | Espaçamento inferior do título                                           | `var(--spacing-xs)`                                    |
 * | **Descrição**                                    |                                                                          |                                                        |
 * | `--description-font-size`                        | Tamanho da fonte da descrição                                            | `var(--font-size-sm)`                                  |
 * | `--description-font-weight`                      | Peso da fonte da descrição                                               | `var(--font-weight-normal)`                            |
 * | `--description-line-height`                      | Altura de linha da descrição                                             | `var(--line-height-md)`                                |
 * | `--description-color`                            | Cor do texto da descrição                                                | `var(--color-neutral-dark-70)`                         |
 * | `--description-margin-bottom`                    | Espaçamento inferior da descrição                                        | `var(--spacing-xs)`                                    |
 * | **Progresso**                                    |                                                                          |                                                        |
 * | `--progress-font-size`                           | Tamanho da fonte do indicador de progresso                               | `var(--font-size-xs)`                                  |
 * | `--progress-font-weight`                         | Peso da fonte do indicador de progresso                                  | `var(--font-weight-normal)`                            |
 * | `--progress-line-height`                         | Altura de linha do indicador de progresso                                | `var(--line-height-sm)`                                |
 * | `--progress-color`                               | Cor do texto do indicador de progresso                                   | `var(--color-neutral-mid-60)`                          |
 * | **Rodapé**                                       |                                                                          |                                                        |
 * | `--footer-margin-top`                            | Espaçamento superior do rodapé                                           | `var(--spacing-xs)`                                    |
 * | `--footer-gap`                                   | Espaçamento entre os botões de navegação                                 | `var(--spacing-xxs)`                                   |
 * | `--footer-gap-tertiary`                          | Espaçamento adicional aplicado ao botão terciário                        | `var(--spacing-sm)`                                    |
 * | **Botões - base**                                |                                                                          |                                                        |
 * | `--button-font-weight`                           | Peso da fonte dos botões                                                 | `var(--font-weight-bold)`                              |
 * | `--button-font-size`                             | Tamanho da fonte dos botões                                              | `var(--font-size-sm)`                                  |
 * | `--button-line-height`                           | Altura de linha dos botões                                               | `var(--line-height-none)`                              |
 * | `--button-border-width`                          | Espessura da borda dos botões                                            | `var(--border-width-md)`                               |
 * | `--button-border-radius`                         | Raio dos cantos dos botões                                               | `var(--border-radius-md)`                              |
 * | `--button-padding`                               | Espaçamento interno dos botões                                           | `var(--spacing-xs) var(--spacing-sm)`                  |
 * | **Botão primário (`Próximo` / `Finalizar`)**      |                                                                          |                                                        |
 * | `--button-primary-text-color`                    | Cor do texto do botão primário                                           | `var(--color-neutral-light-00)`                        |
 * | `--button-primary-color`                         | Cor de fundo do botão primário                                           | `var(--color-action-default)`                          |
 * | `--button-primary-color-hover`                   | Cor de fundo do botão primário no estado *hover*                         | `var(--color-action-hover)`                            |
 * | `--button-primary-color-pressed`                 | Cor de fundo do botão primário no estado *pressed*                       | `var(--color-action-pressed)`                          |
 * | `--button-primary-border-color`                  | Cor da borda do botão primário                                           | `var(--color-action-default)`                          |
 * | `--button-primary-shadow`                        | Sombra do botão primário                                                 | `var(--shadow-none)`                                   |
 * | `--button-primary-text-color-disabled`           | Cor do texto do botão primário desabilitado                              | `var(--color-neutral-dark-70)`                         |
 * | `--button-primary-color-disabled`                | Cor de fundo do botão primário desabilitado                              | `var(--color-neutral-light-30)`                        |
 * | `--button-primary-border-color-disabled`         | Cor da borda do botão primário desabilitado                              | `var(--color-transparent)`                             |
 * | **Botão terciário (`Anterior`)**                  |                                                                          |                                                        |
 * | `--button-tertiary-color`                        | Cor do texto do botão terciário                                          | `var(--color-action-default)`                          |
 * | `--button-tertiary-color-hover`                  | Cor do texto do botão terciário no estado *hover*                        | `var(--color-brand-01-darkest)`                        |
 * | `--button-tertiary-color-pressed`                | Cor do texto do botão terciário no estado *pressed*                      | `var(--color-brand-01-darker)`                         |
 * | `--button-tertiary-background-color`             | Cor de fundo do botão terciário                                          | `var(--color-transparent)`                             |
 * | `--button-tertiary-background-hover`             | Cor de fundo do botão terciário no estado *hover*                        | `var(--color-brand-01-lighter)`                        |
 * | `--button-tertiary-background-pressed`           | Cor de fundo do botão terciário no estado *pressed*                      | `var(--color-brand-01-light)`                          |
 * | `--button-tertiary-border-color`                 | Cor da borda do botão terciário                                          | `var(--color-transparent)`                             |
 * | `--button-tertiary-border-color-hover`           | Cor da borda do botão terciário no estado *hover*                        | `var(--color-transparent)`                             |
 * | `--button-tertiary-border-color-pressed`         | Cor da borda do botão terciário no estado *pressed*                      | `var(--color-transparent)`                             |
 * | `--button-tertiary-shadow`                       | Sombra do botão terciário                                                | `var(--shadow-none)`                                   |
 * | `--button-tertiary-color-disabled`               | Cor do texto do botão terciário desabilitado                             | `var(--color-neutral-light-30)`                        |
 * | `--button-tertiary-background-disabled`          | Cor de fundo do botão terciário desabilitado                             | `var(--color-transparent)`                             |
 * | `--button-tertiary-border-color-disabled`        | Cor da borda do botão terciário desabilitado                             | `var(--color-transparent)`                             |
 * | **Botão fechar (`X`)**                           |                                                                          |                                                        |
 * | `--button-close-color`                           | Cor do botão fechar                                                      | `var(--color-neutral-mid-60)`                          |
 * | `--button-close-color-hover`                     | Cor do botão fechar no estado *hover*                                    | `var(--color-action-hover)`                            |
 * | `--button-close-color-pressed`                   | Cor do botão fechar no estado *pressed*                                  | `var(--color-action-pressed)`                          |
 * | `--button-close-color-focused`                   | Cor do botão fechar no estado de foco visível                            | `var(--color-action-focus)`                            |
 * | `--button-close-background-color`                | Cor de fundo do botão fechar                                             | `var(--color-transparent)`                             |
 * | `--button-close-background-hover`                | Cor de fundo do botão fechar no estado *hover*                           | `var(--color-neutral-light-10)`                        |
 * | `--button-close-background-pressed`              | Cor de fundo do botão fechar no estado *pressed*                         | `var(--color-neutral-light-20)`                        |
 * | `--button-close-border-color`                    | Cor da borda do botão fechar                                             | `var(--color-transparent)`                             |
 * | `--button-close-font-size`                       | Tamanho da fonte/ícone do botão fechar                                   | `var(--font-size-md)`                                  |
 * | `--button-close-padding`                         | Espaçamento interno do botão fechar                                      | `var(--spacing-xxs) var(--spacing-xs)`                 |
 * | `--button-close-color-disabled`                  | Cor do botão fechar desabilitado                                         | `var(--color-neutral-light-30)`                        |
 * | `--button-close-background-disabled`             | Cor de fundo do botão fechar desabilitado                                | `var(--color-transparent)`                             |
 * | `--button-close-border-color-disabled`           | Cor da borda do botão fechar desabilitado                                | `var(--color-transparent)`                             |
 * | **Foco visível**                                 |                                                                          |                                                        |
 * | `--outline-color-focused`                        | Cor do *outline* aplicado aos botões em foco visível                     | `var(--color-action-focus)`                            |
 */
export abstract class PoUserGuideBaseService {
  private _literals: PoUserGuideLiterals;
  private readonly language: string = poLocaleDefault;

  protected get defaultOptions(): PoUserGuideOptions {
    const literals = this.literals;
    return {
      allowClose: true,
      showProgress: true,
      keyboardControl: true,
      overlayOpacity: 0.7,
      nextLabel: literals.next,
      previousLabel: literals.previous,
      doneLabel: literals.done,
      closeLabel: literals.close,
      progressTemplate: literals.progressTemplate
    };
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-user-guide`.
   *
   * Existem duas maneiras de customizar o serviço, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoUserGuideLiterals = {
   *    next: 'Próximo',
   *    previous: 'Anterior',
   *    done: 'Finalizar',
   *    close: 'Fechar'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoUserGuideLiterals = {
   *    next: 'Avançar'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta passá-las ao método `setOptions`:
   *
   * ```
   * this.poUserGuide.setOptions({ literals: customLiterals }).start();
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  get literals(): PoUserGuideLiterals {
    return (
      this._literals || {
        ...poUserGuideLiteralsDefault[poLocaleDefault],
        ...poUserGuideLiteralsDefault[this.language]
      }
    );
  }

  set literals(value: PoUserGuideLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poUserGuideLiteralsDefault[poLocaleDefault],
        ...poUserGuideLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poUserGuideLiteralsDefault[this.language];
    }
  }

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
  protected readonly _tourStart = new Subject<PoUserGuideStartEvent>();

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
  readonly tourStart$: Observable<PoUserGuideStartEvent> = this._tourStart.asObservable();

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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

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
    const effectiveLiterals = options?.literals
      ? {
          ...poUserGuideLiteralsDefault[poLocaleDefault],
          ...poUserGuideLiteralsDefault[this.language],
          ...options.literals
        }
      : this.literals;

    const userProgressTemplate = options?.progressTemplate;

    const resolved: PoUserGuideOptions = {
      allowClose: true,
      showProgress: true,
      keyboardControl: true,
      overlayOpacity: 0.7,
      nextLabel: effectiveLiterals.next,
      previousLabel: effectiveLiterals.previous,
      doneLabel: effectiveLiterals.done,
      closeLabel: effectiveLiterals.close,
      progressTemplate: effectiveLiterals.progressTemplate,
      ...(options ?? {})
    };

    const overlayOpacity = resolved.overlayOpacity;

    if (typeof overlayOpacity !== 'number' || !Number.isFinite(overlayOpacity)) {
      resolved.overlayOpacity = this.defaultOptions.overlayOpacity;
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
   *
   * @returns {Promise<void>} `Promise` que é resolvida quando o tour é iniciado com sucesso e
   * rejeitada com um `Error` de mensagem padronizada quando ocorre falha na carga da dependência
   * `driver.js` ou na inicialização do tour. As aplicações consumidoras podem encadear `.catch` ou
   * utilizar `await` em um bloco `try/catch` para reagir a essas falhas.
   */
  abstract start(startIndex?: number): Promise<void>;

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
