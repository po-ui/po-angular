'use strict';

/**
 * Processador Dgeni: search-index-generator
 *
 * Gera o índice da busca global do portal em `src/assets/json/search-*.<hash>.json` + `search-manifest.json`.
 * Roda depois do `componentGrouper` (precisa dos grupos com `anchorId`) e lê também os guias (markdown)
 * e os ícones, as mesmas fontes de `build:guides` e `script:copy-icons`.
 */

const fs = require('fs');
const path = require('path');

const configuration = require('../../configuration');
const util = require('../../util');
const builder = require('./search-index-builder');

const OUT_DIR = path.resolve(__dirname, '../../../src/assets/json');
const ICON_SELECTION = path.resolve(__dirname, '../../../../../node_modules/@animaliads/animalia-icon/src/regular/selection.json');

/** Mesmos arquivos que `build:guides` converte em páginas. */
function guideFiles() {
  return util.projectsNames().flatMap(project => {
    const dir = path.resolve(__dirname, '../../..', configuration.sourceFolder, project, 'docs/guides');

    return fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter(f => f.endsWith('.md'))
          .sort()
          .map(f => ({ name: path.basename(f, '.md'), file: path.join(dir, f) }))
      : [];
  });
}

module.exports = function searchIndexGenerator(exampleMap) {
  return {
    $runAfter: ['componentGrouper'],
    $runBefore: ['docs-processed'],

    $process(groups) {
      const docs = [
        ...builder.buildApiDocs(groups),
        ...builder.buildSampleDocs(groups, exampleMap.values()),
        ...guideFiles().flatMap(({ name, file }) => builder.buildGuideDocs(name, fs.readFileSync(file, 'utf-8'))),
        ...(fs.existsSync(ICON_SELECTION) ? builder.buildIconDocs(JSON.parse(fs.readFileSync(ICON_SELECTION, 'utf-8'))) : []),
        ...builder.buildPageDocs()
      ];
      const manifest = builder.writeIndex(OUT_DIR, builder.buildChunks(docs));

      // Guarda de CI: índice vazio significa que a busca ficaria sem resultado em produção.
      if (!manifest.chunks.core || !manifest.chunks.api) {
        throw new Error('[search-index] índice sem os chunks core/api: verifique o build da documentação.');
      }

      Object.keys(manifest.chunks).forEach(name =>
        console.log(`[search-index] ${manifest.chunks[name].file}: ${manifest.chunks[name].count} docs, ${manifest.chunks[name].bytes} bytes`)
      );

      return groups;
    }
  };
};
