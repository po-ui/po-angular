import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '@po-ui/ng-schematics/package-config';

/**
 * Scaffolds the basics of a PO application, this includes:
 *  - Imports PoModule to app root module;
 *  - Install dependencies;
 *  - Configure theme style in project workspace;
 *  - Configure telemetry if enabled;
 */
export default function (options: any): Rule {
  return chain([
    addPoPackageAndInstall(),
    schematic('ng-add-setup-project', {
      ...options
    }),
    configureTelemetry(options)
  ]);
}

function addPoPackageAndInstall(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, '@po-ui/ng-components', '0.0.0-PLACEHOLDER');

    // install packages
    context.addTask(new NodePackageInstallTask());
  };
}

function configureTelemetry(options: any): Rule {
  return (tree: Tree) => {
    const telemetryConfig = {
      enabled: options.enableTelemetry === true,
      consentDate: new Date().toISOString(),
      version: '0.0.0-PLACEHOLDER'
    };

    tree.create('.po-ui-telemetry.json', JSON.stringify(telemetryConfig, null, 2));

    return tree;
  };
}
