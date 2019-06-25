[comment]: # (@label Compatibilidade com os navegadores)
[comment]: # (@link guides/browser-support)

Atualmente o PO está homologado para os seguintes navegadores:

<div class="po-row">
  <div class="po-xl-6 po-lg-8 po-md-10 po-sm-12">
    <table class="po-table">
    <thead>
      <tr class="po-table-header">
        <th class="po-table-header-ellipsis">Navegadores</th>
        <th class="po-table-header-ellipsis">Versões</th>
      </tr>
    </thead>
    <tbody>
      <tr class="po-table-row">
        <th class="po-table-column">Chrome</th>
        <td class="po-table-column">versões mais recentes (latest)</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">Firefox</th>
        <td class="po-table-column">versões mais recentes (latest)</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">Edge</th>
        <td class="po-table-column">2 últimas versões principais</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">IE</th>
        <td class="po-table-column">9 (em homologação), 10 e 11</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">Safari</th>
        <td class="po-table-column">2 últimas versões principais</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">IOS</th>
        <td class="po-table-column">2 últimas versões principais</td>
      </tr>
      <tr class="po-table-row">
        <th class="po-table-column">Android</th>
        <td class="po-table-column">Pie (9.0) e Oreo (8.0)</td>
      </tr>
    </tbody>
    </table>
  </div>
</div>

> Nossa homologação tem como base os navegadores que o Angular suporta nativamente. Para saber mais, acesse a guia
[*Browser support*](https://angular.io/guide/browser-support) do Angular.

## Utilização de *polyfills*

Para a compatibilidade com alguns desses navegadores, é necessário utilizar os *polyfills*
disponibilizados pelo Angular no arquivo `/src/polyfills.ts`.

O exemplo abaixo contém os *polyfills* utilizados no PO Portal e que também deve ser habilitado no seu projeto para a utilização do PO em alguns navegadores:

``` javascript
/**
 * BROWSER POLYFILLS
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6';
import 'core-js/es7';

/** Evergreen browsers require these. **/
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

/**
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.

```

> Para saber mais sobre sobre como funciona um *polyfill*
acesse a documentação [*Browser support*](https://angular.io/guide/browser-support) do Angular.
