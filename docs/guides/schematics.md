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

## Generate Schematics 

O `PO` vem com vários `schematics` que podem ser usados ​​para gerar componentes facilmente.

Para gerar o componente, execute o comando abaixo, onde `package` é o pacote e ```schematic-name``` o componente que deseja:

```
ng generate <package>:<schematic-name>
```

> A lista de opções disponíveis que o CLI oferece para o *ng generate* é vista acrescentando `--help` no comando.

### PO UI Components

```
ng generate @po-ui/ng-components:<schematic-name>
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
          <td class="po-table-column"><a href="/documentation/po-page-list"><strong>po-page-list</strong></a>
          </td>
          <td class="po-table-column">
            Componente que deve ser utilizado como o container principal para as telas de listagem de dados, podendo ser apresentado como lista ou tabela.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-page-default"><strong>po-page-default</strong></a>
          </td>
          <td class="po-table-column">Componente que deve ser utilizado como o container principal para as telas sem um template definido.</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-edit"><strong>po-page-edit</strong></a>
          </td>
          <td class="po-table-column">Componente que deve ser utilizado como container principal para tela de edição ou adição de um registro.</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-detail"><strong>po-page-detail</strong></a>
          </td>
          <td class="po-table-column">Componente que deve ser utilizado como container principal para a tela de detalhamento de um registro.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

### Po UI Templates
```
ng generate @po-ui/ng-templates:<schematic-name>
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
          <td class="po-table-column"><a href="/documentation/po-page-dynamic-table"><strong>po-page-dynamic-table</strong></a>
          </td>
          <td class="po-table-column">Página que exibe uma lista de registros em uma tabela baseado em uma lista de fields, o mesmo também suporta metadados conforme especificado na documentação.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">
          <a href="/documentation/po-page-dynamic-detail"><strong>po-page-dynamic-detail</strong></a>
          </td>
          <td class="po-table-column">Página que serve para exibir registros em detalhes, o mesmo também suporta metadados conforme especificado na documentação.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-dynamic-edit"><strong>po-page-dynamic-edit</strong></a></td>
          <td class="po-table-column">Página que pode servir para editar ou criar novos registros, o mesmo também suporta metadados conforme especificado na documentação.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-dynamic-search"><strong>po-page-dynamic-search</strong></a></td>
          <td class="po-table-column">Componente com as ações de pesquisa já definidas, bastando que o desenvolvedor implemente apenas a chamada para as APIs e exiba as informações.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-job-scheduler"><strong>po-page-job-scheduler</strong></a></td>
          <td class="po-table-column">Página que serve para criação e atualização de agendamentos da execução de processos (Job Scheduler), como por exemplo: a geração da folha de pagamento dos funcionários. Para utilizá-la, basta informar o serviço (endpoint) para consumo, sem a necessidade de criar componentes e tratamentos dos dados.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-login"><strong>po-page-login</strong></a></td>
          <td class="po-table-column">Página utilizada como template para tela de login. Com ele é possível definirmos valores para usuário, senha e definir ações para recuperação de senha e gravação de dados do usuário. Também é possível inserir uma imagem em conjunto com um texto de destaque.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-change-password"><strong>po-page-change-password</strong></a></td>
          <td class="po-table-column">Página utilizada como template para tela de cadastro ou alteração de senha.
          </td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column"><a href="/documentation/po-page-blocked-user"><strong>po-page-blocked-user</strong></a></td>
          <td class="po-table-column">Página utilizada como template para tela de bloqueio de usuário. 
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
