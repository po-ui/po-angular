'use strict';

/**
 * Lista fechada das categorias do menu de Guias (`/guides`).
 *
 * Cada guia diz a categoria no frontmatter (`category: <chave>`); aqui ficam só as chaves válidas, o rótulo e a ordem.
 * A ordem das categorias no menu é a ordem do array. Mesmo formato de `docs-categories.js` (uma seção só).
 */
module.exports = {
  /** Categoria usada para guia sem `category` nem `parent` (só aviso no build). */
  fallbackCategory: 'others',

  sections: [
    {
      key: 'guides',
      label: 'Guias',
      categories: [
        { key: 'getting-started', label: 'Começando' },
        { key: 'themes', label: 'Temas' },
        { key: 'layout', label: 'Layout e tipografia' },
        { key: 'components', label: 'Uso dos componentes' },
        { key: 'sync', label: 'Dados offline (PO Sync)' },
        { key: 'migration', label: 'Migração e depreciações' },
        { key: 'releases', label: 'Versões e suporte' },
        { key: 'community', label: 'Comunidade' },
        { key: 'others', label: 'Outros' }
      ]
    }
  ]
};
