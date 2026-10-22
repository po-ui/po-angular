import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Em projetos externos, troque os dois imports abaixo por:
// import { PoChartType, PoModule } from '@po-ui/ng-components';
import { PoChartType } from '../../../../ui/src/lib/components/po-chart/enums/po-chart-type.enum';
import { PoModule } from '../../../../ui/src/public-api';

/**
 * Showcase standalone dos componentes afetados pela nova definição de tema (EVO / Animalia DS).
 *
 * Reúne, em um único componente, exemplos de todos os componentes cujo arredondamento de borda
 * (`border-radius`) passou a ser definido pela constante compartilhada `poThemeSharedBase`
 * do serviço de tema do PO UI. Serve para validar visualmente, em qualquer projeto, se o tema
 * está aplicando as bordas corretamente nos níveis AA e AAA, nos tipos claro e escuro.
 *
 * Como usar em outro projeto:
 * 1. Copie este arquivo (e o `theme-showcase.component.html`) para o seu projeto.
 * 2. Ajuste o import do `PoModule` para `@po-ui/ng-components`.
 * 3. Importe o componente onde quiser: `imports: [ThemeShowcaseComponent]` (em outro standalone)
 *    ou declare-o num módulo via `imports`.
 * 4. Use a tag `<app-theme-showcase></app-theme-showcase>` no template.
 */
@Component({
  selector: 'app-theme-showcase',
  standalone: true,
  imports: [FormsModule, PoModule],
  templateUrl: './theme-showcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeShowcaseComponent {
  // --- Campos / valores de exemplo (fields) ---
  inputValue = 'Texto de exemplo';
  textareaValue = 'Conteúdo de várias linhas para demonstrar o arredondamento do textarea.';
  multiselectValue: Array<string> = [];
  searchValue = '';
  datepickerValue = '';
  datetimepickerValue = '';
  timepickerValue = '';
  lookupValue = '';

  // --- Seleção (radio) ---
  radioValue = 'a';

  // --- Rich text ---
  richTextValue = '<p>Texto <b>formatado</b> de exemplo.</p>';

  // --- Opções reutilizadas ---
  readonly options = [
    { label: 'Opção A', value: 'a' },
    { label: 'Opção B', value: 'b' },
    { label: 'Opção C', value: 'c' }
  ];

  // --- Dropdown ---
  readonly dropdownActions = [
    { label: 'Editar', action: this.noop.bind(this) },
    { label: 'Remover', action: this.noop.bind(this) }
  ];

  // --- Button group ---
  readonly buttonGroupItems = [
    { label: 'Um', action: this.noop.bind(this) },
    { label: 'Dois', action: this.noop.bind(this) },
    { label: 'Três', action: this.noop.bind(this) }
  ];

  // --- Tree view ---
  readonly treeItems = [
    {
      label: 'Raiz',
      value: 1,
      subItems: [
        { label: 'Filho 1', value: 11 },
        { label: 'Filho 2', value: 12 }
      ]
    }
  ];

  // --- List view ---
  readonly listItems = [
    { title: 'Item 1', description: 'Descrição do primeiro item' },
    { title: 'Item 2', description: 'Descrição do segundo item' }
  ];
  readonly listActions = [{ label: 'Ação', action: this.noop.bind(this) }];

  // --- Accordion ---
  // (conteúdo estático no template)

  // --- Stepper ---
  readonly steps = [{ label: 'Passo 1' }, { label: 'Passo 2' }, { label: 'Passo 3' }];

  // --- Breadcrumb ---
  readonly breadcrumbItems = [{ label: 'Início', link: '/' }, { label: 'Página atual' }];

  // --- Disclaimer group ---
  readonly disclaimers = [
    { label: 'Filtro A', value: 'a' },
    { label: 'Filtro B', value: 'b' }
  ];

  // --- Chart (gauge) ---
  readonly chartGaugeType = PoChartType.Gauge;
  readonly gaugeSeries = [{ label: 'Progresso', data: 70 }];

  // --- Modal ---
  modalPrimaryAction = { label: 'Confirmar', action: () => this.closeModal() };
  modalSecondaryAction = { label: 'Cancelar', action: () => this.closeModal() };

  openModal(modal: { open: () => void }) {
    modal.open();
  }

  closeModal(modal?: { close: () => void }) {
    modal?.close();
  }

  openPopover(popover: { open: () => void }) {
    popover.open();
  }

  private noop() {
    // Ação de exemplo — sem efeito.
  }
}
