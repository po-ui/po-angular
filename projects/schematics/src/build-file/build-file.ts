import { apply, applyTemplates, chain, mergeWith, move, Rule, url, Tree } from '@angular-devkit/schematics';

import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getWorkspace } from '@schematics/angular/utility/config';
import { strings } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';
import { validateName } from '@schematics/angular/utility/validation';

import { getProjectFromWorkspace } from '../project';
import { FileOptions } from './file-options';

export function buildFile(options: FileOptions): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project: any = getProjectFromWorkspace(workspace, options.project);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
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
