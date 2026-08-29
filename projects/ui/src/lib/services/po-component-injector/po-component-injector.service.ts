import { 
  Injectable, 
  ComponentRef, 
  ApplicationRef, 
  Injector, 
  createComponent, 
  Type 
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoComponentInjectorService {
  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector
  ) {}

  /**
   * Cria dinamicamente um componente no ApplicationRef e o anexa ao body do documento.
   * @param component Classe do componente Angular (ex: MeuComponente)
   */
  createComponentInApplication<T>(component: Type<T>): ComponentRef<T> {
    const componentRef = createComponent(component, {
      environmentInjector: this.applicationRef.injector,
      elementInjector: this.injector
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return componentRef;
  }

  /**
   * Destrói o componente e remove suas referências do ApplicationRef e do DOM.
   * @param componentRef Referência do componente que foi criado dinamicamente
   */
  destroyComponentInApplication<T>(componentRef: ComponentRef<T>): void {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}