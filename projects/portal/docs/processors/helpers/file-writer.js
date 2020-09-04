const capitalize = require('capitalize'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  getDirName = require('path').dirname,
  handlebars = require('handlebars');
configuration = require('./../../configuration');

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
    mkdirp(getDirName(path), function (err) {
      if (err) return cb(err);
      fs.writeFile(path, contents, cb);
    });
  },

  generateApiComponentFile: function (docName, component) {
    const componentSource = `
import { Component } from '@angular/core';

@Component({
  selector: 'sample-{{docName}}-doc',
  templateUrl: './sample-{{docName}}-doc.component.html'
})
export class Sample{{component}}DocComponent { }
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
import { Component } from '@angular/core';

@Component({
  selector: 'sample-{{name}}-view',
  templateUrl: './sample-{{name}}-view.component.html'
})
export class Sample{{component}}ViewComponent {
  hideSampleCodeTabs = true;
  sampleCodeButtonLabel = 'Talk is cheap, show me the code!';
  sampleCodeButtonIcon = 'po-icon po-icon-plus';

  toggleSampleCodeTabs() {
    this.hideSampleCodeTabs = !this.hideSampleCodeTabs;
    this.sampleCodeButtonLabel = this.hideSampleCodeTabs ? 'Talk is cheap, show me the code!' : 'Okay, hide the code';
    this.sampleCodeButtonIcon = this.hideSampleCodeTabs ? 'po-icon-plus' : 'po-icon-minus';
  }
}
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
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './doc-{{docName}}.component.html'
})
export class Doc{{component}}Component implements OnInit, OnDestroy {
  sub: any;

  hidePoWebSample = true;
  samplesLength = {{samplesLength}};

  activeTab = 'doc';

  actions: Array<{}> = [
    { label: 'Documentação', action: this.goBack.bind(this), icon: 'po-icon-document-filled' },
    { label: 'Colabore', action: this.improveDocs.bind(this) },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  // Voltar
  goBack(): void {
    this.router.navigate(['documentation']);
  }

  // Aprimorar Docs
  improveDocs(): void {
    this.router.navigate(['guides/development-flow']);
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const view = params['view'];

      // Defines active tab
      this.activeTab = view || 'doc';

      this.hidePoWebSample = this.samplesLength === 0;

    });
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
      samplesLength: samplesLength
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
<po-page-default p-title="{{title}}" [p-actions]="actions">
  <po-tabs p-size="1">
    <po-tab p-label="Documentação" [p-active]="activeTab.includes('doc')">
      <sample-{{docName}}-doc></sample-{{docName}}-doc>
    </po-tab>
    <po-tab p-label="Exemplos" [p-hide]="hidePoWebSample" [p-active]="activeTab.includes('web')">
    {{#each samples}}
      <sample-{{name}}-view></sample-{{name}}-view>
    {{/each}}
    </po-tab>
  </po-tabs>
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

const documentationRoutes: Routes = [
  { path: '', component: DocumentationComponent, children: [
    {{#each docs}}
    // tslint:disable-next-line:max-line-length
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
    let capitalizedName = docName.split('po')[1].split('-');

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
