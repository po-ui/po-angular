[comment]: # (@label Fundamentos do PO Sync)
[comment]: # (@link guides/sync-fundamentals)

## Conteúdo

- [Introdução](guides/sync-fundamentals#introduction)
- [Conhecimentos necessários](guides/sync-fundamentals#knowledge)
- [*Schemas*](guides/sync-fundamentals#schemas)
  - [Como criar um *schema*](guides/sync-fundamentals#create-schema)
  - [Schematic](guides/sync-fundamentals#schematic)
- [Preparando a API para a sincronização](guides/sync-fundamentals#prepare-api)
  - [Exclusão lógica](guides/sync-fundamentals#logical-deletion)
  - [*Endpoint* de sincronização](guides/sync-fundamentals#sync-url)
- [Preparando a aplicação](guides/sync-fundamentals#prepare)
  - [Sincronização periódica](guides/sync-fundamentals#periodic)
  - [Carga inicial dos dados](guides/sync-fundamentals#load-data)
- [Manipulando os registros de um *schema*](guides/sync-fundamentals#po-entity)
  - [Buscando os registros](guides/sync-fundamentals#find-data)
  - [Criação, atualização e exclusão de um registro](guides/sync-fundamentals#save-and-remove)
- [Sincronização manual](guides/sync-fundamentals#sync)
- [Técnicas avançadas](guides/sync-fundamentals#advanced-techniques)
  - [Notificação pós-sincronização](guides/sync-fundamentals#on-sync)
  - [Adaptando a resposta da API para o padrão do PO UI](guides/sync-fundamentals#po-data-transform)
  - [Capturando respostas da sincronização](guides/sync-fundamentals#get-responses)
  - [Inserindo requisições HTTP na fila de eventos](guides/sync-fundamentals#insert-http-command)
  - [Criação de identificador customizado para eventos da fila](guides/sync-fundamentals#custom-request-id)
  - [Alterando as definições dos *schemas*](guides/sync-fundamentals#schemas-definition)
- [Aplicativo de demonstração do PO Sync](guides/sync-fundamentals#po-conference)


<a id="introduction"></a>
## Introdução

O PO Sync é uma biblioteca que possibilita armazenar dados na aplicação local mantendo a sincronização entre os dados locais e o servidor.
Permitindo que o usuário utilize a aplicação tanto *online* quanto *offline*, com a mesma experiência de uso.

### Como o PO Sync mantém os dados atualizados com o servidor?

Todas as modificações nos registros como criar, alterar e excluir acontecem primeiramente no armazenamento local.
Para cada modificação feita em um registro também é criado um evento. Este evento representa uma operação, sendo
composto basicamente pelo tipo de operação (criação, alteração ou remoção) e o registro modificado.
Este evento é adicionado a uma fila de eventos que será consumida pelo processo de sincronização (atualização dos dados).
Este processo é demonstrado na figura a seguir:

<p style="text-align:center">
  <img src="./assets/graphics/po-sync/event-sourcing.jpg" class="po-mt-2 po-mb-2" style="max-width:100%;">
</p>

É no processo de sincronização que os dados são atualizados tanto da aplicação local para o servidor quanto do servidor para a aplicação local.

> A sincronização sempre acontece com a aplicação *online* e em segundo plano, permitindo que o usuário continue utilizando a aplicação normalmente.

#### Como ocorre a sincronização?

A sincronização dos dados acontece em duas etapas:

**1)** Busca os itens da fila de eventos e envia os dados modificados da aplicação local para o servidor sequencialmente:

<p style="text-align:center">
  <img src="./assets/graphics/po-sync/sync-send.jpg" class="po-mt-2 po-mb-2" style="max-width:100%;">
</p>

**2)** Busca os dados que foram modificados no servidor e atualiza na aplicação local:

<p style="text-align:center">
  <img src="./assets/graphics/po-sync/sync-get.jpg" class="po-mt-2 po-mb-2" style="max-width:100%;">
</p>

Esta sincronização pode ser acionada (gatilho) das seguintes formas:

- Reativa: toda vez que houver alguma mudança no hardware do dispositivo, como na troca do tipo de rede 4G para WI-FI;

- [Periódica](guides/sync-fundamentals#periodic): será acionada periodicamente baseada nos parâmetros de configurações do [PoSyncConfig](/documentation/po-sync);

- [Manualmente](guides/sync-fundamentals#sync): será acionada na chamada manual do método `PoSyncService.sync()`.

> Antes de continuar os próximos passos, siga as instruções do [Começando com o PO Sync](guides/sync-get-started) para
saber como criar um novo projeto com Ionic 5 utilizando o PO Sync.

<a id="knowledge"></a>
## Conhecimentos necessários

Para compreender o funcionamento do PO Sync e utilizá-lo é necessário ter conhecimento técnico em:

- [JavaScript (ES6)](http://es6-features.org), em particular a utilização do padrão [*Promises*](http://es6-features.org/#PromiseUsage);
- [Ionic](https://ionicframework.com/);
- [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) do [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview);
- Protocolo de comunicação HTTP;
- Arquitetura REST.

<a id="schemas"></a>
## *Schemas*

O PO Sync sincroniza os dados com base em um conjunto de *schemas*. Onde cada *schema* representa um modelo de dados,
ou seja, a estrutura lógica e as características de um conjunto de registros. Sendo semelhante a uma tabela
convencional de um banco de dados, como por exemplo uma tabela de clientes, produtos ou automóveis. No entanto os *schemas*
não possuem relacionamentos entre si como as tabelas convencionais.

<a id="create-schema"></a>
### Como criar um *schema*

Cada *schema* deve implementar a interface [PoSyncSchema](/documentation/po-sync). Para criar um *schema* que represente uma "Conferência"
podemos fazer:

```shell
ng generate @po-ui/ng-sync:schema --name=conference
```

O comando ng generate do Angular CLI criará um arquivo com uma estrutura semelhante a essa:

``` typescript
import { PoSyncSchema } from '@po-ui/ng-sync';

const conferenceSchema: PoSyncSchema = {
  // Endpoint para o método GET
  getUrlApi: 'https://po-sample-conference.herokuapp.com/conferences',
  diffUrlApi: 'https://po-sample-conference.herokuapp.com/conferences/diff',
  deletedField: 'isDeleted',
  fields: [ 'id', 'title', 'date', 'location', 'description' ],
  idField: 'id',
  name: 'conference',
  pageSize: 1
};
```

Nesta definição de *schema* podem ser configurados os *endpoints* para os métodos HTTP: GET, POST, DELETE e PATCH,
sendo somente o *endpoint* do método GET obrigatório. Caso os demais não sejam informados, será utilizado o mesmo endereço
do *endpoint* do método GET para os outros métodos.

A propriedade `fields` da interface [PoSyncSchema](/documentation/po-sync) representa os campos que estarão no registro.
Por exemplo, para um *schema* do tipo Pessoa, poderíamos ter os campos: nome, idade e endereço.

Não necessariamente precisam ser representados todos os campos retornados pela API, somente os necessários para as
manipulações através do PO Sync.

<a id="schematic"></a>
### Schematic

Você pode utilizar um schematic para criar o arquivo com a estrutura básica do schema.

Para isso utilize o comando

```shell
ng generate @po-ui/ng-sync:schema
```

Você também pode informar um caminho completo.

```shell
ng generate @po-ui/ng-sync:schema --name=conference/schema/conference
```

Ou apenas o nome do schema que ele criará o arquivo na pasta que o comando for executado.

```shell
ng generate @po-ui/ng-sync:schema --name=conference
```

<a id="prepare-api"></a>
## Preparando a API para a sincronização

Para que a sincronização aconteça corretamente é necessário que a API tenha implementado a 
[exclusão lógica](guides/sync-fundamentals#logical-deletion) e um 
[*endpoint* de sincronização](guides/sync-fundamentals#sync-url).

<a id="logical-deletion"></a>
### Exclusão lógica

A exclusão dos registros na API deverá ser feita de forma lógica, ou seja, é necessário que cada registro contenha um
campo que representa se aquele registro foi excluído, por exemplo:

``` javascript
{
  "id": 1,
  "title": "PO conference 2018",
  "date": "2018-08-11T00:00:00Z",
  "location": "Av. Santos Dumont, 831 - Santo Antônio, Joinville - SC",
  "description": "Conference organized by PO",
  // Campo informando se o registro foi excluído
  "isDeleted": false
}
```

No registro acima o campo chamado `isDeleted` descreve se ele foi excluído ou não.

Esta informação do campo deverá ser fornecida ao PO Sync dentro da declaração de cada *schema*, para isso temos a
propriedade `deletedField` na interface [PoSyncSchema](/documentation/po-sync), por exemplo:

``` typescript
import { PoSyncSchema } from '@po-ui/ng-sync';

const conferenceSchema: PoSyncSchema = {
  getUrlApi: 'https://po-sample-conference.herokuapp.com/conferences',
  diffUrlApi: 'https://po-sample-conference.herokuapp.com/conferences/diff',
  // Definição do nome do campo
  deletedField: 'isDeleted',
  fields: [ 'id', 'title', 'date', 'location', 'description' ],
  idField: 'id',
  name: 'conference',
  pageSize: 1
};
```

#### Porque exclusão lógica?

A exclusão lógica é utilizada para que outras aplicações possam saber se um registro foi removido.

Imagine que dois aplicativos estejam manipulando o mesmo registro através de um *endpoint*. Um dos aplicativos remove
este registro, como o outro aplicativo saberá que este registro foi removido? Através da exclusão lógica, o PO Sync
tem o controle dessa informação.

<a id="sync-url"></a>
### *Endpoint* de sincronização

Sempre que houver uma sincronização, uma requisição é feita neste *endpoint* utilizando a data da última sincronização
como referência (como parâmetro da URL). Ao receber esta data, o *endpoint* deve retornar todos os registros que
tiveram a última atualização maior ou igual a data que foi recebida como parâmetro, logo, somente os dados não
sincronizados serão retornados. Para cada um dos *schemas* é necessário ter um *endpoint* de sincronização.

Abra o seu navegador e acesse a URL
https://po-sample-conference.herokuapp.com/conferences/diff/2018-10-08T13:23:31.893Z.

O *endpoint* de sincronização deve retornar uma resposta com a estrutura como a da URL acima, por exemplo:

``` javascript
{
  "hasNext": false,
  "items": [],
  "po_sync_date": "2018-10-08T13:57:55.008Z"
}
```

Onde:
- `hasNext`: Indica se existe uma próxima página com mais registros para aquela coleção de itens.
- `items`: Lista de itens retornados.
- `po_sync_date`: Data da última sincronização. Ao realizar esta requisição estamos solicitando uma
sincronização, então esta data deve ser a data em que o servidor está devolvendo a resposta. Se na requisição o *endpoint*
não enviar esta data, não será possível fazer a próxima sincronização, pois esta data será utilizada
para a próxima URL de sincronização.

> Esta estrutura de resposta é padronizada pelo [Guia de implementação de APIs](https://po-ui.io/guides/api).

> **Primeira sincronização:** 
como na primeira sincronização o PO Sync ainda não recebeu nenhuma data dos *endpoints*, a URL é montada com uma data muito
antiga, o que faz com que todos os dados sejam retornados na primeira sincronização.

A definição deste *endpoint* deve ser feita na propriedade `diffUrlApi` da sua definição do *schema*, como no exemplo
abaixo:

``` typescript
import { PoSyncSchema } from '@po-ui/ng-sync';

const conferenceSchema: PoSyncSchema = {
  getUrlApi: 'https://po-sample-conference.herokuapp.com/conferences',
  // Definição da URL de sincronização
  diffUrlApi: 'https://po-sample-conference.herokuapp.com/conferences/diff',
  deletedField: 'isDeleted',
  fields: [ 'id', 'title', 'date', 'location', 'description' ],
  idField: 'id',
  name: 'conference',
  pageSize: 1
};
```

<a id="prepare"></a>
## Preparando a aplicação

Após ter criado os *schemas* e preparado a API, é necessário preparar a aplicação para utilizar o PO Sync passando para
ele os *schemas* e as configurações iniciais. Se você seguiu o guia [Começando com o PO Sync](guides/sync-get-started),
dentro do arquivo `src/app/app.component.ts`, no método `initSync()` foi feita a seguinte implementação:

``` typescript
const config: PoSyncConfig = {
  type: PoNetworkType.ethernet
};
const schemas = [conferenceSchema];

this.poSync.prepare(schemas, config).then(() => {
  this.poSync.sync();
  ...
});
```

A variável `config` implementa a interface [PoSyncConfig](/documentation/po-sync) e representa as configurações iniciais de sincronização. Neste
exemplo, a propriedade `type` descreve o tipo de conexão que irá permitir que aconteça o sincronismo. Ao terminar de
preparar a aplicação os dados estarão disponíveis para serem sincronizados do servidor para a aplicação local. Por esta razão,
após a conclusão da promessa deste método, o `poSync.sync()` pode ser chamado para sincronizar os dados.

<a id="periodic"></a>
### Sincronização periódica

Para que os dados sejam atualizados dentro de um período de tempo, modifique a constante `config` do exemplo
anterior para ficar da seguinte forma:

``` typescript
const config: PoSyncConfig = {
  type: PoNetworkType.ethernet,
  // Linha adicionada
  period: 30
};

const schemas = [conferenceSchema];

this.poSync.prepare(schemas, config).then(() => {
  this.poSync.sync();
  ...
});
```

Onde o valor da propriedade `period` define que o sincronismo deverá ser ativado a cada 30 segundos.

<a id="load-data"></a>
### Carga inicial dos dados

Caso queira fazer a carga inicial dos dados que estão no servidor antes de fazer o primeiro sincronismo, o serviço [PoSyncService](/documentation/po-sync)
disponibiliza um método chamado `PoSyncService.loadData()`.

> **Atenção:** este método deve ser chamado apenas uma vez para carregar os dados iniciais e antes do primeiro sincronismo.

Para implementar a carga inicial no código anterior, basta substituir a linha onde estava `this.poSync.sync();` pela
seguinte implementação:

``` typescript
const config: PoSyncConfig = {
  type: PoNetworkType.ethernet,
  period: 30
};

const schemas = [conferenceSchema];

this.poSync.prepare(schemas, config).then(() => {
  
  // Implementação adicionada
  if(<condicao>) {
    this.poSync.loadData();
  }

});
```

Onde `<condicao>` deve ser substituída por uma validação que verifique se é a primeira vez em que os dados estão sendo
carregados na aplicação, como por exemplo na instalação do aplicativo.

<a id="po-entity"></a>
## Manipulando os registros de um *schema*

Toda a manipulação dos registros de um *schema* como salvar, remover e buscar é feita através da instância da classe
[PoEntity](/documentation/po-entity) que pode ser obtida a partir do método `PoSyncService.getModel()`, por exemplo:

``` typescript
this.conferenceModel = await this.poSync.getModel('conference');
```

Onde o parâmetro "conference" representa o nome do *schema* que se deseja manipular.
Este é o mesmo valor colocado na propriedade `name` da interface [PoSyncSchema](/documentation/po-sync).

Agora com esta instância podemos utilizar todos os métodos do [PoEntity](/documentation/po-entity) para manipular os registros.

<a id="find-data"></a>
### Buscando os registros

> A busca dos registros sempre é feita na aplicação local, pois a mesma é atualizada com o servidor através do processo de sincronização.

Com a instância de [PoEntity](/documentation/po-entity) armazenada na propriedade `this.conferenceModel` podemos buscar
os registros com o `PoEntity.find()` da seguinte forma:

``` typescript
this.conferences = await this.conferenceModel.find().exec();
```

Podemos notar que após usar o método, foi necessário concatená-lo com o método `PoQueryBuilder.exec()`
para que a busca pudesse ser concluída e os registros serem retornados.

Isso acontece porque o método `PoEntity.find()` retorna uma instância da classe [PoQueryBuilder](/documentation/po-query-builder) e todos os métodos
desta classe podem ser encadeados e no final chamar o método `PoQueryBuilder.exec()` para concluir a busca.

Por exemplo, para buscar os dados e ordená-los pelo campo do *schema* chamado `title`, podemos fazer:

``` typescript
this.conferences = await this.conferenceModel.find().sort('title').exec();
```

E se quisermos retornar somente os campos `title` e `location`, podemos fazer:

``` typescript
this.conferences = await this.conferenceModel.find().sort('title').select('title location').exec();
```

> Para saber mais sobre os métodos para construção de consultas, acesse [PoQueryBuilder](/documentation/po-query-builder).

<a id="save-and-remove"></a>
### Criação, atualização e exclusão de um registro

Ainda com a instância de [PoEntity](/documentation/po-entity) podemos utilizar o método `PoEntity.save()` para criar um
novo registro. Portanto para criar uma nova conferência no nosso exemplo, podemos fazer:

``` typescript
const conference = { title: 'BrasilJS', location: 'Barra Shopping Sul - Porto Alegre, RS - Brasil' };

this.conferenceModel.save(conference).then(() => {
  // Conferência criada!
});
```

E para atualizar a conferência, é necessário ter o registro buscado através do [PoEntity](/documentation/po-entity),
pois este registro deverá conter o *id* depois que for salvo.

Por exemplo, para buscarmos e atualizarmos a conferência que criamos acima, podemos fazer:

**1)** Buscar a conferência pelo título "BrasilJS":

``` typescript
const conferenceUpdated = await this.conferenceModel.find().filter({ title: 'BrasilJS' }).exec();
```

**2)** Podemos atualizar a localização, por exemplo:

``` typescript
conferenceUpdated.location = 'UFRGS - Porto Alegre, RS - Brasil';
```

**3)** Utilizamos o método `PoEntity.save()` para efetuar a atualização:

``` typescript
this.conferenceModel.save(conferenceUpdated).then(() => {
  // Conferência atualizada!
});
```
Para excluir um registro também é necessário buscá-lo através do [PoEntity](/documentation/po-entity)
como na atualização e após esta busca utilizar o método `PoEntity.remove()` para remover o registro, por exemplo:

``` typescript
const conferenceRemove = await this.conferenceModel.find().filter({ title: 'BrasilJS' }).exec();

this.conferenceModel.remove(conferenceRemove).then(() => {
  // Conferência removida!
});
```

<a id="sync"></a>
## Sincronização manual

Existem casos onde o usuário do aplicativo deseja ativar manualmente a sincronização, como por exemplo apertando um
botão para atualizar os dados.

Esta operação pode ser feita através do método `PoSyncService.sync()`. Por exemplo:

``` typescript
this.poSync.sync().then(() => {
  // Sincronização concluída
}).catch(() => {
  // Erro durante a sincronização
});
```

<a id="advanced-techniques"></a>
## Técnicas avançadas

<a id="on-sync"></a>
### Notificação pós-sincronização

Em algumas situações, é necessário ser notificado sempre que uma sincronização acontecer para, por exemplo, atualizar 
a tela do usuário com os dados sincronizados. Para isso, se inscreva através do método
`PoSyncService.onSync()` que irá notificá-lo sempre que uma sincronização acontecer com sucesso.

Por exemplo, no guia [Começando com o PO Sync](guides/sync-get-started) temos a utilização do método
`PoSyncService.onSync()` dentro do `constructor()`, localizado no arquivo `src/pages/home/home.ts`:

``` typescript
constructor(public navCtrl: NavController, private poSync: PoSyncService) {
  // Deve chamar o método loadHomePage() sempre que acontecer uma sincronização
  this.poSync.onSync().subscribe(() => this.loadHomePage());
}

async loadHomePage() {
  this.conference = await this.poSync.getModel('conference').findOne().exec();
}
```

> Para saber mais sobre este método acesse [PoSyncService.onSync()](/documentation/po-sync).

<a id="po-data-transform"></a>
### Adaptando a resposta da API para o padrão do PO

O PO Sync necessita que as APIs utilizem o padrão de respostas que está no [Guia de implementação de APIs](https://po-ui.io/guides/api) que segue a seguinte estrutura:

``` javascript
{
  "hasNext": boolean,
  "items": [],
  "po_sync_date": date
}
```

No entanto, existem APIs que ainda não seguem este padrão. Imagine que você possua uma API que sempre retorne a seguinte estrutura:

``` typescript
{
  "next": string,
  "data": [],
  "sync_date": date
}
```

Onde:
- `next`: é a URL da próxima página. Por exemplo: `https://<url>?page=3`;
- `data`: lista de itens retornados;
- `sync_date`: data da última sincronização.

E a API espera para paginação os seguintes parâmetros na URL:
- `pageNumber`: indica o número da página;
- `size`: quantidade de itens por página.

Por exemplo:
```
http://<url>/?pageNumber=2&size=10
```

É possível fazer a adaptação desta resposta utilizando a classe [PoDataTransform](/documentation/po-data-transform).
Esta classe possui uma propriedade chamada `data` que representa a resposta que o *endpoint* retornou.

Para fazer a adaptação desta estrutura de resposta:

**1)** Crie uma nova classe e a faça herdar a classe [PoDataTransform](/documentation/po-data-transform):

``` typescript
import { PoDataTransform } from '@po-ui/ng-sync';

class MyDataTransform extends PoDataTransform {
  ...
}
```

**2)** Implemente os métodos da classe [PoDataTransform](/documentation/po-data-transform):

``` typescript
import { PoDataTransform } from '@po-ui/ng-sync';

class MyDataTransform extends PoDataTransform {

  getDateFieldName(): string {
    return 'sync_date';
  }

  getItemsFieldName(): string {
    return 'data';
  }

  getPageParamName(): string {
    return 'pageNumber';
  }

  getPageSizeParamName(): string {
    return 'size';
  }

  hasNext(): boolean {
    return !!this.data.next;
  }

}
```

Os primeiros quatro métodos representam os nomes que irão corresponder a cada parâmetro. No nosso exemplo, a coleção de
registros não está em uma propriedade `items` conforme o padrão PO UI, mas sim em `data`, então no método
`MyDataTransform.getItemsFieldName()` será retornado o valor `data`.

O método `MyDataTransform.hasNext()` deve retornar um valor *booleano* que determina se existe mais páginas para serem
buscadas ou não. No nosso exemplo podemos acessar a próxima página com a propriedade `next`.
Como temos acesso a resposta da API através da propriedade `data`, podemos saber se existe uma próxima página do seguinte modo:

``` typescript
hasNext(): boolean {
  return !!this.data.next;
}
```

**3)** Por fim, deve ser criado uma instância desta classe `MyDataTransform` e incluí-la na propriedade do objeto `PoSyncConfig`
que é inserido no método `PoSyncService.prepare()`, da seguinte forma:

``` typescript
const config: PoSyncConfig = {
  type: PoNetworkType.ethernet,
  period: 30,
  // Instância da classe MyDataTransform
  dataTransform: new MyDataTransform()
};

const schemas = [conferenceSchema];

this.poSync.prepare(schemas, config).then(() => {
  ...
});
```

Com isto, todas as respostas dos *endpoints* dos schemas serão adaptados para seguir o padrão de API do PO UI esperado pelo
PO Sync.

<a id="get-responses"></a>
### Capturando respostas da sincronização

Conforme os itens que estão na fila de eventos são enviados para o servidor é possível fazer este monitoramento
através da inscrição no método `PoSyncService.getResponses()`.
A inscrição realizada através do método `.subscribe()`, retorna um objeto do tipo `PoSyncResponse` que contém as
informações do item que foi consumido da fila de eventos. Exemplo de utilização:

``` typescript
this.poSync.getResponses().subscribe(poSyncResponse => {
  // Foi consumido um item da fila de eventos.
});
```

#### Em que situações este monitoramento pode ser útil?

Este monitoramento é útil para saber se os itens conseguiram ser enviados para o servidor com sucesso. Caso um item
enviado não tiver sucesso, o consumo da fila de eventos será suspenso e os demais itens não serão enviados para o
servidor enquanto este item que não está sendo enviado for resolvido.

O consumo da fila de eventos pode ser suspenso em duas situações:
- Se o servidor rejeitar a requisição com *status* diferente da classe de *status 2xx* (sucesso);
- Se um item da fila representa uma requisição de alteração ou exclusão e o registro envolvido não possuir *id*.

Para resolver este tipo de problema, uma solução é remover este item da fila de eventos, isto pode ser feito da seguinte forma:

``` typescript
// Monitora o consumo da fila de eventos
this.poSync.getResponses().subscribe(poSyncResponse => {

  // Verifica se o retorno do consumo da fila é um erro HTTP
  if (poSyncResponse.response instanceof HttpErrorResponse || poSyncResponse.response instanceof PoEventSourcingErrorResponse) {

    // Remove o item da fila de eventos
    this.poSync.removeItemOfSync(poSyncResponse.id).then(() => {
      // Sincroniza os itens novamente
      return this.poSync.resumeSync();
    });

  }

});
```

> Saiba mais sobre [PoSyncService.getResponses()](/documentation/po-sync), [PoSyncService.removeItemOfSync()](/documentation/po-sync)
e [PoEventSourcingErrorResponse](/documentation/po-event-sourcing-error-response).

<a id="insert-http-command"></a>
### Inserindo requisições HTTP na fila de eventos

A manipulação da fila de eventos é feita pelo PO Sync, mas existe a possibilidade de criar um evento na fila contendo uma
requisição HTTP customizada. Isso pode ser feito através da utilização do método `PoSyncService.insertHttpCommand()`.
Este método recebe como primeiro parâmetro um objeto no formato [PoHttpRequestData](/documentation/po-sync) que contém as informações da requisição.
Exemplo de utilização:

``` typescript
const poHttpRequestData: PoHttpRequestData = {
  // URL que será enviada na requisição
  url: 'http://<url>',

  // Método HTTP que será utilizado
  method: PoHttpRequestType.POST,

  // Corpo da requisição
  body: { record: 'example' }
};

this.poSync.insertHttpCommand(poHttpRequestData).then(commandId => {
  // Item adicionado na fila de eventos e retornado o ID do evento em "commandId"
});
```

O método `PoSyncService.insertHttpCommand()` retorna uma promessa e no parâmetro do *callback* da promessa é fornecido
o identificador daquele evento. Este identificador por ser armazenado e utilizado posteriormente em alguma validação no método
[PoSyncService.getResponses()](/documentation/po-sync), por exemplo:

``` typescript
this.poSync.getResponses().subscribe(poSyncResponse => {

  if(poSyncResponse.id === this.commandResponseId) {
    // É o evento de requisição HTTP customizado
  }

});

const poHttpRequestData: PoHttpRequestData = {
  // URL que será enviada na requisição
  url: 'http://<url>',

  // Método HTTP que será utilizado
  method: PoHttpRequestType.POST,

  // Corpo da requisição
  body: { record: 'example' }
};


this.poSync.insertHttpCommand(poHttpRequestData).then(commandId => {
  // Atribuição do identificador do evento a uma propriedade
  this.commandResponseId = commandId
});
```

Também é possível fazer o envio de arquivo (File) para o servidor utilizando o `Content-Type: multipart/form-data`. Para isso, deve ser informado no `body` o `rawFile`, conforme exemplo abaixo:

``` typescript
public insertFileHttpCommand(file: File) {
  const requestData: PoHttpRequestData = {
    url: 'http://my-server/api/v1/upload';,
    method: PoHttpRequestType.POST,
    headers: Array<PoHttpHeaderOption> = [{ name: 'Authorization', value: 'Basic ' + btoa('13' + ':' + '13') }],
    body: file.rawFile,
    formField: 'files',
  };

  this.poSync.insertHttpCommand(requestData).then(commandId => {
    // Evento HTTP adicionado na fila de eventos e retornado o ID do evento em "commandId"
  });
}
```
> Caso não seja passado nenhum valor para a propriedade `formField` será aplicado o valor padrão `file`.

> Para o envio de arquivos recomendamos o uso prioritário do `lokijs` nas configurações do `PoStorageModule` por sua maior capacidade de armazenamento.
A configuração deve ser feita no `app.module.ts` da sua aplicação, por exemplo:

``` typescript
...
@NgModule({
  ...
  imports: [
    ...
    PoStorageModule.forRoot({ // import do módulo Po Storage,
      name: 'mystorage',
      storeName: '_mystore',
      driverOrder: ['lokijs', 'indexeddb', 'localstorage', 'websql']
    }),
    PoSyncModule, // import do módulo Po Sync
  ],
  ...
})
export class AppModule {}
```

<a id="custom-request-id"></a>
### Criação de identificador customizado para eventos da fila

Para monitorar se um evento em específico foi enviado ou não para o servidor é possível criar um identificador customizado
para ele e inseri-lo como parâmetro nos métodos `PoEntity.save()`, `PoEntity.remove()` ou `PoSync.insertHttpCommand`. Este identificador é retornado junto com o objeto `PoSyncResponse` do método `PoSync.getResponses()`, o que possibilita identificar se o evento foi enviado ou não, da seguinte forma:

Na criação ou alteração de um registro:

``` typescript
// Capturando os eventos enviados ao servidor
this.poSync.getResponses().subscribe(poSyncResponse => {

  if (poSyncResponse.customRequestId === customId) {
    // A criação/alteração com o id-1234 foi processado no servidor
  }

});

const conferenceModel = this.poSync.getModel('conference');

const customId = 'id-1234';

// Inserido o identificador 'customId' no segundo parâmetro
conferenceModel.save(conference, customId).then(() => {});
```

Na remoção de um registro:

``` typescript
// Capturando os eventos enviados ao servidor
this.poSync.getResponses().subscribe(poSyncResponse => {

  if (poSyncResponse.customRequestId === customId) {
    // A remoção com o id-ABC foi processado no servidor
  }

});

const conferenceModel = this.poSync.getModel('conference');

const customId = 'id-ABC';

// Inserido o identificador 'customId' no segundo parâmetro
conferenceModel.remove(conference, customId).then(() => {});
```

Ou na criação de uma requisição HTTP customizada:

``` typescript
// Capturando os eventos enviados ao servidor
this.poSync.getResponses().subscribe(poSyncResponse => {
  
  if (poSyncResponse.customRequestId === customId) {
    // A requisição HTTP com o id-XYZ foi processado no servidor
  }

});

const customId = 'id-XYZ';

// Inserido o identificador 'customId' no segundo parâmetro
this.poSync.insertHttpCommand(poHttpRequestData, customId).then(() => {});
```

<a id="schemas-definition"></a>
### Alterando as definições dos *schemas*

Em algumas situações, pode existir a necessidade de alterar a definição do *schema* que foi inserido como 
parâmetro dentro do método `PoSyncService.prepare()`. Uma alternativa para fazer esta alteração é:

**1)** Chamar o método [`PoSynceService.destroy()`](/documentation/po-sync):

``` typescript
this.poSync.destroy().then(() => {
  // As definições dos schemas, os itens da fila de eventos e todos os registros foram destruídos
});
```

> **Atenção:** ao utilizar o método `PoSynceService.destroy()`, todos os registros armazenados localmente
serão removidos inclusive os itens que estiverem na fila de eventos esperando para sincronizar.

**2)** E após a conclusão da promessa do método `PoSynceService.destroy()` chamar o método
`PoSyncService.prepare()` com a nova definição:

``` typescript
// Schemas atualizados
const schemasUpdated = [...];

this.poSync.destroy()
  .then(() => this.poSync.prepare(schemasUpdated, config))
  .then(() => {
    // Definições dos schemas atualizadas
  });
```

> **Atenção:** para que não venham ocorrer erros em ações que dependem das definições dos *schemas*, recomenda-se utilizar
o método `PoSyncService.prepare()` logo após o método `PoSynceService.destroy()`.

<a id="po-conference"></a>
## Aplicativo de demonstração do PO Sync

PO Conference Application é um aplicativo de demonstração do PO Sync baseado no [Ionic Conference Application](https://github.com/ionic-team/ionic-conference-app). Tendo como objetivo, demonstrar as funcionalidades do PO Sync de forma didática.

> Acesse o repositório do aplicativo [neste link](https://github.com/po-ui/po-sample-conference).
