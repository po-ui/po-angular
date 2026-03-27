#!/usr/bin/env node
'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const isCI = process.env.CI || process.env.CONTINUOUS_INTEGRATION || process.env.GITHUB_ACTIONS || process.env.TRAVIS;

if (isCI || !process.stdin.isTTY) {
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n\uD83D\uDD0D Deseja habilitar telemetria anônima para ajudar a equipe do PO UI? (s/N): ', answer => {
  const enabled = answer.trim().toLowerCase() === 's' || answer.trim().toLowerCase() === 'y';

  // Tenta gravar na raiz do projeto do consumidor
  const projectRoot = findProjectRoot();
  if (projectRoot) {
    const configPath = path.join(projectRoot, '.po-ui-telemetry.json');
    const config = {
      enabled,
      consentDate: new Date().toISOString()
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    if (enabled) {
      console.log('\u2705 Telemetria habilitada. Obrigado por ajudar!');
    } else {
      console.log('Telemetria não habilitada. Você pode habilitar depois com: ng add @po-ui/ng-components');
    }
  }

  rl.close();
});

// Timeout de 30 segundos para não travar a instalação
setTimeout(() => {
  console.log('\nTimeout atingido. Telemetria não habilitada.');
  rl.close();
  process.exit(0);
}, 30000);

function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, 'package.json')) &&
      !fs.existsSync(path.join(dir, 'node_modules', '.package-lock.json'))
    ) {
      // Verificar se não é o próprio node_modules
      if (!dir.includes('node_modules')) {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }
  return null;
}
