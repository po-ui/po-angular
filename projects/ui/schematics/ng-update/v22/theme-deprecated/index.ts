import { logging, normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import {
  createMigrationReport,
  MigrationReport,
  MigrationSummaryLabels,
  MigrationWarning,
  printMigrationSummary
} from '../migration-report';
import { injectDeprecatedTheme } from './theme-bootstrap-migration';
import { migrateAngularJsonStyles, migrateStylesheetContent } from './theme-style-migration';
import { importsPoThemeService, migrateThemeTsContent } from './theme-ts-migration';
import { parseSource, ThemeMigrationResult } from './ts-utils';

const LOG_PREFIX = '[tema-anterior]';
const WORKSPACE_FILES = ['/angular.json', '/.angular.json'];
const STYLE_EXTENSIONS = ['.css', '.scss', '.sass', '.less'];
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.angular', '.git']);

/** Rótulos do `Resumo_Migracao` específicos da migração do tema anterior. */
const THEME_SUMMARY_LABELS: MigrationSummaryLabels = {
  summaryLine: (filesScanned, filesChanged) =>
    `${LOG_PREFIX} ${filesScanned} arquivo(s) analisado(s), ${filesChanged} arquivo(s) alterado(s).`,
  successLine: `${LOG_PREFIX} As constantes e os estilos foram reapontados para o tema anterior (depreciado).`,
  emptyLine: `${LOG_PREFIX} Nenhuma referência ao tema padrão foi encontrada. Nenhum arquivo foi alterado.`,
  warningsIntro: count => `${LOG_PREFIX} ${count} ocorrência(s) exigem revisão manual:`
};

/**
 * Contexto de um `Projeto_Consumidor` propagado para a varredura de arquivos.
 */
interface ProjectContext {
  /** Nome do projeto no workspace. */
  projectName: string;
  /** Tipo do projeto conforme o `angular.json`. */
  projectType: 'application' | 'library';
  /** Diretório-fonte base do projeto. */
  sourceDir: string;
  /** Acumula se algum `.ts` do projeto importa o `PoThemeService`. */
  usesThemeService: boolean;
}

/**
 * Regra da migração do tema anterior do PO UI (depreciado até a v24).
 *
 * Reaponta o projeto para o tema padrão anterior: constantes `*Deprecated`,
 * arquivos CSS `-deprecated` do `@po-ui/style` e, nas aplicações que não usam o
 * `PoThemeService`, a aplicação do tema anterior no componente principal.
 *
 * Diferente das demais migrações, esta regra NÃO é registrada no
 * `migrations.json`: ela é composta na `chain` da `migration-v22` obrigatória,
 * condicionada à resposta do desenvolvedor (ver `prompt.ts`). O gatilho e a
 * guarda de execução em lote ficam a cargo de quem compõe a `chain`.
 */
export function themeDeprecatedRule(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspacePath = WORKSPACE_FILES.find(file => tree.exists(file));
    const workspace = getWorkspaceConfigGracefully(tree);

    if (!workspacePath || !workspace) {
      logger.error(`${LOG_PREFIX} Não foi possível obter a configuração do workspace. Nenhum arquivo foi alterado.`);
      return tree;
    }

    const report = createMigrationReport();
    const injectedProjects: Array<{ projectName: string; filePath: string }> = [];
    const projectsUsingService: Array<string> = [];

    // Req. 4 — troca os CSS do `@po-ui/style` no `angular.json` (uma única vez).
    writeResult(tree, workspacePath, readText(tree, workspacePath), migrateAngularJsonStyles, report, logger);

    const visited = new Set<string>();

    for (const projectName of Object.keys(workspace.projects ?? {})) {
      migrateProject(tree, workspace, projectName, visited, report, injectedProjects, projectsUsingService, logger);
    }

    printSummary(report, injectedProjects, projectsUsingService, logger);

    return tree;
  };
}

