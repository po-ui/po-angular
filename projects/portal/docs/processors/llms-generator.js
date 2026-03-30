'use strict';

/**
 * Processador Dgeni: llms-generator
 *
 * Gera arquivos de documentação estruturada para consumo por ferramentas de IA:
 *
 * - `src/llms.txt`       → índice resumido (padrão llmstxt.org), servido em https://po-ui.io/llms.txt
 * - `src/llms-full.txt`  → documentação completa concatenada, servida em https://po-ui.io/llms-full.txt
 * - `src/llms-generated/<name>.md` → documentação individual por componente/serviço/interface/enum
 *
 * O processador roda dentro do pipeline Dgeni (build:api) após `docs-processed`,
 * aproveitando todos os dados já extraídos dos JSDocs do código-fonte.
 *
 * @see projects/portal/docs/index.js para registrar este processador.
 */

const path = require('path');
const fs = require('fs');
const { unescapeHtml, stripHtml, getFirstSentence, normalizeDescription } = require('./helpers/llms-formatting');

const PORTAL_URL = 'https://po-ui.io';
const PORTAL_SRC = path.resolve(__dirname, '../../src');
const DOCS_OUTPUT_DIR = path.resolve(PORTAL_SRC, 'llms-generated');

module.exports = function llmsGenerator() {
  return {
    $runAfter: ['categorizer'],
    $runBefore: ['componentGrouper'],

    $process(docs) {
      ensureDir(DOCS_OUTPUT_DIR);

      const components = [];
      const services = [];
      const interfaces = [];
      const enums = [];

      // Filtra e classifica os docs válidos
      const validDocs = docs.filter(
        doc =>
          !doc.docsPrivate &&
          doc.description &&
          (doc.isDirective || doc.isService || doc.isInterface || doc.isEnum || doc.isModel)
      );

      validDocs.forEach(doc => {
        const fileInfo = resolveDocFileInfo(doc);
        if (!fileInfo) return;

        const markdown = generateComponentMarkdown(doc, fileInfo);
        const outputPath = path.join(DOCS_OUTPUT_DIR, `${fileInfo.slug}.md`);

        writeFile(outputPath, markdown);

        const entry = {
          name: doc.name,
          slug: fileInfo.slug,
          selector: fileInfo.selector,
          description: getFirstSentence(normalizeDescription(doc.description)),
          url: `${PORTAL_URL}/llms-generated/${fileInfo.slug}.md`,
          portalUrl: `${PORTAL_URL}/documentation/${fileInfo.slug}`,
          type: fileInfo.type,
        };

        if (doc.isDirective) components.push(entry);
        else if (doc.isService) services.push(entry);
        else if (doc.isEnum) enums.push(entry);
        else interfaces.push(entry);
      });

      // Ordena cada categoria alfabeticamente
      const sortByName = (a, b) => a.slug.localeCompare(b.slug);
      components.sort(sortByName);
      services.sort(sortByName);
      interfaces.sort(sortByName);
      enums.sort(sortByName);

      const allEntries = [...components, ...services, ...interfaces, ...enums];

      // Gera llms.txt (índice)
      const llmsTxt = generateLlmsTxt({ components, services, interfaces, enums });
      writeFile(path.join(PORTAL_SRC, 'llms.txt'), llmsTxt);

      // Gera llms-full.txt (conteúdo completo)
      const llmsFullTxt = generateLlmsFullTxt(allEntries, docs);
      writeFile(path.join(PORTAL_SRC, 'llms-full.txt'), llmsFullTxt);

      const total = allEntries.length;
      console.log(
        `[llms-generator] ✅ Gerados: ${total} docs | ` +
          `${components.length} componentes, ${services.length} serviços, ` +
          `${interfaces.length} interfaces, ${enums.length} enums`
      );
      console.log(`[llms-generator] 📄 llms.txt → ${path.join(PORTAL_SRC, 'llms.txt')}`);
      console.log(`[llms-generator] 📄 llms-full.txt → ${path.join(PORTAL_SRC, 'llms-full.txt')}`);
      console.log(`[llms-generator] 📁 llms-generated/ → ${DOCS_OUTPUT_DIR} (${total} arquivos .md)`);
    },
  };
};

// ---------------------------------------------------------------------------
// Geração de markdown por componente
// ---------------------------------------------------------------------------

/**
 * Resolve metadados do doc para nomes de arquivo e slugs.
 * @returns {{ slug, selector, type }} ou null se não aplicável
 */
