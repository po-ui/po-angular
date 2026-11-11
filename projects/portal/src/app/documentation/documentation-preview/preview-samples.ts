import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Type,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PoModule, PoNotificationService, PoStepperOrientation, PoTagType, PoToasterType } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoCodeEditorModule, PoCodeEditorRegister } from '@po-ui/ng-code-editor';

/**
 * Wrappers standalone (POC) que reproduzem o exemplo "basic" de cada componente,
 * para renderização dentro dos cards da listagem.
 *
 * GERADO a partir dos templates estáticos (sem lógica no .ts e sem bindings
 * dinâmicos) dos samples basic oficiais. Ficam de fora: componentes de página
 * inteira, os que dependem de outro módulo (ex.: code-editor) e os que fazem
 * chamada a API externa (lookup/upload/page-dynamic-table). Esses mantêm o
 * preview textual.
 *
 * Carregado dinamicamente (import()) pela diretiva de host -> chunk separado.
 */

@Component({
  selector: 'app-preview-po-accordion',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-accordion>
      <po-accordion-item p-label="Como instalo o PO UI no meu projeto?">
        <p class="po-text-color-neutral-dark-40">
          Execute <code>ng add &#64;po-ui/ng-components</code> na raiz do projeto. O schematic configura o tema e os
          módulos necessários automaticamente.
        </p>
      </po-accordion-item>
      <po-accordion-item p-label="O PO UI é gratuito?">
        <p class="po-text-color-neutral-dark-40">
          Sim. O PO UI é open source sob licença MIT e pode ser usado tanto em projetos pessoais quanto comerciais.
        </p>
      </po-accordion-item>
      <po-accordion-item p-label="Quais versões do Angular são suportadas?">
        <p class="po-text-color-neutral-dark-40">
          Cada release do PO UI acompanha as versões do Angular. Consulte a documentação para a matriz de
          compatibilidade atualizada.
        </p>
      </po-accordion-item>
      <po-accordion-item p-label="Como reportar um bug ou sugerir uma melhoria?">
        <p class="po-text-color-neutral-dark-40">
          Abra uma issue no repositório oficial no GitHub descrevendo o cenário, o comportamento esperado e os passos
          para reproduzir.
        </p>
      </po-accordion-item>
    </po-accordion>
  `
})
export class PreviewPoAccordionComponent {}

@Component({
  selector: 'app-preview-po-avatar',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1.5rem">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
        <po-avatar p-size="xl" p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>
        <span class="po-font-text-smaller">xl</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
        <po-avatar p-size="lg" p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>
        <span class="po-font-text-smaller">lg</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
        <po-avatar p-size="md" p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>
        <span class="po-font-text-smaller">md</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
        <po-avatar p-size="sm" p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>
        <span class="po-font-text-smaller">sm</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
        <po-avatar p-size="xs" p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>
        <span class="po-font-text-smaller">xs</span>
      </div>
    </div>
  `
})
export class PreviewPoAvatarComponent {}

@Component({
  selector: 'app-preview-po-badge',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <div>
        <p class="po-font-text-bold po-mb-1">Contadores</p>
        <div style="display: flex; align-items: center; gap: 1.5rem">
          <po-badge p-icon="an an-bell" [p-value]="3"></po-badge>
          <po-badge p-icon="an an-bell" [p-value]="25"></po-badge>
        </div>
      </div>
      <div>
        <p class="po-font-text-bold po-mb-1">Status</p>
        <div style="display: flex; align-items: center; gap: 1.5rem">
          <span style="display: inline-flex; align-items: center; gap: 0.5rem">
            <po-badge p-status="positive"></po-badge> positive
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.5rem">
            <po-badge p-status="negative"></po-badge> negative
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.5rem">
            <po-badge p-status="warning"></po-badge> warning
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.5rem">
            <po-badge p-status="disabled"></po-badge> disabled
          </span>
        </div>
      </div>
    </div>
  `
})
export class PreviewPoBadgeComponent {}

@Component({
  selector: 'app-preview-po-calendar',
  standalone: true,
  imports: [PoModule],
  template: `<po-calendar></po-calendar>`
})
export class PreviewPoCalendarComponent {}

@Component({
  selector: 'app-preview-po-checkbox',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-checkbox
        name="terms"
        p-label="Aceito os termos de uso"
        p-help="Leia os termos antes de confirmar"
        [(ngModel)]="accepted"
      ></po-checkbox>
      <po-checkbox name="news" p-label="Receber novidades por e-mail" [(ngModel)]="news"></po-checkbox>
      <po-checkbox name="partial" p-label="Seleção parcial (indeterminado)" [(ngModel)]="partial"></po-checkbox>
      <po-checkbox name="locked" p-label="Opção desabilitada" [p-disabled]="true"></po-checkbox>
    </div>
  `
})
export class PreviewPoCheckboxComponent {
  accepted = true;
  news = false;
  partial: boolean | null = null; // null => estado indeterminado
}

@Component({
  selector: 'app-preview-po-container',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-container p-title="Resumo do pedido">
      <div class="po-row">
        <po-info class="po-md-6" p-label="Cliente" p-value="Maria Silva"></po-info>
        <po-info class="po-md-6" p-label="Pedido" p-value="#10432"></po-info>
        <po-info class="po-md-6" p-label="Total" p-value="R$ 1.250,00"></po-info>
        <po-info class="po-md-6" p-label="Status" p-value="Em separação"></po-info>
      </div>
    </po-container>
  `
})
export class PreviewPoContainerComponent {}

@Component({
  selector: 'app-preview-po-context-tabs',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="height: 180px">
      <po-context-tabs>
        @for (tab of tabs; track tab.label) {
          <po-tab [p-label]="tab.label" [p-active]="$first" [p-hide-close]="$first" (p-close-tab)="onClose(tab)">
            <div class="po-font-text">Conteúdo de {{ tab.label }}</div>
          </po-tab>
        }
      </po-context-tabs>
    </div>
  `
})
export class PreviewPoContextTabsComponent {
  // A primeira aba é fixa (hideClose); as demais podem ser fechadas.
  tabs = [{ label: 'Visão geral' }, { label: 'Pedido #1042' }, { label: 'Pedido #1043' }, { label: 'Pedido #1044' }];

