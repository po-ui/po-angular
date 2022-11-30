import { chain, schematic, Tree, noop, SchematicContext } from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/workspace';

import { addModuleImportToRootModule, getProjectFromWorkspace } from '@angular/cdk/schematics';
import {
  getProjectTargetOptions
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
export default function (options: any) {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    if (project) {
      return chain([
        addModuleImportToRootModule(host, poModuleName, poModuleSourcePath, project) as any,
        addThemeToAppStyles(options),
        configureSideMenu(options)
      ]);
    }
  }
}

/** Add PO theme to project styles */
function addThemeToAppStyles(options: any): (tree: Tree) => any {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
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
  project: any,
  targetName: 'test' | 'build',
  host: Tree,
  assetPath: string,
  workspace: any
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
