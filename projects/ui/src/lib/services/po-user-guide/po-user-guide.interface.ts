/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Define a posição preferida do popover do tour em relação ao elemento destacado.
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
 * > Quando o valor não é informado, é aplicado o padrão `auto`.
 */
export type PoUserGuidePosition = 'top' | 'right' | 'bottom' | 'left' | 'over' | 'auto';

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Define o alinhamento do popover do tour ao longo do eixo da posição configurada.
 *
 * Valores aceitos:
 *
 * - `start`: o popover é alinhado ao início do eixo da posição (topo ou esquerda, conforme a `PoUserGuidePosition`).
 * - `center`: o popover é alinhado ao centro do eixo da posição.
 * - `end`: o popover é alinhado ao final do eixo da posição (rodapé ou direita, conforme a `PoUserGuidePosition`).
 *
 * > Quando o valor não é informado, é aplicado o padrão `start`.
 */
export type PoUserGuideAlignment = 'start' | 'center' | 'end';

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
 * Todas as propriedades são opcionais. Quando omitidas, são aplicados os valores padrão do PO UI documentados
 * em cada propriedade através da anotação `@default`.
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
   * Habilita o controle do tour por teclado.
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
   * @default `{{current}} de {{total}}`
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

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.
 *
 * É publicado no `Observable` `PoUserGuideService.tourStart$` exatamente uma vez por execução, imediatamente
 * após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
 * `PoUserGuideService.stepChange$`.
 *
 * As aplicações consumidoras podem assinar `tourStart$` para registrar telemetria do início do tour,
 * exibir mensagens contextuais ou disparar lógica de negócio dependente do início da jornada do usuário.
 */
export interface PoUserGuideEvent {
  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;

  /**
   * @description
   *
   * Índice do passo inicial do tour, com base zero.
   *
   * Corresponde ao argumento `startIndex` informado a `PoUserGuideService.start`. Quando o método é invocado
   * sem argumentos, o valor é `0`.
   */
  startIndex: number;

  /**
   * @description
   *
   * Marca de tempo, em milissegundos, do momento de emissão do evento, obtida a partir de `Date.now()`.
   *
   * Útil para correlacionar o início do tour com outros eventos de telemetria da aplicação.
   */
  timestamp: number;
}

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.
 *
 * É publicado no `Observable` `PoUserGuideService.stepChange$` toda vez que o passo ativo é alterado, seja por
 * interação do usuário (cliques nos botões "Próximo"/"Anterior" ou navegação por teclado) ou por chamada
 * programática aos métodos `next`, `previous`, `goTo` e `start` do `PoUserGuideService`.
 *
 * As aplicações consumidoras podem assinar `stepChange$` para reagir à navegação do usuário, atualizar a
 * UI conforme o passo ativo, registrar telemetria de progresso ou disparar lógica de negócio contextual.
 */
export interface PoUserGuideStepChangeEvent {
  /**
   * @description
   *
   * Passo do tour que se tornou ativo após a transição.
   *
   * Corresponde ao elemento da lista `steps` (configurada via `PoUserGuideService.setSteps`) cujo índice é
   * igual ao valor de `index` neste evento.
   */
  step: PoUserGuideStep;

  /**
   * @description
   *
   * Índice, com base zero, do passo ativo após a transição.
   *
   * Está sempre contido no intervalo `[0, totalSteps - 1]`.
   */
  index: number;

  /**
   * @description
   *
   * Direção da transição que originou a mudança de passo.
   *
   * Valores aceitos:
   *
   * - `next`: a transição foi originada pelo método `PoUserGuideService.next` ou pelo botão "Próximo" do popover.
   * - `previous`: a transição foi originada pelo método `PoUserGuideService.previous` ou pelo botão "Anterior" do popover.
   * - `goto`: a transição foi originada pela chamada ao método `PoUserGuideService.goTo` com um índice arbitrário.
   * - `start`: a transição corresponde à exibição do primeiro passo logo após a inicialização do tour
   *   pelo método `PoUserGuideService.start`.
   */
  direction: 'next' | 'previous' | 'goto' | 'start';

  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;
}

/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * Interface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.
 *
 * É publicado no `Observable` `PoUserGuideService.tourEnd$` exatamente uma vez por execução, sempre após a
 * emissão do último `PoUserGuideStepChangeEvent` em `PoUserGuideService.stepChange$` e após a limpeza do estado
 * interno do serviço.
 *
 * As aplicações consumidoras podem assinar `tourEnd$` para registrar telemetria de conclusão ou de
 * abandono do tour, executar limpezas de UI ou disparar lógica de negócio dependente do encerramento
 * da jornada do usuário.
 */
export interface PoUserGuideEndEvent {
  /**
   * @description
   *
   * Motivo do encerramento do tour.
   *
   * Valores aceitos:
   *
   * - `completed`: o usuário avançou além do último passo do tour, concluindo a jornada por completo.
   * - `closed`: o tour foi encerrado antes da conclusão, seja pelo usuário (tecla `Esc`, botão "Fechar"
   *   ou clique fora do popover quando `PoUserGuideOptions.allowClose` está habilitado) ou pela aplicação
   *   consumidora através das chamadas a `PoUserGuideService.close` ou `PoUserGuideService.exit`.
   * - `destroyed`: o encerramento foi forçado pela destruição da instância do serviço — cenário raro,
   *   normalmente observado em testes automatizados ou em ciclos de vida atípicos da aplicação.
   */
  reason: 'completed' | 'closed' | 'destroyed';

  /**
   * @description
   *
   * Índice, com base zero, do último passo ativo antes do encerramento do tour.
   *
   * Quando `reason` é `'completed'`, corresponde ao índice do último passo da lista (`totalSteps - 1`).
   * Quando `reason` é `'closed'` ou `'destroyed'`, corresponde ao índice do passo que estava em exibição
   * no momento do encerramento.
   */
  lastIndex: number;

  /**
   * @description
   *
   * Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`.
   */
  totalSteps: number;
}
