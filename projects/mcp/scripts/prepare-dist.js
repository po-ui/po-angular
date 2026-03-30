#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../../../dist/mcp');
const indexJs = path.join(distDir, 'index.js');
const rootPkgPath = path.resolve(__dirname, '../../../package.json');
const mcpPkgPath = path.resolve(__dirname, '../package.json');

// 1. Adiciona shebang ao index.js
if (!fs.existsSync(indexJs)) {
  console.error(`[prepare-dist] Arquivo nao encontrado: ${indexJs}`);
  process.exit(1);
}

const indexContent = fs.readFileSync(indexJs, 'utf8');
if (!indexContent.startsWith('#!')) {
  fs.writeFileSync(indexJs, '#!/usr/bin/env node\n' + indexContent);
  console.log('[prepare-dist] Shebang adicionado em dist/mcp/index.js');
} else {
  console.log('[prepare-dist] Shebang ja presente.');
}

// 2. Copia package.json para dist/mcp com paths corrigidos e versao substituida
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const mcpPkg = JSON.parse(fs.readFileSync(mcpPkgPath, 'utf8'));

const buildVersion = rootPkg.version;
const versionPlaceholder = '0.0.0-PLACEHOLDER';

const distPkg = { ...mcpPkg };
distPkg.version = mcpPkg.version === versionPlaceholder ? buildVersion : mcpPkg.version;
distPkg.main = './index.js';
distPkg.bin = { 'po-ui-mcp': './index.js' };

// Remove devDependencies e scripts do pacote publicado
delete distPkg.devDependencies;
delete distPkg.scripts;
delete distPkg.jest;

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(distPkg, null, 2) + '\n');
console.log(`[prepare-dist] package.json copiado para dist/mcp (versao: ${distPkg.version})`);

// 3. Copia README.md se existir
const readmeSrc = path.resolve(__dirname, '../README.md');
if (fs.existsSync(readmeSrc)) {
  fs.copyFileSync(readmeSrc, path.join(distDir, 'README.md'));
  console.log('[prepare-dist] README.md copiado para dist/mcp');
}
