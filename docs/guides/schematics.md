[comment]: # (@label Schematics)
[comment]: # (@link guides/schematics)

O PO contém *schematics* do [Angular CLI](https://angular.io/cli) em seu pacote, para facilitar o desenvolvimento de aplicações PO.

## Instalando Schematics

Um vez que for instalado o pacote `@portinari/portinari-ui`, teremos disponível os *schematics* através do Angular CLI.

Caso esteja iniciando uma aplicação com PO, indica-se utilizar o comando abaixo,
no qual será instalado o pacote `@portinari/portinari-ui` e realizadas algumas configurações, que serão descritas em seguida:

```
ng add @portinari/portinari-ui
```

- Substitui o `AppComponent` com uma estrutura incial de um projeto, utilizando os components `po-page-default`, `po-toolbar`, e `po-menu`;
- Importa o módulo do PO;
- Configura o tema do PO no projeto;

### Schematics 

O `PO` vem com vários `schematics` que podem ser usados ​​para gerar componentes facilmente.

Para gerar o componente, execute o comando abaixo, onde ```schematic-name``` é o componente que deseja:

```
ng generate @portinari/portinari-ui:<schematic-name>
```

<div class="po-row">
  <div class="po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Nome</th>
          <th class="po-table-header-ellipsis">Descrição</th>
        </tr>
      </thead>
      <tbody>
        <tr class="po-table-row">
          <td class="po-table-column"> [**po-page-list**](https://portinari.io/documentation/po-page-list)
          </td>
          <td class="po-table-column">
            Componente que deve ser utilizado como o container principal para as telas de listagem de dados, podendo ser apresentado como lista ou tabela.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          [**po-page-default**](https://portinari.io/documentation/po-page-default)
          </td>
          <td class="po-table-column">Componente que deve ser utilizado como o container principal para as telas sem um template definido.</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">[**po-page-edit**](https://portinari.io/documentation/po-page-edit)</td>
          <td class="po-table-column">Componente que deve ser utilizado como container principal para tela de edição ou adição de um registro.</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">[**po-page-detail**](https://portinari.io/documentation/po-page-detail)</td>
          <td class="po-table-column">Componente que deve ser utilizado como container principal para a tela de detalhamento de um registro.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
