import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  MergeStrategy,
  move,
  noop,
  pathTemplate,
  Rule,
  Tree,
  url,
  forEach,
  SchematicContext,
  Source,
  filter
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { normalize, strings } from '@angular-devkit/core';

import { addModuleImportToRootModule } from '../../utils/module';
import { getProjectFromWorkspace } from '../../utils/project';
import { Schema as ComponentOptions } from './schema';
import { supportedCssExtensions } from '../../utils/supported-css-extensions';

const routerModule = 'RouterModule.forRoot([])';
const routerModulePath = '@angular/router';

/**
 * Configures and creates component to use with sidemenu layout, through steps below:
 * - Create a app.component with components to do sidemenu layout;
 * - Imports RouterModule in app root module;
 */
export default function(options: ComponentOptions): Rule {
  return chain([createAppComponent(options), addModuleImportToRootModule(options, routerModule, routerModulePath)]);
}

function createAppComponent(options: ComponentOptions): Rule {
  return (tree: Tree) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const sourceDir = `${project.sourceRoot}/app`;

    if (!supportedCssExtensions.includes((options as any).style)) {
      options.style = 'css';
    }

    const templateSource = applyWithOverwrite(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      pathTemplate({ ...options }),
      applyTemplates({
        ...strings,
        ...options
      }),
      move(normalize(sourceDir))
    ]);

    return chain([templateSource]);
  };
}

function applyWithOverwrite(source: Source, rules: Array<Rule>): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach(fileEntry => {
          if (tree.exists(fileEntry.path)) {
            tree.overwrite(fileEntry.path, fileEntry.content);
            return null;
          }
          return fileEntry;
        })
      ]),
      MergeStrategy.Overwrite
    );

    return rule(tree, context);
  };
}