  onClose(tab: { label: string }): void {
    this.tabs = this.tabs.filter(item => item !== tab);
  }
}

@Component({
  selector: 'app-preview-po-datepicker-range',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-datepicker-range
      name="datepickerRange"
      p-label="Período"
      p-help="Informe a data inicial e final"
      p-clean
    ></po-datepicker-range>
  `
})
export class PreviewPoDatepickerRangeComponent {}

@Component({
  selector: 'app-preview-po-datepicker',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-datepicker
        name="datepicker"
        p-label="Data de nascimento"
        p-placeholder="dd/mm/aaaa"
        p-help="Formato dd/mm/aaaa"
        p-clean
      ></po-datepicker>
      <po-datepicker
        name="datepickerMonthYear"
        p-label="Competência"
        p-mode="month-year"
        p-help="Seleção de mês e ano"
        p-clean
      ></po-datepicker>
      <po-datepicker
        name="datepickerYear"
        p-label="Ano-base"
        p-mode="year"
        p-help="Seleção apenas do ano"
        p-clean
      ></po-datepicker>
    </div>
  `
})
export class PreviewPoDatepickerComponent {}

@Component({
  selector: 'app-preview-po-datetimepicker',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-datetimepicker
      name="datetimepicker"
      p-label="Agendamento"
      p-help="Data e hora do compromisso"
      p-clean
    ></po-datetimepicker>
  `
})
export class PreviewPoDatetimepickerComponent {}

@Component({
  selector: 'app-preview-po-decimal',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-decimal
        name="price"
        p-label="Valor (R$)"
        p-icon="an an-currency-circle-dollar"
        p-help="Duas casas decimais"
        [p-decimals-length]="2"
      ></po-decimal>
      <po-decimal
        name="weight"
        p-label="Peso (kg)"
        p-help="Até três casas decimais"
        [p-decimals-length]="3"
      ></po-decimal>
    </div>
  `
})
export class PreviewPoDecimalComponent {}

@Component({
  selector: 'app-preview-po-divider',
  standalone: true,
  imports: [PoModule],
  template: `
    <div>
      <po-divider p-label="Dados pessoais"></po-divider>
      <p class="po-font-text">Nome, e-mail e telefone do cliente.</p>

      <po-divider p-label="Endereço"></po-divider>
      <p class="po-font-text">Logradouro, cidade e CEP.</p>

      <po-divider></po-divider>
      <p class="po-font-text">Divisor sem rótulo.</p>
    </div>
  `
})
export class PreviewPoDividerComponent {}

@Component({
  selector: 'app-preview-po-email',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-email
      name="email"
      p-label="E-mail corporativo"
      p-icon="an an-envelope"
      p-placeholder="nome@empresa.com"
      p-help="Informe um e-mail válido"
      p-clean
    ></po-email>
  `
})
export class PreviewPoEmailComponent {}

@Component({
  selector: 'app-preview-po-filter-chip',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <po-filter-chip p-label="Em aberto"></po-filter-chip>
      <po-filter-chip p-label="Concluídos"></po-filter-chip>
      <po-filter-chip p-label="Cancelados"></po-filter-chip>
      <po-filter-chip p-label="Últimos 30 dias"></po-filter-chip>
    </div>
  `
})
export class PreviewPoFilterChipComponent {}

@Component({
  selector: 'app-preview-po-info',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-row">
      <po-info class="po-md-12" p-label="Nome" p-value="Maria Silva"></po-info>
      <po-info class="po-md-12" p-label="E-mail" p-value="maria.silva@totvs.com.br"></po-info>
      <po-info class="po-md-12" p-label="Site" p-value="po-ui.io" p-url="https://po-ui.io"></po-info>
      <po-info class="po-md-12" p-label="Telefone" p-value="(11) 99999-0000"></po-info>
    </div>
  `
})
export class PreviewPoInfoComponent {}

@Component({
  selector: 'app-preview-po-input',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-input name="user" p-label="Usuário" p-icon="an an-user" p-placeholder="Digite seu usuário" p-clean></po-input>
      <po-input name="cpf" p-label="CPF" p-mask="999.999.999-99" p-help="Apenas números"></po-input>
    </div>
  `
})
export class PreviewPoInputComponent {}

@Component({
  selector: 'app-preview-po-link',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      <po-link p-label="Acessar documentação" p-url="https://po-ui.io"></po-link>
      <po-link p-label="Abrir em nova aba" p-url="https://po-ui.io" p-open-new-tab></po-link>
    </div>
  `
})
export class PreviewPoLinkComponent {}

@Component({
  selector: 'app-preview-po-loading-overlay',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="sample-container" style="position: relative; min-height: 160px;">
      <po-loading-overlay p-size="lg" p-text="Carregando"></po-loading-overlay>
    </div>
  `
})
export class PreviewPoLoadingOverlayComponent {}

@Component({
  selector: 'app-preview-po-number',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-number name="age" p-label="Idade" p-help="Valor entre 18 e 120" [p-min]="18" [p-max]="120"></po-number>
      <po-number name="quantity" p-label="Quantidade" p-help="Incrementa de 5 em 5" [p-min]="0" p-step="5"></po-number>
    </div>
  `
})
export class PreviewPoNumberComponent {}

@Component({
  selector: 'app-preview-po-password',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-password name="password" p-label="Senha" p-help="Mínimo de 8 caracteres"></po-password>
      <po-password
        name="passwordNoPeek"
        p-label="Senha (sem visualizar)"
        p-help="Botão de espiar ocultado"
        [p-hide-password-peek]="true"
      ></po-password>
    </div>
  `
})
export class PreviewPoPasswordComponent {}

@Component({
  selector: 'app-preview-po-rich-text',
  standalone: true,
  imports: [PoModule],
  template: `<po-rich-text></po-rich-text>`
})
export class PreviewPoRichTextComponent {}

