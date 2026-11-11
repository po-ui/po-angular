const capitalize = require('capitalize'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  getDirName = require('path').dirname,
  handlebars = require('handlebars');
configuration = require('./../../configuration');

/**
 * Título e troca de modo da página de cada componente: "Accordion · Exemplos" / "Accordion · Documentação".
 * Para chamar a documentação de "API", troque `doc` (e o rótulo de `toDoc`, se quiser).
 */
const PAGE_MODES = {
  separator: ' · ',
  web: 'Exemplos',
  doc: 'Documentação',
  toWeb: { label: 'Ver exemplos', icon: 'an an-browsers' },
  toDoc: { label: 'Ver documentação', icon: 'an an-file-text' }
};

module.exports = {
  //Samples array
  generateSamplesArray: function (doc, group) {
    let samples = [];

    //Gets sample path
    var projectPath = doc.fileInfo.relativePath.replace(/\\/g, '/').split('/');

    const docName = projectPath
      .pop()
      .match(/^(.+?)\.?(component|service|directive|module|interceptor|model)?(\.(ts))?$/)[1];

    if (doc.example) {
      let example = doc.example.match(/^\{@runnableExample (.*)\}$/gm);
      if (example) {
        example.forEach(function (sample) {
          let runnableExample = sample.match(/^\{@runnableExample\s\[sample\-(.+)\]\}$/)[1];
          let name = runnableExample.split(',')[0];
          let hasParentFolder = runnableExample.split(',')[1];

          let capitalizedName = name.split('-');

          if (capitalizedName[0] != 'po') {
            console.error(
              `error`.red + ':   ',
              `O nome do sample ${name} está inválido verifique os padrões de documentação.`
            );
          } else {
            //transforms po-button into PoButton
            capitalizedName.forEach(function (group, index) {
              capitalizedName[index] = capitalize(group);
            });

            capitalizedName = capitalizedName.join('');

            this.generateSampleViewComponentFile(docName, name, capitalizedName);
            samples.push({
              name: name,
              component: capitalizedName,
              doc: docName,
              project: projectPath[0],
              hasParentFolder: hasParentFolder === 'true'
            });
          }
        }, this);
      }
    }

    this.generateDocComponentFile(docName, group, samples.length);
    this.generateDocTemplateFile(docName, samples);
    this.generateDocRoutingModuleFile(docName, group.componentName);
    this.generateDocModuleFile(docName, group.componentName, samples);

    return samples;
  },

  //File api-list.json
  generateDocsJsonFile: function (jsonDocs) {
    this.writeFile('src/assets/json/api-list.json', jsonDocs, function (result) {
      if (result) {
        console.error(`error`.red + ':   ', `Erro ao salvar arquivo api-list.json: ${result.message}`);
      }
    });
  },

  // Grava arquivos
  writeFile: function (path, contents, cb) {
    const dirName = getDirName(path);
    mkdirp.sync(dirName);
    fs.writeFile(path, contents, cb);
  },

  generateApiComponentFile: function (docName, component) {
    const componentSource = `
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sample-{{docName}}-doc',
  templateUrl: './sample-{{docName}}-doc.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class Sample{{component}}DocComponent {
  private readonly router = inject(Router);

  /** Abre a aba Documentação de outro item (tags "Subcomponentes" / "Faz parte de"). */
  openDoc(name: string): void {
    this.router.navigate(['/documentation', name], { queryParams: { view: 'doc' } });
  }
}
`;
    const componentTemplate = handlebars.compile(componentSource);
    let componentContent = componentTemplate({
      docName: docName,
      component: component
    });

    this.writeFile(
      `${configuration.outputFolder}sample-${docName}/doc/sample-${docName}-doc.component.ts`,
      componentContent,
      result => {
        if (result) {
          console.error(
            `error`.red + ':   ',
            `Erro ao salvar arquivo sample-${docName}/doc/sample-${docNamename}-doc.component.ts: ${result.message}`
          );
        }
      }
    );
  },
  generateSampleViewComponentFile: function (docName, name, component) {
    const componentSource = `
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sample-{{name}}-view',
  templateUrl: './sample-{{name}}-view.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class Sample{{component}}ViewComponent {}
`;
    const componentTemplate = handlebars.compile(componentSource);
    let componentContent = componentTemplate({
      name: name,
      component: component
    });

    this.writeFile(
      `${configuration.outputFolder}sample-${docName}/samples/sample-${name}-view.component.ts`,
      componentContent,
      result => {
        if (result) {
          console.error(
            `error`.red + ':   ',
            `Erro ao salvar arquivo sample-${name}/samples/sample-${name}-view.component.ts: ${result.message}`
          );
        }
      }
    );
  },
  generateDocRoutingModuleFile: function (docName, component) {
    const routingModuleSource = `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Doc{{component}}Component } from './doc-{{docName}}.component';

const documentationRoutes: Routes = [
  { path: '', component: Doc{{component}}Component }
];

@NgModule({
  imports: [RouterModule.forChild(documentationRoutes)],
  exports: [RouterModule]
})
export class Doc{{component}}RoutingModule { }
`;

    const routingModuleTemplate = handlebars.compile(routingModuleSource);
    let routingModuleContent = routingModuleTemplate({
      docName: docName,
      component: component
    });

    this.writeFile(
      `${configuration.outputFolder}sample-${docName}/doc-${docName}-routing.module.ts`,
      routingModuleContent,
      result => {
        if (result) {
          console.error(
            `error`.red + ':   ',
            `Erro ao salvar arquivo sample-${docName}/doc-${docName}-routing.module.ts: ${result.message}`
          );
        }
      }
    );
  },

  generateDocComponentFile: function (docName, group, samplesLength) {
    const path = group.fileInfo.filePath.split(group.types[0]).pop();
    const type = group.types[0];

    const componentSource = `
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';

import { PoPageAction } from '@po-ui/ng-components';

@Component({
  templateUrl: './doc-{{docName}}.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class Doc{{component}}Component implements OnInit, OnDestroy {
  sub: any;

  hidePoWebSample = true;
  samplesLength = {{samplesLength}};

  /** Modo exibido, um por vez: 'web' (exemplos) ou 'doc' (documentação), vindo de ?view=. */
  activeTab = 'doc';

  title = '{{title}}';

  actions: Array<PoPageAction> = [];

  // A troca de modo é a 1ª ação: no celular o po-page-default só mostra 2 ações fora do menu "...".
  private readonly toWeb: PoPageAction = { label: '{{toWeb.label}}', icon: '{{toWeb.icon}}', action: () => this.changeTab('web') };
  private readonly toDoc: PoPageAction = { label: '{{toDoc.label}}', icon: '{{toDoc.icon}}', action: () => this.changeTab('doc') };
  private readonly back: PoPageAction = { label: 'Voltar', icon: 'an an-arrow-left', action: this.goBack.bind(this) };

  constructor(private route: ActivatedRoute, private router: Router) { }

  // Voltar para a listagem de componentes
  goBack(): void {
    this.router.navigate(['documentation']);
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const view = params['view'];

      this.hidePoWebSample = this.samplesLength === 0;

      // Defines active tab: prioriza "Exemplos" (web) quando houver exemplos;
      // caso contrário, cai para "Documentação" (doc). Quando não há exemplos,
      // ignora o view=web da URL para não deixar a tela vazia.
      this.activeTab = this.hidePoWebSample ? 'doc' : view || 'web';

      this.title = '{{title}}{{separator}}' + (this.activeTab === 'web' ? '{{webLabel}}' : '{{docLabel}}');
      this.actions = this.hidePoWebSample
        ? [this.back]
        : [this.activeTab === 'web' ? this.toDoc : this.toWeb, this.back];
    });
  }

  changeTab(tab: string) {
    this.router.navigate([], { queryParams: { view: tab }, queryParamsHandling: 'merge' });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
`;
    const componentTemplate = handlebars.compile(componentSource);
    let componentContent = componentTemplate({
      docName: docName,
      component: group.componentName,
      path: path,
      type: type,
      samplesLength: samplesLength,
      title: this.capitalizeDocName(docName),
      separator: PAGE_MODES.separator,
      webLabel: PAGE_MODES.web,
      docLabel: PAGE_MODES.doc,
      toWeb: PAGE_MODES.toWeb,
      toDoc: PAGE_MODES.toDoc
    });

    this.writeFile(
      `${configuration.outputFolder}sample-${docName}/doc-${docName}.component.ts`,
      componentContent,
      result => {
        if (result) {
          console.error(
            `error`.red + ':   ',
            `Erro ao salvar arquivo sample-${docName}/doc-${docName}.component.ts: ${result.message}`
          );
        }
      }
    );
  },

  generateDocModuleFile: function (docName, component, samples) {
    const moduleSource = `
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';

import { Doc{{component}}Component } from './doc-{{docName}}.component';
import { Doc{{component}}RoutingModule } from './doc-{{docName}}-routing.module';

import { Sample{{component}}DocComponent } from './doc/sample-{{docName}}-doc.component';
{{#each samples}}
{{#if hasParentFolder}}
import { Sample{{component}}Component } from './samples/sample-{{name}}/sample-{{name}}.component';
{{else}}
import { Sample{{component}}Component } from './samples/sample-{{name}}.component';
{{/if}}

import { Sample{{component}}ViewComponent } from './samples/sample-{{name}}-view.component';
{{/each}}

@NgModule({
  imports: [
    SharedModule,

    Doc{{component}}RoutingModule
  ],
  declarations: [
    {{#each samples}}
    Sample{{component}}Component,
    Sample{{component}}ViewComponent,
    {{/each}}
    Doc{{component}}Component,
    Sample{{component}}DocComponent
  ],
  providers: []
})
export class Doc{{component}}Module { }
`;

    const moduleTemplate = handlebars.compile(moduleSource);
    let moduleContent = moduleTemplate({
      docName: docName,
      component: component,
      samples: samples
    });

    this.writeFile(`${configuration.outputFolder}sample-${docName}/doc-${docName}.module.ts`, moduleContent, result => {
      if (result) {
        console.error(
          `error`.red + ':   ',
          `Erro ao salvar arquivo sample-${docName}/doc-${docName}.module.ts: ${result.message}`
        );
      }
    });
  },

  generateDocTemplateFile: function (docName, samples) {
    const htmlSource = `
<po-page-default data-tour="component-page" [p-title]="title" [p-actions]="actions">
  <!-- Um modo por vez (?view=web|doc). Os dois ficam montados e só se escondem, como as abas faziam:
       o exemplo não é recriado ao trocar de modo. -->
  @if (!hidePoWebSample) {
  <div data-tour-mode="web" [hidden]="activeTab !== 'web'">
    {{#each samples}}
    <sample-{{name}}-view></sample-{{name}}-view>
    {{/each}}
  </div>
  }
  <div data-tour-mode="doc" [hidden]="activeTab !== 'doc'">
    <sample-{{docName}}-doc></sample-{{docName}}-doc>
  </div>
</po-page-default>
`;

    const htmlTemplate = handlebars.compile(htmlSource);
    let htmlContent = htmlTemplate({
        title: `${this.capitalizeDocName(docName)}`,
        docName: docName,
        samples: samples
    });

    this.writeFile(
        `${configuration.outputFolder}sample-${docName}/doc-${docName}.component.html`,
        htmlContent,
        result => {
            if (result) {
                console.error(
                    `error`.red + ':   ',
                    `Erro ao salvar arquivo sample-${docName}/doc-${docName}.component.html: ${result.message}`
                );
            }
        }
    );
},
  generateDocumentationRoutingModule: function (docs) {
    const routingModuleSource = `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentationComponent } from './documentation.component';
import { DocumentationListComponent } from './documentation-list.component';
import { IaToolsLlmsComponent } from './ia-tools-llms/ia-tools-llms.component';
import { IaToolsMcpComponent } from './ia-tools-mcp/ia-tools-mcp.component';

const documentationRoutes: Routes = [
  { path: '', component: DocumentationComponent, children: [
    { path: 'ia-tools-llms', component: IaToolsLlmsComponent },
    { path: 'ia-tools-mcp', component: IaToolsMcpComponent },
    {{#each docs}}
    { path: '{{name}}', loadChildren: () => import('./samples/sample-{{name}}/doc-{{name}}.module').then(m => m.Doc{{componentName}}Module) },
    {{/each}}
    { path: '', component: DocumentationListComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(documentationRoutes)],
  exports: [RouterModule]
})
export class DocumentationRoutingModule { }
`;

    const routingModuleTemplate = handlebars.compile(routingModuleSource);
    let routingModuleContent = routingModuleTemplate({
      docs: docs
    });

    this.writeFile('src/app/documentation/documentation-routing.module.ts', routingModuleContent, result => {
      if (result) {
        console.error(`error`.red + ':   ', `Erro ao salvar arquivo documentation-list.component: ${result.message}`);
      }
    });
  },

  capitalizeDocName: function (docName) {
    let capitalizedName = docName.split('po-')[1].split('-');

    if (capitalizedName) {
      capitalizedName.forEach(function (part, index) {
        capitalizedName[index] = capitalize(part);
      });
      return capitalizedName.join(' ');
    } else {
      capitalizedName[0] = capitalizedName[0].toUpperCase();
      return capitalizedName.join(' ');
    }
  }
};
