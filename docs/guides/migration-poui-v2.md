[comment]: # (@label Migração do PO UI para V2)
[comment]: # (@link guides/migration-poui-v2)

Este guia contém informações sobre a migração do seu projeto para a versão 2 do PO UI.

## Atualizando o projeto com Angular

Antes de atualizar a versão do PO UI, é importante que você tenha atualizado o seu projeto para
o Angular 9, executando o comando abaixo:

``` ng update @angular/cli@9 @angular/core@9 ```

> Para realizar a migração completa e avaliar se não precisa fazer alguma alteração veja o [**Guia de Upgrade do Angular**](https://update.angular.io/).

O nosso pacote anterior possuía dependências que eram compatíveis com a versão 8 do Angular, portanto
pode ser preciso utilizar a *flag* `--force` para que o Angular realize a migração do seu projeto, ignorando a versão das dependências.
Para avaliar as *flags* disponíveis veja a [**documentação do ng update**](https://angular.io/cli/update).

## Atualizando o PO UI

Para facilitar a migração do seu projeto para o PO UI v2, implementamos o `ng update` nos pacotes abaixo:

- [**@po-ui/ng-components**](guides/migration-poui-v2#components)
- [**@po-ui/ng-sync**](guides/migration-poui-v2#sync)

O `ng update` ajudará nas alterações necessárias para seu projeto seguir atualizado, que são elas:
  - Alterar maioria dos conteúdos relacionados ao **BREAKING CHANGES** e **Depreciações** no seu projeto;
  - Atualizar as versões dos pacotes `@po-ui`.

Mas é importante conhecer os **BREAKING CHANGES** e **Depreciações** para realizar as alterações manualmente caso necessário.

<a id="components"></a>
### ng update @po-ui/ng-components

Para poder utilizar o comando e realizar a migração, execute os comandos abaixo:

``` npm i --save @po-ui/ng-components@2 ```

``` ng update @po-ui/ng-components --from 1 --migrate-only ```

#### Breaking Changes

Nesta nova versão o nome dos pacotes foram alterados, de acordo com a tabela abaixo:

| Pacotes                                                 | Substituído por                      |
| --------------------------------------------------------| -------------------------------------|
| `@portinari/portinari-ui`                               | `@po-ui/ng-components`               |
| `@portinari/portinari-templates`                        | `@po-ui/ng-templates`                |
| `@portinari/portinari-code-editor`                      | `@po-ui/ng-code-editor`              |
| `@portinari/tslint`                                     | `@po-ui/ng-tslint`                   |
| `@portinari/style`                                      | `@po-ui/style`                       |

Também foi realizado remoções das propriedades, onde passam a valer as novas definições, veja a tabela abaixo:

| Componentes                            | Anteriormente                            | Substituído por                   |
| ---------------------------------------| -----------------------------------------| ----------------------------------|
| `PoFieldModule`                        | `[p-focus]`                              | `[p-auto-focus]`                  |
| `PoHttpResquestInterceptor`            | `X-Portinari-Screen-Lock`                | `X-PO-Screen-Lock`                |
| `PoHttpResquestInterceptor`            | `X-Portinari-No-Count-Pending-Requests`  | `X-PO-No-Count-Pending-Requests`  |
| `PoHttpInterceptor`                    | `X-Portinari-No-Message`                 | `X-PO-No-Message`                 |
| `PoPageEdit`                           | Possuir a ação `cancel() {}` no TS       | `(p-cancel)`                      |
| `PoPageEdit`                           | Possuir a ação `save() {}` no TS         | `(p-save)`                        |
| `PoPageEdit`                           | Possuir a ação `saveNew() {}` no TS      | `(p-save-new)`                    |
| `PoPageDetail`                         | Possuir a ação `back() {}` no TS         | `(p-back)`                        |
| `PoPageDetail`                         | Possuir a ação `edit() {}` no TS         | `(p-edit)`                        |
| `PoPageDetail`                         | Possuir a ação `remove() {}` no TS       | `(p-remove)`                      |


#### Depreciação

Nas versões `1.x.x` era possível passar funções para nossas propriedades sem informar o `.bind(this)`,
pois capturávamos o componente pai e conseguíamos acessar o contexto corrente. Porém depreciamos este comportamento,
agora necessita passar a referência da função utilizando o `.bind(this)` para que o mesmo execute 
a função no contexto invocado, tanto em funções dentro de *arrays* quanto em funções via *property bind*.

Os componentes que sofrerão esta depreciação, são:
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

Exemplo funções via *property bind*
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

<a id="sync"></a>
### ng update @po-ui/ng-sync

Para poder utilizar o comando e realizar a migração, execute os comandos abaixo:

``` npm i --save @po-ui/ng-sync@2 ```

``` ng update @po-ui/ng-sync --from 1 --migrate-only ```

#### Breaking Changes

Nesta nova versão o nome dos pacotes foram alterados, de acordo com a tabela abaixo:

| Pacotes                                                 | Substituído por                      |
| --------------------------------------------------------| ------------------------------------ |
| `@portinari/portinari-sync`                             | `@po-ui/ng-sync`                     |
| `@portinari/portinari-storage`                          | `@po-ui/ng-storage`                  |
| `@portinari/tslint`                                     | `@po-ui/ng-tslint`                   |


#### Depreciação

Também foi realizada uma depreciação, onde ainda será aceito o modelo anterior, porém na versão 3 será removido.

A depreciação ocorreu no retorno do `Endpoint de sincronização`, onde anteriomente deveria retornar a data da última sincronização
na propriedade `portinari_sync_date`, que agora passa a ser `po_sync_date`, veja o antes e depois:

```
{
  "hasNext": false,
  "items": [],
  "portinari_sync_date": "2018-10-08T13:57:55.008Z"
}
```

A propriedade `portinari_sync_date` foi depreciada e o nova propriedade é:

```
{
  "hasNext": false,
  "items": [],
  "po_sync_date": "2018-10-08T13:57:55.008Z"
}
```
