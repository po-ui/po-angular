import { Input, TemplateRef, Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * @docsPrivate
 *
 * @usedBy PoButton
 *
 * @description
 *
 * Permite a exibição de ícones.
 */
@Component({
  selector: 'po-icon',
  templateUrl: './po-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoIconComponent {
  class: string;
  private _icon: string | TemplateRef<void>;

  constructor() {}

  /**
   * Define o ícone a ser exibido.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-button p-icon="po-icon-user" p-label="PO button"></po-button>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-button p-icon="fa fa-podcast" p-label="PO button"></po-button>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-button [p-icon]="template" p-label="button template ionic"></po-button>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  @Input('p-icon') set icon(value: string | TemplateRef<void>) {
    if (typeof value === 'string') {
      this.addClasses(value);
    } else if (value instanceof TemplateRef) {
      this._icon = value;
    }
  }

  get icon() {
    return this._icon;
  }

  private addClasses(value: string) {
    this.class = value.startsWith('po-icon-')
      ? (this.class = `po-icon ${value}`)
      : (this.class = `po-fonts-icon ${value}`);
  }
}
