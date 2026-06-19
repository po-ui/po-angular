import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { logging } from '@angular-devkit/core';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';
import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { updateDepedenciesVersion } from './changes';
import { migrateHtmlContent } from './gauge-html-migration';
import { migrateTypeScriptContent } from './gauge-ts-migration';
import { createMigrationReport, MigrationReport, MigrationWarning, printMigrationSummary } from './migration-report';

import * as readline from 'readline';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(query, (answer: string) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function main(): Promise<Rule> {
  const message =
    '\n⚠️  Antes de atualizar o PO UI para a versão 22, é necessário que o Angular do seu projeto ' +
    'já esteja na versão 22.\n' +
    'Siga o guia oficial de atualização do Angular: https://angular.dev/update-guide\n\n' +
    'Você já executou "ng update @angular/core@22 @angular/cli@22" e as migrações necessárias do Angular 22? (yes/no) ';

  let answer = 'yes';

  if (process.stdin.isTTY) {
    answer = await askQuestion(message);
  } else {
    console.log(message);
    console.log('Execução em modo não-interativo detectada. Assumindo "yes" como padrão.\n');
  }

  const confirmed = ['yes', 'y', 'sim', 's', ''].includes(answer.trim().toLowerCase());

  if (!confirmed) {
    console.log(
      '\n❌ Atualização cancelada. Execute primeiro as migrações do Angular 22:\n' +
        '   ng update @angular/core@22 @angular/cli@22\n' +
        '   Consulte: https://angular.dev/update-guide\n'
    );
    return chain([]);
  }

  return chain([
    updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), // Req 8.1
    gaugeMigrationRule(), // Req 8.2 (após versões, antes da instalação)
    postUpdate() // Req 8.3 (NodePackageInstallTask)
  ]);
}

export default function (): Rule {
  return (_tree: Tree, _context: SchematicContext) => main();
}

/**
 * Regra adicionada à `chain` do `migration-v22` responsável por localizar e
 * transformar os usos do componente removido `po-gauge` para `po-chart` com
 * `p-type="gauge"`.
 *
 * Comportamento (Req. 1.1, 1.2, 1.3, 1.4):
 * - Obtém a configuração do workspace via `getWorkspaceConfigGracefully`.
 * - Se a configuração não pôde ser obtida, registra erro e encerra sem alterar
 *   nenhum arquivo.
 * - Se não há nenhum projeto definido, registra aviso e encerra sem alterar
 *   nenhum arquivo.
 * - Caso contrário, itera por todos os `Projeto_Consumidor`, delegando a
 *   migração de cada projeto para `migrateProject`, e ao final apresenta o
 *   `Resumo_Migracao` (Req. 6.4, 9.1).
 *
 * Observação: a composição desta regra na `chain` é realizada na task 8.1.
 */
export function gaugeMigrationRule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspace = getWorkspaceConfigGracefully(tree);

    if (!workspace) {
      // Req. 1.2 — falha ao obter a configuração do workspace
      logger.error('Não foi possível obter a configuração do workspace. Nenhum arquivo foi alterado.');
      return tree;
    }

    const projectNames = Object.keys(workspace.projects ?? {});

    if (projectNames.length === 0) {
      // Req. 1.3 — nenhum projeto definido no workspace
      logger.info('Nenhum projeto encontrado no workspace. Nenhum arquivo foi alterado.');
      return tree;
    }

    const report = createMigrationReport();

    // Req. 1.4 — itera por todos os projetos do workspace
    for (const projectName of projectNames) {
      migrateProject(tree, workspace, projectName, report, logger);
    }

    // Req. 6.4 / 9.1 — apresenta o Resumo_Migracao ao final da execução
    printMigrationSummary(report, logger);

    return tree;
  };
}

/**
 * Contexto de um `Projeto_Consumidor` propagado para a varredura de arquivos.
 * Reúne os dados de projeto já resolvidos (tipo, diretório-fonte e arquitetura)
 * para que `scanDirectory` e as transformações não precisem recalculá-los.
 */