@Component({
  selector: 'app-preview-po-search',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-search
      p-aria-label="Buscar pessoa"
      p-placeholder="Buscar por nome ou e-mail"
      [p-items]="items"
      [p-filter-keys]="filterKeys"
      (p-filtered-items-change)="filtered($event)"
    ></po-search>

    <div class="po-mt-2" style="display: flex; flex-direction: column; gap: 0.25rem">
      @for (people of peopleFiltered; track people.email) {
        <span class="po-font-text">{{ people.name }} — {{ people.email }}</span>
      } @empty {
        <span class="po-font-text po-text-color-neutral-dark-70">Nenhum resultado</span>
      }
    </div>
  `
})
export class PreviewPoSearchComponent {
  readonly filterKeys = ['name', 'email'];

  readonly items = [
    { name: 'Maria Silva', email: 'maria@po-ui.com' },
    { name: 'João Souza', email: 'joao@po-ui.com' },
    { name: 'Ana Pereira', email: 'ana@po-ui.com' },
    { name: 'Carlos Lima', email: 'carlos@po-ui.com' }
  ];

  peopleFiltered = [...this.items];

  filtered(event: Array<{ name: string; email: string }>): void {
    this.peopleFiltered = event;
  }
}

@Component({
  selector: 'app-preview-po-skeleton',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-row">
      <po-skeleton class="po-md-12"></po-skeleton>
      <po-skeleton class="po-md-12"></po-skeleton>
      <po-skeleton class="po-md-12"></po-skeleton>
    </div>
  `
})
export class PreviewPoSkeletonComponent {}

@Component({
  selector: 'app-preview-po-switch',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <po-switch
        name="notifications"
        p-label="Notificações por e-mail"
        p-label-on="Ativado"
        p-label-off="Desativado"
        [(ngModel)]="emailOn"
      ></po-switch>
      <po-switch
        name="darkmode"
        p-label="Modo escuro"
        p-label-on="Sim"
        p-label-off="Não"
        [(ngModel)]="darkMode"
      ></po-switch>
    </div>
  `
})
export class PreviewPoSwitchComponent {
  emailOn = true;
  darkMode = false;
}

@Component({
  selector: 'app-preview-po-tabs',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-tabs>
      <po-tab p-label="Dados" [p-active]="true">
        <p class="po-font-text">Informações gerais do cadastro.</p>
      </po-tab>
      <po-tab p-label="Endereço">
        <p class="po-font-text">Logradouro, cidade e CEP.</p>
      </po-tab>
      <po-tab p-label="Histórico">
        <p class="po-font-text">Registro de alterações.</p>
      </po-tab>
    </po-tabs>
  `
})
export class PreviewPoTabsComponent {}

@Component({
  selector: 'app-preview-po-tag',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <po-tag p-value="Concluído" [p-type]="tagType.Success" [p-icon]="true"></po-tag>
      <po-tag p-value="Pendente" [p-type]="tagType.Warning" [p-icon]="true"></po-tag>
      <po-tag p-value="Erro" [p-type]="tagType.Danger" [p-icon]="true"></po-tag>
      <po-tag p-value="Em análise" [p-type]="tagType.Info" [p-icon]="true"></po-tag>
    </div>
  `
})
export class PreviewPoTagComponent {
  readonly tagType = PoTagType;
}

@Component({
  selector: 'app-preview-po-textarea',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-textarea
      name="textarea"
      p-label="Observações"
      p-placeholder="Descreva os detalhes do atendimento"
      p-help="Máximo de 500 caracteres"
      [p-rows]="4"
      [p-maxlength]="500"
    ></po-textarea>
  `
})
export class PreviewPoTextareaComponent {}

@Component({
  selector: 'app-preview-po-timepicker',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-timepicker
      name="timepicker"
      p-label="Horário"
      p-placeholder="hh:mm"
      p-help="Informe o horário do agendamento"
      p-clean
    ></po-timepicker>
  `
})
export class PreviewPoTimepickerComponent {}

@Component({
  selector: 'app-preview-po-timer',
  standalone: true,
  imports: [PoModule],
  template: `<po-timer></po-timer>`
})
export class PreviewPoTimerComponent {}

@Component({
  selector: 'app-preview-po-toaster',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-row">
      <po-toaster
        class="po-md-12"
        p-message="Mensagem de informação"
        p-support-message="Aqui vão detalhes adicionais da informação."
        [p-type]="toasterType.Information"
        [p-show-close]="false"
      ></po-toaster>
      <po-toaster
        class="po-md-12 po-pt-1"
        p-message="Mensagem de atenção"
        p-support-message="Revise os dados antes de continuar."
        [p-type]="toasterType.Warning"
        [p-show-close]="false"
      ></po-toaster>
      <po-toaster
        class="po-md-12 po-pt-1"
        p-message="Mensagem de erro"
        p-support-message="Não foi possível concluir a operação."
        [p-type]="toasterType.Error"
        [p-show-close]="false"
      ></po-toaster>
      <po-toaster
        class="po-md-12 po-pt-1"
        p-message="Mensagem de sucesso"
        p-support-message="Operação realizada com sucesso."
        [p-type]="toasterType.Success"
        [p-show-close]="false"
      ></po-toaster>
    </div>
  `
})
export class PreviewPoToasterComponent {
  readonly toasterType = PoToasterType;
}

@Component({
  selector: 'app-preview-po-toolbar',
  standalone: true,
  imports: [PoModule],
  template: `<po-toolbar p-title="PO Toolbar"></po-toolbar>`
})
export class PreviewPoToolbarComponent {}

@Component({
  selector: 'app-preview-po-tooltip',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <po-button p-label="Passe o mouse" p-tooltip="Dica exibida abaixo" p-tooltip-position="bottom"></po-button>
      <po-button p-label="Tooltip à direita" p-tooltip="Dica exibida à direita" p-tooltip-position="right"></po-button>
    </div>
  `
})
export class PreviewPoTooltipComponent {}

@Component({
  selector: 'app-preview-po-url',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-url
      name="url"
      p-label="Site"
      p-placeholder="https://exemplo.com"
      p-help="Informe a URL completa"
      p-clean
    ></po-url>
  `
})
export class PreviewPoUrlComponent {}

