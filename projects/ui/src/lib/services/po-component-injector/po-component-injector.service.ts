import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoComponentInjectorService {
  constructor(
    private componentResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  // Cria um dinamicamente no ApplicationRef
  createComponentInApplication(component: any): ComponentRef<any> {
    const componentRef = this.componentResolver.resolveComponentFactory(component).create(this.injector);
    this.applicationRef.attachView(componentRef.hostView);
    const domElem = (<any>componentRef.hostView).rootNodes[0];
    document.body.appendChild(domElem);
    return componentRef;
  }

  // Destrói o componente e remove do ApplicationRef
  destroyComponentInApplication(componentRef: any) {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
