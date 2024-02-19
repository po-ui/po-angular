import { chain, Rule, schematic, Tree, noop } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';

import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module';
import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

/** PO Module name that will insert in app root module */
const poModuleName = 'PoModule';
const poModuleSourcePath = '@po-ui/ng-components';

/** HttpClient Module name that will insert in app root module */
const httpClientModuleName = 'HttpClientModule';
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
    addModuleImportToRootModule(options, httpClientModuleName, httpClientModuleSourcePath),
    addThemeToAppStyles(options),
    updateAppConfigFileRule(options),
    configureSideMenu(options)
  ]);
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

export function updateAppConfigFile(content: string): string {
  const importBlock = `
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoHttpRequestModule } from '@po-ui/ng-components';
`;

  const providersBlock = `
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([BrowserAnimationsModule, PoHttpRequestModule]),
  ],`;

  const regexImport = /import {[^}]+} from '@angular\/core';/;
  const regexProviders = /providers: \[[^\]]+\]/;

  // Remove imports e providers existentes
  let modifiedContent = content.replace(regexImport, '').replace(regexProviders, '');

  // Adiciona os novos imports e providers
  modifiedContent = modifiedContent.replace(
    /export const appConfig: ApplicationConfig = {/,
    `import { ApplicationConfig, importProvidersFrom } from '@angular/core';${importBlock}
export const appConfig: ApplicationConfig = {${providersBlock}`
  );

  return modifiedContent.trim();
}