@Component({
  selector: 'app-preview-po-widget',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-widget p-title="Vendas do mês" p-tag="+12%" p-tag-type="success" p-primary-label="Ver detalhes">
      <p class="po-font-text">Total faturado: <strong>R$ 48.900,00</strong></p>
      <p class="po-font-text-smaller po-text-color-neutral-dark-70">Atualizado hoje às 09:00</p>
    </po-widget>
  `
})
export class PreviewPoWidgetComponent {}

@Component({
  selector: 'app-preview-po-breadcrumb',
  standalone: true,
  imports: [PoModule],
  template: ` <po-breadcrumb [p-items]="items"></po-breadcrumb> `
})
export class PreviewPoBreadcrumbComponent {
  private readonly notification = inject(PoNotificationService);

  // O po-breadcrumb chama item.action() SEM argumentos, então o label é
  // capturado por closure em cada item (padrão usado nos samples oficiais).
  readonly items = [
    { label: 'Início', action: () => this.navigate('Início') },
    { label: 'Financeiro', action: () => this.navigate('Financeiro') },
    { label: 'Contas a Pagar', action: () => this.navigate('Contas a Pagar') },
    { label: 'Novo Título' }
  ];

  private navigate(label: string): void {
    this.notification.information(`Navegando para: ${label}`);
  }
}

@Component({
  selector: 'app-preview-po-chart',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-chart
      [p-height]="160"
      [p-series]="[
        { label: 'Angular', data: 100 },
        { label: 'React', data: 10 }
      ]"
    >
    </po-chart>
  `
})
export class PreviewPoChartComponent {}

@Component({
  selector: 'app-preview-po-checkbox-group',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <po-checkbox-group
      name="notifications"
      p-label="Notificações"
      [p-columns]="2"
      [p-options]="[
        { value: 'email', label: 'E-mail' },
        { value: 'sms', label: 'SMS' },
        { value: 'push', label: 'Push' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ]"
      [ngModel]="channels"
      (ngModelChange)="channels = $event"
    >
    </po-checkbox-group>
  `
})
export class PreviewPoCheckboxGroupComponent {
  channels = ['email', 'push'];
}

@Component({
  selector: 'app-preview-po-combo',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-combo
      name="combo"
      p-label="Estado"
      p-placeholder="Selecione um estado"
      p-help="Comece a digitar para filtrar"
      p-clean
      [p-options]="states"
    >
    </po-combo>
  `
})
export class PreviewPoComboComponent {
  readonly states = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
  ];
}

@Component({
  selector: 'app-preview-po-disclaimer-group',
  standalone: true,
  imports: [PoModule],
  template: ` <po-disclaimer-group p-title="Filtros aplicados" [p-disclaimers]="filters"></po-disclaimer-group> `
})
export class PreviewPoDisclaimerGroupComponent {
  // Filtros ativos de uma busca — cada chip pode ser removido individualmente.
  readonly filters = [
    { label: 'Status: Ativo', value: 'ativo', property: 'status' },
    { label: 'UF: SP', value: 'SP', property: 'uf' },
    { label: 'Categoria: Cliente', value: 'cliente', property: 'categoria' },
    { label: 'Período: últimos 30 dias', value: '30d', property: 'periodo' }
  ];
}

@Component({
  selector: 'app-preview-po-dropdown',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-dropdown
      p-label="Ações"
      [p-actions]="[
        { label: 'Editar', icon: 'an an-pencil-simple', action: noop },
        { label: 'Duplicar', icon: 'an an-copy', action: noop },
        { label: 'Compartilhar', icon: 'an an-share', action: noop },
        { label: 'Excluir', icon: 'an an-trash', type: 'danger', separator: true, action: noop }
      ]"
    ></po-dropdown>
  `
})
export class PreviewPoDropdownComponent {
  noop = () => {};
}

@Component({
  selector: 'app-preview-po-dynamic-form',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-dynamic-form
      [p-fields]="[
        { property: 'name', label: 'Nome completo', required: true, showRequired: true, gridColumns: 12 },
        { property: 'email', label: 'E-mail', type: 'email', gridColumns: 6 },
        { property: 'phone', label: 'Telefone', mask: '(99) 99999-9999', gridColumns: 6 },
        { property: 'birthdate', label: 'Data de nascimento', type: 'date', gridColumns: 12 },
        {
          property: 'gender',
          label: 'Gênero',
          gridColumns: 12,
          options: [
            { label: 'Feminino', value: 'f' },
            { label: 'Masculino', value: 'm' },
            { label: 'Outro', value: 'o' }
          ]
        },
        { property: 'city', label: 'Cidade', gridColumns: 8 },
        { property: 'state', label: 'UF', gridColumns: 4 }
      ]"
    >
    </po-dynamic-form>
  `
})
export class PreviewPoDynamicFormComponent {}

@Component({
  selector: 'app-preview-po-dynamic-view',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-dynamic-view
      [p-fields]="[
        { property: 'name', label: 'Nome', gridColumns: 6 },
        { property: 'email', label: 'E-mail', gridColumns: 6 },
        { property: 'birthdate', label: 'Nascimento', type: 'date', gridColumns: 4 },
        { property: 'city', label: 'Cidade', gridColumns: 4 },
        { property: 'state', label: 'UF', gridColumns: 4 },
        { property: 'status', label: 'Status', gridColumns: 12, tag: true, color: 'color-11' }
      ]"
      [p-value]="{
        name: 'Maria Silva',
        email: 'maria.silva@totvs.com.br',
        birthdate: '1990-05-21',
        city: 'São Paulo',
        state: 'SP',
        status: 'Ativo'
      }"
    >
    </po-dynamic-view>
  `
})
export class PreviewPoDynamicViewComponent {}

@Component({
  selector: 'app-preview-po-list-view',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-list-view
      [p-field-properties]="{ title: 'name', subtitle: 'role', tag: { value: 'status', type: 'statusType' } }"
      [p-items]="[
        {
          name: 'Maria Silva',
          role: 'Administradora',
          email: 'maria@po-ui.com',
          phone: '(11) 99999-0001',
          status: 'Ativo',
          statusType: 'success'
        },
        {
          name: 'João Souza',
          role: 'Editor',
          email: 'joao@po-ui.com',
          phone: '(11) 99999-0002',
          status: 'Pendente',
          statusType: 'warning'
        }
      ]"
    >
      <ng-template p-list-view-detail-template let-item>
        <div class="po-row">
          <po-info class="po-md-6" p-label="E-mail" [p-value]="item.email"></po-info>
          <po-info class="po-md-6" p-label="Telefone" [p-value]="item.phone"></po-info>
        </div>
      </ng-template>
    </po-list-view>
  `
})
export class PreviewPoListViewComponent {}

