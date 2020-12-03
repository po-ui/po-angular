[comment]: # (@label Migração do PO UI para V4)
[comment]: # (@link guides/migration-poui-v4)

Este guia contém informações sobre a migração do seu projeto para a versão 4 do PO UI.

> Caso você não estiver utilizando a v3, precisa realizar as migrações anteriores, 
Guia de Migração do PO UI para [**V2**](guides/migration-poui-v2) e [**V3**](guides/migration-poui-v3)

## Atualizando o projeto com Angular

Antes de atualizar a versão do PO UI, é importante que você tenha atualizado o seu projeto para
o Angular 11, executando o comando abaixo:

```
ng update @angular/cli @angular/core
```

> Para realizar a migração completa e avaliar se não precisa fazer alguma alteração veja o [**Guia de Upgrade do Angular**](https://update.angular.io/).

O nosso pacote anterior possuía dependências que eram compatíveis com a versão 10 do Angular, portanto
pode ser preciso utilizar a *flag* `--force` para que o Angular realize a migração do seu projeto, ignorando a versão das dependências.
Para avaliar as *flags* disponíveis veja a [**documentação do ng update**](https://angular.io/cli/update).

## Atualizando o PO UI

Para facilitar a migração do seu projeto para o PO UI v4, implementamos o `ng update` nos pacotes abaixo:

- [**@po-ui/ng-components**](guides/migration-poui-v4#components)
- [**@po-ui/ng-sync**](guides/migration-poui-v4#sync)


<a id="components"></a>
### ng update @po-ui/ng-components

Para realizar a migração, execute o comando abaixo:

``` ng update @po-ui/ng-components --next```

O `ng update` ajudará nas alterações necessárias para seu projeto seguir atualizado, que são elas:
  - Modificada propriedade contida na interface `PoChartAxisOptions` de `axisXGridLines` para `gridLines`;
  - Atualizar as versões dos pacotes:
    - `@po-ui/ng-componentes`;
    - `@po-ui/ng-templates`;
    - `@po-ui/ng-code-editor`;
    - `@po-ui/ng-storage`;
    - `@po-ui/ng-sync`;
    - `@po-ui/ng-tslint`;
    - `@po-ui/style`;

#### Breaking Changes

<b> Propriedades e Eventos </b>

Remoção das propriedades, onde passam a valer as novas definições, veja a tabela abaixo:

<div class="po-row">
  <div class="po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Componentes</th>
          <th class="po-table-header-ellipsis">Anteriormente</th>
          <th class="po-table-header-ellipsis">Substituído por</th>
        </tr>
      </thead>
      <tbody>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-page-login"><strong>PoPageLogin</strong></a>
          </td>
          <td class="po-table-column"> PoPageLoginLiterals.Title
          </td>
          <td class="po-table-column"> 
            Não se aplica.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-page-list"><strong>PoPageList</strong></a>
          </td>
          <td class="po-table-column"> PoPageFilter.ngModel
          </td>
          <td class="po-table-column">
            Será enviado por parâmetro na função <i>PoPageFilter.onAction</i> o valor de pesquisa.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-chart"><strong>PoChartAxisOptions</strong></a>
          </td>
          <td class="po-table-column">axisXGridLines
          </td>
          <td class="po-table-column">
            gridLines
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

#### Depreciação

Componente <a href="/documentation/po-chart">PoChart:</a>
Depreciadas as propriedades `category` e `value` nas interfaces `PoPieChartSeries` e `PoDonutChartSeries`,
que passam a aceitar `label` e `data` respectivamente.

<a id="sync"></a>
### ng update @po-ui/ng-sync

> Caso você também utilize `@po-ui/ng-components` não há necessidade de executar o *ng update* do `@po-ui/ng-sync`.

Para realizar a migração, execute o comando abaixo:

```
ng update @po-ui/ng-sync --next
```

O `ng update` ajudará nas alterações necessárias para seu projeto, que será atualizar as versões dos pacotes:
  - `@po-ui/ng-sync`;
  - `@po-ui/ng-storage`;
  - `@po-ui/ng-tslint`;

