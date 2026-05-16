import { PoUserGuideLiterals } from './po-user-guide-literals.interface';
import { PoUserGuideStepChangeEvent } from './po-user-guide-step-change-event.interface';

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve as opções globais de configuração do tour guiado executado pelo `PoUserGuideService`.
 *
 * Os valores informados são aplicados a toda a execução do tour e podem ser sobrescritos pontualmente
 * em cada `PoUserGuideStep` através das propriedades específicas de *labels* (`nextLabel`, `previousLabel`,
 * `doneLabel`) — neste caso, o valor declarado no passo prevalece sobre o valor declarado nas opções globais.
 *
 */
export interface PoUserGuideOptions {
  /**
   * @optional
   *
   * @description
   *
   * Permite que o usuário encerre o tour clicando fora do popover ou utilizando o botão "Fechar" (X).
   *
   * Quando definido como `false`, o tour somente pode ser encerrado de forma programática (por exemplo,
   * através do método `close()` do `PoUserGuideService`) ou ao avançar além do último passo.
   *
   * @default `true`
   */
  allowClose?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Quando `true`, mantém a rolagem da página totalmente livre durante o tour.
   *
   * O valor padrão `false` (ou a omissão da propriedade) preserva o comportamento padrão de
   * bloqueio: a rolagem do `document.documentElement` e do `document.body` é desabilitada
   * enquanto o tour estiver ativo e restaurada integralmente ao seu término.
   *
   * @default `false`
   */
  allowScroll?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe o indicador textual de progresso do tour no popover (por exemplo, `1 de 5`).
   *
   * O texto pode ser personalizado através da propriedade `progressTemplate`.
   *
   * @default `true`
   */
  showProgress?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Habilita/desabilita o controle do tour por teclado (valor padrão: `true`).
   * Se configurado como `false`, o controle por teclado é desabilitado.
   *
   * Quando ativo, são interpretadas as seguintes teclas:
   *
   * - `Esc`: encerra o tour (equivalente a `close()`).
   * - `→` (seta para a direita) ou `Enter`: avança para o próximo passo (equivalente a `next()`).
   * - `←` (seta para a esquerda): retrocede para o passo anterior (equivalente a `previous()`).
   *
   * @default `true`
   */
  keyboardControl?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define a opacidade do *overlay* que escurece a página ao redor do elemento destacado.
   *
   * O valor deve estar contido no intervalo `[0, 1]`, sendo `0` totalmente transparente e `1` totalmente opaco.
   * Valores fora deste intervalo são ajustados (*clamped*) para os limites mais próximos.
   *
   * @default `0.7`
   */
  overlayOpacity?: number;

  /**
   * @optional
   *
   * @description
   *
   * *Label* padrão do botão "Próximo" aplicado a todos os passos do tour.
   *
   * Pode ser sobrescrito individualmente por passo através de `PoUserGuideStep.nextLabel`.
   *
   * @default `Próximo`
   */
  nextLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * *Label* padrão do botão "Anterior" aplicado a todos os passos do tour.
   *
   * Pode ser sobrescrito individualmente por passo através de `PoUserGuideStep.previousLabel`.
   *
   * @default `Anterior`
   */
  previousLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * *Label* padrão do botão "Finalizar" aplicado ao último passo do tour.
   *
   * Pode ser sobrescrito individualmente por passo através de `PoUserGuideStep.doneLabel`.
   *
   * @default `Finalizar`
   */
  doneLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * *Label* padrão do botão "Fechar" (X) exibido no canto do popover do tour.
   *
   * @default `Fechar`
   */
  closeLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Template do texto de progresso exibido no popover quando `showProgress` está habilitado.
   *
   * Aceita os seguintes *placeholders*, que são substituídos em tempo de renderização:
   *
   * - `current`: número do passo atual, com base 1 (ou seja, o primeiro passo é exibido como `1`).
   * - `total`: número total de passos do tour.
   *
   * Quando o template informado não contém nenhum dos *placeholders* suportados, o texto é exibido
   * literalmente e um aviso é registrado em `console.warn`.
   *
   * @default `{ {current} } de { {total} }`
   */
  progressTemplate?: string;

  /**
   * @optional
   *
   * @description
   *
   * Classe CSS adicional aplicada ao elemento raiz do popover do tour.
   *
   * Útil para customizações pontuais sem alterar o tema global do PO UI. A classe padrão `po-user-guide-popover`
   * é sempre aplicada e preservada — o valor informado é concatenado a ela.
   */
  popoverClass?: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-user-guide`.
   *
   * Permite customizar os textos dos botões de navegação e o template de progresso do tour.
   * Quando omitido, as literais são traduzidas automaticamente de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   *
   * Exemplo passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoUserGuideLiterals = {
   *    next: 'Avançar',
   *    done: 'Concluir'
   *  };
   * ```
   */
  literals?: PoUserGuideLiterals;

  /**
   * @optional
   *
   * @description
   *
   * Função de *callback* invocada a cada mudança de passo durante a execução do tour.
   *
   * Recebe como argumento um evento `PoUserGuideStepChangeEvent` contendo o passo ativo, seu índice, a direção
   * da transição (`'next'`, `'previous'`, `'goto'` ou `'start'`) e o total de passos do tour.
   *
   * O *callback* é executado antes da emissão do evento correspondente em `PoUserGuideService.stepChange$`,
   * permitindo a aplicação consumidora reagir à transição antes que outros assinantes do `Observable` sejam notificados.
   */
  onStepChange?: (event: PoUserGuideStepChangeEvent) => void;
}
