#!/usr/bin/env node
'use strict';

// Não exibir mensagem em CI ou quando stdin não é interativo
const isCI =
  process.env.CI ||
  process.env.CONTINUOUS_INTEGRATION ||
  process.env.BUILD_NUMBER ||
  process.env.GITHUB_ACTIONS ||
  process.env.TRAVIS ||
  process.env.CIRCLECI ||
  process.env.JENKINS_URL;

if (isCI) {
  process.exit(0);
}

const message = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Obrigado por instalar @po-ui/ng-components!                    ║
║                                                                  ║
║   Ajude-nos a melhorar o PO UI habilitando telemetria anônima.   ║
║   Para ativar, execute:                                          ║
║                                                                  ║
║     ng add @po-ui/ng-components                                  ║
║                                                                  ║
║   Durante o ng add, você poderá escolher habilitar telemetria.   ║
║                                                                  ║
║   Saiba mais: https://po-ui.io/guides/telemetry                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

console.log(message);
