import { logging, normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

import { getWorkspaceConfigGracefully } from '@po-ui/ng-schematics/project';

import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';

import { injectDeprecatedTheme } from './theme-bootstrap-migration';
import { migrateAngularJsonStyles, migrateStylesheetContent } from './theme-style-migration';
import { importsPoThemeService, migrateThemeTsContent } from './theme-ts-migration';
import { parseSource, ThemeMigrationResult, ThemeMigrationWarning } from './ts-utils';

const LOG_PREFIX = '[tema-anterior]';
const WORKSPACE_FILES = ['/angular.json', '/.angular.json'];
const STYLE_EXTENSIONS = ['.css', '.scss', '.sass', '.less'];
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.angular', '.git']);

/** Resumo da migração para o tema anterior. */
export interface ThemeDeprecatedReport {
  filesScanned: number;
  filesChanged: number;
  /** Projetos que receberam a injeção: nome -> arquivo do componente. */
  injectedProjects: Array<{ projectName: string; filePath: string }>;
  /** Projetos que já usam o `PoThemeService` e não receberam a injeção. */
  projectsUsingService: Array<string>;
  warnings: Array<ThemeMigrationWarning>;
}

/**
 * Migração opcional `migration-v22-theme-deprecated`.
 *
 * Reaponta o projeto para o tema padrão anterior do PO UI (depreciado até a
 * v24): constantes `*Deprecated`, arquivos CSS `-deprecated` do `@po-ui/style`
 * e, nas aplicações que não usam o `PoThemeService`, a aplicação do tema
 * anterior no componente principal.
 */
export default function (): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspacePath = WORKSPACE_FILES.find(file => tree.exists(file));
    const workspace = getWorkspaceConfigGracefully(tree);

    if (!workspacePath || !workspace) {
      logger.error(`${LOG_PREFIX} Não foi possível obter a configuração do workspace. Nenhum arquivo foi alterado.`);
      return tree;
    }

    const report: ThemeDeprecatedReport = {
      filesScanned: 0,
      filesChanged: 0,
      injectedProjects: [],
      projectsUsingService: [],
      warnings: []
    };

    writeResult(tree, workspacePath, readText(tree, workspacePath), migrateAngularJsonStyles, report, logger);

    const visited = new Set<string>();

    for (const [projectName, project] of Object.entries(workspace.projects ?? {})) {
      migrateProject(tree, projectName, project, visited, report, logger);
    }

    printSummary(report, logger);

    return tree;
  };
}

function migrateProject(
  tree: Tree,
  projectName: string,
  project: WorkspaceProject,
  visited: Set<string>,
  report: ThemeDeprecatedReport,
  logger: logging.LoggerApi
): void {
  const sourceRoot = normalize(`/${project.sourceRoot ?? `${project.root ? `${project.root}/` : ''}src`}`);
  const files = collectFiles(tree, sourceRoot);

  if (files.length === 0) {
    logger.warn(`${LOG_PREFIX} Projeto "${projectName}": o diretório "${sourceRoot}" não existe ou está vazio.`);
    return;
  }

  let usesThemeService = false;

  for (const filePath of files) {
    const original = readText(tree, filePath);
    if (!filePath.endsWith('.spec.ts') && filePath.endsWith('.ts') && importsPoThemeService(original)) {
      usesThemeService = true;
    }

    if (visited.has(filePath)) {
      continue;
    }
    visited.add(filePath);

    report.filesScanned++;
    const migrate = filePath.endsWith('.ts') ? migrateThemeTsContent : migrateStylesheetContent;
    writeResult(tree, filePath, original, migrate, report, logger);
  }

  if (project.projectType === 'library') {
    return;
  }

  if (usesThemeService) {
    report.projectsUsingService.push(projectName);
    return;
  }

  const bootstrap = findBootstrapComponent(tree, project);

  if ('reason' in bootstrap) {
    report.warnings.push({
      filePath: bootstrap.filePath ?? sourceRoot,
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
    report.injectedProjects.push({ projectName, filePath: bootstrap.filePath });
  }
}

/** Aplica a transformação e grava o arquivo somente quando o conteúdo mudou. */
function writeResult(
  tree: Tree,
  filePath: string,
  original: string,
  migrate: (source: string) => ThemeMigrationResult,
  report: ThemeDeprecatedReport,
  logger: logging.LoggerApi
): void {
  const result = migrate(original);

  result.warnings.forEach(warning => report.warnings.push({ ...warning, filePath }));

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

/** Arquivos `.ts` e de estilo sob o diretório, recursivamente. */
function collectFiles(tree: Tree, dirPath: string): Array<string> {
  const directory = tree.getDir(dirPath);
  const files: Array<string> = [];

  directory.subfiles.forEach(file => {
    const lower = file.toLowerCase();
    if ((lower.endsWith('.ts') && !lower.endsWith('.d.ts')) || STYLE_EXTENSIONS.some(ext => lower.endsWith(ext))) {
      files.push(`${directory.path}/${file}`);
    }
  });

  directory.subdirs.forEach(subdir => {
    if (!IGNORED_DIRS.has(subdir)) {
      files.push(...collectFiles(tree, `${directory.path}/${subdir}`));
    }
  });

  return files;
}

type BootstrapLookup = { filePath: string; className: string } | { reason: string; filePath?: string };

/**
 * Localiza o componente de bootstrap a partir do `main` do projeto:
 * - standalone: primeiro argumento de `bootstrapApplication`;
 * - NgModule: `bootstrap: [X]` do módulo passado a `bootstrapModule`.
 */
function findBootstrapComponent(tree: Tree, project: WorkspaceProject): BootstrapLookup {
  const buildOptions = (project.architect?.build?.options ?? project.targets?.build?.options) as
    Record<string, string> | undefined;
  const mainOption = buildOptions?.browser ?? buildOptions?.main;
  const mainFile = mainOption ? normalize(`/${mainOption}`) : undefined;

  if (!mainFile || !tree.exists(mainFile)) {
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

  const callee = call.expression;
  const isModule =
    (ts.isPropertyAccessExpression(callee) ? callee.name.text : (callee as ts.Identifier).text) === 'bootstrapModule';

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

function printSummary(report: ThemeDeprecatedReport, logger: logging.LoggerApi): void {
  logger.info(
    `${LOG_PREFIX} ${report.filesScanned} arquivo(s) analisado(s), ${report.filesChanged} arquivo(s) alterado(s).`
  );

  report.injectedProjects.forEach(({ projectName, filePath }) =>
    logger.info(`${LOG_PREFIX} Projeto "${projectName}": tema anterior aplicado em "${filePath}".`)
  );

  report.projectsUsingService.forEach(projectName =>
    logger.info(
      `${LOG_PREFIX} Projeto "${projectName}": já usa o PoThemeService. As constantes foram reapontadas, ` +
        `sem injeção no componente principal.`
    )
  );

  if (report.warnings.length > 0) {
    logger.warn(`${LOG_PREFIX} ${report.warnings.length} ocorrência(s) exigem revisão manual:`);
    report.warnings.forEach(warning => logger.warn(`  - ${warning.filePath}:${warning.line} — ${warning.reason}`));
  }

  logger.info(`${LOG_PREFIX} O tema anterior está depreciado e será removido na v24.`);
}
