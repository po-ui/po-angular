/** Lê os arquivos alterados (API do GitHub ou git local) e classifica o tipo de cada mudança. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const API_LINE = /@Input\(|@Output\(|\binput(<|\(|\.required)|\boutput(<|\()|\bmodel(<|\(|\.required)/;
const ALIAS = /alias:\s*'([^']+)'|@(?:Input|Output)\(\s*'([^']+)'/g;
const GIT_STATUS = { A: 'added', D: 'removed', M: 'modified', R: 'renamed' };

function fromGitHubApi(filesJson) {
  return JSON.parse(fs.readFileSync(filesJson, 'utf8')).map(f => ({
    filename: f.filename,
    status: f.status,
    additions: f.additions || 0,
    deletions: f.deletions || 0,
    patch: f.patch || ''
  }));
}

function fromGit(base, head = 'HEAD') {
  const range = `${base}...${head}`;
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  return git('diff', '--numstat', range)
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [additions, deletions, filename] = line.split('\t');
      const status = git('diff', '--name-status', range, '--', filename).trim().charAt(0);
      return {
        filename,
        status: GIT_STATUS[status] || 'modified',
        additions: Number(additions) || 0,
        deletions: Number(deletions) || 0,
        patch: git('diff', '-U0', range, '--', filename)
      };
    });
}

const changedLines = patch => patch.split('\n').filter(l => /^[+-](?![+-]{2} )/.test(l));

function classifyFile(relPath, patch) {
  if (relPath.endsWith('.spec.ts') || relPath.startsWith('util-test/')) {
    return 'test';
  }
  if (relPath.includes('/samples/')) {
    return 'sample';
  }
  if (relPath.endsWith('.md')) {
    return 'doc';
  }
  if (relPath.endsWith('.html')) {
    return 'template';
  }
  if (/\.(s?css|less)$/.test(relPath)) {
    return 'style';
  }
  if (/literals|\.constant\.ts$/.test(relPath)) {
    return 'literals';
  }
  if (path.basename(relPath) === 'index.ts' || relPath.endsWith('.module.ts')) {
    return 'exports';
  }
  if (/\.(interface|enum)\.ts$/.test(relPath) || /\/(interfaces|enums)\//.test(relPath)) {
    return 'contract';
  }

  const lines = changedLines(patch);
  if (lines.length && lines.every(l => /^[+-]\s*(\*|\/\/|\/\*|$)/.test(l))) {
    return 'doc';
  }
  return lines.some(l => API_LINE.test(l)) ? 'api' : 'logic';
}

// Propriedades p-* adicionadas e removidas no diff. Removida sem ser readicionada = possível breaking change.
function apiAliases(patch) {
  const added = new Set();
  const removed = new Set();
  for (const line of changedLines(patch)) {
    const target = line.startsWith('+') ? added : removed;
    for (const m of line.matchAll(ALIAS)) {
      target.add(m[1] || m[2]);
    }
  }
  return {
    added: [...added].filter(a => !removed.has(a)),
    removed: [...removed].filter(a => !added.has(a))
  };
}

module.exports = { fromGitHubApi, fromGit, classifyFile, apiAliases };
