import { parseJson, JsonParseMode } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

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
    return (parseJson(configBuffer.toString(), JsonParseMode.Json5) as unknown) as WorkspaceSchema;
  } catch (e) {
    return null;
  }
}
