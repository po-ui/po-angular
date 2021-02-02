[comment]: # (@label Migração do PO UI para V3)
[comment]: # (@link guides/migration-poui-v3)

Este guia contém informações sobre a migração do seu projeto para a versão 3 do PO UI.

> Caso você estiver utilizando a v1, veja o guia [**Migração do PO UI para V2**](guides/migration-poui-v2).

## Atualizando o projeto com Angular

Antes de atualizar a versão do PO UI, é importante que você tenha atualizado o seu projeto para
o Angular 10, executando o comando abaixo:

```
ng update @angular/cli@10 @angular/core@10
```

> Para realizar a migração completa e avaliar se não precisa fazer alguma alteração veja o [**Guia de Upgrade do Angular**](https://update.angular.io/).

O nosso pacote anterior possuía dependências que eram compatíveis com a versão 9 do Angular, portanto
pode ser preciso utilizar a *flag* `--force` para que o Angular realize a migração do seu projeto, ignorando a versão das dependências.
Para avaliar as *flags* disponíveis veja a [**documentação do ng update**](https://angular.io/cli/update).

## Atualizando o PO UI

Para facilitar a migração do seu projeto para o PO UI v3, implementamos o `ng update` nos pacotes abaixo:

- [**@po-ui/ng-components**](guides/migration-poui-v3#components)
- [**@po-ui/ng-sync**](guides/migration-poui-v3#sync)


<a id="components"></a>
### ng update @po-ui/ng-components

Para realizar a migração, execute o comando abaixo:

``` ng update @po-ui/ng-components@3 --next```

O `ng update` ajudará nas alterações necessárias para seu projeto seguir atualizado, que são elas:
  - Altera o uso do `[p-checkbox]` para `[p-selectable]` utilizado no `PoTable`
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
            <a href="/documentation/po-table"><strong>PoTable</strong></a>
          </td>
          <td class="po-table-column">
            [p-checkbox]
          </td>
          <td class="po-table-column">
            [p-selectable]
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-lookup"><strong>PoLookupFilter</strong></a>
          </td>
          <td class="po-table-column"> getFilteredData(search, page, pageSize)
          </td>
          <td class="po-table-column"> getFilteredItems(params: PoLookupFilteredParams)
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-upload"><strong>PoUploadLiterals</strong></a>
          </td>
          <td class="po-table-column"> cancel, deleteFile e tryAgain
          </td>
          <td class="po-table-column">
            Não se aplica.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<br>

<b> Passar referência das funções sem .bind ou via string </b>

Até a versão `2.x.x` era possível passar funções para nossas propriedades sem informar o `.bind(this)`,
pois capturávamos o componente pai e conseguíamos acessar o contexto corrente. Porém depreciamos este comportamento,
agora necessita passar a referência da função utilizando o `.bind(this)` para que o mesmo execute
a função no contexto invocado, tanto em funções dentro de *arrays* quanto em funções via *property bind*.

Os componentes que sofreram este *breaking change*, são:
- [**PageChangePassword**](http://po-ui.io/documentation/po-page-change-password)
- [**ButtonGroup**](http://po-ui.io/documentation/po-button-group)
- [**Menu**](http://po-ui.io/documentation/po-menu)
- [**MenuPanel**](http://po-ui.io/documentation/po-menu-panel)
- [**Navbar**](http://po-ui.io/documentation/po-navbar)
- [**PageList**](http://po-ui.io/documentation/po-page-list)
- [**PageDefault**](http://po-ui.io/documentation/po-page-default)
- [**Popup**](http://po-ui.io/documentation/po-popup)
- [**Stepper**](http://po-ui.io/documentation/po-step)
- [**Table**](http://po-ui.io/documentation/po-table)
- [**Toolbar**](http://po-ui.io/documentation/po-toolbar)

Abaixo listamos dois exemplos comparativos com essas depreciações em alguns componentes.

Exemplo via funções dentro de arrays:
- Antes:

```
<po-page-default p-title="Página" [p-actions]="actions">
   ...
</po-page-default>
```

```
export class ExampleFunction () {

  actions: Array<PoPageAction> = [
    { label: 'Adicionar', action: this.add }
  ]

  add() {
    ...
  }
}
```

- Agora:

```
<po-page-default p-title="Página" [p-actions]="actions">
   ...
</po-page-default>
```

```
export class ExampleFunction () {

  actions: Array<PoPageAction> = [
    { label: 'Adicionar', action: this.add.bind(this) }
  ]

  add() {
    ...
  }
}
```

Exemplo funções via *property bind*:
- Antes:
```
<po-stepper>
  <po-step p-label="Personal" [p-can-active-next-step]="canActiveNextStep">
  </po-step>
</po-stepper>
```

- Agora:
```
<po-stepper>
  <po-step p-label="Personal" [p-can-active-next-step]="canActiveNextStep.bind(this)">
  </po-step>
</po-stepper>
```

#### Depreciação

Depreciado a propriedade `PoPageFilter.ngModel` no componente [**PoPageList**](/documentation/po-page-list), onde o valor pesquisado será possível recuperar através do parâmetro a ser recebido no evento `PoPageFilter.onAction`.

<a id="sync"></a>
### ng update @po-ui/ng-sync

Para realizar a migração, execute o comando abaixo:

```
ng update @po-ui/ng-sync --next
```

O `ng update` ajudará nas alterações necessárias para seu projeto, que será atualizar as versões dos pacotes:
  - `@po-ui/ng-sync`;
  - `@po-ui/ng-storage`;
  - `@po-ui/ng-tslint`;

> Caso você também utilize `@po-ui/ng-components` não há necessidade de executar o *ng update* do `@po-ui/ng-sync`.

#### Breaking Change

A remoção ocorreu no retorno do `Endpoint de sincronização`, onde anteriormente deveria retornar a data da última sincronização
na propriedade `portinari_sync_date`, que agora passa a ser exclusivamente `po_sync_date`, veja o antes e depois:

```
{
  "hasNext": false,
  "items": [],
  "portinari_sync_date": "2018-10-08T13:57:55.008Z"
}
```

A propriedade `portinari_sync_date` foi removida e a correta propriedade é:

```
{
  "hasNext": false,
  "items": [],
  "po_sync_date": "2018-10-08T13:57:55.008Z"
}
```
