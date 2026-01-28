# PO UI Storage

## Modo desenvolvimento

Para desenvolver novos *schematics* ou alterá-los é necessário executar o comando abaixo na raiz do projeto:

```
~ <caminho_do_repositorio>/po-angular

> npm run build:schematics
```

Após executar o comando será criado a pasta `dist/ng-schematics` e você estará apto a utilizar a biblioteca
em modo de desenvolvimento para implementar novas melhorias/correções e etc.

## Como testar

Há duas possibilidades para execução de testes para os novos *schematics*:

### 1 - npm link

O comando **npm link** criará um link simbólico do pacote que deseja testar dentro do `node_modules` da aplicação. Desta forma, é possível executar *schematics* do `po-storage` diretamente em `./projects/app/src/app`. 

Primeiramente, é necessária a alteração em `angular.json`:

```
...
  "defaultProject": "app"
...
```

Executar o build do projeto `po-storage`:

``` 
> npm run build:storage 
```

Agora executaremos o comando de link:

``` 
> npm link dist/ng-storage 
```

Por fim, executando o comando abaixo, o pacote do `po-storage` será instalado e também será adicionado o módulo `PoStorageModule` em `app.module.ts`:

``` 
> ng generate @po-ui/ng-storage:ng-add 
```

> Pra remover posteriormente o pacote `po-storage` do `node_modules` execute `npm uninstall @po-ui/ng-storage`.

### 2 - verdaccio

Para poder testar localmente é necessário instalar [verdaccio](https://github.com/verdaccio/verdaccio), para termos um *npm registry* local,
onde publicaremos os pacotes para realizar o teste.

Após a instalação, devemos apontar o npm registry para o que iniciaremos localmente.

O comando abaixo subirá o npm local, no endereço http://localhost:4873.

``` 
> verdaccio 
```

Em seguida, definiremos o *npm registry*, conforme o comando abaixo:

``` 
> npm set registry http://localhost:4873 
```

A partir de agora, os pacotes que publicaremos serão enviados ao nosso registry local.

> Para utilizar *npm registry* global novamente, execute o comando: `npm set registry https://registry.npmjs.org/`.


Antes de testarmos o pacotes, devemos fazer duas configurações, são elas:

- Adicionar dentro do arquivo ```verdaccio/config.yaml``` a configuração: `max_body_size: 200mb`;
- Executar o comando: ``` npm adduser --registry http://localhost:4873 ```

Para testarmos o pacote, devemos incrementar a versão do mesmo e ter o npm registry local em execução. confirmando essas situações, podemos rodar o script abaixo:

```
> npm run build:storage && npm run publish:storage:local
```

Por fim, execute os comando abaixo no seu projeto Angular:

```
> ng add @po-ui/ng-storage
```
