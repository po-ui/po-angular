import { PO_UI_STYLE_PACKAGE, themeDeprecatedStyleMap } from './changes';
import { ThemeMigrationResult } from './ts-utils';

/** Resultado da troca de arquivos CSS: acrescenta a quantidade de referências trocadas. */
export interface StyleMigrationResult extends ThemeMigrationResult {
  /** Quantidade de referências trocadas. */
  replacements: number;
}

/**
 * Nomes de arquivo sem a extensão `.css` (o Sass aceita `@use`/`@import` sem
 * extensão), ordenados do mais longo para o mais curto para que a alternância
 * da expressão regular não pare num prefixo.
 */
const styleBaseNames = Object.keys(themeDeprecatedStyleMap)
  .map(file => file.replace(/\.css$/, ''))
  .sort((a, b) => b.length - a.length);

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

/**
 * Captura `@po-ui/style/css/<arquivo>[.css]`, exigindo que o nome termine num
 * delimitador. Assim `po-theme-default.min.css` não casa dentro de
 * `po-theme-default-deprecated.min.css` (idempotência).
 */
const styleReference = new RegExp(
  `(${escape(`${PO_UI_STYLE_PACKAGE}/css/`)})(${styleBaseNames.map(escape).join('|')})(\\.css)?(?=["'\`)\\s;,]|$)`,
  'g'
);

/** Linhas de stylesheet que referenciam outros arquivos. */
const stylesheetImportLine = /^\s*@(import|use|forward)\b/;

/**
 * Troca, no conteúdo do `angular.json`, as referências aos arquivos CSS do tema
 * padrão do `@po-ui/style` pelas versões do tema anterior.
 *
 * A troca é textual e alcança qualquer string do arquivo, o que cobre todos os
 * projetos, todos os targets e suas `configurations`, entradas em string ou em
 * objeto (`{ "input": ... }`), com e sem o prefixo `./`. A formatação e os
 * comentários do arquivo são preservados. Caminhos que já apontam para
 * `-deprecated` não são alterados.
 */
export function migrateAngularJsonStyles(json: string): StyleMigrationResult {
  return replaceStyleReferences(json, () => true);
}

/**
 * Troca, num arquivo `.css`/`.scss`/`.sass`/`.less`, as referências de
 * `@import`, `@use` e `@forward` (com ou sem `~`, `url()` e extensão) aos
 * arquivos CSS do tema padrão do `@po-ui/style` pelas versões do tema anterior.
 */
export function migrateStylesheetContent(source: string): StyleMigrationResult {
  return replaceStyleReferences(source, line => stylesheetImportLine.test(line));
}

function replaceStyleReferences(source: string, acceptLine: (line: string) => boolean): StyleMigrationResult {
  if (!source.includes(`${PO_UI_STYLE_PACKAGE}/css/`)) {
    return { content: source, changed: false, warnings: [], replacements: 0 };
  }

  let replacements = 0;
  const content = source
    .split('\n')
    .map(line => {
      if (!acceptLine(line)) {
        return line;
      }

      return line.replace(styleReference, (_match, prefix: string, baseName: string, extension = '') => {
        replacements++;
        const deprecated = themeDeprecatedStyleMap[`${baseName}.css`].replace(/\.css$/, '');
        return `${prefix}${deprecated}${extension}`;
      });
    })
    .join('\n');

  return { content, changed: content !== source, warnings: [], replacements };
}
