'use strict';

/**
 * Aplica (uma vez) as tags de categoria do menu no JSDoc das classes documentadas.
 *
 *   node projects/portal/docs/scripts/apply-docs-tags.js          # aplica
 *   node projects/portal/docs/scripts/apply-docs-tags.js --check  # só confere, não grava
 *
 * - Só edita comentários: insere as linhas no fim do JSDoc da classe pública do grupo, antes do `*`/`.
 *   No Dgeni o valor de uma tag vai até a próxima tag; no fim do bloco o valor é só a linha.
 * - Idempotente: tag já presente com o mesmo valor é mantida; com valor diferente, avisa e não troca.
 * - Fonte: a tabela de categorias aprovada (sem o po-gauge, que foi removido; nenhum @docsOrder).
 *   Depois de aplicada, a fonte da verdade passa a ser o JSDoc de cada arquivo.
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '../../../..');
const LIBS = ['ui', 'templates', 'storage', 'sync', 'code-editor'].map(lib => path.join(ROOT, 'projects', lib, 'src/lib'));
const SUFFIXES = ['component', 'directive', 'service', 'interceptor', 'model'];

// categoria -> rotas (itens do menu)
const CATEGORIES = {
  'actions': ['po-button', 'po-button-group', 'po-dropdown', 'po-link'],
  'form': [
    'po-input', 'po-email', 'po-password', 'po-url', 'po-number', 'po-decimal', 'po-login', 'po-textarea',
    'po-rich-text', 'po-code-editor', 'po-upload', 'po-helper', 'po-field-validate'
  ],
  'selection': [
    'po-select', 'po-combo', 'po-multiselect', 'po-lookup', 'po-checkbox', 'po-checkbox-group', 'po-radio-group',
    'po-switch'
  ],
  'date-time': ['po-calendar', 'po-datepicker', 'po-datepicker-range', 'po-datetimepicker', 'po-timepicker'],
  'search-filters': ['po-search', 'po-search-ai', 'po-filter-chip', 'po-disclaimer-group'],
  'tables-lists': ['po-table', 'po-grid', 'po-list-view', 'po-tree-view'],
  'visual': ['po-avatar', 'po-badge', 'po-tag', 'po-info', 'po-image', 'po-slide'],
  'charts': ['po-chart'],
  'containers': ['po-container', 'po-widget', 'po-accordion', 'po-divider'],
  'navigation': [
    'po-menu', 'po-menu-panel', 'po-navbar', 'po-header', 'po-toolbar', 'po-breadcrumb', 'po-context-menu',
    'po-context-tabs', 'po-stepper', 'po-tabs'
  ],
  'feedback': ['po-toaster', 'po-progress', 'po-loading-overlay', 'po-skeleton'],
  'overlay': ['po-modal', 'po-page-slide', 'po-popover', 'po-popup'],
  'pages': ['po-page-default', 'po-page-list', 'po-page-detail', 'po-page-edit', 'po-page-job-scheduler'],
  'auth': ['po-page-login', 'po-page-change-password', 'po-page-blocked-user', 'po-modal-password-recovery'],
  'dynamic': [
    'po-dynamic-form', 'po-dynamic-view', 'po-page-dynamic-table', 'po-page-dynamic-search', 'po-page-dynamic-detail',
    'po-page-dynamic-edit'
  ],
  'directives': ['po-drag', 'po-drop-list', 'po-tooltip'],
  'services': [
    'po-dialog', 'po-i18n', 'po-media-query', 'po-network', 'po-notification', 'po-storage', 'po-sync', 'po-theme',
    'po-user-guide'
  ],
  'interceptors': ['po-http-interceptor', 'po-http-request-interceptor'],
  'models': ['po-data-transform', 'po-entity', 'po-event-sourcing-error-response', 'po-network-status', 'po-query-builder']
};

// pai -> subcomponentes (fora do menu, ligados ao pai)
const PARENTS = {
  'po-code-editor': ['po-code-editor-register'],
  'po-combo': ['po-combo-option-template'],
  'po-multiselect': ['po-multiselect-option-template'],
  'po-table': ['po-table-cell-template', 'po-table-column-template', 'po-table-row-template'],
  'po-list-view': ['po-list-view-content-template', 'po-list-view-detail-template'],
  'po-slide': ['po-slide-content-template'],
  'po-accordion': ['po-accordion-item'],
  'po-tabs': ['po-tab'],
  'po-menu': ['po-menu-header-template'],
  'po-stepper': ['po-step'],
  'po-modal': ['po-modal-footer'],
  'po-page-slide': ['po-page-slide-footer'],
  'po-page-job-scheduler': ['po-job-scheduler-parameters-template', 'po-job-scheduler-summary-template']
};

// rota -> categorias onde também aparece como atalho
const SHORTCUTS = {
  'po-drag': ['tables-lists'],
  'po-drop-list': ['tables-lists'],
  'po-notification': ['feedback'],
  'po-dialog': ['feedback', 'overlay'],
  'po-tabs': ['containers'],
  'po-tooltip': ['overlay']
};

/** Tags esperadas por rota, na ordem em que são escritas. */
function expectedTags() {
  const tags = new Map();
  const add = (route, tag, value) => tags.set(route, [...(tags.get(route) || []), [tag, value]]);

  Object.entries(CATEGORIES).forEach(([category, routes]) => routes.forEach(route => add(route, 'docsCategory', category)));
  Object.entries(PARENTS).forEach(([parent, subs]) => subs.forEach(sub => add(sub, 'docsParent', parent)));
  Object.entries(SHORTCUTS).forEach(([route, categories]) => categories.forEach(c => add(route, 'docsShortcut', c)));

  return tags;
}

