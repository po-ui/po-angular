import { Tree } from '@angular-devkit/schematics';

import { tsLint } from '../ng-update/changes';

const dependeciesChanges = {
  '@portinari/portinari-ui': '@po-ui/ng-components',
  '@portinari/portinari-sync': '@po-ui/ng-sync',
  '@portinari/portinari-storage': '@po-ui/ng-storage',
  '@portinari/portinari-style': '@po-ui/style',
  '@portinari/portinari-templates': '@po-ui/ng-templates',
  '@portinari/portinari-code-editor': '@po-ui/ng-code-editor',

  '@totvs/portinari-theme': '@totvs/po-theme'
};

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: any) => (result[key] = obj[key]) && result, {});
}

/** Adds a package to the package.json in the given host tree. */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

export function updatePackageJson(version: string) {
  return (tree: Tree): Tree => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (!json.dependencies) {
        json.dependencies = {};
      }

      // necessario apenas quando migrar para @po-ui/ng-components
      if (json.dependencies['@po-ui/ng-components']) {
        delete json.dependencies['@po-ui/ng-components'];
      }

      Object.keys(dependeciesChanges).forEach(pkg => {
        const previousPackage = pkg;
        const newPackage = dependeciesChanges[pkg];

        if (json.dependencies[previousPackage]) {
          json.dependencies[newPackage] = version;

          delete json.dependencies[previousPackage];
        }
      });

      if (json.devDependencies[tsLint.replace]) {
        json.devDependencies[tsLint.replaceWith] = '2.0.0';

        delete json.devDependencies[tsLint.replace];
      }

      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}

/** Gets the version of the specified package by looking at the package.json in the given tree. */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  if (!tree.exists('package.json')) {
    return null;
  }

  const packageJson = JSON.parse(tree.read('package.json')!.toString('utf8'));

  if (packageJson.dependencies && packageJson.dependencies[name]) {
    return packageJson.dependencies[name];
  }

  return null;
}
