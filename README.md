### Pré-requisitos

Para começar a utilização do PO tenha em mãos o `Node.js` instalado (deve-se utilizar a versão 10.x ou acima) e o seu gerenciador de pacote favorito atualizado. Caso você ainda não tenha instalado o pacote `@angular/cli`, instale-o via `npm` ou `yarn`.

Instalando com npm:
```
npm i -g @angular/cli
```

Caso prefira o yarn:
```
yarn global add @angular/cli
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

Abra seu browser e acesse a url http://localhost:4200. Pronto seu projeto deve estar parecido com essa imagem.

<p class="po-text-center">
  <img src="./assets/graphics/app-running.png" width="660px">
</p>

----

### E agora?

Agora é só abrir seu **editor / IDE** favorito e começar a trabalhar no seu projeto.

O `@portinari/portinari-ui` por padrão irá configurar uma aplicação com menu lateral, isso já vai ajudar bastante se você está começando a se aventurar no PO e/ou em aplicações Angular.

A partir daqui você está apto a adicionar outros componentes do **Portinari**.