function migrateProject(
  tree: Tree,
  workspace: WorkspaceSchema,
  projectName: string,
  visited: Set<string>,
  report: MigrationReport,
  injectedProjects: Array<{ projectName: string; filePath: string }>,
  projectsUsingService: Array<string>,
  logger: logging.LoggerApi
): void {
  const project = getProjectFromWorkspace(workspace, projectName);

  if (!project) {
    return;
  }

  const projectType: 'application' | 'library' = project.projectType === 'library' ? 'library' : 'application';
  const sourceDir = normalize(`/${project.sourceRoot ?? `${project.root ? `${project.root}/` : ''}src`}`);

  const directory = tree.getDir(sourceDir);
  if (directory.subfiles.length === 0 && directory.subdirs.length === 0) {
    logger.warn(`${LOG_PREFIX} Projeto "${projectName}": o diretório "${sourceDir}" não existe ou está vazio.`);
    return;
  }

  const ctx: ProjectContext = { projectName, projectType, sourceDir, usesThemeService: false };

  // Req. 3 / 4 — reescreve constantes nos `.ts` e CSS nos estilos.
  scanDirectory(tree, sourceDir, ctx, visited, report, logger);

  // Req. 7 — bibliotecas recebem apenas a reescrita de constantes/CSS.
  if (projectType === 'library') {
    return;
  }

  // Req. 6 — projeto que já usa o serviço: apenas reescrita, sem injeção.
  if (ctx.usesThemeService) {
    projectsUsingService.push(projectName);
    return;
  }

  // Req. 5 — injeta o serviço e aplica o tema anterior no componente principal.
  const bootstrap = findBootstrapComponent(tree, project, logger);

  if ('reason' in bootstrap) {
    report.warnings.push({
      filePath: bootstrap.filePath ?? ctx.sourceDir,
      line: 1,
      reason:
        `Projeto "${projectName}": ${bootstrap.reason} Para manter o tema anterior, chame ` +
        `"setTheme(poThemeDefaultDeprecated)" do PoThemeService na inicialização da aplicação.`
    });
    return;
  }

  const changedBefore = report.filesChanged;
  writeResult(
    tree,
    bootstrap.filePath,
    readText(tree, bootstrap.filePath),
    source => injectDeprecatedTheme(source, bootstrap.className),
    report,
    logger
  );

  if (report.filesChanged > changedBefore) {
    injectedProjects.push({ projectName, filePath: bootstrap.filePath });
  }
}

/**
 * Varredura recursiva do diretório-fonte de um `Projeto_Consumidor`.
 *
 * Processa `.ts` (exceto `.d.ts`) e arquivos de estilo, ignorando diretórios de
 * build. Detecta uso do `PoThemeService` em `.ts` (exceto `.spec.ts`), contabiliza
 * cada arquivo analisado e grava com `tree.overwrite` apenas quando o conteúdo
 * muda. Compartilha arquivos já visitados entre projetos via `visited`.
 */
function scanDirectory(
  tree: Tree,
  dirPath: string,
  ctx: ProjectContext,
  visited: Set<string>,
  report: MigrationReport,
  logger: logging.LoggerApi
): void {
  const directory = tree.getDir(dirPath);

  directory.subfiles.forEach(file => {
    const lower = file.toLowerCase();
    const isTs = lower.endsWith('.ts') && !lower.endsWith('.d.ts');
    const isStyle = STYLE_EXTENSIONS.some(ext => lower.endsWith(ext));

    if (!isTs && !isStyle) {
      return;
    }

    const filePath = `${directory.path}/${file}`;
    const original = readText(tree, filePath);

    if (isTs && !lower.endsWith('.spec.ts') && importsPoThemeService(original)) {
      ctx.usesThemeService = true;
    }

    if (visited.has(filePath)) {
      return;
    }
    visited.add(filePath);

    report.filesScanned++;
    const migrate = isTs ? migrateThemeTsContent : migrateStylesheetContent;
    writeResult(tree, filePath, original, migrate, report, logger);
  });

  directory.subdirs.forEach(subdir => {
    if (!IGNORED_DIRS.has(subdir)) {
      scanDirectory(tree, `${directory.path}/${subdir}`, ctx, visited, report, logger);
    }
  });
}

