import { chain, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { ReplaceChanges } from '@po-ui/ng-schematics/replace';
import {
  getWorkspaceConfigGracefully,
  getProjectMainFile,
  getProjectTargetOptions
} from '@po-ui/ng-schematics/project';
import { updatePackageJson } from '@po-ui/ng-schematics/package-config';
import { WorkspaceSchema, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { addModuleImportToModule } from '@po-ui/ng-schematics/module';
import {
  updateDepedenciesVersion,
  poButtonReplaces,
  poButtonReplacesSecondary,
  poButtonReplacesTertiary,
  poButtonReplacesDanger
} from './changes';

const httpClientModuleName = 'HttpClientModule';
const httpClientModuleSourcePath = '@angular/common/http';

export default function () {
  return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), createUpgradeRule(), postUpdate()]);
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

function createUpgradeRule() {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);

    if (workspace === null) {
      logger.error('Não foi possível encontrar o arquivo de configuração de workspace.');
      return;
    }
    const themePathDefaultVariables = 'node_modules/@totvs/po-theme/css/po-theme-default-variables.min.css';
    const themePathDefaultMin = 'node_modules/@totvs/po-theme/css/po-theme-default.min.css';
    const themePathCore = 'node_modules/@po-ui/style/css/po-theme-core.min.css';

    const projectNames = Object.keys(workspace.projects);
    for (const projectName of projectNames) {
      const project = workspace.projects[projectName];
      const entryFolderProject = project.projectType === 'library' ? 'lib' : 'app';
      const sourceDir = `${project.sourceRoot}/${entryFolderProject}`;

      const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

      applyUpdateInContent(tree, sourceDir);
      //adiciona httpClientModule no app
      addModuleImportToModule(tree, appModulePath, httpClientModuleName, httpClientModuleSourcePath);
      //adiciona as variáveis no angular.json do theme-totvs
      addThemeStyleToTarget(project, 'build', tree, themePathDefaultVariables, workspace);
      addThemeStyleToTarget(project, 'test', tree, themePathDefaultVariables, workspace);
      addThemeStyleToTarget(project, 'build', tree, themePathDefaultMin, workspace);
      addThemeStyleToTarget(project, 'test', tree, themePathDefaultMin, workspace);
      addThemeStyleToTarget(project, 'build', tree, themePathCore, workspace);
      addThemeStyleToTarget(project, 'test', tree, themePathCore, workspace);
    }
  };
}

function applyUpdateInContent(tree: Tree, path: string) {
  const directory = tree.getDir(path);
  if (directory.subfiles.length) {
    directory.subfiles.forEach(file => {
      const filePath = path + '/' + file;
      const content = tree.read(filePath)!.toString('utf-8');
      if (!content) {
        return;
      }

      let updated = content;

      if (file.endsWith('.html')) {
        //utiliza o regex no html para atualização do po-button
        updated = replaceWithChanges(poButtonReplacesSecondary, updated);
        updated = replaceWithChanges(poButtonReplacesTertiary, updated);
        updated = replaceWithChanges(poButtonReplacesDanger, updated);
        updated = replaceWithChanges(poButtonReplaces, updated);

        if (updated !== content) {
          tree.overwrite(filePath, updated);
        }
      }
    });
  }

  if (directory.subdirs.length) {
    directory.subdirs.forEach(subDir => {
      applyUpdateInContent(tree, path + '/' + subDir);
    });
  }
}

// Método usado para realizar alterações
function replaceWithChanges(replaces: Array<ReplaceChanges>, content: string = '') {
  replaces.forEach(({ replace, replaceWith }) => {
    const regex = new RegExp(replace, 'gi');
    content = content.replace(regex, <string>replaceWith);
  });

  return content;
}

function addThemeStyleToTarget(
  project: WorkspaceProject,
  targetName: 'test' | 'build',
  host: Tree,
  assetPath: string,
  workspace: WorkspaceSchema
) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    //só adiciona as novas dependencias do theme-totvs se o projeto tiver o theme-totvs instalado
    if (json.dependencies['@totvs/po-theme']) {
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
  }
}
