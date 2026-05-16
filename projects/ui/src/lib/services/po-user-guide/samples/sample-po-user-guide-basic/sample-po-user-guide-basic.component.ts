import { Component } from '@angular/core';

import { PoUserGuidePosition, PoUserGuideService, PoUserGuideStep } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-user-guide-basic',
  templateUrl: './sample-po-user-guide-basic.component.html',
  standalone: false
})
export class SamplePoUserGuideBasicComponent {
  private readonly steps: Array<PoUserGuideStep> = [
    {
      element: '#sample-po-user-guide-basic-title',
      title: 'Bem-vindo ao tour',
      content: 'Este é um exemplo básico de uso do <strong>PoUserGuideService</strong>.',
      position: PoUserGuidePosition.Bottom
    },
    {
      element: '#sample-po-user-guide-basic-info',
      title: 'Conteúdo destacado',
      content: 'Aqui você pode descrever em detalhes a área destacada para o usuário.',
      position: PoUserGuidePosition.Right
    },
    {
      element: '#sample-po-user-guide-basic-cta',
      title: 'Próximos passos',
      content: 'Clique em <strong>Finalizar</strong> para encerrar o tour.',
      position: PoUserGuidePosition.Top
    }
  ];

  constructor(private poUserGuide: PoUserGuideService) {}

  startTour(): void {
    this.poUserGuide.setSteps(this.steps).setOptions({ showProgress: true }).start();
  }
}
