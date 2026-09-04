import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, computed, HostListener, inject, input, signal, ViewEncapsulation } from '@angular/core';

import { PoTooltipModule } from '../../po-tooltip';
import { getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoIconModule } from '../../../components/po-icon/po-icon.module';
import { PoButtonSize } from '../../../components/po-button/enums/po-button-size.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

export const poDragHandleButtonLiteralsDefault = {
  en: { dragToReorder: 'Drag to reorder' },
  es: { dragToReorder: 'Arrastre para reordenar' },
  pt: { dragToReorder: 'Arraste para reordenar' },
  ru: { dragToReorder: 'Перетащите для изменения порядка' }
};

/**
 * @docsPrivate
 *
 * Componente interno criado programaticamente pela diretiva `poDrag`.
 * Renderiza o botão de handle de arraste posicionado absolutamente sobre o
 * elemento arrastável. Visível apenas no hover, via CSS da diretiva.
 *
 * Não deve ser instanciado diretamente pelo consumidor.
 */
@Component({
  selector: 'po-drag-handle-button',
  standalone: true,
  imports: [CdkDragHandle, PoTooltipModule, PoIconModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      cdkDragHandle
      class="po-drag-drop-handle"
      [class.size-small]="resolvedSize() === 'small'"
      type="button"
      tabindex="-1"
      [attr.aria-label]="literals.dragToReorder"
      [p-tooltip]="literals.dragToReorder"
      p-tooltip-position="top"
      [p-append-in-body]="true"
      (click)="$event.stopPropagation()"
    >
      <po-icon p-icon="ICON_DRAG"></po-icon>
    </button>
  `
})
export class PoDragHandleButtonComponent {
  readonly sizeInput = input<string>('', { alias: 'p-size' });

  readonly literals = {
    ...poDragHandleButtonLiteralsDefault[poLocaleDefault],
    ...poDragHandleButtonLiteralsDefault[inject(PoLanguageService).getShortLanguage()]
  };

  private readonly themeChangeSignal = signal(0);

  readonly resolvedSize = computed(() => {
    this.themeChangeSignal();
    const value = this.sizeInput();
    return value ? validateSizeFn(value, PoButtonSize) : getDefaultSizeFn(PoButtonSize);
  });

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.themeChangeSignal.update(v => v + 1);
  }
}
