/** Configurações compartilhadas: caminho da lib, URL do portal, rótulos e níveis de risco. */

const LIB_DIR = 'projects/ui/src/lib';
const DOCS_URL = 'https://po-ui.io/documentation';

// Pastas raiz que só reexportam código; não contam como componente impactado.
const AGGREGATOR_UNITS = new Set([
  'root',
  'components',
  'services',
  'directives',
  'pipes',
  'interceptors',
  'guards',
  'decorators',
  'interfaces',
  'utils',
  'enums'
]);

const CATEGORY_LABELS = {
  api: 'API pública',
  exports: 'exports/módulos',
  logic: 'lógica',
  template: 'template',
  style: 'estilo',
  literals: 'literais (i18n)',
  contract: 'interfaces/enums',
  sample: 'samples',
  test: 'testes',
  doc: 'documentação'
};

const NON_FUNCTIONAL = new Set(['sample', 'test', 'doc']);

const RISK = {
  low: { label: 'Baixo', emoji: '🟢', color: 0x2ecc71 },
  medium: { label: 'Médio', emoji: '🟡', color: 0xf1c40f },
  high: { label: 'Alto', emoji: '🔴', color: 0xe74c3c }
};

const RISK_ORDER = ['low', 'medium', 'high'];

module.exports = { LIB_DIR, DOCS_URL, AGGREGATOR_UNITS, CATEGORY_LABELS, NON_FUNCTIONAL, RISK, RISK_ORDER };
