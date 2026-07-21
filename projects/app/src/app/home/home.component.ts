import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent {
  investigationItems = [
    {
      tag: 'Layout',
      title: 'Largura dos cards',
      description: 'Verificar como a largura dos cards é definida e quais os valores suportados pelo SUI no contexto de widgets.'
    },
    {
      tag: 'Responsividade',
      title: 'Breakpoints customizáveis',
      description: 'Avaliar a possibilidade de customizar os breaking points para os cards e analisar a complexidade de implementação.'
    },
    {
      tag: 'Layout',
      title: 'Altura dos cards',
      description: 'Identificar os valores válidos para altura dos cards e como isso impacta o layout de reordenação.'
    },
    {
      tag: 'Grid',
      title: 'Adequação via Grid Layout',
      description: 'Verificar como o grid layout se comporta ao reordenar linhas e se existe suporte nativo ou se exige solução customizada.'
    },
    {
      tag: 'SUI',
      title: 'Compatibilidade com SUI',
      description: 'Verificar a aplicabilidade de compatibilidade com os recursos liberados pelo SUI relacionados a widgets e drag & drop.'
    },
    {
      tag: 'UX',
      title: 'Validação de UX',
      description: 'Validar a aplicabilidade de todas as funcionalidades e definir o comportamento esperado pelo usuário durante a reordenação.'
    }
  ];
}