function indexSourceFiles() {
  const files = new Map();
  const walk = dir =>
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'samples' && entry.name !== 'node_modules') walk(full);
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        files.set(entry.name, [...(files.get(entry.name) || []), full]);
      }
    });

  LIBS.filter(fs.existsSync).forEach(walk);

  return files;
}

/** Classes exportadas com JSDoc que o Dgeni documenta (sem @docsPrivate). */
function documentedClasses(file) {
  const source = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const found = [];

  sf.statements.forEach(node => {
    if (!ts.isClassDeclaration(node) || !node.name) return;

    const exported = (ts.getModifiers(node) || []).some(m => m.kind === ts.SyntaxKind.ExportKeyword);
    const jsDoc = (node.jsDoc || []).at(-1);

    if (!exported || !jsDoc) return;

    const text = source.slice(jsDoc.pos, jsDoc.end);

    if (!text.startsWith('/**') || !text.endsWith('*/') || text.includes('@docsPrivate')) return;

    found.push({ file, source, className: node.name.text, start: jsDoc.pos, end: jsDoc.end, text });
  });

  return found;
}

function targetFor(route, files) {
  const candidates = SUFFIXES.flatMap(suffix => files.get(`${route}.${suffix}.ts`) || []).flatMap(documentedClasses);

  if (candidates.length !== 1) {
    throw new Error(`${route}: esperava 1 classe documentada, achei ${candidates.length} (${candidates.map(c => `${path.relative(ROOT, c.file)}#${c.className}`).join(', ')})`);
  }

  return candidates[0];
}

/** Insere as tags que faltam antes do `*`/` do bloco. Retorna o novo texto do comentário (ou o mesmo). */
function withTags(comment, tags, route, report) {
  const missing = tags.filter(([tag, value]) => {
    const present = [...comment.matchAll(new RegExp(`@${tag}\\s+([^\\s*]+)`, 'g'))].map(m => m[1]);

    if (present.includes(value)) return false;
    if (present.length && tag !== 'docsShortcut') {
      report.conflicts.push(`${route}: @${tag} já é '${present[0]}', a tabela diz '${value}' (não alterado)`);
      return false;
    }
    return true;
  });

  if (!missing.length) return comment;

  const closing = comment.lastIndexOf('*/');
  const lineStart = comment.lastIndexOf('\n', closing) + 1;

  if (comment.slice(lineStart, closing).trim() !== '') {
    throw new Error(`${route}: o '*/' do JSDoc não está numa linha sozinha`);
  }

  const indent = comment.slice(lineStart, closing);
  const lines = comment.slice(0, lineStart).split('\n');
  const lastContent = lines[lines.length - 2] ?? '';
  const needsBlank = lastContent.trim() !== '*' && lastContent.trim() !== '/**';
  const added = missing.map(([tag, value]) => `${indent}* @${tag} ${value}\n`).join('');

  return comment.slice(0, lineStart) + (needsBlank ? `${indent}*\n` : '') + added + comment.slice(lineStart);
}

function run({ check = false } = {}) {
  const files = indexSourceFiles();
  const report = { changed: [], unchanged: [], conflicts: [], lines: 0 };

  expectedTags().forEach((tags, route) => {
    const target = targetFor(route, files);
    const updated = withTags(target.text, tags, route, report);

    if (updated === target.text) {
      report.unchanged.push(route);
      return;
    }

    report.lines += updated.split('\n').length - target.text.split('\n').length;
    report.changed.push(`${path.relative(ROOT, target.file)}#${target.className}`);

    if (!check) {
      const source = fs.readFileSync(target.file, 'utf-8');

      // segurança: o trecho trocado precisa ser exatamente o comentário lido
      if (source.slice(target.start, target.end) !== target.text) throw new Error(`${route}: arquivo mudou durante o script`);
      fs.writeFileSync(target.file, source.slice(0, target.start) + updated + source.slice(target.end), 'utf-8');
    }
  });

  return report;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const report = run({ check });

  console.log(`${check ? '[check] ' : ''}arquivos alterados: ${report.changed.length}, sem mudança: ${report.unchanged.length}, linhas novas: ${report.lines}`);
  report.conflicts.forEach(c => console.warn(`conflito: ${c}`));
  if (check && report.changed.length) process.exitCode = 1;
}

module.exports = { CATEGORIES, PARENTS, SHORTCUTS, expectedTags, withTags, run };
