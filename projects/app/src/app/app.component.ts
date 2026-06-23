import { Component, ViewChild } from '@angular/core';
import { PoGuidedTourStep } from './../../ui/src/lib/components/po-guided-tour/po-guided-tour.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {

  @ViewChild(PoGuidedTourComponent) guidedTour: PoGuidedTourComponent;

  readonly tourSteps: Array<PoGuidedTourStep> = [
    {
      id: 'step-welcome',
      element: '#welcome-card',
      title: 'Boas-vindas!',
      description: 'Olá! Este é o novo componente de tour guiado do PO UI. Vamos conhecer algumas funcionalidades?',
      position: 'bottom'
    },
    {
      id: 'step-menu',
      element: '.po-menu-item-link',
      title: 'Navegação Fácil',
      description: 'Aqui você pode navegar por todas as áreas da nossa aplicação de demonstração.',
      position: 'right'
    },
    {
      id: 'step-action',
      element: '#action-btn',
      title: 'Ações Contextuais',
      description: 'Você pode disparar ações importantes diretamente daqui.',
      position: 'left'
    },
    {
      id: 'step-final',
      element: '#final-card',
      title: 'Pronto para começar?',
      description: 'Agora que você conhece o básico, explore à vontade o nosso Design System!',
      position: 'top'
    }
  ];

  startTour() {
    this.guidedTour.start();
  }

  onTourComplete() {
    console.log('Tour finalizado com sucesso!');
  }

}