@Component({
  selector: 'app-preview-po-menu-panel',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-wrapper-menu-panel" style="position: relative; height: 120px;">
      <po-menu-panel [p-menus]="[{ label: 'PO HTML Framework', link: '/', icon: 'an an-house-line' }]"></po-menu-panel>
    </div>
  `
})
export class PreviewPoMenuPanelComponent {}

@Component({
  selector: 'app-preview-po-progress',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <po-widget p-title="Barra">
        <po-progress [p-value]="value()"></po-progress>
      </po-widget>
      <po-widget p-title="Circular">
        <po-progress [p-value]="value()" p-shape="circle" [p-radius]="24"></po-progress>
      </po-widget>
      <po-widget p-title="Indeterminado">
        <po-progress [p-indeterminate]="true"></po-progress>
      </po-widget>
      <po-widget p-title="Indeterminado circular">
        <po-progress [p-indeterminate]="true" p-shape="circle" [p-radius]="24"></po-progress>
      </po-widget>
    </div>
  `
})
export class PreviewPoProgressComponent implements OnInit, OnDestroy {
  // Signal: notifica o template a cada atualização, mesmo com o interval
  // rodando fora do ciclo de change detection do Angular.
  readonly value = signal(0);
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Sobe de 0 a 100 e reseta, em loop.
    this.intervalId = setInterval(() => {
      this.value.update(current => (current >= 100 ? 0 : current + 5));
    }, 300);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}

@Component({
  selector: 'app-preview-po-radio-group',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <po-radio-group
      name="payment"
      p-label="Forma de pagamento"
      p-help="Selecione uma opção"
      [p-columns]="2"
      [p-options]="[
        { label: 'Cartão de crédito', value: 'credit' },
        { label: 'Cartão de débito', value: 'debit' },
        { label: 'Pix', value: 'pix' },
        { label: 'Boleto', value: 'boleto' }
      ]"
      [(ngModel)]="payment"
    >
    </po-radio-group>
  `
})
export class PreviewPoRadioGroupComponent {
  payment = 'pix';
}

@Component({
  selector: 'app-preview-po-select',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <po-select
      name="select"
      p-label="Perfil de acesso"
      p-help="Define as permissões do usuário"
      [p-options]="[
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Visualizador', value: 'viewer' }
      ]"
      [ngModel]="profile"
      (ngModelChange)="profile = $event"
    >
    </po-select>
  `
})
export class PreviewPoSelectComponent {
  profile = 'editor';
}

@Component({
  selector: 'app-preview-po-stepper',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-stepper [p-step-icons]="true">
      <po-step p-label="Carrinho" p-icon-default="an an-shopping-cart"></po-step>
      <po-step p-label="Entrega" p-icon-default="an an-truck"></po-step>
      <po-step p-label="Pagamento" p-icon-default="an an-credit-card"></po-step>
      <po-step p-label="Confirmação" p-icon-default="an an-check"></po-step>
    </po-stepper>
  `
})
export class PreviewPoStepperComponent {}

@Component({
  selector: 'app-preview-po-table',
  standalone: true,
  imports: [PoModule],
  template: ` <po-table [p-columns]="columns" [p-items]="items"></po-table> `
})
export class PreviewPoTableComponent {
  readonly columns = [
    { property: 'id', label: 'Código', width: '80px' },
    { property: 'product', label: 'Produto' },
    { property: 'price', label: 'Preço', type: 'currency', format: 'BRL' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      labels: [
        { value: 'active', color: 'color-11', label: 'Ativo' },
        { value: 'inactive', color: 'color-07', label: 'Inativo' }
      ]
    }
  ];

  readonly items = [
    { id: 1, product: 'Notebook', price: 4500, status: 'active' },
    { id: 2, product: 'Mouse', price: 120, status: 'active' },
    { id: 3, product: 'Teclado', price: 250, status: 'inactive' }
  ];
}

@Component({
  selector: 'app-preview-po-tree-view',
  standalone: true,
  imports: [PoModule],
  template: ` <po-tree-view [p-items]="items"></po-tree-view> `
})
export class PreviewPoTreeViewComponent {
  readonly items = [
    {
      label: 'Financeiro',
      value: 'fin',
      subItems: [
        { label: 'Contas a pagar', value: 'fin-pagar' },
        { label: 'Contas a receber', value: 'fin-receber' }
      ]
    },
    {
      label: 'Cadastros',
      value: 'cad',
      subItems: [
        { label: 'Clientes', value: 'cad-cli' },
        {
          label: 'Produtos',
          value: 'cad-prod',
          subItems: [
            { label: 'Categorias', value: 'cad-prod-cat' },
            { label: 'Estoque', value: 'cad-prod-est' }
          ]
        }
      ]
    }
  ];
}

// --- Exemplos mínimos (não seguem o basic oficial; customizáveis depois). ---

@Component({
  selector: 'app-preview-po-accordion-item',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-accordion>
      <po-accordion-item p-label="Como instalo o PO UI no meu projeto?">
        <p class="po-font-text">
          Execute <code>ng add &#64;po-ui/ng-components</code> na raiz do projeto. O schematic configura o tema e os
          módulos necessários automaticamente.
        </p>
      </po-accordion-item>
    </po-accordion>
  `
})
export class PreviewPoAccordionItemComponent {}