function resolveDocFileInfo(doc) {
  if (doc.isDirective) {
    const selector = (doc.directiveSelectors || [])[0];
    if (!selector) return null;
    return {
      slug: selector,
      selector,
      type: 'component',
    };
  }

  if (doc.isService) {
    const slug = camelToKebab(doc.name);
    return { slug, selector: null, type: 'service' };
  }

  if (doc.isEnum) {
    const slug = camelToKebab(doc.name);
    return { slug, selector: null, type: 'enum' };
  }

  if (doc.isInterface || doc.isModel) {
    const slug = camelToKebab(doc.name);
    return { slug, selector: null, type: 'interface' };
  }

  return null;
}

/**
 * Gera o conteúdo markdown completo de um doc.
 */
function generateComponentMarkdown(doc, fileInfo) {
  const lines = [];

  // Cabeçalho
  lines.push(`# ${doc.name}`);
  lines.push('');

  if (fileInfo.selector) {
    lines.push(`**Seletor:** \`${fileInfo.selector}\``);
  }

  lines.push(`**Tipo:** ${translateType(fileInfo.type)}`);
  lines.push(`**Pacote:** \`@po-ui/ng-components\``);
  lines.push(`**Referência:** ${PORTAL_URL}/documentation/${fileInfo.slug}`);
  lines.push('');

  // Descrição principal
  const description = normalizeDescription(doc.description || '');
  if (description) {
    lines.push(description);
    lines.push('');
  }

  // Inputs (propriedades de entrada)
  const inputs = (doc.properties || []).filter(p => p.isDirectiveInput);
  if (inputs.length > 0) {
    lines.push('## Inputs');
    lines.push('');
    lines.push('| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |');
    lines.push('|---|---|---|---|---|---|');

    inputs.forEach(prop => {
      const alias = prop.directiveInputAlias ? `\`${prop.directiveInputAlias}\`` : '-';
      const type = prop.type ? `\`${formatType(prop.type)}\`` : '-';
      const optional = prop.isOptional ? 'sim' : 'não';
      const defaultVal = getTagValue(prop, 'default') || '-';
      const desc = oneLineDescription(prop.description || '');

      lines.push(
        `| \`${prop.name}\` | ${alias} | ${type} | ${optional} | ${defaultVal} | ${desc} |`
      );
    });

    lines.push('');
  }

  // Outputs (eventos)
  const outputs = (doc.properties || []).filter(p => p.isDirectiveOutput);
  if (outputs.length > 0) {
    lines.push('## Outputs');
    lines.push('');
    lines.push('| Evento | Alias | Tipo | Descrição |');
    lines.push('|---|---|---|---|');

    outputs.forEach(prop => {
      const alias = prop.directiveOutputAlias ? `\`${prop.directiveOutputAlias}\`` : '-';
      const type = prop.type ? `\`${formatType(prop.type)}\`` : 'EventEmitter';
      const desc = oneLineDescription(prop.description || '');

      lines.push(`| \`${prop.name}\` | ${alias} | ${type} | ${desc} |`);
    });

    lines.push('');
  }

  // Propriedades de interfaces/modelos
  if ((doc.isInterface || doc.isModel) && doc.properties && doc.properties.length > 0) {
    lines.push('## Propriedades');
    lines.push('');
    lines.push('| Propriedade | Tipo | Opcional | Descrição |');
    lines.push('|---|---|---|---|');

    doc.properties.forEach(prop => {
      const type = prop.type ? `\`${formatType(prop.type)}\`` : '-';
      const optional = prop.isOptional ? 'sim' : 'não';
      const desc = oneLineDescription(prop.description || '');

      lines.push(`| \`${prop.name}\` | ${type} | ${optional} | ${desc} |`);
    });

    lines.push('');
  }

  // Valores de enum
  if (doc.isEnum && doc.enums && doc.enums.length > 0) {
    lines.push('## Valores');
    lines.push('');
    lines.push('| Valor | Descrição |');
    lines.push('|---|---|');

    doc.enums.forEach(enumMember => {
      const desc = oneLineDescription(enumMember.description || '');
      lines.push(`| \`${enumMember.name}\` | ${desc} |`);
    });

    lines.push('');
  }

  // Métodos (serviços)
  const methods = (doc.methods || []).filter(m => m.description);
  if (methods.length > 0) {
    lines.push('## Métodos');
    lines.push('');

    methods.forEach(method => {
      const params = (method.params || [])
        .map(p => {
          try {
            return `${p.name}${p.isOptional ? '?' : ''}: ${formatType(p.type)}`;
          } catch (err) {
            console.error('[llms-generator] erro ao formatar parâmetro', {
              method: method.name,
              param: p && p.name,
              rawType: p && p.type
            });
            return `${p.name || 'param'}: unknown`;
          }
        })
        .join(', ');
      const returnType = method.returnType ? `: ${formatType(method.returnType)}` : '';

      lines.push(`### \`${method.name}(${params})${returnType}\``);
      lines.push('');
      lines.push(normalizeDescription(method.description || ''));
      lines.push('');
    });
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Geração de llms.txt (índice)
// ---------------------------------------------------------------------------

function generateLlmsTxt({ components, services, interfaces, enums }) {
  const lines = [];

  lines.push('# PO UI - Biblioteca de Componentes Angular');
  lines.push('');
  lines.push(
    '> PO UI é uma biblioteca de componentes Angular desenvolvida pela TOTVS, ' +
      'com foco em aplicações corporativas. Oferece mais de 60 componentes prontos para uso, ' +
      'além de serviços, diretivas, interfaces e enums. ' +
      `Documentação completa em ${PORTAL_URL}.`
  );
  lines.push('');
  lines.push('## Instalação');
  lines.push('');
  lines.push('```bash');
  lines.push('ng add @po-ui/ng-components');
  lines.push('```');
  lines.push('');

  if (components.length > 0) {
    lines.push('## Componentes e Diretivas');
    lines.push('');
    components.forEach(c => {
      lines.push(`- [${c.name}](${c.url}): ${c.description}`);
    });
    lines.push('');
  }

  if (services.length > 0) {
    lines.push('## Serviços');
    lines.push('');
    services.forEach(s => {
      lines.push(`- [${s.name}](${s.url}): ${s.description}`);
    });
    lines.push('');
  }

  if (interfaces.length > 0) {
    lines.push('## Interfaces e Modelos');
    lines.push('');
    interfaces.forEach(i => {
      lines.push(`- [${i.name}](${i.url}): ${i.description}`);
    });
    lines.push('');
  }

  if (enums.length > 0) {
    lines.push('## Enums');
    lines.push('');
    enums.forEach(e => {
      lines.push(`- [${e.name}](${e.url}): ${e.description}`);
    });
    lines.push('');
  }

  lines.push('## Guias');
  lines.push('');
  lines.push(`- [Instalação e configuração](${PORTAL_URL}/guides/getting-started): Como instalar e configurar o PO UI em um projeto Angular`);
  lines.push(`- [Personalização de tema com tokens CSS](${PORTAL_URL}/guides/theme-customization): Como customizar cores, espaçamentos e estilos via tokens CSS`);
  lines.push(`- [Acessibilidade](${PORTAL_URL}/guides/accessibility): Diretrizes de acessibilidade WCAG aplicadas nos componentes`);
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Geração de llms-full.txt (documentação completa)
// ---------------------------------------------------------------------------

function generateLlmsFullTxt(allEntries, docs) {
  const header = [
    '# PO UI - Documentação Completa',
    '',
    `> Gerado automaticamente a partir do código-fonte. Versão atual em ${PORTAL_URL}/llms.txt`,
    '',
    '---',
    '',
  ].join('\n');

  const docsByName = new Map(docs.map(d => [d.name, d]));

  const sections = allEntries
    .map(entry => {
      const doc = docsByName.get(entry.name);
      if (!doc) {
        console.warn(`[llms-generator] ⚠️  Doc não encontrado para: ${entry.name}`);
        return null;
      }

      const fileInfo = resolveDocFileInfo(doc);
      if (!fileInfo) {
        console.warn(`[llms-generator] ⚠️  FileInfo não resolvido para: ${entry.name}`);
        return null;
      }

      return generateComponentMarkdown(doc, fileInfo);
    })
    .filter(Boolean); // Remove nulls antes de fazer join

  return header + sections.join('\n\n---\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/**
 * Formata o tipo para string, tratando casos onde o Dgeni retorna
 * objetos, arrays ou estruturas complexas ao invés de string simples.
 */
function formatType(type) {
  if (type == null) return '';

  if (typeof type === 'string') {
    return type.trim();
  }

  if (Array.isArray(type)) {
    return type
      .map(item => formatType(item))
      .filter(Boolean)
      .join(' | ');
  }

  if (typeof type === 'object') {
    if (typeof type.name === 'string') return type.name.trim();
    if (typeof type.type === 'string') return type.type.trim();
    return JSON.stringify(type);
  }

  return String(type).trim();
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

function camelToKebab(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function translateType(type) {
  const map = {
    component: 'Componente / Diretiva',
    service: 'Serviço',
    interface: 'Interface / Modelo',
    enum: 'Enum',
  };
  return map[type] || type;
}

/**
 * Extrai o valor de uma tag JSDoc customizada (ex: @default, @optional).
 */
function getTagValue(doc, tagName) {
  const tags = (doc.tags && doc.tags.tags) || [];
  const tag = tags.find(t => t.tagName === tagName);
  return tag ? tag.description || tag.name || '' : null;
}

/**
 * Converte descrição para uma única linha, removendo formatação Markdown pesada.
 */
function oneLineDescription(text) {
  return normalizeDescription(text)
    .split('\n')[0]
    .replace(/\|/g, '\\|') // escapa pipes dentro de células de tabela
    .trim();
}
