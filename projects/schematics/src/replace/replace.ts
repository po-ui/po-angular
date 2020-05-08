import { Tree } from '@angular-devkit/schematics';

/** Interface dos dados que serão substituidos. */
export interface ReplaceChanges {
  replace: string | RegExp;
  replaceWith: string | Function;
}

/**
 * Método responsável por realizar as substituições no arquivo informado.
 *
 * @param file Arquivo que sofrerá a alteração
 * @param changes Lista de objetos que possuem
 */
export function replaceInFile(file: string, changes: Array<ReplaceChanges> = []) {
  return (tree: Tree) => {
    if (tree.exists(file)) {
      const sourceText = tree.read(file)!.toString('utf-8');
      let updated = sourceText;

      if (updated) {
        changes.forEach(replaceChange => {
          // força a tipagem para string pois o ts não reconhece a função no String.replace
          updated = updated.replace(replaceChange.replace, <string>replaceChange.replaceWith);
        });
      }

      if (updated !== sourceText) {
        tree.overwrite(file, updated);
      }
    }
    return tree;
  };
}
