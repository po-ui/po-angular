
[comment]: # (@label Depreciações)
[comment]: # (@link guides/deprecations)

Às vezes as mudanças são necessárias para inovar e se manter atualizado, e para tornar essas transições o mais fácil possível, assumimos o compromisso de minimizar o número de mudanças significativas e fornecer ferramentas de migração, além disso, seguimos uma política de suspensão de uso para que você tenha tempo hábil para atualizar suas aplicações com as funcionalidades mais recentes.

## Descontinuidade

Anunciamos os recursos obsoletos no nosso [CHANGELOG](https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md). Esses recursos obsoletos aparecem na documentação com uma marcação de *`Deprecated`* e não são mais exemplificados nos *samples* do portal. Quando anunciamos uma suspensão de uso, sempre anunciamos também um caminho de atualização recomendado. Neste documento teremos um resumo dessses recursos depreciados.

Quando um recurso é descontinuado ele ainda se mantém presente geralmente pelas próximas `duas` versões principais. Depois disso esses recursos serão removidos. Uma descontinuação pode ser anunciada em qualquer versão, mas a sua remoção acontecerá apenas na versão principal. Até um recurso depreciado ser removido, manteremos o suporte a problemas críticos e de segurança e também temos ferramentas de migração que geralmente automatizam a maior parte das atualizações.

## Índice

A tabela a seguir lista todos os recursos depreciados, organizados pelo release em que serão removidos. Cada item contém um link para a seção que descreve o motivo da suspensão de uso e as opções de substituição.

<div class="po-row">
  <div class="po-xl-6 po-lg-8 po-md-10 po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Área</th>
          <th class="po-table-header-ellipsis">API ou Funcionalidade</th>
          <th class="po-table-header-ellipsis">Removida em</th>
        </tr>
      </thead>
      <tbody>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-button">PoButton</a></th>
          <td class="po-table-column">p-type</td>
          <td class="po-table-column" style="text-align: center;">v15</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Build</th>
          <td class="po-table-column">HttpClientModule</td>
          <td class="po-table-column" style="text-align: center;">v15</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

> Ver mais detalhes no nosso [CHANGELOG](https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md) e na nossa documentação das ferramentas de migração que automatizam a maioria dos breaking changes.

## Depreciações

Esta seção contém uma lista completa de todos os recursos obsoletos com detalhes para ajudá-lo a planejar sua migração.

### PoButton

<div class="po-row">
  <div class="po-xl-6 po-lg-8 po-md-10 po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Recurso</th>
          <th class="po-table-header-ellipsis">Substituição</th>
          <th class="po-table-header-ellipsis">Anúncio da Depreciação</th>
          <th class="po-table-header-ellipsis">Removido em</th>
        </tr>
      </thead>
      <tbody>
      <tr class="po-table-row">
          <th class="po-table-column">p-type</th>
          <td class="po-table-column"><a href="documentation/po-button">p-kind</a></td>
          <td class="po-table-column" style="text-align: center;">v6</td>
          <td class="po-table-column" style="text-align: center;">v15</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

#### Deprecia p-type default
Indicamos o uso da propriedade `p-kind` secondary

Antes:
```
// html
<po-button [p-type]="default" ...></po-button>

```

Depois:
```
// html
<po-button p-kind="secondary" ...></po-button>
```

#### Deprecia p-type primary
Indicamos o uso da propriedade `p-kind` primary

Antes:
```
// html
<po-button [p-type]="primary" ...></po-button>

```

Depois:
```
// html
<po-button p-kind="primary" ...></po-button>
```

#### Deprecia p-type link
Indicamos o uso da propriedade `p-kind` tertiary

Antes:
```
// html
<po-button [p-type]="link" ...></po-button>

```

Depois:
```
// html
<po-button p-kind="tertiary" ...></po-button>
```

#### Deprecia p-type danger
Indicamos o uso da propriedade `p-danger` true

Antes:
```
// html
<po-button [p-type]="danger" ...></po-button>

```

Depois:
```
// html
<po-button [p-danger]="true" ...></po-button>
```

### HttpClientModule
> O módulo HttpClientModule foi removido do projeto não sendo mais importado diretamente nos componentes que o utilizavam e por motivos de boas práticas é necessário importar o HttpClientModule apenas no módulo principal da aplicação.

Exemplo:
```
// app.module.ts
...
import { HttpClientModule } from '@angular/common/http';
...

@NgModule({
  declarations: [
    ...
    AppComponent
    ...
  ],
  imports: [
    ...
    HttpClientModule,
    ...
  ],
  providers: [],
  bootstrap: [
    ...
    AppComponent
    ...
    ]
})
export class AppModule { }

```

## Breaking Changes

