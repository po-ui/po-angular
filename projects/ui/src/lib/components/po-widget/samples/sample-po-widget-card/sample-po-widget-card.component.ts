import { Component, OnInit, ViewChild } from '@angular/core';

import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-widget-card',
  templateUrl: './sample-po-widget-card.component.html'
})
export class SamplePoWidgetCardComponent implements OnInit {
  help: string;
  label: string;
  technologies: Array<string> = ['Angular', 'Typescript', 'React', 'Babel', 'Jasmine', 'Vue'];
  value: string;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  ngOnInit() {
    this.showAngular();
  }

  showAngular() {
    this.label = 'Angular';
    this.value = `Angular is a javascript framework mantained by Google and successor of the Angular.js.
    In this latest version, we can use all the features of the framework, for example: data bindings, components,
    modules, typescript and much more.`;
    this.help = 'https://angular.io/';
  }

  showJavascriptTechnologies() {
    this.poModal.open();
  }

  showTypescript() {
    this.label = 'Typescript';
    this.value = `Typescript allows to write JavaScript in an easier way.
    Typescript is a super set of JavaScript that compiles for simple JavaScript. Any browser.
    Any host. Any operating system. Open code.`;
    this.help = 'https://www.typescriptlang.org/';
  }
}
