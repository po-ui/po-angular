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
    updateAppConfigFileRule(options)
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

function updateAppConfigFileRule(options: any): Rule {
  const pathConfig = 'src/main.ts';

  return (tree: Tree) => {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFileSync(project, 'browser');

    if (!browserEntryPoint || !isStandaloneApp(tree, browserEntryPoint)) {
      return tree;
    }

    const conteudoModificado = updateMainFile();
    tree.overwrite(pathConfig, conteudoModificado);

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
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { PoSyncModule } from '@po-ui/ng-sync'

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(PoSyncModule)
  ],
});`.trim();
}
