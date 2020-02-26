[comment]: # (@label Primeiros passos)
[comment]: # (@link guides/getting-started)

### Pré-requisitos

Para começar a utilizar o **Po** (Portinari UI) tenha em mãos o `Node.js` instalado (deve-se utilizar a versão 10.x ou acima) e o seu gerenciador de pacote favorito atualizado. Caso você ainda não tenha instalado o pacote `@angular/cli`, instale-o via `npm` ou `yarn`.

Instalando com npm:
```
npm i -g @angular/cli@8.0.0
```

Caso prefira o yarn:
```
yarn global add @angular/cli@8.0.0
```

### Passo 1 - Crie o seu primeiro projeto

> Caso você já tenha um projeto criado e deseja apenas incluir o **Po**, pule esta etapa e vá para o **Passo 1.1**.

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

Após verificar se estas dependências do seu projeto estão com as versões compatíveis declaradas acima, acesse a pasta raiz do seu projeto e execute o comando abaixo:

Instalando com npm:
```
npm install
```

Caso prefira o yarn:
```
yarn install
```

### Passo 2 - Adiconando o pacote @portinari/portinari-ui

Utilizando o comando `ng add` do [Angular CLI](https://cli.angular.io/), vamos adicionar o **Po** em seu projeto e o mesmo se encarregará de configurar o tema, instalar o pacote e importar o módulo do **Po**.

Execute o comando abaixo na pasta raiz do seu projeto:

```
ng add @portinari/portinari-ui
```

> Ao executar o comando acima, será perguntado se deseja incluir uma estrutura inicial em seu projeto com menu lateral, página e toolbar, utilizando componentes do **Po**, **caso desejar, apenas informe: `Y`**.

### Passo 3 - Rode o seu projeto

Agora basta executar mais um comando para subir a aplicação e ver o seu projeto rodando no *browser* ;).

```
ng serve
```

Abra o *browser* e acesse a url http://localhost:4200. Pronto! Se você escolheu incluir uma estrutura inicial em seu projeto, ele deve estar parecido com essa imagem:

<p class="po-text-center">
  <img src="./assets/graphics/app-running.png" width="660px">
</p>

----

### E agora?

Agora é só abrir seu **editor / IDE** favorito e começar a trabalhar no seu projeto.

Caso você queira utilizar nossos componentes de templates, como o **[po-page-login](/documentation/po-page-login)**, **[po-modal-password-recovery](/documentation/po-modal-password-recovery)**, **[po-page-blocked-user](/documentation/po-page-blocked-user)**, **[po-page-dynamic-table](/documentation/po-page-dynamic-table)** entre outros, basta instalar o pacote `@portinari/portinari-templates` e incluí-lo nas dependências do seu projeto rodando o comando abaixo:

Instalando com npm:
```
npm i --save @portinari/portinari-templates
```

Caso prefira o yarn:
```
yarn add @portinari/portinari-templates
```

E depois adicionar o `PoTemplatesModule` no módulo principal da sua aplicação :).

A partir dai o seu projeto está preparado para receber outros componentes do **[Po](/documentation)**! \o/
