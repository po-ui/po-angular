<p align="center">
  <a href="https://po-ui.io">
    <img width="250" src="./docs/assets/po-logos/po_color_bg.svg">
  </a>
</p>

<div align="center">

Biblioteca de componentes de UI para Angular.

[![Travis branch](https://img.shields.io/travis/com/po-ui/po-angular/master?style=flat-square)](https://travis-ci.com/github/po-ui/po-angular)
[![npm package](https://img.shields.io/npm/v/@po-ui/ng-components?color=%23c9357d&style=flat-square)](https://www.npmjs.org/package/@po-ui/ng-components)
[![NPM downloads](https://img.shields.io/npm/dm/@po-ui/ng-components?color=c9357d&label=npm%20downloads&style=flat-square)](https://npmjs.com/package/@po-ui/ng-components)
[![GitHub license](https://img.shields.io/npm/l/@po-ui/ng-components?color=%23c9357d&style=flat-square)](https://github.com/po-ui/po-angular/blob/master/LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-POUI-c9357d?style=flat-square&logo=twitter)](https://twitter.com/pouidev)

</div>

---

### Pré-requisitos

Para começar a utilizar o **PO UI** é pré-requisito ter o `Node.js` instalado (versão 10.x ou acima) e o seu gerenciador de pacote favorito na versão mais atual. Caso você ainda não tenha instalado o pacote `@angular/cli`, instale-o via `npm` ou `yarn`.

Instalando com npm:
```
npm i -g @angular/cli@^10.0.2
```

Caso prefira instalar com o yarn:
```
yarn global add @angular/cli@^10.0.2
```

### Passo 1 - Crie o seu primeiro projeto

> Caso você já tenha um projeto criado e deseje apenas incluir o **Po**, pule esta etapa e vá para o **Passo 1.1**.

O [Angular CLI](https://cli.angular.io/) se encarrega de construir toda estrutura inicial do projeto. Para isso, execute o seguinte comando:

```
ng new my-po-project --skipInstall
```

> O parâmetro `--skip-install` permite criar o projeto, contudo, não instalará as dependências automaticamente.


#### Passo 1.1 - Instalando as dependências

Antes de executar a instalação ou inserir o **Po** no seu projeto existente, é necessário verificar as dependências do seu projeto, algumas delas precisam estar de acordo com a versão do **Po** e Angular (elas podem ser encontradas no arquivo `package.json` localizado na raiz da aplicação).

Veja abaixo a lista de dependências e as versões compatíveis, elas devem ser conferidas e se necessário, ajustadas no seu projeto.

```
  "dependencies": {
    "@angular/animations": "^10.0.3",
    "@angular/common": "^10.0.3",
    "@angular/compiler": "^10.0.3",
    "@angular/core": "^10.0.3",
    "@angular/forms": "^10.0.3",
    "@angular/platform-browser": "^10.0.3",
    "@angular/platform-browser-dynamic": "^10.0.3",
    "@angular/platform-server": "^10.0.3",
    "@angular/router": "^10.0.3",
    "tslib": "^2.0.0",
    "rxjs": "~6.5.5",
    "zone.js": "~0.10.3"
    ...
  }
```

Após verificar se estas dependências do seu projeto estão com as versões compatíveis declaradas acima, acesse a pasta raiz do seu projeto e execute o comando abaixo:

Instalando com npm:
```
npm install
```

Caso prefira instalar com o yarn:
```
yarn install
```

### Passo 2 - Adiconando o pacote @po-ui/ng-components

Utilizando o comando `ng add` do [Angular CLI](https://cli.angular.io/), vamos adicionar o **Po** em seu projeto e o mesmo se encarregará de configurar o tema, instalar o pacote e importar o módulo do **Po**.

Execute o comando abaixo na pasta raiz do seu projeto:

```
ng add @po-ui/ng-components
```

> Ao executar o comando acima, será perguntado se deseja incluir uma estrutura inicial em seu projeto com menu lateral, página e toolbar, utilizando componentes do **Po**, **caso desejar, apenas informe: `Y`**.

### Passo 3 - Rode o seu projeto

Agora basta executar mais um comando para subir a aplicação e ver o seu projeto rodando no *browser* ;).

```
ng serve
```

Abra o *browser* e acesse a url http://localhost:4200. Pronto!

----

### E agora?

Agora é só abrir seu **editor / IDE** favorito e começar a trabalhar no seu projeto.

Caso você queira utilizar nossos componentes de templates, como o **[po-page-login](https://po-ui.io/documentation/po-page-login)**, **[po-modal-password-recovery](https://po-ui.io/documentation/po-modal-password-recovery)**, **[po-page-blocked-user](https://po-ui.io/documentation/po-page-blocked-user)**, **[po-page-dynamic-table](https://po-ui.io/documentation/po-page-dynamic-table)** entre outros, basta instalar o pacote `@po-ui/ng-templates` e incluí-lo nas dependências do seu projeto rodando o comando abaixo:

Instalando com npm:
```
npm i @po-ui/ng-templates
```

Caso prefira instalar com o yarn:
```
yarn add @po-ui/ng-templates
```

E depois adicionar o `PoTemplatesModule` no módulo principal da sua aplicação :).

A partir dai o seu projeto está preparado para receber outros componentes do **[PO UI](https://po-ui.io/documentation)**! \o/