<div class="po-row">
  <div class="po-xl-6 po-lg-8 po-md-10 po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Área</th>
          <th class="po-table-header-ellipsis">Funcionalidade</th>
          <th class="po-table-header-ellipsis">Substituição</th>
          <th class="po-table-header-ellipsis">Removida em</th>
        </tr>
      </thead>
      <tbody>
      <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-input">PoDynamicFormFields</a></th>
          <td class="po-table-column">p-auto-focus</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-select">PoSelect</a></th>
          <td class="po-table-column">p-auto-focus</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-switch">PoSwitch</a></th>
          <td class="po-table-column">p-auto-focus</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
         <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-button">PoButton</a></th>
          <td class="po-table-column">p-auto-focus</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
         <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-input">PoSelectOptionTemplate</a></th>
          <td class="po-table-column">-</td>
          <td class="po-table-column">PoComboOptionTemplate</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation">Components</a></th>
          <td class="po-table-column">diminuição da altura em pequenas resoluções. <a href="https://animaliads.notion.site/Bot-o-fb3a921e8ba54bd38b39758c24613368">Ver mais</a></td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v14</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoChartGaugeSerie</td>
          <td class="po-table-column"><a href="documentation/po-gauge">PoGauge</a></td>
          <td class="po-table-column" style="text-align: center;">v6</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoChartSerie.category</td>
          <td class="po-table-column">PoChartSerie.label</td>
          <td class="po-table-column" style="text-align: center;">v6</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoChartSerie.value</td>
          <td class="po-table-column">PoChartSerie.data</td>
          <td class="po-table-column" style="text-align: center;">v6</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoChartType.Gauge</td>
          <td class="po-table-column"><a href="documentation/po-gauge">PoGauge</a></td>
          <td class="po-table-column" style="text-align: center;">v6</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-navbar">PoNavBar</a></th>
          <td class="po-table-column">p-menu</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v6</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoPieChartSeries</td>
          <td class="po-table-column">PoChartSerie</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoDonutChartSeries</td>
          <td class="po-table-column">PoChartSerie</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoBarChartSeries</td>
          <td class="po-table-column">PoChartSerie</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoColumnChartSeries</td>
          <td class="po-table-column">PoChartSerie</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoLineChartSeries</td>
          <td class="po-table-column">PoChartSerie</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-single-select</td>
          <td class="po-table-column">[p-single-select]="false"</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-hide-select-all</td>
          <td class="po-table-column">[p-hide-select-all]="false"</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-striped</td>
          <td class="po-table-column">[p-striped]="false"</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-show-more-disabled</td>
          <td class="po-table-column">[p-show-more-disabled]="false"</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-sort</td>
          <td class="po-table-column">[p-sort]="false"</td>
          <td class="po-table-column" style="text-align: center;">v5</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-list">PoPageList</a></th>
          <td class="po-table-column">PoPageFilter.ngModel</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v4</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-list">PoPageList</a></th>
          <td class="po-table-column">PoPageFilter.action: string</td>
          <td class="po-table-column">PoPageFilter.action: Function</td>
          <td class="po-table-column" style="text-align: center;">v4</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-list">PoPageList</a></th>
          <td class="po-table-column">PoPageFilter.advancedAction: string</td>
          <td class="po-table-column">PoPageFilter.advancedAction: Function</td>
          <td class="po-table-column" style="text-align: center;">v4</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-login">PoPageLogin</a></th>
          <td class="po-table-column">PoPageLoginLiterals.title</td>
          <td class="po-table-column">p-product-name</td>
          <td class="po-table-column" style="text-align: center;">v4</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-chart">PoChart</a></th>
          <td class="po-table-column">PoChartOptions.axis.axisXGridLines</td>
          <td class="po-table-column">PoChartOptions.axis.gridLines</td>
          <td class="po-table-column" style="text-align: center;">v4</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-sync">PoSync</a></th>
          <td class="po-table-column">portinari_sync_date</td>
          <td class="po-table-column">po_sync_date</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-upload">PoUpload</a></th>
          <td class="po-table-column">PoUploadLiterals.cancel</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-upload">PoUpload</a></th>
          <td class="po-table-column">PoUploadLiterals.deleteFile</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-upload">PoUpload</a></th>
          <td class="po-table-column">PoUploadLiterals.tryAgain</td>
          <td class="po-table-column">-</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-lookup">PoLookup</a></th>
          <td class="po-table-column">getFilteredData</td>
          <td class="po-table-column">getFilteredItems</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-table">PoTable</a></th>
          <td class="po-table-column">p-checkbox</td>
          <td class="po-table-column">p-selectable</td>
          <td class="po-table-column" style="text-align: center;">v3</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-input">PoField</a></th>
          <td class="po-table-column">p-focus</td>
          <td class="po-table-column">p-auto-focus</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Packages</th>
          <td class="po-table-column">@portinari/portinari-ui</td>
          <td class="po-table-column">@po-ui/ng-components</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Packages</th>
          <td class="po-table-column">@portinari/portinari-templates</td>
          <td class="po-table-column">@po-ui/ng-templates</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Packages</th>
          <td class="po-table-column">@portinari/portinari-code-editor</td>
          <td class="po-table-column">@po-ui/ng-code-editor</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Packages</th>
          <td class="po-table-column">@portinari/portinari-storage</td>
          <td class="po-table-column">@po-ui/ng-storage</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column">Packages</th>
          <td class="po-table-column">@portinari/portinari-sync</td>
          <td class="po-table-column">@po-ui/ng-sync</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-http-interceptor">PoHttpInterceptor</a></th>
          <td class="po-table-column">X-Portinari-No-Message</td>
          <td class="po-table-column">X-PO-No-Message</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-http-interceptor">PoHttpInterceptor</a></th>
          <td class="po-table-column">X-Portinari-SCREEN-LOCK</td>
          <td class="po-table-column">X-PO-SCREEN-LOCK</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-http-interceptor">PoHttpInterceptor</a></th>
          <td class="po-table-column">X-Portinari-No-Count-Pending-Requests</td>
          <td class="po-table-column">X-PO-No-Count-Pending-Requests</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-detail">PoPageDetail</a></th>
          <td class="po-table-column">reconhecimento das ações via funções no typescript</td>
          <td class="po-table-column">utilização das propriedades p-back, p-edit e p-remove</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
        <tr class="po-table-row">
          <th class="po-table-column"><a href="documentation/po-page-edit">PoPageEdit</a></th>
          <td class="po-table-column">reconhecimento das ações via funções no typescript</td>
          <td class="po-table-column">utilização das propriedades p-save, p-save-new e p-cancel</td>
          <td class="po-table-column" style="text-align: center;">v2</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

> Ver mais detalhes no nosso [CHANGELOG](https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md) e na nossa documentação das ferramentas de migração que automatizam a maioria dos breaking changes.
