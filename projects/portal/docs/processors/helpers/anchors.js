'use strict';

/**
 * Âncoras (atributo `id` do DOM) da documentação de API e dos guias.
 *
 * O mesmo cálculo alimenta os templates Dgeni (HTML da API) e o gerador do índice de busca,
 * garantindo que o link do resultado aponte para um `id` que existe na página.
 * O `id` vem do nome do código (nunca da ordem), então reordenar não quebra o link.
 */

/** Texto livre -> kebab-case sem acento (ex.: 'Pré-requisitos' -> 'pre-requisitos'). */
function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Garante unicidade na página: o segundo igual recebe `-2`, o terceiro `-3`... */
function uniqueId(base, seen) {
  let id = base || 'item';
  let counter = 2;

  while (seen.has(id)) {
    id = `${base}-${counter++}`;
  }
  seen.add(id);

  return id;
}

/** Texto puro de um título markdown (sem `código`, ênfase, links nem HTML). */
function headingText(rawMarkdown) {
  return String(rawMarkdown || '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/&amp;/g, '&')
    .trim();
}

const cleanAlias = alias => (alias ? String(alias).replace(/['"]/g, '').trim() : '');

/** Nome usado na documentação (igual ao exibido na coluna "Nome" da tabela). */
function propertyAlias(property) {
  if (property.isDirectiveInput) {
    return cleanAlias(property.directiveInputAlias) || property.name;
  }
  if (property.isDirectiveOutput) {
    return cleanAlias(property.directiveOutputAlias) || property.name;
  }
  return property.name === 'name' ? 'name' : `p-${slugify(property.name)}`;
}

/**
 * Atribui `anchorId` a classes, propriedades, métodos, interfaces e enums de um grupo de componente.
 * - classes (diretiva/serviço/outras): alias da propriedade (`p-label`), `method-<nome>`;
 * - interfaces/models/enums: `<tipo-em-kebab>-<membro>` (únicos por construção; objetos podem ser
 *   compartilhados entre grupos, então só são atribuídos uma vez).
 */
function assignGroupAnchors(group) {
  const seen = new Set();
  const classes = [...group.services, ...group.directives, ...group.additionalClasses];

  classes.forEach(cls => {
    cls.anchorId = cls.anchorId || uniqueId(slugify(cls.name), seen);
    (cls.properties || []).forEach(p => {
      p.anchorId = p.anchorId || uniqueId(propertyAlias(p), seen);
    });
    (cls.methods || []).forEach(m => {
      m.anchorId = m.anchorId || uniqueId(`method-${m.name}`, seen);
    });
  });

  [...group.interfaces, ...group.models, ...group.enums].forEach(type => {
    if (type.anchorId) return;

    const prefix = slugify(type.name);
    const local = new Set();

    type.anchorId = uniqueId(prefix, seen);
    // enum: a tabela usa só `enums`; `properties` repetiria os mesmos nomes
    (type.docType === 'enum' ? [] : type.properties || []).forEach(p => {
      p.anchorId = uniqueId(`${prefix}-${slugify(p.name)}`, local);
    });
    (type.methods || []).forEach(m => {
      m.anchorId = uniqueId(`${prefix}-method-${m.name}`, local);
    });
    (type.enums || []).forEach(e => {
      e.anchorId = uniqueId(`${prefix}-${slugify(e.name)}`, local);
    });
  });
}

module.exports = { slugify, headingText, uniqueId, propertyAlias, assignGroupAnchors };
