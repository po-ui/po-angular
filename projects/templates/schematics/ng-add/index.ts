import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import {
  getProjectTargetOptions,
  getProjectFromWorkspace,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module';
import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';

const poTemplateModuleName = 'PoTemplatesModule';
const poTemplateModuleSourcePath = '@po-ui/ng-templates';

/**
 * Scaffolds the basics of a PO application, this includes:
 *  - Imports PoTemplatesModule to app root module;
 *  - Install dependencies;
 *  - Configure theme style in project workspace;
 */
export default function (options: any): Rule {
  return chain([
    addModuleImportToRootModule(options, poTemplateModuleName, poTemplateModuleSourcePath),
    addPoPackageAndInstall(),
    addThemeToAppStyles(options)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-templates', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
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
