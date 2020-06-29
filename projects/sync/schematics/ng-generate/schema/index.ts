import { chain, Rule } from '@angular-devkit/schematics';

import { buildFile } from '@po-ui/ng-schematics/build-file';

import { Schema as FileOptions } from './schema';

/** Scaffolds a new sync schema file */
export default function (options: FileOptions): Rule {
  return chain([createSyncSchema(options)]);
}

function createSyncSchema(options: FileOptions): Rule {
  return buildFile(options);
}
