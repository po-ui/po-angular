export class Documentation {
  name: string;
  module?: string;
  types?: string;
  type: string;
  title: string;
  path?: string;

  // Indica se o componente possui exemplos (aba "Exemplos"). Vem do api-list.json.
  hasSamples?: boolean;

  // Campos derivados montados em DocumentationListComponent para os cards.
  description?: string;
  previewText?: string;
  preview?: string;
  tagLabel?: string;
  tagType?: string;
}
