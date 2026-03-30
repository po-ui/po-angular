#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../../../dist/mcp/index.js');

if (!fs.existsSync(target)) {
  console.error(`[add-shebang] Arquivo não encontrado: ${target}`);
  process.exit(1);
}

const content = fs.readFileSync(target, 'utf8');

if (!content.startsWith('#!')) {
  fs.writeFileSync(target, '#!/usr/bin/env node\n' + content);
  console.log('[add-shebang] Shebang adicionado em dist/mcp/index.js');
} else {
  console.log('[add-shebang] Shebang já presente, nada a fazer.');
}
