[comment]: # (@label Schematics)
[comment]: # (@link guides/schematics)

O PO contém *schematics* do [Angular CLI](https://angular.io/cli) em seu pacote, para facilitar o desenvolvimento de aplicações PO.

## Instalando

Um vez que for instalado o pacotes, teremos disponível os *schematics* através do Angular CLI.

### PO UI Components

Caso esteja iniciando uma aplicação com PO, indica-se utilizar o comando abaixo,
no qual será instalado o pacote `@po-ui/ng-components` e realizadas algumas configurações, que serão descritas em seguida:

```
ng add @po-ui/ng-components
```

- Substitui o `AppComponent` com uma estrutura incial de um projeto, utilizando os components `po-page-default`, `po-toolbar`, e `po-menu`;
- Importa o módulo do PO;
- Configura o tema do PO no projeto;

### PO UI Templates

Para a utilização de componentes de template o processo para inclusão é semelhante.
Primeiramente, deve-se utilizar o comando abaixo, no qual será instalado o pacote `@po-ui/ng-templates`:

```
ng add @po-ui/ng-templates
```

- Importa o módulo do PO;
- Configura o tema do PO no projeto caso não possua;
