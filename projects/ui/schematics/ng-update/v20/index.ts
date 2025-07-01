import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';
import {
  iconsReplaced,
  phIconHifenReplaces,
  phIconReplaces,
  poIconInsideReplaces,
  poIconReplaces,
  ReplaceChanges,
  updateDepedenciesVersion
} from './changes';

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
    return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), createUpgradeRule(), postUpdate()]);
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

export function addImportOnly(_: any, moduleNames: string | Array<string>, importPath: string) {
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

function createUpgradeRule() {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);

    if (workspace === null) {
      logger.error('Não foi possível encontrar o arquivo de configuração de workspace.');
      return;
    }

    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project = workspace.projects[projectName];
      const entryFolderProject = project.projectType === 'library' ? 'lib' : 'app';
      const sourceDir = `${project.sourceRoot}/${entryFolderProject}`;

      applyUpdateInContent(tree, sourceDir);
    }
  };
}

function applyUpdateInContent(tree: Tree, path: string) {
  const directory = tree.getDir(path);

  // Função recursiva para processar arquivos e subdiretórios
  const processDirectory = (dir: any) => {
    // Processa todos os arquivos no diretório atual
    if (dir.subfiles.length) {
      dir.subfiles.forEach((file: string) => {
        const filePath = dir.path + '/' + file;
        const content = tree.read(filePath)!.toString('utf-8');
        if (!content) {
          return;
        }

        let updated = content;

        if (file.endsWith('.html') || file.endsWith('.ts')) {
          // Atualiza para as instâncias dos novos ícones
          updated = replaceWithChanges(poIconInsideReplaces, updated);
          updated = replaceWithChanges(poIconReplaces, updated);
          updated = replaceWithChanges(phIconReplaces, updated);
          updated = replaceWithChanges(phIconHifenReplaces, updated);

          const icons = iconsReplaced.filter((icon: any) => updated.includes(icon.replace));

          icons.forEach(icon => {
            const regexChange = new RegExp('(class="\\s?)?' + icon.replace + '(\\s?)?(?="|>|\\s|$|\'|")', 'gmi');

            if (icon.fill) {
              updated = replaceWithChanges([{ replace: regexChange, replaceWith: `$1${icon.replaceWith}$2` }], updated);
            } else {
              updated = replaceWithChanges(
                [{ replace: regexChange, replaceWith: `$1an ${icon.replaceWith}$2` }],
                updated
              );
            }
          });

          if (updated !== content) {
            tree.overwrite(filePath, updated);
          }
        }
      });
    }

    // Processa subdiretórios recursivamente
    if (dir.subdirs.length) {
      dir.subdirs.forEach((subdir: string) => {
        processDirectory(tree.getDir(dir.path + '/' + subdir));
      });
    }
  };

  // Inicia o processamento a partir do diretório especificado
  processDirectory(directory);
}

function replaceWithChanges(replaces: Array<ReplaceChanges>, content: string = '') {
  replaces.forEach(({ replace, replaceWith }) => {
    const regex = new RegExp(replace, 'gi');
    content = content.replace(regex, <string>replaceWith);
  });

  return content;
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