interface ProjectContext {
  /** Nome do projeto no workspace. */
  projectName: string;
  /** Tipo do projeto conforme o `angular.json`. */
  projectType: 'application' | 'library';
  /** Diretório-fonte base: `${sourceRoot}/${app|lib}`. */
  sourceDir: string;
  /** `true` quando o projeto é uma aplicação standalone. */
  isStandalone: boolean;
}

/**
 * Migração por projeto (`Projeto_Consumidor`).
 *
 * Comportamento (Req. 1.6, 1.7, 1.8, 5.4, 5.5, 5.6):
 * - Resolve a pasta de entrada (`lib` para `library`, `app` para `application`)
 *   e monta `sourceDir = ${sourceRoot}/${entryFolder}`, seguindo o mesmo padrão
 *   de `v20`/`v21`.
 * - Se o diretório-fonte não existe ou está vazio, registra aviso identificando
 *   o projeto e prossegue para o próximo, sem encerrar a execução (Req. 1.6).
 * - Resolve o `mainFile` via `getProjectMainFile` e determina a arquitetura com
 *   `isStandaloneApp` (Req. 5.4). Se o `mainFile` não pode ser localizado/lido,
 *   interrompe a migração deste projeto com erro (Req. 5.5). Se a arquitetura
 *   não pode ser determinada, idem, com mensagem específica (Req. 5.6). Em
 *   ambos os casos os arquivos do projeto permanecem inalterados.
 * - Dispara a varredura recursiva (`scanDirectory`).
 */
function migrateProject(
  tree: Tree,
  workspace: WorkspaceSchema,
  projectName: string,
  report: MigrationReport,
  logger: logging.LoggerApi
): void {
  const project = getProjectFromWorkspace(workspace, projectName);

  if (!project) {
    return;
  }

  // Req. 1.7 / 1.8 — pasta de entrada conforme o tipo do projeto.
  const projectType: 'application' | 'library' = project.projectType === 'library' ? 'library' : 'application';
  const entryFolder = projectType === 'library' ? 'lib' : 'app';
  const sourceDir = `${project.sourceRoot}/${entryFolder}`;

  // Req. 1.6 — diretório-fonte inexistente ou vazio: avisa e segue adiante.
  const directory = tree.getDir(sourceDir);
  if (directory.subfiles.length === 0 && directory.subdirs.length === 0) {
    logger.warn(
      `[po-gauge] Projeto "${projectName}": o diretório-fonte "${sourceDir}" não existe ou está vazio. ` +
        `Nenhum arquivo foi alterado neste projeto.`
    );
    return;
  }

  // Req. 5.4 / 5.5 — localizar o arquivo de entrada principal (main).
  let mainFile: string;
  try {
    mainFile = getProjectMainFile(project);
  } catch (error) {
    logger.error(
      `[po-gauge] Projeto "${projectName}": não foi possível localizar o arquivo de entrada principal ` +
        `(main) a partir do angular.json. Nenhum arquivo foi alterado neste projeto. ` +
        `Detalhe: ${(error as Error)?.message ?? error}`
    );
    return;
  }

  if (!mainFile || !tree.exists(mainFile)) {
    logger.error(
      `[po-gauge] Projeto "${projectName}": o arquivo de entrada principal (main) não foi encontrado ou ` +
        `não pôde ser lido. Nenhum arquivo foi alterado neste projeto.`
    );
    return;
  }

  // Req. 5.4 / 5.6 — determinar a arquitetura (NgModule x standalone).
  let isStandalone: boolean;
  try {
    isStandalone = isStandaloneApp(tree, mainFile);
  } catch (error) {
    logger.error(
      `[po-gauge] Projeto "${projectName}": não foi possível determinar a arquitetura do projeto ` +
        `(NgModule ou standalone) a partir de "${mainFile}". Nenhum arquivo foi alterado neste projeto. ` +
        `Detalhe: ${(error as Error)?.message ?? error}`
    );
    return;
  }

  const ctx: ProjectContext = {
    projectName,
    projectType,
    sourceDir,
    isStandalone
  };

  // Dispara a varredura recursiva dos arquivos `.html`/`.ts` do projeto.
  scanDirectory(tree, sourceDir, ctx, report, logger);
}

