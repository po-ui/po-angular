import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';

import { PoButtonModule } from '../../../projects/ui/src/lib/components/po-button';
import { PoButtonGroupModule } from '../../../projects/ui/src/lib/components/po-button-group';
import { PoCheckboxModule } from '../../../projects/ui/src/lib/components/po-field/po-checkbox/po-checkbox.module';
import { PoThemeService } from '../../../projects/ui/src/lib/services/po-theme/po-theme.service';
import { poThemeDefaultDeprecated } from '../../../projects/ui/src/lib/services/po-theme/index';
import { PoThemeTypeEnum } from '../../../projects/ui/src/lib/services/po-theme/enum/po-theme-type.enum';

/**
 * Harness de regressão visual: renderiza uma GRADE de células (um componente por célula) dentro de #stage.
 *
 * /?theme=light|dark|deprecated-light|deprecated-dark&rows=[[célula, ...], ...]   (rows em JSON)
 *
 * Células por `component`:
 *  - (omitido) po-button:       {kind, danger, size, icon, label, aria, disabled, loading}
 *  - 'button-group':            {size, toggle, items: [{label, icon, selected, disabled}]}
 *  - 'checkbox' (disabled vai em p-disabled E em [disabled]: o NgModel zera o p-disabled sozinho):
 *                               {size, value: true|false|null (null = indeterminate), label, labelWrap, help, helper,
 *                                required, disabled}
 * Comuns a todas:
 *  - caption:       legenda visível (2 linhas, "\n"); faz parte do snapshot.
 *  - width:         largura fixa em px. Sem ela a célula cresce com o conteúdo.
 *  - force:         'hover' | 'focus' | 'active' — estado forçado pelo teste via CDP (CSS.forcePseudoState).
 *  - forceSelector: seletor CSS (dentro da célula) dos elementos que recebem o estado forçado. Padrão: 'button'.
 * Para um componente novo: importe o módulo, acrescente um bloco no @switch e documente a célula acima.
 */
@Component({
  selector: 'harness-root',
  imports: [FormsModule, PoButtonModule, PoButtonGroupModule, PoCheckboxModule],
  template: `
    <div id="stage">
      <div class="grid" [style.gridTemplateColumns]="columns">
        @for (row of rows; track $index) {
          @for (cell of row; track $index) {
            <div
              class="cell"
              [style.width.px]="cell.width"
              [attr.data-force]="cell.force"
              [attr.data-force-selector]="cell.forceSelector"
            >
              <div class="caption">{{ cell.caption }}</div>
              @switch (cell.component) {
                @case ('button-group') {
                  <po-button-group
                    [p-buttons]="cell.items"
                    [p-toggle]="cell.toggle"
                    [p-size]="cell.size"
                  ></po-button-group>
                }
                @case ('checkbox') {
                  <po-checkbox
                    [ngModel]="cell.value"
                    [ngModelOptions]="{ standalone: true }"
                    [p-size]="cell.size"
                    [p-label]="cell.label"
                    [p-label-text-wrap]="cell.labelWrap"
                    [p-help]="cell.help"
                    [p-helper]="cell.helper"
                    [p-required]="cell.required"
                    [p-disabled]="cell.disabled"
                    [disabled]="cell.disabled"
                  ></po-checkbox>
                }
                @default {
                  <po-button
                    [p-kind]="cell.kind"
                    [p-danger]="cell.danger"
                    [p-size]="cell.size"
                    [p-icon]="cell.icon"
                    [p-label]="cell.label"
                    [p-disabled]="cell.disabled"
                    [p-loading]="cell.loading"
                    [p-aria-label]="cell.aria"
                  ></po-button>
                }
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    #stage {
      box-sizing: border-box;
      width: max-content;
      padding: 24px;
      background: var(--color-neutral-light-00, #fff);
    }
    /* Colunas alinhadas e do tamanho do conteúdo mais largo de cada coluna (max-content): nada é cortado. */
    .grid {
      display: grid;
    }
    /* Sem \`width\` a célula cresce com o conteúdo. Com \`width\` (px) a largura é fixa (ex.: testar quebra de
       linha); se o conteúdo não couber, o assertGridNotClipped do teste falha em vez de cortar em silêncio. */
    .cell {
      box-sizing: border-box;
      padding: 8px;
    }
    /* Legenda da célula (faz parte do snapshot): duas linhas, quebra de linha do caption preservada. */
    .caption {
      margin-bottom: 6px;
      font: 10px/12px monospace;
      white-space: pre-line;
      color: #6b6b6b;
    }
  `
})
class HarnessComponent {
  private readonly themeService = inject(PoThemeService);
  private readonly params = new URLSearchParams(location.search);
  private readonly theme = this.params.get('theme') ?? 'light';

  // itens de grupo ganham `action` uma única vez (array novo a cada ciclo quebraria o p-buttons)
  readonly rows = JSON.parse(this.params.get('rows') ?? '[]').map((row: Array<any>) =>
    row.map(cell =>
      cell.items ? { ...cell, items: cell.items.map((i: object) => ({ action: () => {}, ...i })) } : cell
    )
  );
  // colunas = nº de células da 1ª linha
  readonly columns = `repeat(${this.rows[0]?.length ?? 1}, max-content)`;

  constructor() {
    const dark = this.theme.endsWith('dark');
    const type = dark ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
    if (this.theme.startsWith('deprecated')) {
      this.themeService.setTheme(poThemeDefaultDeprecated, type);
    } else {
      this.themeService.setDefaultTheme(type);
    }
    document.body.style.margin = '0';
    document.body.style.background = dark ? '#000' : '#fff';
  }
}

/** Cada tema usa o seu próprio CSS base do @po-ui/style, como um consumidor real faria. */
function loadBaseCss(theme: string): Promise<void> {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = theme.startsWith('deprecated') ? '/po-theme-default-deprecated.css' : '/po-theme-default.css';
  document.head.appendChild(link);
  return new Promise((resolve, reject) => {
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`falha ao carregar ${link.href}`));
  });
}

loadBaseCss(new URLSearchParams(location.search).get('theme') ?? 'light')
  .then(() => bootstrapApplication(HarnessComponent))
  .catch(err => console.error(err));
