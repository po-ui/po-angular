import {
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  booleanAttribute,
  inject
} from '@angular/core';

import { loadPreviewSampleComponent } from './preview-sample-loader';

/**
 * Portão de ociosidade compartilhado: todos os exemplos que pedem `appPreviewSampleIdle` esperam a mesma
 * chamada de `requestIdleCallback` (com `timeout`, para que ela dispare mesmo com a página ocupada por animações)
 * e são criados juntos, em vez de um por ociosidade.
 */
let idleGate: Promise<void> | undefined;

function waitForIdle(): Promise<void> {
  idleGate ??= new Promise<void>(resolve => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout: 500 });
    } else {
      // shortcut: setTimeout fallback for browsers without requestIdleCallback (Safari), no deadline control.
      setTimeout(resolve, 200);
    }
  });
  return idleGate;
}

/**
 * Renderiza, dentro do card, o exemplo do componente indicado por
 * `appPreviewSampleHost` (o `name` do componente, ex.: 'po-avatar').
 *
 * O gatilho de viewport e o skeleton ficam a cargo do bloco `@defer (on viewport)`
 * no template da listagem — esta diretiva só resolve o componente dinâmico
 * (por `item.name`) e o cria. O módulo com os exemplos é importado dinamicamente
 * (`import()`), mantendo-os num chunk separado, fora do bundle da listagem.
 *
 * Opções (desligadas por padrão, para não mudar a listagem):
 * - `appPreviewSampleDetach`: depois da primeira renderização, desliga o exemplo da detecção de mudanças.
 * - `appPreviewSampleIdle`: só importa o chunk dos exemplos quando o navegador estiver ocioso.
 */
@Directive({
  selector: '[appPreviewSampleHost]',
  standalone: true
})
export class PreviewSampleHostDirective implements OnInit, OnDestroy {
  @Input('appPreviewSampleHost') sampleName!: string;

  @Input({ alias: 'appPreviewSampleDetach', transform: booleanAttribute }) detach = false;

  @Input({ alias: 'appPreviewSampleIdle', transform: booleanAttribute }) idle = false;

  private readonly vcr = inject(ViewContainerRef);

  private componentRef?: ComponentRef<unknown>;

  private destroyed = false;

  ngOnInit(): void {
    if (!this.sampleName) {
      return;
    }

    this.loadSample();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.componentRef?.destroy();
    this.componentRef = undefined;
  }

  private async loadSample(): Promise<void> {
    if (this.idle) {
      await waitForIdle();
    }

    const component = await loadPreviewSampleComponent(this.sampleName);
    if (!component || this.destroyed) {
      return;
    }

    // Wrappers são standalone, então createComponent os resolve diretamente.
    this.componentRef = this.vcr.createComponent(component);
    // Render manual: funciona mesmo que a view que hospeda a diretiva esteja desligada (detach).
    this.componentRef.changeDetectorRef.detectChanges();

    if (this.detach) {
      this.componentRef.changeDetectorRef.detach();
    }
  }
}
