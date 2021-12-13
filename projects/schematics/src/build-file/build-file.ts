import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';

import { strings, tags } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';

import { getProjectFromWorkspace, getDefaultPath, getWorkspaceConfigGracefully } from '../project';
import { FileOptions } from './file-options.interface';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

export function buildFile(options: FileOptions): Rule {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);

    if (options.path === undefined && project) {
      options.path = getDefaultPath(project);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    validateName(options.name);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options
      }),
      move(null as any, parsedPath.path)
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

function validateName(name: string): void {
  if (name && /^\d/.test(name)) {
    throw new SchematicsException(tags.oneLine`name (${name})
        can not start with a digit.`);
  }
}
