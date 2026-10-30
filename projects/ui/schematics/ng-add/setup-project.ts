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
 *  - Add provideZoneChangeDetection: standalone via app.config.ts, module-based via main.ts
 */
export default function (options: any): Rule {
  return chain([
    addModuleImportToRootModule(options, poModuleName, poModuleSourcePath),
    addImportOnly(options, [httpProvideHttpClientName, httpWithInterceptorsFromDiName], httpClientModuleSourcePath),
    addProviderToAppModule(options, 'provideHttpClient(withInterceptorsFromDi())'),
    addThemeToAppStyles(options),
    addPolyfillsZoneJS(options),
    addZoneChangeDetection(options),
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
    moduleSource,
    modulePath,
    `
    ${provider}`,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
    `import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';${importBlock}
export const appConfig: ApplicationConfig = {${providersBlock}`
  );

  return modifiedContent.trim();
}

// Adiciona zone.js ao polyfills, caso não exista
function addPolyfillsZoneJS(options: any): (tree: Tree) => Tree {
  return function (tree: Tree): Tree {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project = getProjectFromWorkspace(workspace, options.project);

    const targetOptions = getProjectTargetOptions(project, 'build');
    const zoneJs = 'zone.js';

    if (!targetOptions.polyfills) {
      targetOptions.polyfills = [zoneJs];
    } else {
      const existingZoneJs = targetOptions.polyfills.map((s: any) => (typeof s === 'string' ? s : s.input));

      for (const [, polyfillsName] of existingZoneJs.entries()) {
        if (polyfillsName === zoneJs) {
          return tree;
        }
      }

      targetOptions.polyfills.unshift(zoneJs);
    }

    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));

    return tree;
  };
}

/**
 * Adiciona provideZoneChangeDetection ao main.ts de apps module-based.
 *
 * Para apps standalone, o provider já é adicionado no app.config.ts por
 * `updateAppConfigFileRule`, então esta rule ignora esse caso para evitar
 * a duplicação de providers (NG0408).
 */
function addZoneChangeDetection(options: any): (tree: Tree) => Tree {
  return function (tree: Tree): Tree {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);

    // Apps standalone são tratados por updateAppConfigFileRule (app.config.ts)
    if (isStandaloneApp(tree, browserEntryPoint)) {
      return tree;
    }

    // O browserEntryPoint já vem como caminho relativo ao workspace root
    // Exemplo: "projects/test-app/src/main.ts"
    const mainFilePath = browserEntryPoint;

    if (!tree.exists(mainFilePath)) {
      return tree;
    }

    const content = tree.read(mainFilePath)?.toString('utf-8') || '';

    // Verifica se já tem provideZoneChangeDetection
    if (content.includes('provideZoneChangeDetection')) {
      return tree;
    }

    const modifiedContent = updateMainFile(content);

    // Se nada mudou (padrão de bootstrap não reconhecido), não sobrescreve
    if (modifiedContent === content) {
      return tree;
    }

    tree.overwrite(mainFilePath, modifiedContent);

    return tree;
  };
}

/**
 * Atualiza o main.ts de um app module-based para incluir provideZoneChangeDetection
 * via `applicationProviders` (opção correta para platformBrowser().bootstrapModule).
 *
 * Também garante o import de `provideZoneChangeDetection` a partir de '@angular/core'.
 */
function updateMainFile(content: string): string {
  if (!content.includes('platformBrowser()') || !content.includes('bootstrapModule')) {
    return content;
  }

  // Já configurado; evita duplicar o provider (NG0408)
  if (content.includes('provideZoneChangeDetection')) {
    return content;
  }

  let updated = content;

  const provider = 'provideZoneChangeDetection({ eventCoalescing: true })';

  // bootstrapModule(AppModule, { ... }) -> injeta applicationProviders no objeto existente
  const regexWithOptions = /(bootstrapModule\([^,]+,\s*\{)/;
  // bootstrapModule(AppModule) -> reconstrói a chamada adicionando o objeto de opções
  // Captura o argumento do módulo (grupo 1) para reinserir dentro dos parênteses.
  const regexNoOptions = /bootstrapModule\(\s*([^,)]+?)\s*\)/;

  if (regexWithOptions.test(updated)) {
    updated = updated.replace(regexWithOptions, `$1\n    applicationProviders: [${provider}],`);
  } else if (regexNoOptions.test(updated)) {
    updated = updated.replace(regexNoOptions, `bootstrapModule($1, { applicationProviders: [${provider}] })`);
  } else {
    return content;
  }

  updated = ensureCoreImport(updated);

  return updated;
}

/**
 * Garante que `provideZoneChangeDetection` esteja importado de '@angular/core'.
 * - Se já existe um import de '@angular/core', adiciona o símbolo à lista.
 * - Caso contrário, insere uma nova linha de import no topo do arquivo.
 */
function ensureCoreImport(content: string): string {
  if (content.includes('provideZoneChangeDetection')) {
    // símbolo já usado; verifica se está de fato importado
    const alreadyImported =
      /import\s*\{[^}]*\bprovideZoneChangeDetection\b[^}]*\}\s*from\s*['"]@angular\/core['"]/.test(content);
    if (alreadyImported) {
      return content;
    }
  }

  const coreImportRegex = /import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"];?/;

  if (coreImportRegex.test(content)) {
    return content.replace(coreImportRegex, (_match, symbols) => {
      const trimmed = symbols.trim().replace(/,\s*$/, '');
      return `import { ${trimmed}, provideZoneChangeDetection } from '@angular/core';`;
    });
  }

  // Não há import de @angular/core; adiciona no topo
  return `import { provideZoneChangeDetection } from '@angular/core';\n${content}`;
}
