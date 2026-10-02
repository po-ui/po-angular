/** Cruza os arquivos alterados com o grafo: componentes afetados, consumidores, risco e onde testar. */

const { LIB_DIR, DOCS_URL, AGGREGATOR_UNITS, NON_FUNCTIONAL, RISK_ORDER } = require('./constants');
const { unitOf, displayName } = require('./units');
const { collectImpact } = require('./graph');
const { classifyFile, apiAliases } = require('./changed-files');

function groupByUnit(libFiles) {
  const units = new Map();
  for (const file of libFiles) {
    const rel = file.filename.slice(LIB_DIR.length + 1);
    const unit = unitOf(rel);
    if (!units.has(unit)) {
      units.set(unit, {
        categories: new Set(),
        files: [],
        functionalFiles: [],
        addedAliases: new Set(),
        removedAliases: new Set(),
        removedFiles: []
      });
    }

    const info = units.get(unit);
    const category = classifyFile(rel, file.patch);
    const functional = !NON_FUNCTIONAL.has(category);
    info.categories.add(category);
    info.files.push(rel);
    if (functional) {
      info.functionalFiles.push(rel);
    }
    if (functional && file.status === 'removed') {
      info.removedFiles.push(rel);
    }

    const aliases = apiAliases(file.patch);
    aliases.added.forEach(a => info.addedAliases.add(a));
    aliases.removed.forEach(a => info.removedAliases.add(a));
  }
  return units;
}

function scoreRisk(info, impactedCount) {
  const reasons = [];
  if (!info.functionalFiles.length) {
    return { risk: 'low', reasons };
  }

  let score = 1;
  if (impactedCount >= 25) {
    score += 3;
    reasons.push(`dependência compartilhada por ${impactedCount} unidades`);
  } else if (impactedCount >= 10) {
    score += 2;
    reasons.push(`${impactedCount} unidades dependem dela`);
  } else if (impactedCount >= 3) {
    score += 1;
  }
  if (info.removedAliases.size || info.removedFiles.length) {
    score += 2;
    reasons.push('possível breaking change');
  }
  if (info.categories.has('exports')) {
    score += 1;
    reasons.push('altera exports/módulos');
  }

  const risk = score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
  return { risk, reasons };
}

function describeUnit(graph, unit, info) {
  const impact = collectImpact(graph, info.functionalFiles);
  impact.delete(unit);
  const impacted = [...impact].filter(([u]) => !AGGREGATOR_UNITS.has(u));
  const direct = impacted.filter(([, distance]) => distance === 1).map(([u]) => displayName(u));

  return {
    unit,
    name: displayName(unit),
    categories: [...info.categories],
    files: info.files,
    addedAliases: [...info.addedAliases],
    removedAliases: [...info.removedAliases],
    removedFiles: info.removedFiles,
    directConsumers: direct.sort(),
    transitiveCount: impacted.length,
    functional: info.functionalFiles.length > 0,
    ...scoreRisk(info, impacted.length)
  };
}

const maxRisk = risks => risks.reduce((acc, r) => (RISK_ORDER.indexOf(r) > RISK_ORDER.indexOf(acc) ? r : acc), 'low');

function analyze(changedFiles, graph) {
  const libFiles = changedFiles.filter(f => f.filename.startsWith(`${LIB_DIR}/`));
  const units = groupByUnit(libFiles);

  const changed = [...units]
    .map(([unit, info]) => describeUnit(graph, unit, info))
    .sort((a, b) => RISK_ORDER.indexOf(b.risk) - RISK_ORDER.indexOf(a.risk));

  const allFunctionalFiles = [...units.values()].flatMap(info => info.functionalFiles);
  const affected = [...collectImpact(graph, allFunctionalFiles)].filter(
    ([unit]) => !units.has(unit) && !AGGREGATOR_UNITS.has(unit)
  );
  const direct = affected.filter(([, d]) => d === 1).map(([u]) => u);
  const indirect = affected.filter(([, d]) => d > 1).map(([u]) => u);

  // Só entram componentes com página no portal: primeiro os alterados, depois os consumidores diretos.
  const testTargets = [...changed.filter(c => c.functional).map(c => c.unit), ...[...direct].sort()]
    .filter(u => graph.unitsWithSamples.has(u))
    .map(u => ({ name: displayName(u), url: `${DOCS_URL}/${displayName(u)}` }));

  return {
    changed,
    directConsumers: direct.map(displayName).sort(),
    indirectConsumers: indirect.map(displayName).sort(),
    testTargets,
    overallRisk: maxRisk(changed.map(c => c.risk)),
    stats: {
      files: changedFiles.length,
      libFiles: libFiles.length,
      outsideFiles: changedFiles.length - libFiles.length,
      additions: changedFiles.reduce((sum, f) => sum + f.additions, 0),
      deletions: changedFiles.reduce((sum, f) => sum + f.deletions, 0)
    }
  };
}

module.exports = { analyze };
