import { PoUserGuideAlignment } from '../enums/po-user-guide-alignment.enum';
import { PoUserGuidePosition } from '../enums/po-user-guide-position.enum';

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve um passo individual do tour guiado executado pelo `PoUserGuideService`.
 *
 * Cada passo representa uma parada do tour, com um elemento opcional a ser destacado na página,
 * conteúdo textual ou em HTML, configurações de posicionamento do popover, *labels* específicos
 * dos botões de navegação e *hooks* de ciclo de vida do passo.
 *
 * > A propriedade `content` é a única obrigatória e corresponde ao corpo do popover apresentado ao usuário.
 */
export interface PoUserGuideStep {
  /**
   * @optional
   *
   * @description
   *
   * Elemento da página que o passo deve destacar.
   *
   * Aceita um seletor CSS válido (`'#id'`, `'.class'`, `'tag'`, `'.container > .item'`) ou uma referência direta a um `HTMLElement`
   * (por exemplo, obtida via `@ViewChild` ou `ElementRef.nativeElement`).
   *
   * Quando a propriedade é omitida, o popover é exibido como um modal centralizado na viewport, sem destacar
   * nenhum elemento da página.
   */
  element?: string | HTMLElement;

  /**
   * @optional
   *
   * @description
   *
   * Título exibido no cabeçalho do popover do passo.
   *
   * Quando omitido, o popover é renderizado apenas com o conteúdo definido em `content`.
   */
  title?: string;

  /**
   * @description
   *
   * Conteúdo principal do passo, exibido no corpo do popover. Aceita texto puro ou HTML.
   *
   * > **Aviso de segurança:** por padrão, o PO UI sanitiza o conteúdo HTML recebido antes de repassá-lo
   * > ao popover do tour, reduzindo o risco de vulnerabilidades de *Cross-Site Scripting* (XSS).
   * >
   * > Mesmo com essa proteção, recomenda-se que aplicações consumidoras evitem enviar conteúdo HTML
   * > proveniente de fontes não confiáveis sem validação prévia, como entradas de usuário ou dados externos.
   * > A sanitização realizada pelo PO UI atua como uma camada de segurança, mas não substitui boas práticas
   * > de validação e controle dos dados na origem.
   */
  content: string;

  /**
   * @optional
   *
   * @description
   *
   * Posição preferida do popover em relação ao elemento destacado.
   *
   * Valores aceitos:
   *
   * - `top`: o popover é renderizado acima do elemento destacado.
   * - `right`: o popover é renderizado à direita do elemento destacado.
   * - `bottom`: o popover é renderizado abaixo do elemento destacado.
   * - `left`: o popover é renderizado à esquerda do elemento destacado.
   * - `over`: o popover é renderizado sobreposto ao elemento destacado.
   * - `auto`: a posição é calculada automaticamente conforme o espaço disponível na viewport.
   *
   * @default auto`
   */
  position?: PoUserGuidePosition;

  /**
   * @optional
   *
   * @description
   *
   * Alinhamento do popover ao longo do eixo da posição configurada em `position`.
   *
   * Valores aceitos: 'start' | 'center' | 'end'
   *
   * @default `start`
   */
  align?: PoUserGuideAlignment;

  /**
   * @optional
   *
   * @description
   *
   * Sobrescreve o *label* do botão "Próximo" exclusivamente para este passo.
   *
   * Quando omitido, é utilizado o valor configurado em `PoUserGuideOptions.nextLabel` ou o padrão do PO UI (`Próximo`).
   */
  nextLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Sobrescreve o *label* do botão "Anterior" exclusivamente para este passo.
   *
   * Quando omitido, é utilizado o valor configurado em `PoUserGuideOptions.previousLabel` ou o padrão do PO UI (`Anterior`).
   */
  previousLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Sobrescreve o *label* do botão "Finalizar" exclusivamente para este passo.
   *
   * Quando omitido, é utilizado o valor configurado em `PoUserGuideOptions.doneLabel` ou o padrão do PO UI (`Finalizar`).
   */
  doneLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Lista que filtra quais botões de navegação devem ser exibidos no popover deste passo.
   *
   * Aceita qualquer combinação dos valores `'next'`, `'previous'` e `'close'`. Apenas os botões presentes
   * na lista são renderizados, permitindo, por exemplo, ocultar o botão "Anterior" no primeiro passo
   * ou exibir somente o botão "Fechar" em um passo final.
   *
   * Quando a propriedade é omitida, todos os botões padrão (`'next'`, `'previous'` e `'close'`) são exibidos.
   * Quando informada como array vazio, nenhum botão de navegação é exibido — o controle do tour passa a ser
   * 100% programático via `next()`, `previous()`, `goTo()` e `close()` do `PoUserGuideService`.
   */
  showButtons?: Array<'next' | 'previous' | 'close'>;

  /**
   * @optional
   *
   * @description
   *
   * *Hook* executado imediatamente antes de o passo ser destacado na página, sincronamente à transição.
   *
   * Recebe como argumentos o próprio passo (`step`) e o seu índice (`index`, com base zero) na lista de passos
   * configurada via `PoUserGuideService.setSteps`.
   *
   * Útil para preparar a UI antes do destaque (por exemplo, abrir um menu lateral que contém o elemento alvo).
   */
  onBeforeHighlight?: (step: PoUserGuideStep, index: number) => void;

  /**
   * @optional
   *
   * @description
   *
   * *Hook* executado imediatamente após o passo ser destacado na página.
   *
   * Recebe como argumentos o próprio passo (`step`) e o seu índice (`index`, com base zero) na lista de passos.
   *
   * Útil para registrar telemetria de visualização ou disparar lógica de negócio dependente da exibição do passo.
   */
  onHighlighted?: (step: PoUserGuideStep, index: number) => void;

  /**
   * @optional
   *
   * @description
   *
   * *Hook* executado quando o passo deixa de estar ativo, seja por avanço, retrocesso ou encerramento do tour.
   *
   * Recebe como argumentos o próprio passo (`step`) e o seu índice (`index`, com base zero) na lista de passos.
   *
   * Útil para reverter alterações de UI realizadas em `onBeforeHighlight` ou `onHighlighted`.
   */
  onDeselected?: (step: PoUserGuideStep, index: number) => void;
}
