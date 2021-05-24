[comment]: # (@label Começando com o PO Sync)
[comment]: # (@link guides/sync-get-started)

Esse guia servirá para criar e configurar uma aplicação em [Ionic 5](https://beta.ionicframework.com/docs/) com o uso do PO Sync.

Para maiores detalhes sobre os serviços e métodos utilizados neste tutorial, consulte a documentação de
[Fundamentos do PO Sync](/guides/sync-fundamentals) e a documentação de referência de [API do PO Sync](/documentation/po-sync).

### Pré-requisitos

- [Node.js e NPM](https://nodejs.org/en/)
- [Angular CLI](https://cli.angular.io/) (^12.0.0):
  - ```shell
    npm install -g @angular/cli@12
    ```
- [Ionic](https://ionicframework.com/docs/cli/) (^6.0.0):
  - ```shell
    npm install -g @ionic/cli@6
    ```
- [Cordova](https://cordova.apache.org/docs/en/latest/) (10.0.0):
  - ```shell
    npm i -g cordova
    ```


> É importante ter conhecimento prévio em Angular e Ionic para seguir esta documentação e obter melhor entendimento do PO Sync.

### Passo 1 - Criando o aplicativo

Para a aplicação de exemplo usaremos o template *blank* do Ionic. Para isso, execute o seguinte comando:

```shell
ionic start po-sync-getting-started blank --no-deps
```

> `--no-deps`: pula a instalação das dependências do `package.json`.

Caso surja a questão relacionada ao framework desejado, opte por `Angular`.

### Passo 2 - Instalando as dependências

É necessário realizar alguns ajustes de compatibilidade do PO para o projeto criado.

Navegue até a pasta do aplicativo:
```shell
cd po-sync-getting-started
```

Antes de executar a instalação, é necessário que todas as dependências do projeto estejam declaradas de acordo com a versão do PO no arquivo `package.json`, localizado na raiz da aplicação:

```typescript
  ...
  "dependencies": {
    "@angular/animations": "~12.0.1",
    "@angular/common": "~12.0.1",
    "@angular/core": "~12.0.1",
    "@angular/forms": "~12.0.1",
    "@angular/platform-browser": "~12.0.1",
    "@angular/platform-browser-dynamic": "~12.0.1",
    "@angular/router": "~12.0.1",
    "@angular/service-worker": "~12.0.1",
    "@ionic-native/core": "^5.0.0",
    "@ionic-native/splash-screen": "^5.0.0",
    "@ionic-native/status-bar": "^5.0.0",
    "@ionic/angular": "^5.5.2",
    "rxjs": "~6.6.0",
    "tslib": "^2.1.0",
    "zone.js": "~0.11.4"
    ...
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~12.0.1",
    "@angular/cli": "~12.0.1",
    "@angular/compiler": "~12.0.1",
    "@angular/compiler-cli": "~12.0.1",
    "@angular/language-service": "~12.0.1",
    "@ionic/angular-toolkit": "^4.0.0",
    "typescript": "~4.2.4"
  },
  ...
```

> Após configurar seu arquivo, certifique-se de salvar as alterações realizadas.

Execute o seguinte comando para instalar as dependências:

```shell
npm install
```

### Passo 3 - Instalando o po-sync

Para instalar o `po-sync` no aplicativo execute o seguinte comando:

```shell
ng add @po-ui/ng-sync
```

Após a instalação do `po-sync`, é necessário instalar o plugin
[cordova-plugin-network-information](https://github.com/apache/cordova-plugin-network-information) utilizado pelo [@ionic-native/network](https://ionicframework.com/docs/native/network/), para que a
aplicação realize as sincronizações com sucesso.

Para realizar essa instalação, execute o seguinte comando:

```shell
ionic cordova plugin add cordova-plugin-network-information
```

### Passo 4 - Utilizando o po-sync

#### Passo 4.1 - Importando o `po-sync` e o `po-storage`
No arquivo `src/app/app.module.ts`, adicione a importação dos módulos do `po-storage` e do `po-sync`: 

> Caso você utilize o comando `ng add`, esse passo será feito automaticamente.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

/* Imports adicionados */
import { PoStorageModule } from '@po-ui/ng-storage';
import { PoSyncModule } from '@po-ui/ng-sync';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PoStorageModule.forRoot(), // import do módulo Po Storage
    PoSyncModule, // import do módulo Po Sync
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### Passo 4.2 - Mapeando seu primeiro *schema*

O `po-sync` utiliza a definição de `schemas`, onde cada `schema` representa um modelo de dados armazenado no dispositivo.

Crie o arquivo `src/app/home/conference-schema.constants.ts` e adicione o conteúdo abaixo:

```typescript
import { PoSyncSchema } from '@po-ui/ng-sync';

export const conferenceSchema: PoSyncSchema = {
  getUrlApi: 'https://po-sample-conference.herokuapp.com/conferences',
  diffUrlApi: 'https://po-sample-conference.herokuapp.com/conferences/diff',
  deletedField: 'deleted',
  fields: [ 'id', 'title', 'location', 'description' ],
  idField: 'id',
  name: 'conference',
  pageSize: 1
};
```

### Passo 5 - Configurando o método prepare

Após ter o seu primeiro *schema* criado, configure o seu aplicativo utilizando o `po-sync` através do método `PoSyncService.prepare()`.

#### Passo 5.1 - Alterando o `src/app/app.component.ts`

Substitua o conteúdo do arquivo pelo conteúdo abaixo:

```typescript
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PoSyncConfig, PoNetworkType, PoSyncService } from '@po-ui/ng-sync';

import { conferenceSchema } from './home/conference-schema.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private poSync: PoSyncService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initSync();

    });
  }

  initSync() {
    const config: PoSyncConfig = {
      type: PoNetworkType.ethernet
    };
    const schemas = [conferenceSchema];

    this.poSync.prepare(schemas, config).then(() => {
      this.poSync.sync();
    });
  }
}
```

Após utilizar o método `PoSyncService.prepare()`, a aplicação estará pronta para sincronizar os dados através do método `PoSyncService.sync()`.

### Passo 6 - Acessando os dados

Localize o arquivo `src/app/home/home.page.ts` e faça as seguintes alterações:

```typescript
import { Component } from '@angular/core';

import { PoSyncService } from '@po-ui/ng-sync';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  conference;

  constructor(private poSync: PoSyncService) {
    this.poSync.onSync().subscribe(() => this.loadHomePage());
  }

  async loadHomePage() {
    this.conference = await this.poSync.getModel('conference').findOne().exec();
  }

  clear() {
    this.conference = null;
  }

}
```

No construtor, foi realizado uma inscrição no método `PoSyncService.onSync()`, para quando ocorrer uma sincronização, o método `loadHomePage()` busque um registro do *schema* "Conference".

### Passo 7 - Exibindo os dados em tela

No arquivo `src/app/home/home.page.html` crie a seguinte estrutura:
```html
<ion-content class="ion-padding">
  <ion-button expand="full" (click)="loadHomePage()">Buscar informações</ion-button>
  <ion-button expand="full" color="danger" (click)="clear()">Apagar informações</ion-button>

  <ion-card *ngIf="conference">
    <ion-card-content>
      <ion-card-title>
        {{ conference.title }}
      </ion-card-title>
      <p>{{ conference.description }}</p>
      <p>{{ conference.location }}</p>
    </ion-card-content>
  </ion-card>
</ion-content>
```

### Passo 8 - Executando o aplicativo

Execute o comando `ionic serve` e verifique o funcionamento do aplicativo Ionic com `po-sync`.

#### Passo 8.1 - Entendendo o funcionamento do `po-sync`

- O aplicativo sincroniza os dados que estão no servidor através do método `PoSyncService.sync()`;

- Durante esta sincronização é efetuada a busca dos registros utilizando a URL de GET, informada no `conference-schema.constants.ts`, e o retorno é salvo no dispositivo do cliente;

- Com os dados salvos no dispositivo, é possível desabilitar o acesso à internet do aplicativo e ainda continuar acessando os dados através do `po-sync`.

Demonstração do aplicativo acessando os dados *offline*:

![Getting Started App](./assets/graphics/po-sync/app-get-started.gif)

### Próximos passos

- Leia sobre os principais [fundamentos do PO Sync](./guides/sync-fundamentals).

- Saiba mais sobre a [API do PO Sync](./documentation/po-sync).
