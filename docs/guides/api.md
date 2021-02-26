[comment]: # (@label Guia de implementação de APIs)
[comment]: # (@link guides/api)

## Conteúdo

- [Introdução](guides/api#introduction)
- [Formato das mensagens de resposta](guides/api#responseMessage)
  - [Mensagens de erro](guides/api#errorMessages)
  - [Mensagens de sucesso](guides/api#successMessages)
  - [Mensagens de sucesso para coleções](guides/api#successMessagesForCollections)
- [Formato das requisições para coleções](guides/api#collections)
  - [Ordenação](guides/api#order)
  - [Filtros](guides/api#filters)
  - [Paginação](guides/api#pagination)


<a id="introduction"></a>
## Introdução

Este guia tem a finalidade de exibir os modelos de requisições e respostas HTTP que o PO UI utiliza em seus componentes e *interceptors*.


<a id="responseMessage"></a>
## Formato das mensagens de resposta
Alguns componentes utilizam `endpoints` para poder buscar os itens. Para isso, é necessário que o formato no qual estes itens serão devolvidos seja padronizado, para uma comunicação mais efetiva. A seguir serão apresentados o formato de mensagem de resposta esperado pelos `endpoints`.

<a id="errorMessages"></a>
### Mensagens de erro

Para todas as mensagens que representam um erro (códigos HTTP 4xx e 5xx) deve-se retornar obrigatoriamente os campos a seguir, caso deseje apresentá-las:

```
{
    code: "Código identificador do erro",
    message: "Literal no idioma da requisição descrevendo o erro para o cliente",
    detailedMessage: "Mensagem técnica e mais detalhada do erro"
}
```

Opcionalmente pode-se retornar os campos:

- `helpUrl`: link para a documentação do erro;
- `type`: pode ser informado os seguintes valores: `error`, `warning` e `information`;
- `details`: lista de objetos de erro (recursiva) com mais detalhes sobre o erro principal.

```
{
    code: "Código identificador do erro",
    type: "error"
    message: "Literal no idioma da requisição descrevendo o erro para o cliente",
    detailedMessage: "Mensagem técnica e mais detalhada do erro",
    helpUrl: "link para a documentação do error",
    details [
        {
            code: "Código identificador do erro",
            message: "Literal no idioma da requisição descrevendo o erro para o cliente",
            detailedMessage: "Mensagem técnica e mais detalhada do erro"
        },
        {
            code: "Código identificador do erro",
            message: "Literal no idioma da requisição descrevendo o erro para o cliente",
            detailedMessage: "Mensagem técnica e mais detalhada do erro"
        },
        {
            code: "Código identificador do erro",
            message: "Literal no idioma da requisição descrevendo o erro para o cliente",
            detailedMessage: "Mensagem técnica e mais detalhada do erro"
        }
    ]
}
```

<a id="successMessages"></a>
### Mensagens de sucesso

Mensagens de sucesso (código HTTP 2xx) devem retornar diretamente a entidade que representa o objeto resultante da operação do *endpoint*. Exemplo:

```
GET https://example.com.br/api/users/10

{
    id: 10,
    name: "John",
    surname: "Doe",
    age: 25,
    country: "US"
}
```

Opcionalmente, o atributo `_messages` pode ser incluído no objeto retornado para fornecer alguma informação complementar ao processamento realizado (mensagens de aviso, de negócio, etc). 

O formato do objeto de mensagem segue o padrão anteriormente descrito, para mensagens de erro.

```
GET https://example.com.br/api/users/10
 
{
    id: 10,
    name: "John",
    surname: "Doe",
    age: 25,
    country: "US",
    _messages: [{
      code: "INFO",
      type: "information",
      message: "Esta é uma mensagem informativa",
      detailedMessage: "Mais detalhes sobre esta mensagem podem ser vistos aqui."
    }]
}
```

<a id="successMessagesForCollections"></a>
#### Mensagens de sucesso para coleções

Nos casos em que o resultado da operação do *endpoint* representa uma coleção (lista de itens), os itens devem estar agrupados em um objeto com as propriedades `hasNext`, indicando se existe uma próxima página com mais registros para aquela coleção e `items` que representam a lista de itens retornados.

```
{
  hasNext: true,
  items: [
    {},
    {},
    ...
  ]
}
```
Para o retorno de coleções, também é possível incluir o atributo `_messages`, conforme segue:

```
{
  hasNext: true,
  items: [
    {},
    {},
    ...
  ],
  _messages: [{
    code: "INFO",
    type: "information",
    message: "Uma mensagem informativa.",
    detailedMessage: "Detalhes relativos a mensagem."
  }]
}
```

<a id="collections"></a>
## Formato das requisições para as coleções

Os *endpoints* também podem receber parâmetros na requisição que servem para especificar o tipo de resposta desejada, por exemplo: ordenação. A seguir, serão apresentados os parâmetros que poderão ser enviados nessas requisições.

<a id="order"></a>
### Ordenação

Quando algum componente, como `po-lookup`, realizar alguma ordenação será enviado o parâmetro  `order`, com as seguintes características:

- campos precedidos por um sinal de subtração (-) devem ser ordenados de forma decrescente;
- campos que omitirem o sinal (subtração) devem ser ordenados de forma crescente.

Por exemplo, a seguinte requisição deve retornar a lista de usuários ordenados pelo nome de forma crescente e então pela idade de forma decrescente e pelo sobrenome de forma crescente:

```
GET https://example.com.br/api/users?order=name,-age,surname
```

<a id="filters"></a>
### Filtros

Aos realizar um filtro será enviado um parâmetro no formato `property=value`:

``` GET https://example.com.br/api/users?name=john&surname=doe ```

<a id="pagination"></a>
### Paginação

A paginação é definida pelos parâmetros `page` e `pageSize`, respeitando as seguintes regras: 

- o valor do parâmetro `page` deve ser um valor numérico (maior que zero) representando a página solicitada;
- o valor do parâmetro `pageSize` deve ser um valor numérico (maior que zero) representando o total de registros retornados na consulta;
- os parâmetros de paginação devem obedecer a semântica de multiplicador, ou seja, se o cliente solicitou `page=2` com um `pageSize=20` deve-se retornar os registros de 21 até 40;
- a resposta de uma requisição com paginação deve retornar um atributo indicando se existe uma próxima página disponível conforme descrito na [mensagem de sucesso de coleções](#successMessagesForCollections) e esse atributo deve ter o nome `hasNext`.

Por exemplo, a seguinte requisição deve retornar a quarta página de registros (dos registros 31 a 40 inclusive) de usuários:

``` GET https://example.com.br/api/users/?page=4&pageSize=10 ```
