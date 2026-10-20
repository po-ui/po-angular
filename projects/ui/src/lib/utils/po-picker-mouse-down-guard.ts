import { Renderer2 } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Registra se o último `mousedown` do documento ocorreu dentro do picker (calendário).
 *
 * Ao pressionar o mouse dentro do calendário e soltar fora dele, o navegador dispara o `click` fora do calendário.
 * Esse `click` não deve fechar o calendário, por isso o componente deve consultar `consume` antes de fechá-lo.
 */
export class PoPickerMouseDownGuard {
  private isMouseDownOnPicker = false;
  private removeListener: () => void;

  /**
   * @param isInsidePicker Função que indica se o alvo do `mousedown` pertence ao picker.
   */
  constructor(private readonly isInsidePicker: (target: EventTarget) => boolean) {}

  listen(renderer: Renderer2): void {
    this.destroy();
    this.removeListener = renderer.listen('document', 'mousedown', (event: MouseEvent) => this.register(event?.target));
  }

  register(target: EventTarget): void {
    this.isMouseDownOnPicker = !!target && this.isInsidePicker(target);
  }

  /**
   * Retorna se o último `mousedown` ocorreu no picker e reinicia o estado, valendo apenas para o `click` seguinte.
   */
  consume(): boolean {
    const isMouseDownOnPicker = this.isMouseDownOnPicker;
    this.isMouseDownOnPicker = false;

    return isMouseDownOnPicker;
  }

  destroy(): void {
    this.removeListener?.();
    this.removeListener = undefined;
    this.isMouseDownOnPicker = false;
  }
}
