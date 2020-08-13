import { Tree } from '@angular-devkit/schematics';

import { UpdateDependencies } from './update-dependencies.interface';

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

// Atualiza os pacotes pela versão
export function updatePackageJson(version: string, { dependencies, devDependencies }: UpdateDependencies) {
  return (tree: Tree): Tree => {
    if (tree.exists('package.json')) {
      const sourceText = tree.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (!json.dependencies) {
        json.dependencies = {};
      }

      dependencies?.forEach(pkg => {
        if (json.dependencies[pkg]) {
          json.dependencies[pkg] = version;
        }
      });

      devDependencies?.forEach(devDependency => {
        const updatedDependency =
          typeof devDependency === 'object' ? devDependency : { package: devDependency, version };

        if (json.devDependencies[updatedDependency.package]) {
          json.devDependencies[updatedDependency.package] = updatedDependency.version;
        }
      });

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

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
export function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: any) => (result[key] = obj[key]) && result, {});
}
