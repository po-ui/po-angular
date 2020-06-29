import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';
import { addModuleImportToRootModule } from '@po-ui/ng-schematics/module/module';
import { configuringBuildTargets } from '@po-ui/ng-schematics/build-target-options/build-target-options';

/** PO Module name that will be inserted into app root module */
const poCodeEditorModuleName = 'PoCodeEditorModule';
const poCodeEditorModuleSourcePath = '@po-ui/ng-code-editor';

// Path needs to be always relative to the `package.json` or workspace root.
const poThemeStylePath = './node_modules/@po-ui/style/css/po-theme-default.min.css';

// Monaco asset to be included in the project.
const poCodeEditorMonacoAsset = { glob: '**/*', input: 'node_modules/monaco-editor/min', output: '/assets/monaco/' };

/**
 * Scaffolds the basics of the PO Code Editor, this includes:
 *  - Install dependencies;
 *  - Imports PoCodeEditorModule to app root module;
 *  - Configure the theme's style in the project workspace;
 *  - Configure the monaco editor's asset in the project workspace;
 *
 */
export default function (options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    addModuleImportToRootModule(options, poCodeEditorModuleName, poCodeEditorModuleSourcePath),
    configuringBuildTargets(options, 'styles', poThemeStylePath),
    configuringBuildTargets(options, 'assets', poCodeEditorMonacoAsset)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-code-editor', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}
