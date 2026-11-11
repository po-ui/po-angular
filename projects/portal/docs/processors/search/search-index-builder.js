'use strict';

/**
 * Monta os documentos do índice de busca do portal (modelo `SearchDoc`) e grava os chunks.
 *
 * Chunks (carregados sob demanda no cliente):
 * - core:  componentes, serviços, interfaces/enums, guias e páginas
 * - api:   propriedades, eventos e métodos
 * - icons: ícones
 *
 * Cada chunk guarda uma tabela `pages` compartilhada (nome da página, rota, componente, pacote);
 * o documento só aponta para ela pelo índice em `page`.
 * O nome do arquivo leva o hash do conteúdo (`search-core.3f9a1c2e.json`) e o `search-manifest.json`
 * diz qual é o atual: arquivos com hash podem ficar em cache para sempre.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Lexer } = require('marked');

const { slugify, headingText, uniqueId, propertyAlias } = require('../helpers/anchors');
const { plainText, truncate } = require('./search-text');

const CHUNK_OF_TYPE = {
  componente: 'core',
  servico: 'core',
  interface: 'core',
  enum: 'core',
  guia: 'core',
  pagina: 'core',
  propriedade: 'api',
  evento: 'api',
  metodo: 'api',
  icone: 'icons'
};

const LIMITS = { component: 500, member: 240, guide: 1500 };

/** Páginas fixas do portal (rotas de `app-routing.module.ts`). */
const FIXED_PAGES = [
  { slug: 'inicio', title: 'Iniciar', url: '/', text: 'Página inicial do PO UI: biblioteca de componentes Angular.' },
  {
    slug: 'componentes',
    title: 'Componentes',
    url: '/documentation',
    text: 'API Reference: lista de todos os componentes, serviços e interfaces do PO UI.'
  },
  { slug: 'guias', title: 'Guias', url: '/guides', text: 'Guias de uso, migração e boas práticas do PO UI.' },
  { slug: 'icones', title: 'Ícones', url: '/icons', text: 'Catálogo de ícones do PO UI, nas versões regular e fill.' },
  {
    slug: 'ferramentas',
    title: 'Ferramentas',
    url: '/tools',
    text: 'Ferramentas para trabalhar com o PO UI.'
  },
  {
    slug: 'construtor-de-temas',
    title: 'Construtor de temas',
    url: '/construtor-de-temas',
    text: 'Crie e visualize temas personalizados do PO UI.'
  },
  {
    slug: 'ia-tools-llms',
    title: 'PO UI e IA: llms.txt',
    url: '/documentation/ia-tools-llms',
    text: 'Documentação do PO UI para ferramentas de IA (llms.txt e llms-full.txt).'
  },
  {
    slug: 'ia-tools-mcp',
    title: 'PO UI e IA: servidor MCP',
    url: '/documentation/ia-tools-mcp',
    text: 'Servidor MCP do PO UI para assistentes de código.'
  }
];

// ---------------------------------------------------------------------------
// API (grupos do Dgeni)
// ---------------------------------------------------------------------------

/** Documentos de API de um grupo (componente/serviço com suas interfaces e enums). */
function buildGroupDocs(group) {
  const docs = [];
  const page = { name: group.componentName, url: `/documentation/${group.name}?view=doc`, component: group.name, package: group.package };
  const add = (type, id, title, text, { limit = LIMITS.member, ...extra } = {}) =>
    docs.push({ id, type, title, page, text: truncate(plainText(text), limit), ...extra });

  const primary = group.directives[0] || group.services[0] || group.additionalClasses[0];

  add(group.directives.length ? 'componente' : 'servico', group.name, group.componentName, group.description, {
    limit: LIMITS.component
  });

  const classes = [
    ...group.directives.map(c => ['componente', c]),
    ...group.services.map(c => ['servico', c]),
    ...group.additionalClasses.map(c => ['servico', c])
  ];

  classes.forEach(([type, cls]) => {
    if (cls !== primary && cls.description && cls.anchorId) {
      add(type, `${group.name}#${cls.anchorId}`, cls.name, cls.description, {
        fragment: cls.anchorId,
        limit: LIMITS.component
      });
    }
    (cls.properties || []).forEach(p => addMember(add, group, cls.name, p));
    (cls.methods || []).forEach(m => addMethod(add, group, cls.name, m));
  });

  [...group.interfaces, ...group.models, ...group.enums].forEach(type => {
    if (type.description && type.anchorId) {
      add(type.docType === 'enum' ? 'enum' : 'interface', `${group.name}#${type.anchorId}`, type.name, type.description, {
        fragment: type.anchorId,
        limit: LIMITS.component
      });
    }
    (type.docType === 'enum' ? type.enums || [] : type.properties || []).forEach(p =>
      addMember(add, group, type.name, p, true)
    );
    (type.methods || []).forEach(m => addMethod(add, group, type.name, m));
  });

  return docs;
}

function addMember(add, group, owner, property, isTypeMember = false) {
  if (!property.anchorId || !property.description || !property.content) return;

  const label = isTypeMember ? `${owner}.${property.name}` : propertyAlias(property);
  const type = property.isDirectiveOutput ? 'evento' : 'propriedade';

  add(type, `${group.name}#${property.anchorId}`, `${group.name} › ${label}`, property.description, {
    section: owner,
    fragment: property.anchorId
  });
}

function addMethod(add, group, owner, method) {
  if (!method.anchorId || !method.description) return;

  add('metodo', `${group.name}#${method.anchorId}`, `${group.name} › ${method.name}()`, method.description, {
    section: owner,
    fragment: method.anchorId
  });
}

