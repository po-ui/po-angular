<p align="center">
  <a href="https://po-ui.io">
    <img width="250" src="./docs/assets/po-logos/po_black.svg">
  </a>
</p>

<div align="center">

Biblioteca de componentes de UI para Angular.

</div>

---

### Pré-requisitos

Para começar a utilizar o **PO UI** é pré-requisito ter o `Node.js` instalado (versão 10.x ou acima) e o seu gerenciador de pacote favorito na versão mais atual. Caso você ainda não tenha instalado o pacote `@angular/cli`, instale-o via `npm` ou `yarn`.

Instalando com npm:
```
npm i -g @angular/cli@9.1.0
```

Caso prefira instalar com o yarn:
```
yarn global add @angular/cli@9.1.0
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
    "@angular/animations": "~9.1.0",
    "@angular/common": "~9.1.0",
    "@angular/compiler": "~9.1.0",
    "@angular/core": "~9.1.0",
    "@angular/forms": "~9.1.0",
    "@angular/platform-browser": "~9.1.0",
    "@angular/platform-browser-dynamic": "~9.1.0",
    "@angular/platform-server": "~9.1.0",
    "@angular/router": "~9.1.0",
    "rxjs": "~6.5.4",
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
