import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { PoButtonModule } from '../../../projects/ui/src/lib/components/po-button';
import { PoButtonGroupModule } from '../../../projects/ui/src/lib/components/po-button-group';
import { PoThemeService } from '../../../projects/ui/src/lib/services/po-theme/po-theme.service';
import { poThemeDefaultDeprecated } from '../../../projects/ui/src/lib/services/po-theme/index';
import { PoThemeTypeEnum } from '../../../projects/ui/src/lib/services/po-theme/enum/po-theme-type.enum';

/**
 * Renderiza UM componente configurado por query string, dentro de #stage.
 * ?theme=light|dark (padrão) | deprecated-light|deprecated-dark (poThemeDefaultDeprecated).
 * ?c=grid&rows=[[célula]] (JSON): várias células numa página só. Célula de po-button:
 * {kind,danger,size,icon,label,aria,disabled,loading}; de po-button-group: {component:'button-group',size,toggle,items}.
 * Comuns: `caption` (legenda visível, parte do snapshot), `width` (px), `force` = hover|focus|active e `forceItem`
 * (índice do item do grupo), aplicados depois pelo teste via CDP (CSS.forcePseudoState).
 * ?c=button (padrão) | button-group (&toggle=none|single|multiple&items=[{label,icon,selected,disabled}] em JSON).
 * Ex.: /?kind=primary&danger=1&size=large&icon=an%20an-plus&label=Salvar&loading=1&theme=dark
 */
@Component({
  selector: 'harness-root',
  imports: [PoButtonModule, PoButtonGroupModule],
  template: `
    <div id="stage" [style.width]="width">
      @if (component === 'grid') {
        @for (row of rows; track $index) {
          <div class="row">
            @for (cell of row; track $index) {
              <div
                class="cell"
                [style.width.px]="cell.width ?? 300"
                [attr.data-force]="cell.force"
                [attr.data-force-item]="cell.forceItem"
              >
                <div class="caption">{{ cell.caption }}</div>
                @if (cell.component === 'button-group') {
                  <po-button-group
                    [p-buttons]="cell.items"
                    [p-toggle]="cell.toggle"
                    [p-size]="cell.size"
                  ></po-button-group>
                } @else {
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
              </div>
            }
          </div>
        }
      } @else if (component === 'button-group') {
        <po-button-group [p-buttons]="items" [p-toggle]="toggle" [p-size]="q.size"></po-button-group>
      } @else {
        <po-button
          [p-kind]="q.kind"
          [p-danger]="q.danger"
          [p-size]="q.size"
          [p-icon]="q.icon"
          [p-label]="q.label"
          [p-disabled]="q.disabled"
          [p-loading]="q.loading"
          [p-aria-label]="q.ariaLabel"
        ></po-button>
      }
    </div>
  `,
  styles: `
    #stage {
      box-sizing: border-box;
      padding: 24px;
      background: var(--color-neutral-light-00, #fff);
    }
    .row {
      display: flex;
    }
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
  private readonly params = new URLSearchParams(location.search);
  private readonly themeService = inject(PoThemeService);
  private readonly theme = this.params.get('theme') ?? 'light';

  readonly component = this.params.get('c') ?? 'button';
  // itens de grupo ganham `action` uma única vez (array novo a cada ciclo quebraria o p-buttons)
  readonly rows = JSON.parse(this.params.get('rows') ?? '[]').map((row: Array<any>) =>
    row.map(cell => (cell.items ? { ...cell, items: this.withActions(cell.items) } : cell))
  );
  readonly width = { 'button-group': '480px', grid: 'max-content' }[this.component] ?? '320px';
  readonly toggle = this.params.get('toggle') ?? 'none';
  readonly items = this.withActions(JSON.parse(this.params.get('items') ?? '[]'));

  /** po-button-group exige `action` em cada item. */
  withActions(items: Array<object>): Array<any> {
    return items.map(i => ({ action: () => {}, ...i }));
  }

  readonly q = {
    kind: this.params.get('kind') ?? 'secondary',
    danger: this.params.get('danger') === '1',
    size: this.params.get('size') ?? 'medium',
    icon: this.params.get('icon') || undefined,
    label: this.params.get('label') || undefined,
    ariaLabel: this.params.get('aria') || undefined,
    disabled: this.params.get('disabled') === '1',
    loading: this.params.get('loading') === '1'
  };

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
