import { ComponentRef, Directive, Input, OnDestroy, OnInit, ViewContainerRef, inject } from '@angular/core';

/**
 * Renderiza, dentro do card, o exemplo do componente indicado por
 * `appPreviewSampleHost` (o `name` do componente, ex.: 'po-avatar').
 *
 * O gatilho de viewport e o skeleton ficam a cargo do bloco `@defer (on viewport)`
 * no template da listagem — esta diretiva só resolve o componente dinâmico
 * (por `item.name`) e o cria. O módulo com os exemplos é importado dinamicamente
 * (`import()`), mantendo-os num chunk separado, fora do bundle da listagem.
 */
@Directive({
  selector: '[appPreviewSampleHost]',
  standalone: false
})
export class PreviewSampleHostDirective implements OnInit, OnDestroy {
  @Input('appPreviewSampleHost') sampleName!: string;

  private readonly vcr = inject(ViewContainerRef);

  private componentRef?: ComponentRef<unknown>;

  ngOnInit(): void {
    if (this.sampleName) {
      this.loadSample();
    }
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
    this.componentRef = undefined;
  }

  private async loadSample(): Promise<void> {
    const { PREVIEW_SAMPLES } = await import('./preview-samples');

    const component = PREVIEW_SAMPLES[this.sampleName];
    if (!component) {
      return;
    }

    // Wrappers são standalone, então createComponent os resolve diretamente.
    this.componentRef = this.vcr.createComponent(component);
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
