import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';
import { updateDepedenciesVersion } from './changes';

import { getSourceFile } from '@po-ui/ng-schematics/module';
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import * as readline from 'readline';

const IconsDictionaryName = 'ICONS_DICTIONARY';
const poIconDictionary = 'PoIconDictionary';
const poModuleSourcePath = '@po-ui/ng-components';

const newProviderDictionary = `
    {
      provide: 'ICONS_DICTIONARY',
      useValue: 'PoIconDictionary'
    }`;

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(query, (answer: any) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function main(options: any): Promise<Rule> {
  const configureNewIcon = await askQuestion(
    'A Lib de ícones PO Icon está depreciada e será removida na versão 20, gostaria de usar a nova lib?(yes/no)'
  );

  if (
    configureNewIcon.toLowerCase() === 'yes' ||
    configureNewIcon.toLowerCase() === 'y' ||
    configureNewIcon.toLowerCase() === 'sim' ||
    configureNewIcon.toLowerCase() === ''
  ) {
    return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), postUpdate()]);
  } else {
    return chain([
      updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion),
      addImportOnly(options, [IconsDictionaryName, poIconDictionary], poModuleSourcePath),
      addProviderToAppModule(options, newProviderDictionary),
      updateAppConfigFileRule(),
      postUpdate()
    ]);
  }
}

export default function (options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => main(options);
}

export function addImportOnly(_: any, moduleNames: string | Array<String>, importPath: string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);

    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project: any = getProjectFromWorkspace(workspace, projectName);

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
    }
    return host;
  };
}

export function addProviderToAppModule(_: any, provider: { provide: string; useValue: string } | string) {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project: any = getProjectFromWorkspace(workspace, projectName);
      const browserEntryPoint = getProjectMainFile(project);

      if (isStandaloneApp(host, browserEntryPoint)) {
        return host;
      }

      const appModulePath = getAppModulePath(host, browserEntryPoint);

      addProviderToModuleProvider(host, appModulePath, provider);
    }
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

function insertChanges(tree: Tree, changes: Array<any>, modulePath: string) {
  const recorder = tree.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}

function updateAppConfigFileRule(): Rule {
  return (tree: Tree) => {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const projectNames = Object.keys(workspace.projects);

    for (const projectName of projectNames) {
      const project: any = getProjectFromWorkspace(workspace, projectName);
      const browserEntryPoint = getProjectMainFile(project);

      if (!isStandaloneApp(tree, browserEntryPoint)) {
        return tree;
      }

      const content = tree.read('src/app/app.config.ts')?.toString('utf-8') || '';

      const conteudoModificado = updateAppConfigFile(content);

      tree.overwrite('src/app/app.config.ts', conteudoModificado);
    }
    return tree;
  };
}

export function updateAppConfigFile(content: string): string {
  const newImports = `import { ICONS_DICTIONARY, PoIconDictionary } from '@po-ui/ng-components';`;

  const newProvider = `
    {
      provide: ICONS_DICTIONARY,
      useValue: PoIconDictionary
    },`;

  // Verificar se já existe o import e o provider
  const importExists = content.includes(newImports);
  const providerExists = content.includes(newProvider.trim());

  let modifiedContent = content;

  if (!importExists) {
    // Adiciona o novo import
    modifiedContent = modifiedContent.replace(
      /import { ApplicationConfig,[^}]+} from '@angular\/core';/,
      match => `${match}\n${newImports}`
    );
  }

  if (!providerExists) {
    // Adiciona o novo provider
    modifiedContent = modifiedContent.replace(/providers: \[[^\]]+\]/, match =>
      match.replace('providers: [', `providers: [${newProvider}`)
    );
  }

  return modifiedContent.trim();
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
