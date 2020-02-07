
<p align="center">
  <a href="https://portinari.io">
    <img width="250" src="./logo.jpg">
  </a>
</p>

<div align="center">

Biblioteca de componentes de UI para Angular.

[![Travis branch](https://img.shields.io/travis/com/portinariui/portinari-angular/master?style=flat-square)](https://travis-ci.com/portinariui/portinari-angular)
[![npm package](https://img.shields.io/npm/v/@portinari/portinari-ui?color=%23c9357d&style=flat-square)](https://www.npmjs.org/package/@portinari/portinari-ui)
[![NPM downloads](https://img.shields.io/npm/dm/@portinari/portinari-ui?color=c9357d&label=npm%20downloads&style=flat-square)](https://npmjs.com/package/@portinari/portinari-ui)
[![GitHub license](https://img.shields.io/npm/l/@portinari/portinari-ui?color=%23c9357d&style=flat-square)](https://github.com/portinariui/portinari-angular/blob/master/LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-PortinariUI-c9357d?style=flat-square&logo=twitter)](https://twitter.com/portinariui)

</div>

---

### Pré-requisitos

Para começar a utilização do PO tenha em mãos o `Node.js` instalado (deve-se utilizar a versão 10.x ou acima) e o seu gerenciador de pacote favorito atualizado. Caso você ainda não tenha instalado o pacote `@angular/cli`, instale-o via `npm` ou `yarn`.

Instalando com npm:
```
npm i -g @angular/cli@8.0.0
```

Caso prefira o yarn:
```
yarn global add @angular/cli@8.0.0
```

### Passo 1 - Crie o seu primeiro projeto

O [Angular CLI](https://cli.angular.io/) se encarrega de construir toda estrutura inicial do projeto. Para isso, execute o seguinte comando:

```
ng new my-po-project --skipInstall
```

> O parâmetro `--skip-install` permite criar o projeto, contudo, não instalará as dependências automaticamente.


#### Passo 1.1 - Instalando as dependências

Antes de executar a instalação, é necessário que todas as dependências do projeto estejam declaradas de acordo com a versão
do PO e Angular no arquivo **package.json**, localizado na raiz da aplicação.

```
  "dependencies": {
    "@angular/animations": "~8.0.0",
    "@angular/common": "~8.0.0",
    "@angular/compiler": "~8.0.0",
    "@angular/core": "~8.0.0",
    "@angular/forms": "~8.0.0",
    "@angular/platform-browser": "~8.0.0",
    "@angular/platform-browser-dynamic": "~8.0.0",
    "@angular/platform-server": "~8.0.0",
    "@angular/router": "~8.0.0",
    "rxjs": "~6.4.0",
    "zone.js": "~0.9.1"
    ...
  }
```

Após verificar as dependencias, acesse a pasta raiz do seu projeto e execute o comando abaixo:

Instalando com npm:
```
npm install
```

Caso prefira o yarn:
```
yarn install
```

### Passo 2 - Adiconando o pacote @portinari/portinari-ui

Utilizando o comando `ng add` do [Angular CLI](https://cli.angular.io/), vamos adicionar o PO em seu projeto e o mesmo se encarregará de configurar o tema, instalar o pacote e importar o módulo do PO.

Execute o comando abaixo na pasta raiz do seu projeto:

```
ng add @portinari/portinari-ui
```

> Ao executar o comando acima, será perguntado se deseja incluir uma estrutura incial em seu projeto, utilizando componentes do PO, caso desejar, apenas informe: `Y`.

### Passo 3 - Rode o seu projeto

Agora basta rodar mais um comando para ver seu projeto no ar.

```
ng serve
```

Pronto, agora abra seu browser e acesse a url http://localhost:4200 para ver o resultado.

----

### E agora?

Agora é só abrir seu **editor / IDE** favorito e começar a trabalhar no seu projeto.

O `@portinari/portinari-ui` por padrão irá configurar uma aplicação com menu lateral, isso já vai ajudar bastante se você está começando a se aventurar no PO e/ou em aplicações Angular.

A partir daqui você está apto a adicionar outros componentes do **Portinari**.
