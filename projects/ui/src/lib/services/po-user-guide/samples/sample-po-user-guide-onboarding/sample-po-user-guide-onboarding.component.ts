import { Component, AfterViewInit } from '@angular/core';

import { PoUserGuidePosition, PoUserGuideService, PoUserGuideStep } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-user-guide-onboarding',
  templateUrl: './sample-po-user-guide-onboarding.component.html',
  providers: [PoUserGuideService],
  standalone: false
})
export class SamplePoUserGuideOnboardingComponent implements AfterViewInit {
  name: string;
  email: string;
  birthDate: string;
  jobTitle: string;
  bio: string;

  private readonly steps: Array<PoUserGuideStep> = [
    {
      element: '#sample-po-user-guide-onboarding-name',
      title: 'Identifique-se',
      content: 'Informe seu nome completo. Este é o dado utilizado nas comunicações da plataforma.',
      position: PoUserGuidePosition.Right
    },
    {
      element: '#sample-po-user-guide-onboarding-email',
      title: 'E-mail corporativo',
      content: 'Utilize um e-mail válido — ele será o seu identificador único de acesso.',
      position: PoUserGuidePosition.Right
    },
    {
      element: '#sample-po-user-guide-onboarding-birthdate',
      title: 'Data de nascimento',
      content: 'A data de nascimento é utilizada apenas para validação de elegibilidade do cadastro.',
      position: PoUserGuidePosition.Right
    },
    {
      element: '#sample-po-user-guide-onboarding-jobtitle',
      title: 'Cargo',
      content: 'Indique seu cargo atual para personalizarmos o conteúdo de boas-vindas.',
      position: PoUserGuidePosition.Right
    },
    {
      element: '#sample-po-user-guide-onboarding-submit',
      title: 'Conclua o cadastro',
      content: 'Após preencher os campos acima, clique em <strong>Salvar</strong> para concluir.',
      position: PoUserGuidePosition.Top
    }
  ];

  constructor(private PoUserGuide: PoUserGuideService) {}

  ngAfterViewInit(): void {
    this.PoUserGuide.setSteps(this.steps).setOptions({ showProgress: true, allowClose: true });
  }

  restartTour(): void {
    this.PoUserGuide.start();
  }
}
