#!/usr/bin/env node
/**
 * Mostra quais componentes da lib ui uma PR altera e quem consome esses componentes.
 * Gera o comentário da PR (report.md) e a mensagem do Discord (discord.json).
 * Detalhes e uso local: README.md nesta pasta.
 */
const fs = require('fs');
const path = require('path');
const { LIB_DIR } = require('./lib/constants');
const { buildGraph } = require('./lib/graph');
const { fromGitHubApi, fromGit } = require('./lib/changed-files');
const { analyze } = require('./lib/analyze');
const { buildMarkdown } = require('./lib/markdown');
const { buildDiscordPayload } = require('./lib/discord');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.files && !args.base) {
    console.error('Informe --files <arquivo.json> ou --base <ref>.');
    process.exit(1);
  }

  const outDir = args['out-dir'] || 'pr-impact';
  const pr = {
    title: process.env.PR_TITLE || '',
    author: process.env.PR_AUTHOR || '',
    url: process.env.PR_URL || '',
    number: process.env.PR_NUMBER || ''
  };

  const changedFiles = args.files ? fromGitHubApi(args.files) : fromGit(args.base, args.head);
  const result = analyze(changedFiles, buildGraph(LIB_DIR));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(outDir, 'report.md'), buildMarkdown(result, pr));
  fs.writeFileSync(path.join(outDir, 'discord.json'), JSON.stringify(buildDiscordPayload(result, pr)));

  const { overallRisk, changed, directConsumers, indirectConsumers } = result;
  console.log(
    `Risco: ${overallRisk} · alterados: ${changed.length} · ` +
      `diretos: ${directConsumers.length} · indiretos: ${indirectConsumers.length}`
  );
}

main();