/**
 * Varredura recursiva do diretório-fonte de um `Projeto_Consumidor`.
 *
 * Comportamento (Req. 1.4, 1.5, 2.8, 4.6, 7.3, 7.5, 9.1):
 * - Percorre recursivamente todos os subdiretórios sem limite de profundidade,
 *   reaproveitando o padrão de `v20`/`v21` (`tree.getDir(...)` com
 *   `subfiles`/`subdirs`) (Req. 1.4).
 * - Processa apenas arquivos com extensão `.html` ou `.ts` (comparação
 *   case-insensitive); demais arquivos são ignorados sem alteração (Req. 1.5).
 * - Para cada arquivo processado incrementa `report.filesScanned`, lê o
 *   conteúdo via `tree.read` e delega às transformações puras
 *   (`migrateHtmlContent` para `.html`, `migrateTypeScriptContent` para `.ts`).
 * - Preenche o campo `filePath` das advertências com o caminho relativo do
 *   arquivo (as funções puras o deixam vazio) e as acumula em `report.warnings`
 *   (Req. 9.1).
 * - Escreve com `tree.overwrite` somente quando o conteúdo transformado difere
 *   do original (Req. 2.8, 4.6, 7.3), incrementando `report.filesChanged`.
 * - Em caso de exceção na escrita, preserva o arquivo original (sem aplicar
 *   alterações parciais) e registra erro identificando o arquivo, sem
 *   incrementar `report.filesChanged` (Req. 7.5).
 */
function scanDirectory(
  tree: Tree,
  dirPath: string,
  ctx: ProjectContext,
  report: MigrationReport,
  logger: logging.LoggerApi
): void {
  const directory = tree.getDir(dirPath);

  // Req. 1.5 — processa apenas arquivos `.html`/`.ts` (case-insensitive).
  directory.subfiles.forEach((file: string) => {
    const lowerName = file.toLowerCase();
    const isHtml = lowerName.endsWith('.html');
    const isTs = lowerName.endsWith('.ts');

    if (!isHtml && !isTs) {
      return;
    }

    const filePath = `${directory.path}/${file}`;
    const buffer = tree.read(filePath);
    if (!buffer) {
      return;
    }

    const original = buffer.toString('utf-8');

    // Req. 9.1 — contabiliza cada arquivo `.html`/`.ts` analisado.
    report.filesScanned++;

    const result = isHtml ? migrateHtmlContent(original) : migrateTypeScriptContent(original, ctx.isStandalone);

    // Preenche o `filePath` (deixado vazio pelas funções puras) e acumula.
    result.warnings.forEach((warning: MigrationWarning) => {
      report.warnings.push({ ...warning, filePath });
    });

    // Req. 2.8 / 4.6 / 7.3 — escreve somente quando o conteúdo efetivamente mudou.
    if (result.content !== original) {
      try {
        tree.overwrite(filePath, result.content);
        report.filesChanged++;
      } catch (error) {
        // Req. 7.5 — falha na escrita: preserva o original e registra o erro.
        logger.error(
          `[po-gauge] Falha ao gravar o arquivo "${filePath}". O conteúdo original foi preservado ` +
            `(nenhuma alteração parcial foi aplicada). Detalhe: ${(error as Error)?.message ?? error}`
        );
      }
    }
  });

  // Req. 1.4 — varredura recursiva dos subdiretórios, sem limite de profundidade.
  directory.subdirs.forEach((subdir: string) => {
    scanDirectory(tree, `${directory.path}/${subdir}`, ctx, report, logger);
  });
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
