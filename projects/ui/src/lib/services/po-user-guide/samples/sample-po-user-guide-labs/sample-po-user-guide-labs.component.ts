import { Component, OnInit } from '@angular/core';

import { PoUserGuideOptions, PoUserGuideService, PoUserGuideStep } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-user-guide-labs',
  templateUrl: './sample-po-user-guide-labs.component.html',
  providers: [PoUserGuideService],
  standalone: false
})
export class SamplePoUserGuideLabsComponent implements OnInit {
  allowClose: boolean;
  showProgress: boolean;
  keyboardControl: boolean;
  overlayOpacity: number;
  nextLabel: string;
  previousLabel: string;
  doneLabel: string;
  progressTemplate: string;

  stepTitle: string;
  stepContent: string;

  readonly progressTemplateHelp = 'Use {{ current }} e {{ total }} como placeholders.';

  constructor(private PoUserGuide: PoUserGuideService) {}

  ngOnInit(): void {
    this.restore();
  }

  restore(): void {
    this.allowClose = true;
    this.showProgress = true;
    this.keyboardControl = true;
    this.overlayOpacity = 0.7;
    this.nextLabel = 'Próximo';
    this.previousLabel = 'Anterior';
    this.doneLabel = 'Finalizar';
    this.progressTemplate = '{{current}} de {{total}}';
    this.stepTitle = 'Passo destacado';
    this.stepContent = 'Edite os campos ao lado e inicie o tour para visualizar as alterações.';
  }

  startTour(): void {
    const steps: Array<PoUserGuideStep> = [
      {
        element: '#sample-po-user-guide-labs-form',
        title: this.stepTitle,
        content: this.stepContent,
        position: 'right'
      },
      {
        element: '#sample-po-user-guide-labs-cta',
        title: 'Botão de início',
        content: 'Reinicie o tour quantas vezes precisar para experimentar opções diferentes.',
        position: 'top'
      },
      {
        title: 'Modal final',
        content: 'Passos sem <code>element</code> são exibidos como um modal centralizado.'
      }
    ];

    const options: PoUserGuideOptions = {
      allowClose: this.allowClose,
      showProgress: this.showProgress,
      keyboardControl: this.keyboardControl,
      overlayOpacity: this.overlayOpacity,
      nextLabel: this.nextLabel,
      previousLabel: this.previousLabel,
      doneLabel: this.doneLabel,
      progressTemplate: this.progressTemplate
    };

    this.PoUserGuide.setSteps(steps).setOptions(options).start();
  }
}