/** Aplica a transformação e grava o arquivo somente quando o conteúdo mudou. */
function writeResult(
  tree: Tree,
  filePath: string,
  original: string,
  migrate: (source: string) => ThemeMigrationResult,
  report: MigrationReport,
  logger: logging.LoggerApi
): void {
  const result = migrate(original);

  result.warnings.forEach((warning: MigrationWarning) => report.warnings.push({ ...warning, filePath }));

  if (result.content === original) {
    return;
  }

  try {
    tree.overwrite(filePath, result.content);
    report.filesChanged++;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} Falha ao gravar "${filePath}". O conteúdo original foi preservado. ` +
        `Detalhe: ${(error as Error)?.message ?? error}`
    );
  }
}

type BootstrapLookup = { filePath: string; className: string } | { reason: string; filePath?: string };

/**
 * Localiza o componente de bootstrap a partir do `main` do projeto:
 * - standalone: primeiro argumento de `bootstrapApplication`;
 * - NgModule: `bootstrap: [X]` do módulo passado a `bootstrapModule`.
 *
 * Usa `getProjectMainFile` para localizar o `main` e `isStandaloneApp` para
 * determinar a arquitetura, seguindo o padrão da migração obrigatória da v22.
 */
function findBootstrapComponent(tree: Tree, project: WorkspaceProject, logger: logging.LoggerApi): BootstrapLookup {
  let mainFile: string;
  try {
    mainFile = normalize(`/${getProjectMainFile(project)}`);
  } catch (error) {
    logger.warn(
      `${LOG_PREFIX} Não foi possível localizar o arquivo principal (main). Detalhe: ${(error as Error)?.message ?? error}`
    );
    return { reason: 'não foi possível localizar o arquivo principal (main) no angular.json.' };
  }

  if (!tree.exists(mainFile)) {
    return { reason: 'não foi possível localizar o arquivo principal (main) no angular.json.' };
  }

  const main = parseSource(readText(tree, mainFile), mainFile);
  const call = findCall(main, ['bootstrapApplication', 'bootstrapModule']);
  const argument = call?.arguments[0];

  if (!call || !argument || !ts.isIdentifier(argument)) {
    return { reason: 'não foi encontrada a chamada "bootstrapApplication" ou "bootstrapModule".', filePath: mainFile };
  }

  const declaringFile = resolveIdentifierFile(tree, main, mainFile, argument.text);
  if (!declaringFile) {
    return { reason: `não foi possível localizar o arquivo de "${argument.text}".`, filePath: mainFile };
  }

  let isModule: boolean;
  try {
    isModule = !isStandaloneApp(tree, mainFile);
  } catch {
    // Fallback determinístico pela própria chamada quando o utilitário falha.
    const callee = call.expression;
    isModule =
      (ts.isPropertyAccessExpression(callee) ? callee.name.text : (callee as ts.Identifier).text) === 'bootstrapModule';
  }

  if (!isModule) {
    return { filePath: declaringFile, className: argument.text };
  }

  const moduleSource = parseSource(readText(tree, declaringFile), declaringFile);
  const componentName = findModuleBootstrapComponent(moduleSource, argument.text);

  if (!componentName) {
    return { reason: `o módulo "${argument.text}" não declara um componente em "bootstrap".`, filePath: declaringFile };
  }

  const componentFile = resolveIdentifierFile(tree, moduleSource, declaringFile, componentName);
  if (!componentFile) {
    return { reason: `não foi possível localizar o arquivo de "${componentName}".`, filePath: declaringFile };
  }

  return { filePath: componentFile, className: componentName };
}

function findCall(sourceFile: ts.SourceFile, names: Array<string>): ts.CallExpression | undefined {
  let found: ts.CallExpression | undefined;
  const visit = (node: ts.Node): void => {
    if (found) {
      return;
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const name = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : undefined;
      if (name && names.includes(name)) {
        found = node;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

/** Nome do primeiro componente em `bootstrap: [...]` do `@NgModule` informado. */
function findModuleBootstrapComponent(sourceFile: ts.SourceFile, moduleName: string): string | undefined {
  const moduleClass = sourceFile.statements.find(
    (statement): statement is ts.ClassDeclaration =>
      ts.isClassDeclaration(statement) && statement.name?.text === moduleName
  );

  for (const decorator of (moduleClass && ts.getDecorators(moduleClass)) ?? []) {
    const expression = decorator.expression;
    const metadata = ts.isCallExpression(expression) ? expression.arguments[0] : undefined;

    if (!metadata || !ts.isObjectLiteralExpression(metadata)) {
      continue;
    }

    for (const property of metadata.properties) {
      if (
        ts.isPropertyAssignment(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === 'bootstrap' &&
        ts.isArrayLiteralExpression(property.initializer)
      ) {
        const first = property.initializer.elements[0];
        return first && ts.isIdentifier(first) ? first.text : undefined;
      }
    }
  }

  return undefined;
}

/**
 * Arquivo onde o identificador é declarado: o próprio arquivo, quando a classe
 * está nele, ou o import relativo correspondente.
 */
function resolveIdentifierFile(
  tree: Tree,
  sourceFile: ts.SourceFile,
  filePath: string,
  name: string
): string | undefined {
  const declaredHere = sourceFile.statements.some(
    statement => ts.isClassDeclaration(statement) && statement.name?.text === name
  );
  if (declaredHere) {
    return filePath;
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    const bindings = statement.importClause?.namedBindings;
    const imported =
      bindings && ts.isNamedImports(bindings) && bindings.elements.some(element => element.name.text === name);
    const specifier = statement.moduleSpecifier.text;

    if (imported && specifier.startsWith('.')) {
      const base = normalize(`${filePath.slice(0, filePath.lastIndexOf('/'))}/${specifier}`);
      return [`${base}.ts`, `${base}/index.ts`, base].find(
        candidate => candidate.endsWith('.ts') && tree.exists(candidate)
      );
    }
  }

  return undefined;
}

function readText(tree: Tree, filePath: string): string {
  return tree.read(filePath)?.toString('utf-8') ?? '';
}

function printSummary(
  report: MigrationReport,
  injectedProjects: Array<{ projectName: string; filePath: string }>,
  projectsUsingService: Array<string>,
  logger: logging.LoggerApi
): void {
  // Resumo padronizado (compartilhado com a migração obrigatória da v22).
  printMigrationSummary(report, logger, THEME_SUMMARY_LABELS);

  injectedProjects.forEach(({ projectName, filePath }) =>
    logger.info(`${LOG_PREFIX} Projeto "${projectName}": tema anterior aplicado em "${filePath}".`)
  );

  projectsUsingService.forEach(projectName =>
    logger.info(
      `${LOG_PREFIX} Projeto "${projectName}": já usa o PoThemeService. As constantes foram reapontadas, ` +
        `sem injeção no componente principal.`
    )
  );

  logger.info(`${LOG_PREFIX} O tema anterior está depreciado e será removido na v24.`);
}
