import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { updatePackageJson } from '@po-ui/ng-schematics/package-config';

import { updateDepedenciesVersion } from './changes';

import * as readline from 'readline';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(query, (answer: string) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function main(): Promise<Rule> {
  const answer = await askQuestion(
    '\nAntes de atualizar o PO UI para a versão 22, é necessário que o Angular do seu projeto ' +
      'já esteja na versão 22.\n' +
      'Siga o guia oficial de atualização do Angular: https://angular.dev/update-guide\n\n' +
      'Você já executou "ng update @angular/core@22 @angular/cli@22" e as migrações necessárias do Angular 22? (yes/no) '
  );

  const confirmed = ['yes', 'y', 'sim', 's', ''].includes(answer.trim().toLowerCase());

  if (!confirmed) {
    console.log(
      '\nAtualização cancelada. Execute primeiro as migrações do Angular 22:\n' +
        '   ng update @angular/core@22 @angular/cli@22\n' +
        '   Consulte: https://angular.dev/update-guide\n'
    );
    return chain([]);
  }

  return chain([updatePackageJson('0.0.0-PLACEHOLDER', updateDepedenciesVersion), postUpdate()]);
}

export default function (): Rule {
  return (_tree: Tree, _context: SchematicContext) => main();
}

function postUpdate() {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
