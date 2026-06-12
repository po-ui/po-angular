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
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { normalize, strings } from '@angular-devkit/core';

import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module';
import {
  getProjectFromWorkspace,
  getProjectMainFile,
  getWorkspaceConfigGracefully
} from '@po-ui/ng-schematics/project';
import {
  detectFileNameStyleGuide,
  FileNameStyleGuide,
  getFileNameSuffixes,
  supportedCssExtensions
} from '@po-ui/ng-schematics/utils';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { Schema as ComponentOptions } from './schema';

const routerModule = 'RouterModule.forRoot([])';
const routerModulePath = '@angular/router';

/**
 * Configures and creates component to use with sidemenu layout, through steps below:
 * - Create a app.component with components to do sidemenu layout;
 * - Imports RouterModule in app root module;
 */
export default function (options: ComponentOptions): Rule {
  return chain([createAppComponent(options), addModuleImportToRootModule(options, routerModule, routerModulePath)]);
}

function createAppComponent(options: ComponentOptions): Rule {
  return (tree: Tree) => {
    const workspace = getWorkspaceConfigGracefully(tree) ?? ({} as WorkspaceSchema);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    const browserEntryPoint = getProjectMainFile(project);
    const sourceDir = `${project.sourceRoot}/app`;

    const urlFile = !isStandaloneApp(tree, browserEntryPoint) ? './files' : './files-standalone';

    if (!supportedCssExtensions.includes((options as any).style)) {
      options.style = 'css';
    }

    // Use the explicit option when provided, otherwise auto-detect the style already used by the project.
    const styleGuide: FileNameStyleGuide =
      options.fileNameStyleGuide ?? detectFileNameStyleGuide(tree, browserEntryPoint);
    const { componentSuffix } = getFileNameSuffixes(styleGuide);
    const appFileName = `app${componentSuffix}`;
    const appClassName = styleGuide === '2016' ? 'AppComponent' : 'App';

    const templateOptions = { ...options, appFileName, appClassName };

    const templateSource = applyWithOverwrite(url(urlFile), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      pathTemplate({ ...templateOptions }),
      applyTemplates({
        ...strings,
        ...templateOptions
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
