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
        <td class="po-table-column">9*, 10* e 11. *Deprecated</td>
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

> Nossa homologação tem como base os navegadores que o Angular suporta nativamente. Para saber mais, acesse o guia
[*Browser support*](https://angular.io/guide/browser-support) do Angular.

## Utilização de *polyfills*

Para a compatibilidade com alguns desses navegadores, é necessário utilizar os *polyfills*
disponibilizados pelo Angular no arquivo `/src/polyfills.ts`.

O exemplo abaixo contém os *polyfills* utilizados no PO Portal e que também deve ser habilitado no seu projeto para a utilização do PO em alguns navegadores:

```
npm i core-js@3.6.4
```

``` javascript
/**
 * BROWSER POLYFILLS
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es';

/**
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.

```

> Para saber mais sobre sobre como funciona um *polyfill*
acesse a documentação [*Browser support*](https://angular.io/guide/browser-support) do Angular.

## Executando a aplicação localmente

A partir do Angular CLI v8, os comandos *ng serve*, *ng test* e *ng e2e* são executados com ES2015, não sendo suportado para navegadores como Internet Explorer.

Para conseguir executar a aplicação localmente no Internet Explorer, veja a documentação [Desenvolvendo localmente em navegadores antigos](https://angular.io/guide/deployment#local-development-in-older-browsers).
