import { SchematicsException } from '@angular-devkit/schematics';
import { WorkspaceSchema, WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';

export function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
  const project = workspace.projects[projectName || workspace.defaultProject!];

  if (!project) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
  if (project.targets && project.targets[buildTarget] && project.targets[buildTarget].options) {
    return project.targets[buildTarget].options;
  }

  // TODO(devversion): consider removing this architect check if the CLI completely switched
  // over to `targets`, and the `architect` support has been removed.
  // See: https://github.com/angular/angular-cli/commit/307160806cb48c95ecb8982854f452303801ac9f
  if (project.architect && project.architect[buildTarget] && project.architect[buildTarget].options) {
    return project.architect[buildTarget].options;
  }

  throw new SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
export function getProjectMainFile(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
    );
  }

  return buildOptions.main;
}
