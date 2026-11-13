'use strict';

/**
 * Vocabulário fechado das categorias do menu de documentação e da listagem "API Reference".
 *
 * Os itens carregam a categoria no próprio JSDoc (`@docsCategory <chave>`, `@docsParent <rota>`,
 * `@docsShortcut <chave>`, `@docsOrder <n>`); aqui fica só a lista de chaves válidas, o rótulo e a ordem.
 * A seção é derivada da categoria (cada chave pertence a uma seção só).
 * A ordem das seções e das categorias é a ordem dos arrays abaixo.
 */
module.exports = {
  /** Categoria usada para item sem `@docsCategory` nem `@docsParent` (só aviso no build). */
  fallbackCategory: 'others',

  sections: [
    {
      key: 'components',
      label: 'Componentes',
      categories: [
        { key: 'actions', label: 'Ações' },
        { key: 'form', label: 'Formulário' },
        { key: 'selection', label: 'Seleção' },
        { key: 'date-time', label: 'Data e hora' },
        { key: 'search-filters', label: 'Busca e filtros' },
        { key: 'tables-lists', label: 'Tabelas e listas' },
        { key: 'visual', label: 'Elementos visuais' },
        { key: 'charts', label: 'Gráficos' },
        { key: 'containers', label: 'Contêineres' },
        { key: 'navigation', label: 'Navegação' },
        { key: 'feedback', label: 'Feedback' },
        { key: 'overlay', label: 'Sobreposição' },
        { key: 'others', label: 'Outros' }
      ]
    },
    {
      key: 'page-templates',
      label: 'Templates de página',
      categories: [
        { key: 'pages', label: 'Páginas' },
        { key: 'auth', label: 'Autenticação' }
      ]
    },
    {
      key: 'dynamic',
      label: 'Componentes dinâmicos',
      // seção de um nível só: a categoria não vira subnível no menu
      flat: true,
      categories: [{ key: 'dynamic', label: 'Componentes dinâmicos' }]
    },
    {
      key: 'utilities',
      label: 'Utilitários',
      categories: [
        { key: 'directives', label: 'Diretivas' },
        { key: 'services', label: 'Serviços' },
        { key: 'interceptors', label: 'Interceptors' },
        { key: 'models', label: 'Modelos de dados' }
      ]
    }
  ]
};
