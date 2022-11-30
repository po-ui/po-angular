import { parse } from 'jsonc-parser';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { Path } from '@angular-devkit/core';

/** Name of the default Angular CLI workspace configuration files. */
const defaultWorkspaceConfigPaths = ['/angular.json', '/.angular.json'];

export function getWorkspaceConfigGracefully(tree: Tree): null | WorkspaceSchema {
  const path = defaultWorkspaceConfigPaths.find(filePath => tree.exists(filePath));
  const configBuffer = tree.read(path!);

  if (!path || !configBuffer) {
    return null;
  }

  try {
    // Parse the workspace file as JSON5 which is also supported for CLI
    // workspace configurations.
    return (parse(configBuffer.toString()) as unknown) as WorkspaceSchema;
  } catch (e) {
    return null;
  }
}

export function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
  const project = workspace.projects[projectName || workspace.defaultProject!];

  if (!project) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(project: any, buildTarget: string) {

  const options = project.targets?.get(buildTarget)?.options;

  if (!options) {
    throw new SchematicsException(
      `Cannot determine project target configuration for: ${buildTarget}.`,
    );
  }

  return options;
}

/** Looks for the main TypeScript file in the given project and returns its path. */
export function getProjectMainFile(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
    );
  }

  return buildOptions.main as Path;
}

// Return default path of application or library
export function getDefaultPath(project: WorkspaceProject) {
  const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
  const projectDirName = project.projectType === 'application' ? 'app' : 'lib';

  return `${root}${projectDirName}`;
}