@Component({
  selector: 'app-preview-po-button',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <po-button p-label="Primário" p-kind="primary"></po-button>
      <po-button p-label="Secundário" p-kind="secondary"></po-button>
      <po-button p-label="Terciário" p-kind="tertiary"></po-button>
      <po-button p-label="Glow" p-kind="glow"></po-button>
      <po-button p-label="Novo" p-icon="an an-plus" p-kind="secondary"></po-button>
      <po-button p-label="Excluir" p-icon="an an-trash" p-kind="secondary" [p-danger]="true"></po-button>
      <po-button p-label="Salvando" p-kind="primary" [p-loading]="true"></po-button>
    </div>
  `
})
export class PreviewPoButtonComponent {}

// Ação vazia dos botões do preview do po-button-group. Fica fora da classe para
// estar disponível nos inicializadores de `alignButtons` e `formatButtons`.
const noopAction = () => {};

@Component({
  selector: 'app-preview-po-button-group',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <div>
        <p class="po-font-text-bold po-mb-1">Seleção única</p>
        <po-button-group p-toggle="single" [p-buttons]="alignButtons"></po-button-group>
      </div>
      <div>
        <p class="po-font-text-bold po-mb-1">Seleção múltipla</p>
        <po-button-group p-toggle="multiple" [p-buttons]="formatButtons"></po-button-group>
      </div>
    </div>
  `
})
export class PreviewPoButtonGroupComponent {
  // Seleção única: alinhamento (um já selecionado).
  readonly alignButtons = [
    { label: 'Esquerda', icon: 'an an-text-align-left', action: noopAction, selected: true },
    { label: 'Centro', icon: 'an an-text-align-center', action: noopAction },
    { label: 'Direita', icon: 'an an-text-align-right', action: noopAction }
  ];

  // Seleção múltipla: formatação de texto.
  readonly formatButtons = [
    { label: 'Negrito', icon: 'an an-text-b', action: noopAction },
    { label: 'Itálico', icon: 'an an-text-italic', action: noopAction },
    { label: 'Sublinhado', icon: 'an an-text-underline', action: noopAction }
  ];
}

@Component({
  selector: 'app-preview-po-code-editor',
  standalone: true,
  imports: [PoCodeEditorModule, FormsModule],
  template: ` <po-code-editor p-height="200" p-language="typescript" [(ngModel)]="code"></po-code-editor> `
})
export class PreviewPoCodeEditorComponent {
  code = [
    'export function greet(name: string): string {',
    '  return `Olá, ${name}!`;',
    '}',
    '',
    "console.log(greet('PO UI'));"
  ].join('\n');
}

// Função de completion exportada (necessária para compatibilidade com AOT),
// usada ao registrar a linguagem terraform no po-code-editor.
export function provideTerraformCompletions() {
  return {
    suggestions: [
      { label: 'resource', insertText: 'resource "${1:type}" "${2:name}" {\n\t$0\n}' },
      { label: 'variable', insertText: 'variable "${1:name}" {\n\t$0\n}' },
      { label: 'output', insertText: 'output "${1:name}" {\n\tvalue = $0\n}' },
      { label: 'provider', insertText: 'provider "${1:name}" {\n\t$0\n}' }
    ]
  };
}

// Linguagem customizada com highlight + sugestões (Ctrl+Space).
const terraformLanguage = {
  language: 'terraform',
  options: {
    keywords: ['resource', 'provider', 'variable', 'output', 'module', 'true', 'false'],
    operators: ['{', '}', '(', ')', '[', ']', '?', ':'],
    tokenizer: {
      root: [[`[a-z_$][\\w$]*`, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }]]
    }
  },
  suggestions: { provideCompletionItems: provideTerraformCompletions }
};

@Component({
  selector: 'app-preview-po-code-editor-register',
  standalone: true,
  imports: [PoCodeEditorModule, FormsModule],
  // forRegister() devolve um ModuleWithProviders, inválido nos imports de um
  // standalone. Como ele só registra o token PoCodeEditorRegister, fornecemos
  // o mesmo valor diretamente via providers.
  providers: [{ provide: PoCodeEditorRegister, useValue: terraformLanguage }],
  template: ` <po-code-editor p-height="200" p-language="terraform" [(ngModel)]="code"></po-code-editor> `
})
export class PreviewPoCodeEditorRegisterComponent {
  // Pressione Ctrl+Space para ver as sugestões da linguagem registrada.
  code = [
    'resource "aws_instance" "web" {',
    '  ami           = "ami-123456"',
    '  instance_type = "t2.micro"',
    '}'
  ].join('\n');
}

@Component({
  selector: 'app-preview-po-context-menu',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-context-menu-wrapper">
      <po-context-menu
        p-context-title="Cadastro"
        p-title="Fornecedor"
        [p-items]="menuItems"
        (p-item-selected)="onItemSelected($event)"
      >
      </po-context-menu>
    </div>
  `
})
export class PreviewPoContextMenuComponent {
  private readonly notification = inject(PoNotificationService);

  readonly menuItems = [{ label: 'Dados cadastrais', selected: true }, { label: 'Endereços' }, { label: 'Documentos' }];

  onItemSelected(item: { label: string }): void {
    this.notification.success(`Item selecionado: ${item.label}`);
  }
}

@Component({
  selector: 'app-preview-po-grid',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-grid
      [p-columns]="[
        { property: 'id', label: 'ID' },
        { property: 'name', label: 'Nome' }
      ]"
      [p-data]="[
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]"
    >
    </po-grid>
  `
})
export class PreviewPoGridComponent {}

