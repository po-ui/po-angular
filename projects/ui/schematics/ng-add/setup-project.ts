import { chain, Rule, schematic, Tree, noop } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module';
import {
  getProjectFromWorkspace,
  getProjectTargetOptions,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';

/** PO Module name that will insert in app root module */
const poModuleName = 'PoModule';
const poModuleSourcePath = '@po-ui/ng-components';

/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add PO Module to app root module
 *  - Adds themes to styles
 *  - Run sidemenu schematic
 */
export default function (options: any): Rule {
  return chain([
    addModuleImportToRootModule(options, poModuleName, poModuleSourcePath),
    addThemeToAppStyles(options),
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