function buildApiDocs(groups) {
  return groups
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(buildGroupDocs);
}

// ---------------------------------------------------------------------------
// Guias (markdown)
// ---------------------------------------------------------------------------

/** Metadados `[comment]: # (@label Texto)` dos guias. */
function guideMeta(markdown) {
  const meta = {};

  (markdown.match(/\[comment\]: # \(@(.+)\)/g) || []).forEach(line => {
    const [, tag, value] = line.match(/\(@(\S+)\s*(.*)\)$/) || [];

    if (tag) meta[tag] = value;
  });

  return meta;
}

/**
 * Uma entrada por seção (título). Os `id` seguem a mesma sequência do renderer do gulp
 * (`slugify(headingText)` + `uniqueId`, todos os títulos em ordem), então batem com o HTML.
 */
function buildGuideDocs(fileName, markdown) {
  const meta = guideMeta(markdown);
  const pageName = meta.label || fileName;
  const url = `/guides/${fileName}`;
  const page = { name: pageName, url, component: undefined, package: undefined };
  const seen = new Set();
  const docs = [];
  let current = null;
  let parentH2 = '';

  const flush = () => {
    if (current) {
      current.text = truncate(plainText(current.raw, { keepCode: true }), LIMITS.guide);
      delete current.raw;
      docs.push(current);
    }
  };

  Lexer.lex(markdown).forEach(token => {
    if (token.type === 'heading') {
      flush();
      const title = headingText(token.text);
      const fragment = uniqueId(slugify(title), seen);

      if (token.depth <= 2) parentH2 = token.depth === 2 ? title : '';
      current = {
        id: `guia:${fileName}#${fragment}`,
        type: 'guia',
        title,
        page,
        section: token.depth > 2 ? parentH2 : token.depth === 2 ? pageName : undefined,
        fragment: token.depth === 1 ? undefined : fragment,
        raw: ''
      };
    } else if (current && token.type !== 'space' && !/^\[comment\]/.test(token.raw)) {
      current.raw += `${token.raw}\n`;
    }
  });
  flush();

  return docs.filter(d => d.text || d.title);
}

// ---------------------------------------------------------------------------
// Ícones e páginas
// ---------------------------------------------------------------------------

/** `selection.json` do IcoMoon (@animaliads/animalia-icon). `-fill` é variante do mesmo nome. */
function buildIconDocs(selection) {
  const page = { name: 'Ícones', url: '/icons' };
  const seen = new Set();
  const docs = [];

  (selection.icons || []).forEach(({ properties = {} }) => {
    const name = String(properties.name || '').replace(/-fill$/, '');

    if (!name || seen.has(name)) return;
    seen.add(name);
    docs.push({
      id: `icone:${name}`,
      type: 'icone',
      title: name,
      page,
      text: `an an-${String(properties.ligatures || name).replace(/-fill$/, '')}`
    });
  });

  return docs;
}

function buildPageDocs() {
  return FIXED_PAGES.map(p => ({
    id: `pagina:${p.slug}`,
    type: 'pagina',
    title: p.title,
    page: { name: p.title, url: p.url },
    text: p.text
  }));
}

// ---------------------------------------------------------------------------
// Chunks, hash e manifest
// ---------------------------------------------------------------------------

/** Separa por chunk, remove ids repetidos (mesma interface em dois lugares da página) e monta a tabela de páginas. */
function buildChunks(docs) {
  const seenIds = new Set();
  const byChunk = {};

  docs.forEach(doc => {
    if (seenIds.has(doc.id)) return;
    seenIds.add(doc.id);
    (byChunk[CHUNK_OF_TYPE[doc.type]] = byChunk[CHUNK_OF_TYPE[doc.type]] || []).push(doc);
  });

  const chunks = {};

  Object.keys(byChunk).forEach(name => {
    const pages = [];
    const pageIndex = new Map();
    const list = byChunk[name]
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map(({ page, ...doc }) => {
        const key = `${page.url}|${page.name}`;

        if (!pageIndex.has(key)) {
          pageIndex.set(key, pages.length);
          pages.push(page);
        }

        return { ...doc, page: pageIndex.get(key) };
      });

    chunks[name] = { pages, docs: list };
  });

  return chunks;
}

/**
 * Grava `search-<chunk>.<hash>.json` e `search-manifest.json` em `outDir`, apagando chunks antigos.
 * @returns {object} manifest
 */
function writeIndex(outDir, chunks) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.readdirSync(outDir)
    .filter(f => /^search-(core|api|icons)\.[0-9a-f]+\.json$/.test(f) || f === 'search-manifest.json')
    .forEach(f => fs.unlinkSync(path.join(outDir, f)));

  const manifest = { version: 1, chunks: {} };

  Object.keys(chunks).forEach(name => {
    const json = JSON.stringify(chunks[name]);
    const hash = crypto.createHash('sha1').update(json).digest('hex').slice(0, 8);
    const file = `search-${name}.${hash}.json`;

    fs.writeFileSync(path.join(outDir, file), json, 'utf-8');
    manifest.chunks[name] = { file, count: chunks[name].docs.length, bytes: Buffer.byteLength(json) };
  });

  fs.writeFileSync(path.join(outDir, 'search-manifest.json'), JSON.stringify(manifest), 'utf-8');

  return manifest;
}

module.exports = {
  CHUNK_OF_TYPE,
  buildApiDocs,
  buildGroupDocs,
  buildGuideDocs,
  buildIconDocs,
  buildPageDocs,
  buildChunks,
  writeIndex,
  guideMeta
};
