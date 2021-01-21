import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { AssetSpecification } from './asset-specification.interface';
import { getProjectTargetOptions, getProjectFromWorkspace, getWorkspaceConfigGracefully } from '../project';

/** Add a file or asset in project workspace */
export function configuringBuildTargets(
  options: any,
  optionsProperty: string,
  buildTargetElement: string | AssetSpecification
): (tree: Tree) => Tree {
  return function (tree: Tree): Tree {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project = getProjectFromWorkspace(workspace, options.project);

    addOptionToTarget(project, 'build', tree, optionsProperty, buildTargetElement, workspace);
    addOptionToTarget(project, 'test', tree, optionsProperty, buildTargetElement, workspace);

    return tree;
  };
}

/** Adds an entry to the given project target options. */
export function addOptionToTarget(
  project: WorkspaceProject,
  targetName: 'test' | 'build',
  host: Tree,
  optionsProperty: string,
  optionPath: string | AssetSpecification,
  workspace: WorkspaceSchema
) {
  const targetOptions = getProjectTargetOptions(project, targetName);

  if (!targetOptions) {
    return;
  }

  if (!targetOptions[optionsProperty]) {
    targetOptions[optionsProperty] = [optionPath];
  } else {
    const existingPaths = targetOptions[optionsProperty].map((s: any) => (typeof s === 'string' ? s : s.input));

    for (const [, optionPathValue] of existingPaths.entries()) {
      if (optionPathValue === optionPath) {
        return;
      }
    }

    targetOptions[optionsProperty].unshift(optionPath);
  }

  host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
