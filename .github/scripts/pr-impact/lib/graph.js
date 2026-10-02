/**
 * Monta o grafo de dependências da lib (imports e seletores usados nos templates)
 * e calcula até onde o impacto de uma mudança se propaga.
 */

const fs = require('fs');
const path = require('path');
const { toPosix, unitOf, isSink } = require('./units');

const EXPORTED_SYMBOL =
  /export\s+(?:default\s+)?(?:abstract\s+)?(?:class|interface|enum|const|function|type|let)\s+(\w+)/g;
const SELECTOR = /selector:\s*['`]([^'`]+)['`]/g;
const RELATIVE_IMPORT = /(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s+'(\.[^']*)'/g;
const TEMPLATE_OR_STYLE_URL = /(?:templateUrl|styleUrl)\s*:\s*'(\.[^']*)'/g;
const PO_TAG = /<(po-[\w-]+)/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(toPosix(full));
    }
  }
  return files;
}

const stripComments = source => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

function isGraphSource(relPath) {
  return (
    (relPath.endsWith('.ts') || relPath.endsWith('.html')) &&
    !relPath.endsWith('.spec.ts') &&
    !relPath.includes('/samples/') &&
    !relPath.startsWith('util-test/')
  );
}

function resolveImport(absLib, fromFile, specifier) {
  const base = path.resolve(absLib, path.dirname(fromFile), specifier);
  for (const candidate of [`${base}.ts`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) {
      const rel = toPosix(path.relative(absLib, candidate));
      return rel.startsWith('..') ? null : rel;
    }
  }
  return null;
}

function indexDeclarations(sources) {
  // Permite saber o arquivo real de imports como '../../services'.
  const symbolFile = new Map();
  const selectorFile = new Map();

  for (const [file, source] of sources) {
    if (!file.endsWith('.ts') || isSink(file)) {
      continue;
    }
    for (const [, symbol] of source.matchAll(EXPORTED_SYMBOL)) {
      if (!symbolFile.has(symbol)) {
        symbolFile.set(symbol, file);
      }
    }
    for (const [, selectors] of source.matchAll(SELECTOR)) {
      selectors
        .split(',')
        .map(s => s.trim())
        .filter(s => /^po-[\w-]+$/.test(s))
        .forEach(s => selectorFile.set(s, file));
    }
  }
  return { symbolFile, selectorFile };
}

// Retorna arquivo → arquivos que dependem dele (por import ou por seletor usado no template).
function buildGraph(libDir) {
  const absLib = path.resolve(libDir);
  const allFiles = walk(absLib).map(f => toPosix(path.relative(absLib, f)));
  const sources = new Map(
    allFiles.filter(isGraphSource).map(f => [f, stripComments(fs.readFileSync(path.join(absLib, f), 'utf8'))])
  );
  const { symbolFile, selectorFile } = indexDeclarations(sources);

  const unitsWithSamples = new Set(
    allFiles
      .map(f => f.match(/^(.*?)\/samples\//))
      .filter(Boolean)
      .map(([, dir]) => unitOf(`${dir}/x.ts`))
  );

  const dependents = new Map();
  const addEdge = (from, to) => {
    if (!to || from === to) {
      return;
    }
    if (!dependents.has(to)) {
      dependents.set(to, new Set());
    }
    dependents.get(to).add(from);
  };

  for (const [file, source] of sources) {
    if (file.endsWith('.ts')) {
      for (const [, names, specifier] of source.matchAll(RELATIVE_IMPORT)) {
        const target = resolveImport(absLib, file, specifier);
        if (target && path.basename(target) === 'index.ts') {
          names
            .replace(/[{}*]/g, '')
            .split(',')
            .forEach(name => addEdge(file, symbolFile.get(name.trim().split(/\s+as\s+/)[0])));
        } else if (target) {
          addEdge(file, target);
        }
      }
      for (const [, url] of source.matchAll(TEMPLATE_OR_STYLE_URL)) {
        addEdge(file, toPosix(path.join(path.dirname(file), url)));
      }
    }
    for (const [, tag] of source.matchAll(PO_TAG)) {
      addEdge(file, selectorFile.get(tag));
    }
  }

  return { dependents, unitsWithSamples };
}

// Retorna unidade → distância. A distância só aumenta quando o impacto passa para outra unidade.
function collectImpact(graph, startFiles) {
  const best = new Map(startFiles.map(f => [f, 0]));
  const unitDistance = new Map();
  let frontier = [...startFiles];

  for (let level = 0; frontier.length; level++) {
    const next = [];
    const stack = [...frontier];
    while (stack.length) {
      const file = stack.pop();
      const unit = unitOf(file);
      if (!unitDistance.has(unit)) {
        unitDistance.set(unit, level);
      }
      if (isSink(file)) {
        continue;
      }
      for (const consumer of graph.dependents.get(file) || []) {
        const sameUnit = unitOf(consumer) === unit;
        const distance = sameUnit ? level : level + 1;
        if (best.has(consumer) && best.get(consumer) <= distance) {
          continue;
        }
        best.set(consumer, distance);
        (sameUnit ? stack : next).push(consumer);
      }
    }
    frontier = next.filter(f => best.get(f) === level + 1);
  }
  return unitDistance;
}

module.exports = { buildGraph, collectImpact };
