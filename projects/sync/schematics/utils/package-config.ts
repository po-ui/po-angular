import { Tree } from '@angular-devkit/schematics';

import { tsLint } from '../ng-update/changes';

const dependeciesChanges = {
  '@portinari/portinari-sync': '@po-ui/ng-sync',
  '@portinari/portinari-storage': '@po-ui/ng-storage'
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

export function updatePackageJson(version: string) {
  return (tree: Tree): Tree => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (!json.dependencies) {
        json.dependencies = {};
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
        json.devDependencies[tsLint.replaceWith] = '0.0.0-PLACEHOLDER';

        delete json.devDependencies[tsLint.replace];
      }

      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return tree;
  };
}
