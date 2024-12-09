import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';

import { addModuleImportToModule, getSourceFile, hasNgModuleImport } from '@po-ui/ng-schematics/module';
import {
  getProjectFromWorkspace,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

/** PO Module name that will be inserted into app root module */
const poStorageModuleName = 'PoStorageModule.forRoot()';
const poStorageModuleSourcePath = '@po-ui/ng-storage';
const poPoSyncModuleName = 'PoSyncModule';
const poPoSyncModuleSourcePath = '@po-ui/ng-sync';

/** HttpClient Module name that will insert in app root module */
const httpProvideHttpClientName = 'provideHttpClient';
const httpWithInterceptorsFromDiName = 'withInterceptorsFromDi';
const httpClientModuleSourcePath = '@angular/common/http';

export default function (options: any): Rule {
  return chain([
    addModuleImportToRootModuleSync(options, poStorageModuleName, poStorageModuleSourcePath),
    addModuleImportToRootModuleSync(options, poPoSyncModuleName, poPoSyncModuleSourcePath),
    addImportOnly(options, [httpProvideHttpClientName, httpWithInterceptorsFromDiName], httpClientModuleSourcePath),
    addProviderToAppModule(options, 'provideHttpClient(withInterceptorsFromDi()),'),
    updateEntryPointFileRule(options)
  ]);
}

function addModuleImportToRootModuleSync(options: any, moduleName: string, modulePath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFileSync(project);

    if (!browserEntryPoint || isStandaloneApp(host, browserEntryPoint)) {
      return host;
    }

    const appModulePath = getAppModulePath(host, browserEntryPoint);
    if (!hasNgModuleImport(host, appModulePath, moduleName)) {
      addModuleImportToModule(host, appModulePath, moduleName, modulePath);
    }

    return host;
  };
}

function addImportOnly(options: any, moduleNames: string | Array<string>, importPath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);

    const browserEntryPoint = getProjectMainFileSync(project);

    if (!browserEntryPoint || isStandaloneApp(host, browserEntryPoint)) {
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

function addProviderToAppModule(options: any, provider: { provide: string; useValue: string } | string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFileSync(project);

    if (!browserEntryPoint || isStandaloneApp(host, browserEntryPoint)) {
      return host;
    }

    const appModulePath = getAppModulePath(host, browserEntryPoint);

    addProviderToModuleProvider(host, appModulePath, provider);

    return host;
  };
}

function updateEntryPointFileRule(options: any): Rule {
  const pathMain = 'src/main.ts';
  const pathAppConfig = 'src/app/app.config.ts';
  let pathFile: string;
  let conteudoModificado: string;

  return (tree: Tree) => {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFileSync(project, 'browser');

    if (!browserEntryPoint || !isStandaloneApp(tree, browserEntryPoint)) {
      return tree;
    }

    if (!tree.exists(pathAppConfig)) {
      pathFile = pathMain;
      conteudoModificado = updateMainFile();
    } else {
      pathFile = pathAppConfig;
      const content = tree.read('src/app/app.config.ts')?.toString('utf-8') || '';
      conteudoModificado = updateAppConfigFile(content);
    }

    tree.overwrite(pathFile, conteudoModificado);
    return tree;
  };
}

function addProviderToModuleProvider(
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

function getProjectMainFileSync(project: WorkspaceProject, property: string = 'main'): string | null {
  const buildOptions = getProjectTargetOptions(project, 'build');
  if (!buildOptions[property]) {
    return null;
  }

  return buildOptions[property];
}

function insertChanges(tree: Tree, changes: Array<any>, modulePath: string) {
  const recorder = tree.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}

function updateMainFile(): string {
  return `
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoSyncModule } from '@po-ui/ng-sync';
import { PoStorageModule } from '@po-ui/ng-storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(PoSyncModule),
    importProvidersFrom(PoStorageModule.forRoot())
  ],
});`.trim();
}

function updateAppConfigFile(content: string): string {
  const importBlock = `
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoSyncModule } from '@po-ui/ng-sync';
import { PoStorageModule } from '@po-ui/ng-storage';
`;

  const providersBlock = `
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(PoSyncModule),
    importProvidersFrom(PoStorageModule.forRoot())
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
