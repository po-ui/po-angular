import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import { getWorkspaceConfigGracefully } from '@po-ui/ng-schematics/project';

import {
  iconsReplaced,
  phIconHifenReplaces,
  phIconReplaces,
  poIconInsideReplaces,
  poIconReplaces,
  ReplaceChanges,
  updateDepedenciesVersion
} from './changes';

import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

async function main(): Promise<Rule> {
  return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), createUpgradeRule(), postUpdate()]);
}

export default function (): Rule {
  return (_tree: Tree, _context: SchematicContext) => main();
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
