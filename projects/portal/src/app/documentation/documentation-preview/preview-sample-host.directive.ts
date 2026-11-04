import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  inject
} from '@angular/core';

/**
 * Renderiza, dentro do card, o exemplo "basic" do componente indicado por
 * `appPreviewSampleHost` (o `name` do componente, ex.: 'po-avatar').
 *
 * O sample só é carregado quando o card entra na viewport (IntersectionObserver),
 * e o módulo com os exemplos é importado dinamicamente (chunk separado). Assim o
 * protótipo não infla o bundle da listagem nem monta todos os exemplos de uma vez.
 */
@Directive({
  selector: '[appPreviewSampleHost]',
  standalone: false
})
export class PreviewSampleHostDirective implements OnInit, OnDestroy {
  @Input('appPreviewSampleHost') sampleName!: string;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly ngZone = inject(NgZone);

  private observer?: IntersectionObserver;
  private componentRef?: ComponentRef<unknown>;
  private loading = false;

  ngOnInit(): void {
    if (!this.sampleName) {
      return;
    }

    const element = this.host.nativeElement;

    // IntersectionObserver só aceita um Element. Se o host não for um (ex.: a
    // diretiva num <ng-container>, cujo nativeElement é um comment node) ou o
    // ambiente não tiver o observer, carrega o sample diretamente.
    if (typeof IntersectionObserver === 'undefined' || !(element instanceof Element)) {
      this.loadSample();
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            this.ngZone.run(() => this.loadSample());
          }
        },
        { root: null, threshold: 0.1 }
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.componentRef?.destroy();
    this.componentRef = undefined;
  }

  private async loadSample(): Promise<void> {
    if (this.loading || this.componentRef) {
      return;
    }
    this.loading = true;

    // Não precisa continuar observando após o primeiro carregamento.
    this.observer?.disconnect();

    const { PREVIEW_SAMPLES } = await import('./preview-samples');

    const component = PREVIEW_SAMPLES[this.sampleName];
    if (!component) {
      this.loading = false;
      return;
    }

    // Wrappers são standalone, então createComponent os resolve diretamente.
    this.componentRef = this.vcr.createComponent(component);
    this.componentRef.changeDetectorRef.detectChanges();
    this.loading = false;
  }
}
