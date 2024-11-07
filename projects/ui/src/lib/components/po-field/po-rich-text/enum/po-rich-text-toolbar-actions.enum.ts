/**
 * @usedBy PoRichTextComponent
 *
 * @description
 * Enumeração que define as ações disponíveis na barra de ferramentas do `PoRichTextComponent`.
 * Cada ação corresponde a um conjunto de botões ou funcionalidades que podem ser habilitados ou desabilitados
 * na barra de ferramentas do editor do rich-text.
 */
export enum PoRichTextToolbarActions {
  /**
   * Seletor de cores, Ação que permite que o usuário altere a cor do texto selecionado.
   */
  Color = 'color',

  /**
   * Alinhamento de texto, incluindo alinhamento à esquerda, centralizado, à direita e justificado.
   */
  Align = 'align',

  /**
   * Formatação de texto, como aplicar negrito, itálico ou sublinhado ao texto selecionado.
   */
  Format = 'format',

  /**
   * Listas com marcadores (bullet points) ou listas numeradas.
   */
  List = 'list',

  /**
   * Links no conteúdo, aplica partes do texto para serem clicáveis e direcionem para URLs especificadas.
   */
  Link = 'link',

  /**
   * Mídias, como imagens, no conteúdo do editor.
   */
  Media = 'media'
}
