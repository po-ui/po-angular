import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
  filter,
  noop,
  SchematicsException
} from '@angular-devkit/schematics';
import { buildRelativePath, findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { normalize, strings, tags } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';
import { validateHtmlSelector } from '@schematics/angular/utility/validation';

import { supportedCssExtensions } from '../utils/supported-css-extensions';
import { getProjectFromWorkspace, getDefaultPath, getWorkspaceConfigGracefully, getProjectMainFile } from '../project';
import { addModuleImportToModule, addDeclarationComponentToModule, addExportComponentToModule } from '../module';
import { Schema as ComponentOptions } from './schema';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';

export function buildComponent(options: ComponentOptions): Rule {
  return (host: Tree) => {
    const workspace = getWorkspaceConfigGracefully(host) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);
    const isStandAlone = isStandaloneApp(host, browserEntryPoint);
    const urlFile = !isStandAlone ? './files' : './files-standalone';

    if (options.path === undefined && project) {
      options.path = getDefaultPath(project);
    }

    if (!isStandAlone) {
      options.module = findModuleFromOptions(host, options);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    (<any>options).selector = buildSelector(options, (project && project.prefix) || '');

    if (!supportedCssExtensions.includes(options.style as string)) {
      options.style = 'css';
    }

    validateName(options.name);
    validateHtmlSelector((<any>options).selector);

    const templateSource = apply(url(urlFile), [
      options.routing ? noop() : filter(path => !path.endsWith('-routing.module.ts.template')),
      options.createModule ? noop() : filter(path => !path.endsWith('.module.ts.template')),
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        ...options
      }),
      move(null as any, parsedPath.path)
    ]);

    return chain([
      options.createModule ? addImportToModule(options) : addDeclarationToModule(options),
      mergeWith(templateSource)
    ]);
  };
}

function validateName(name: string): void {
  if (name && /^\d/.test(name)) {
    throw new SchematicsException(tags.oneLine`name (${name})
        can not start with a digit.`);
  }
}

function buildSelector(options: ComponentOptions, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

function addImportToModule(options: ComponentOptions): Rule {
  return (tree: Tree) => {
    if (!options.module || options.routing) {
      return tree;
    }
    const modulePath = options.module;

    const componentModulePath = normalize(
      `/${options.path}/` + strings.dasherize(options.name) + '/' + strings.dasherize(options.name) + '.module'
    );

    const relativePath = buildRelativePath(modulePath, componentModulePath);
    const classifiedModuleName = strings.classify(`${options.name}Module`);

    return addModuleImportToModule(tree, modulePath, classifiedModuleName, relativePath);
  };
}

function addDeclarationToModule(options: ComponentOptions): Rule {
  return (tree: Tree) => {
    if (!options.module) {
      return tree;
    }

    const modulePath = options.module;

    const componentPath = normalize(
      `/${options.path}/` + strings.dasherize(options.name) + '/' + strings.dasherize(options.name) + '.component'
    );

    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`${options.name}Component`);

    addDeclarationComponentToModule(tree, modulePath, classifiedName, relativePath);

    if (options.export) {
      addExportComponentToModule(tree, modulePath, classifiedName, relativePath);
    }
  };
}