@Component({
  selector: 'app-preview-po-header',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-page-default>
      <po-header
        style="--nav-position: flex"
        [p-brand]="{ title: 'PO Header' }"
        [p-actions-tools]="[
          { icon: 'an an-bell', label: 'Notificações' },
          { icon: 'an an-gear', label: 'Configurações' }
        ]"
      ></po-header>
    </po-page-default>
  `
})
export class PreviewPoHeaderComponent {}

@Component({
  selector: 'app-preview-po-helper',
  standalone: true,
  imports: [PoModule],
  template: `
    <div style="display: flex; align-items: center; gap: 0.5rem">
      <span class="po-font-text-bold">CPF</span>
      <po-helper [p-helper]="helper"></po-helper>
    </div>
  `
})
export class PreviewPoHelperComponent {
  private readonly notification = inject(PoNotificationService);

  readonly helper = {
    title: 'Sobre o CPF',
    content: 'Informe apenas <b>números</b>. O dígito verificador é validado automaticamente.',
    type: 'help' as const,
    footerAction: {
      label: 'Saiba mais',
      action: () => this.notification.information('Abrindo a documentação...')
    }
  };
}

@Component({
  selector: 'app-preview-po-image',
  standalone: true,
  imports: [PoModule],
  template: `<po-image
    p-src="https://po-ui.io/assets/graphics/logo-po.png"
    p-alt="PO Image"
    [p-height]="120"
  ></po-image>`
})
export class PreviewPoImageComponent {}

@Component({
  selector: 'app-preview-po-login',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-login
      name="login"
      p-label="Usuário"
      p-placeholder="Informe seu login de acesso"
      p-help="Use o mesmo usuário do seu e-mail corporativo"
      p-clean
    ></po-login>
  `
})
export class PreviewPoLoginComponent {}

@Component({
  selector: 'app-preview-po-lookup',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-lookup
      name="lookup"
      p-label="Heroes"
      p-help="Busque um herói pela API de exemplo"
      p-field-label="label"
      p-field-value="value"
      p-filter-service="https://po-sample-api.onrender.com/v1/heroes"
    ></po-lookup>
  `
})
export class PreviewPoLookupComponent {}

@Component({
  selector: 'app-preview-po-menu',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-wrapper" style="position: relative; height: 320px">
      <po-menu [p-menus]="menus" [p-filter]="true"></po-menu>
    </div>
  `
})
export class PreviewPoMenuComponent {
  private readonly notification = inject(PoNotificationService);

  readonly menus = [
    { label: 'Início', icon: 'an an-house', shortLabel: 'Início', action: () => this.open('Início') },
    {
      label: 'Cadastros',
      icon: 'an an-folders',
      shortLabel: 'Cadastros',
      subItems: [
        { label: 'Clientes', action: () => this.open('Clientes') },
        { label: 'Fornecedores', action: () => this.open('Fornecedores') },
        { label: 'Produtos', action: () => this.open('Produtos') }
      ]
    },
    {
      label: 'Financeiro',
      icon: 'an an-wallet',
      shortLabel: 'Financeiro',
      subItems: [
        { label: 'Contas a pagar', action: () => this.open('Contas a pagar') },
        { label: 'Contas a receber', action: () => this.open('Contas a receber') }
      ]
    },
    {
      label: 'Notificações',
      icon: 'an an-bell',
      shortLabel: 'Alertas',
      badge: { value: 3 },
      action: () => this.open('Notificações')
    }
  ];

  private open(label: string): void {
    this.notification.information(`Menu: ${label}`);
  }
}

@Component({
  selector: 'app-preview-po-modal',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-modal #modal p-title="PO Modal">We are TOTVS!</po-modal>
    <po-button p-label="Abrir modal" (p-click)="modal.open()"></po-button>
  `
})
export class PreviewPoModalComponent {}

@Component({
  selector: 'app-preview-po-modal-footer',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-modal #modal p-title="Footer personalizado">
      Use o po-modal-footer para montar ações sob medida — alinhamento, múltiplos botões e kinds diferentes conforme a
      necessidade.
      <po-modal-footer>
        <po-button p-label="Cancelar" p-kind="tertiary" (p-click)="modal.close()"></po-button>
        <po-button p-label="Salvar rascunho" p-kind="secondary" (p-click)="modal.close()"></po-button>
        <po-button p-label="Confirmar" p-kind="primary" (p-click)="modal.close()"></po-button>
      </po-modal-footer>
    </po-modal>
    <po-button p-label="Abrir modal" (p-click)="modal.open()"></po-button>
  `
})
export class PreviewPoModalFooterComponent {}

@Component({
  selector: 'app-preview-po-modal-password-recovery',
  standalone: true,
  imports: [PoModule, PoTemplatesModule],
  template: `
    <po-modal-password-recovery #recovery></po-modal-password-recovery>
    <po-button p-label="Recuperar senha" (p-click)="recovery.open()"></po-button>
  `
})
export class PreviewPoModalPasswordRecoveryComponent {}

@Component({
  selector: 'app-preview-po-multiselect',
  standalone: true,
  imports: [PoModule, FormsModule],
  template: `
    <po-multiselect
      name="multiselect"
      p-label="Tecnologias"
      p-help="Selecione uma ou mais tecnologias"
      [p-options]="options"
      [(ngModel)]="selected"
    >
    </po-multiselect>
  `
})
export class PreviewPoMultiselectComponent {
  readonly options = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'node', label: 'Node.js' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  selected = ['angular', 'typescript'];
}

@Component({
  selector: 'app-preview-po-popover',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-button #trigger p-label="Abrir Popover" p-kind="primary"></po-button>
    <po-popover [p-target]="triggerRef" p-title="PO Popover" p-trigger="click">
      Conteúdo exibido no popover, posicionado ao lado do botão.
    </po-popover>
  `
})
export class PreviewPoPopoverComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('trigger', { read: ElementRef, static: true }) triggerRef!: ElementRef;

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'app-preview-po-popup',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-button #trigger p-label="Abrir Popup" (p-click)="popup.toggle()"></po-button>
    <po-popup
      #popup
      [p-target]="triggerRef"
      [p-actions]="[
        { label: 'Editar', icon: 'an an-pencil-simple' },
        { label: 'Compartilhar', icon: 'an an-share' },
        { label: 'Excluir', icon: 'an an-trash', type: 'danger', separator: true }
      ]"
    ></po-popup>
  `
})
export class PreviewPoPopupComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('trigger', { read: ElementRef, static: true }) triggerRef!: ElementRef;

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'app-preview-po-search-ai',
  standalone: true,
  imports: [PoModule],
  template: `<po-search-ai name="searchAi" p-label="PO Search A.I."></po-search-ai>`
})
export class PreviewPoSearchAiComponent {}

