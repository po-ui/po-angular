export class Documentation {
  name: string;
  module?: string;
  types?: string;
  type: string;
  title: string;
  path?: string;

  // Indica se o componente possui exemplos (aba "Exemplos"). Vem do api-list.json.
  hasSamples?: boolean;

  // Categorias do menu e da listagem (tags @docsCategory/@docsParent/@docsShortcut/@docsOrder), gravadas
  // pelo gerador da documentação (projects/portal/docs/processors/docs-grouper.js).
  section?: string;
  sectionLabel?: string;
  sectionOrder?: number;
  category?: string;
  categoryLabel?: string;
  categoryOrder?: number;
  // seção de um nível só (sem subnível de categoria), ex.: Componentes dinâmicos
  flat?: boolean;
  order?: number;
  // subcomponente: rota do pai (fica fora do menu e da listagem, dentro do pai)
  parent?: string;
  children?: Array<string>;
  shortcuts?: Array<DocumentationShortcut>;

  // Campos derivados montados em DocumentationListComponent para os cards.
  description?: string;
  previewText?: string;
  preview?: string;
  tagLabel?: string;
  tagType?: string;
}

/** Categoria onde o item também aparece como atalho (`@docsShortcut`). */
export interface DocumentationShortcut {
  category: string;
  categoryLabel: string;
  section: string;
  sectionLabel: string;
}
