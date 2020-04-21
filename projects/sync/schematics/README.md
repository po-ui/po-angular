# PO UI Schematics

## ng update @po-ui/ng-sync

Esse *schematic* é executado através do Angular CLI para oferecer suporte à atualização automática do PO UI em um projeto Angular.


### Como funciona

No arquivo ```npm/@po-ui/ng-sync/package.json ```, é declarado a chave `ng-update`. Isso indica ao Angular CLI que este projeto possui um conjunto de *schematics* de migração.

```
  "ng-update": {
    "migrations": "./schematics/migrations.json",
    "packageGroup": [
      "@po-ui/ng-sync"
    ]
  }
```

Quando os schematics forem analisados, ele tentará determinar se algum script de migração deve ser executado com base nas definições. As definições de migração podem ser encontradas em nosso arquivo `projects/sync/schematics/src/migration.json`. A execução `ng update` procurará scripts com base nesta coleção. Veja documentação do Angular sobre [ng-update](https://github.com/angular/angular-cli/blob/master/docs/specifications/update.md).


### Como testar

Para poder testar localmente é necessário instalar [verdaccio](https://github.com/verdaccio/verdaccio), para termos um *npm registry* local,
onde publicaremos os pacotes para realizar o teste.

Após a instalação, devemos apontar o npm registry para o que iniciaremos localmente.

O comando abaixo subirá o npm local, no endereço http://localhost:4873.

``` > verdaccio ```

Em seguida, definiremos o *npm registry*, conforme o comando abaixo:

``` > npm set registry http://localhost:4873 ```

A partir de agora, os pacotes que publicaremos serão enviados ao nosso registry local.

> Para utilizar *npm registry* global novamente, execute o comando: `npm set registry https://registry.npmjs.org/`.


Antes de testarmos o pacotes, devemos fazer duas configurações, são elas:

- Adicionar dentro do arquivo ```verdacio/config.yaml``` a configuração: `max_body_size: 200mb`;
- Executar o comando: ``` npm adduser --registry http://localhost:4873 ```

Para testarmos o pacote, devemos incrementar a versão do mesmo,
caso for uma versão beta devemos alterar a versão também no arquivo `migrations.json`,
ter o npm registry local em execução, confirmando essas situações, podemos rodar o script abaixo:

`> npm run build:storage && npm run build:storage`

`> npm run publish:storage:local && npm run publish:sync:local`

Por fim, execute os comandos abaixo no seu projeto Angular:

`> npm i --save @po-ui/ng-sync`

`> ng update @po-ui/ng-sync --next --from 1 --migrate-only`

Pode ser utilizado o verdaccio para publicar os pacotes locais, como `@po-ui/ng-storage`, assim não precisamos instalar local e o fluxo fica mais próximo do oficial.

Se você precisar executar isso várias vezes, desfaça as alterações feitas pelo `ng update` para que o `package.json` volte ao número da versão original e execute `npm install` novamente antes de tentar outra atualização.