@Component({
  selector: 'app-preview-po-slide',
  standalone: true,
  imports: [PoModule],
  template: `<po-slide [p-slides]="['https://po-ui.io/assets/graphics/logo-po.png']"></po-slide>`
})
export class PreviewPoSlideComponent {}

@Component({
  selector: 'app-preview-po-step',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-stepper [p-orientation]="orientation" [p-step-icons]="true">
      <po-step p-label="Dados pessoais" p-icon-default="an an-user"></po-step>
      <po-step p-label="Endereço" p-icon-default="an an-map-pin"></po-step>
      <po-step p-label="Revisão" p-icon-default="an an-list-checks"></po-step>
    </po-stepper>
  `
})
export class PreviewPoStepComponent {
  readonly orientation = PoStepperOrientation.Vertical;
}

@Component({
  selector: 'app-preview-po-tab',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-tabs>
      <po-tab p-label="Ativa" [p-active]="true">
        <p class="po-font-text">Aba ativa por padrão (p-active).</p>
      </po-tab>
      <po-tab p-label="Normal">
        <p class="po-font-text">Aba comum.</p>
      </po-tab>
      <po-tab p-label="Desabilitada" [p-disabled]="true"></po-tab>
    </po-tabs>
  `
})
export class PreviewPoTabComponent {}

@Component({
  selector: 'app-preview-po-upload',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-upload
      name="upload"
      p-label="Anexos"
      p-url="https://po-sample-api.onrender.com/v1/uploads/addFile"
      [p-restrictions]="{ allowedExtensions: ['.png', '.jpg', '.jpeg'], maxFileSize: 5242880 }"
    ></po-upload>
  `
})
export class PreviewPoUploadComponent {}

/**
 * Mapa `name do componente` -> wrapper. Chaves batem com `item.name`.
 */
export const PREVIEW_SAMPLES: Record<string, Type<unknown>> = {
  'po-accordion': PreviewPoAccordionComponent,
  'po-accordion-item': PreviewPoAccordionItemComponent,
  'po-avatar': PreviewPoAvatarComponent,
  'po-badge': PreviewPoBadgeComponent,
  'po-breadcrumb': PreviewPoBreadcrumbComponent,
  'po-button': PreviewPoButtonComponent,
  'po-button-group': PreviewPoButtonGroupComponent,
  'po-calendar': PreviewPoCalendarComponent,
  'po-chart': PreviewPoChartComponent,
  'po-checkbox': PreviewPoCheckboxComponent,
  'po-checkbox-group': PreviewPoCheckboxGroupComponent,
  'po-code-editor': PreviewPoCodeEditorComponent,
  'po-code-editor-register': PreviewPoCodeEditorRegisterComponent,
  'po-combo': PreviewPoComboComponent,
  'po-container': PreviewPoContainerComponent,
  'po-context-menu': PreviewPoContextMenuComponent,
  'po-context-tabs': PreviewPoContextTabsComponent,
  'po-datepicker-range': PreviewPoDatepickerRangeComponent,
  'po-datepicker': PreviewPoDatepickerComponent,
  'po-datetimepicker': PreviewPoDatetimepickerComponent,
  'po-decimal': PreviewPoDecimalComponent,
  'po-disclaimer-group': PreviewPoDisclaimerGroupComponent,
  'po-divider': PreviewPoDividerComponent,
  'po-dropdown': PreviewPoDropdownComponent,
  'po-dynamic-form': PreviewPoDynamicFormComponent,
  'po-dynamic-view': PreviewPoDynamicViewComponent,
  'po-email': PreviewPoEmailComponent,
  'po-filter-chip': PreviewPoFilterChipComponent,
  'po-grid': PreviewPoGridComponent,
  'po-header': PreviewPoHeaderComponent,
  'po-helper': PreviewPoHelperComponent,
  'po-image': PreviewPoImageComponent,
  'po-info': PreviewPoInfoComponent,
  'po-input': PreviewPoInputComponent,
  'po-link': PreviewPoLinkComponent,
  'po-list-view': PreviewPoListViewComponent,
  'po-loading-overlay': PreviewPoLoadingOverlayComponent,
  'po-login': PreviewPoLoginComponent,
  'po-lookup': PreviewPoLookupComponent,
  'po-menu': PreviewPoMenuComponent,
  'po-menu-panel': PreviewPoMenuPanelComponent,
  'po-modal': PreviewPoModalComponent,
  'po-modal-footer': PreviewPoModalFooterComponent,
  'po-modal-password-recovery': PreviewPoModalPasswordRecoveryComponent,
  'po-multiselect': PreviewPoMultiselectComponent,
  'po-number': PreviewPoNumberComponent,
  'po-password': PreviewPoPasswordComponent,
  'po-popover': PreviewPoPopoverComponent,
  'po-popup': PreviewPoPopupComponent,
  'po-progress': PreviewPoProgressComponent,
  'po-radio-group': PreviewPoRadioGroupComponent,
  'po-rich-text': PreviewPoRichTextComponent,
  'po-search': PreviewPoSearchComponent,
  'po-search-ai': PreviewPoSearchAiComponent,
  'po-select': PreviewPoSelectComponent,
  'po-skeleton': PreviewPoSkeletonComponent,
  'po-slide': PreviewPoSlideComponent,
  'po-step': PreviewPoStepComponent,
  'po-stepper': PreviewPoStepperComponent,
  'po-switch': PreviewPoSwitchComponent,
  'po-tab': PreviewPoTabComponent,
  'po-table': PreviewPoTableComponent,
  'po-tabs': PreviewPoTabsComponent,
  'po-tag': PreviewPoTagComponent,
  'po-textarea': PreviewPoTextareaComponent,
  'po-timepicker': PreviewPoTimepickerComponent,
  'po-timer': PreviewPoTimerComponent,
  'po-toaster': PreviewPoToasterComponent,
  'po-toolbar': PreviewPoToolbarComponent,
  'po-tooltip': PreviewPoTooltipComponent,
  'po-tree-view': PreviewPoTreeViewComponent,
  'po-upload': PreviewPoUploadComponent,
  'po-url': PreviewPoUrlComponent,
  'po-widget': PreviewPoWidgetComponent
};
