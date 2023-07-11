[comment]: # (@label Migração do PO UI)
[comment]: # (@link guides/migration-poui)

Este guia contém informações sobre a migração do seu projeto para a versão mais atualizada do PO UI.

> Caso você não estiver utilizando a versão anterior da mais atualizada, é importante realizar a migração para a mesma.

> Se seu projeto estiver na v1, veja este Guia de Migração do PO UI para [**V2**](guides/migration-poui-v2).

## Atualizando o projeto com Angular

Antes de atualizar a versão do PO UI, é importante que você tenha atualizado o seu projeto para
o Angular que o PO UI está homologado, veja nossa
[tabela de compatibilidade](https://github.com/po-ui/po-angular/wiki#vers%C3%B5es-angular-x-po-ui) em nosso Github Wiki.

Para atualizar o Angular, execute o comando abaixo:

```
ng update @angular/cli@<version> @angular/core@<version> --force
```

Por exemplo:

```
ng update @angular/cli@15 @angular/core@15 --force
```

> Para realizar a migração completa e avaliar se não precisa fazer alguma alteração veja o [**Guia de Upgrade do Angular**](https://update.angular.io/).

O nosso pacote possuía dependências que eram compatíveis com a versão anterior do Angular, portanto
devemos utilizar a *flag* `--force` para que o Angular realize a migração do seu projeto, ignorando a versão das dependências.
Para avaliar as *flags* disponíveis veja a [**documentação do ng update**](https://angular.io/cli/update).

## Atualizando o PO UI

Para facilitar a migração do seu projeto para o PO UI mais recente, implementamos o `ng update` nos pacotes abaixo:

- [**@po-ui/ng-components**](guides/migration-poui#components)
- [**@po-ui/ng-sync**](guides/migration-poui#sync)


<a id="components"></a>
### ng update @po-ui/ng-components

Para realizar a migração, devemos executar o comando `ng update`, conforme exemplo abaixo. Mas antes verifique se comitou os arquivos alterados pela migração do Angular, se preferir você pode utilizar a
*flag* `--allow-dirty` em conjunto.

```
ng update @po-ui/ng-components@<version> --allow-dirty --force
```

Por exemplo:

```
ng update @po-ui/ng-components@15 --allow-dirty --force
```

> Caso ocorra um erro ao concluir o comando acima pode ser necessário fazer uma instalação limpa no projeto apagando a pasta `node_modules` e o arquivo `package-lock.json` e executando o comando `npm i --legacy-peer-deps` antes de realizar o `ng update`.

O `ng update` ajudará nas alterações necessárias para seu projeto seguir atualizado, que são elas:
  - Caso houver *breaking changes*, serão realizados as alterações possíveis, mas fique atento ao
  [CHANGELOG](https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md);
  - Atualizar as versões dos pacotes:
    - `@po-ui/ng-components`;
    - `@po-ui/ng-templates`;
    - `@po-ui/ng-code-editor`;
    - `@po-ui/ng-storage`;
    - `@po-ui/ng-sync`;
    - `@po-ui/style`;


<a id="sync"></a>
### ng update @po-ui/ng-sync

> Caso você também utilize `@po-ui/ng-components` não há necessidade de executar o *ng update* do `@po-ui/ng-sync`.

Para realizar a migração, devemos executar o comando `ng update`, conforme exemplo abaixo. Mas antes verifique se comitou os arquivos alterados pela migração do Angular, se preferir você pode utilizar a
*flag* `--allow-dirty` em conjunto.

```
ng update @po-ui/ng-sync@<version> --allow-dirty --force
```

Por exemplo:

```
ng update @po-ui/ng-sync@15 --allow-dirty --force
```

O `ng update` ajudará nas alterações necessárias para seu projeto, que será atualizar as versões dos pacotes:
  - `@po-ui/ng-sync`;
  - `@po-ui/ng-storage`;

## Depreciações e Breaking Changes

Possuimos uma documentação que lista as depreciações correntes e os *breaking changes* já realizados na biblioteca,
para consultá-lo acesse o guia [Depreciações](guides/deprecations)

Verifique também nosso [CHANGELOG](https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md) para obter
mais detalhes dos *breaking changes* realizados.
