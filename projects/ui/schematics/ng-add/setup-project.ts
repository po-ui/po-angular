import { Rule, Tree, chain, noop, schematic } from '@angular-devkit/schematics';
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { addModuleImportToRootModule, getSourceFile } from '@po-ui/ng-schematics/module';
import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';

/** PO Module name that will insert in app root module */
const poModuleName = 'PoModule';
const poModuleSourcePath = '@po-ui/ng-components';

/** HttpClient Module name that will insert in app root module */
const httpProvideHttpClientName = 'provideHttpClient';
const httpWithInterceptorsFromDiName = 'withInterceptorsFromDi';
const httpClientModuleSourcePath = '@angular/common/http';

/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add PO Module to app root module
 *  - Adds themes to styles
 *  - Run sidemenu schematic
 */
export default function (options: any): Rule {
  return chain([
    addModuleImportToRootModule(options, poModuleName, poModuleSourcePath),
    addImportOnly(options, [httpProvideHttpClientName, httpWithInterceptorsFromDiName], httpClientModuleSourcePath),
    addProviderToAppModule(options, 'provideHttpClient(withInterceptorsFromDi()),'),
    addThemeToAppStyles(options),
    updateAppConfigFileRule(options),
    configureSideMenu(options)
  ]);
}

//insere um import no módulo sem adicionar na lista de importação
export function addImportOnly(options: any, moduleNames: string | Array<string>, importPath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);

    const browserEntryPoint = getProjectMainFile(project);

    if (isStandaloneApp(host, browserEntryPoint)) {
      return host;
    }

    const modulePath = getAppModulePath(host, browserEntryPoint);
    let importStatement: string;

    if (Array.isArray(moduleNames)) {
      const names = moduleNames.join(', ');
      importStatement = `import { ${names} } from '${importPath}';\n`;
    } else {
      importStatement = `import { ${moduleNames} } from '${importPath}';\n`;
    }

    const recorder = host.beginUpdate(modulePath);
    recorder.insertLeft(0, importStatement);
    host.commitUpdate(recorder);

    return host;
  };
}

/** Add PO theme to project styles */
function addThemeToAppStyles(options: any): (tree: Tree) => Tree {
  return function (tree: Tree): Tree {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project = getProjectFromWorkspace(workspace, options.project);

    // Path needs to be always relative to the `package.json` or workspace root.
    const themePath = './node_modules/@po-ui/style/css/po-theme-default.min.css';

    addThemeStyleToTarget(project, 'build', tree, themePath, workspace);
    addThemeStyleToTarget(project, 'test', tree, themePath, workspace);

    return tree;
  };
}

/** Adds a theming style entry to the given project target options. */
function addThemeStyleToTarget(
  project: WorkspaceProject,
  targetName: 'test' | 'build',
  host: Tree,
  assetPath: string,
  workspace: WorkspaceSchema
) {
  const targetOptions = getProjectTargetOptions(project, targetName);

  if (!targetOptions.styles) {
    targetOptions.styles = [assetPath];
  } else {
    const existingStyles = targetOptions.styles.map((s: any) => (typeof s === 'string' ? s : s.input));

    for (const [, stylePath] of existingStyles.entries()) {
      if (stylePath === assetPath) {
        return;
      }
    }

    targetOptions.styles.unshift(assetPath);
  }

  host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}

function configureSideMenu(options: any) {
  return options.configSideMenu ? schematic('sidemenu', { ...options }) : noop();
}

function updateAppConfigFileRule(options: any): Rule {
  return (tree: Tree) => {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);

    if (!isStandaloneApp(tree, browserEntryPoint)) {
      return tree;
    }

    const content = tree.read('src/app/app.config.ts')?.toString('utf-8') || '';

    const conteudoModificado = updateAppConfigFile(content);

    tree.overwrite('src/app/app.config.ts', conteudoModificado);
    return tree;
  };
}

export function addProviderToAppModule(options: any, provider: { provide: string; useValue: string } | string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);

    if (isStandaloneApp(host, browserEntryPoint)) {
      return host;
    }

    const appModulePath = getAppModulePath(host, browserEntryPoint);

    addProviderToModuleProvider(host, appModulePath, provider);

    return host;
  };
}

// para inserir variáveis no provider
export function addProviderToModuleProvider(
  tree: Tree,
  modulePath: string,
  provider: { provide: string; useValue: string } | string
) {
  const moduleSource = getSourceFile(tree, modulePath);
  const changes = addProviderToModule(
    moduleSource as any,
    modulePath,
    `
    ${provider}`,
    null as any
  );

  return insertChanges(tree, changes, modulePath);
}

/** Inserts the specified changes into the module file. */
function insertChanges(tree: Tree, changes: Array<any>, modulePath: string) {
  const recorder = tree.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}

export function updateAppConfigFile(content: string): string {
  const importBlock = `
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';
`;

  const providersBlock = `
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],`;

  const regexImport = /import {[^}]+} from '@angular\/core';/;
  const regexProviders = /providers: \[[^\]]+\]/;

  // Remove imports e providers existentes
  let modifiedContent = content.replace(regexImport, '').replace(regexProviders, '');

  // Adiciona os novos imports e providers
  modifiedContent = modifiedContent.replace(
    /export const appConfig: ApplicationConfig = {/,
    `import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';${importBlock}
export const appConfig: ApplicationConfig = {${providersBlock}`
  );

  return modifiedContent.trim();
}
