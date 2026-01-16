import {
  AfterViewInit,
  Component,
  ComponentRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { convertToBoolean, uuid } from '../../../utils/util';
import { PoLoadingIconSize } from '../enums/po-loading-icon-size-enum';
import { LOADING_ICON_COMPONENT } from './po-loading-icon-component-injection-token';
import { LoadingIconComponent } from '../interfaces/po-loading-icon-component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que exibe um ícone de carregamento de conteúdo. A cor padrão para ele é a primária conforme o tema utilizado.
 * É possível alterá-la para um tom cinza conforme a necessidade.
 */
@Component({
  selector: 'po-loading-icon',
  templateUrl: 'po-loading-icon.component.html',
  standalone: false
})
export class PoLoadingIconComponent implements AfterViewInit, OnDestroy {
  private _neutralColor: boolean;
  private _size: string = 'md';
  private createdRef: ComponentRef<LoadingIconComponent>;
  id = uuid();

  @ViewChild('loadingContainer', { read: ViewContainerRef, static: false }) loadingContainer: ViewContainerRef;

  /**
   * @optional
   *
   * @description
   *
   * Definição para cor neutra (cinza) para o ícone de carregamento.
   *
   * @default `false`
   */
  @Input('p-neutral-color') set neutralColor(value: boolean) {
    this._neutralColor = convertToBoolean(value);
  }

  get neutralColor(): boolean {
    return this._neutralColor;
  }

  /**
   * @optional
   *
   * @description
   *
   * Definição do tamanho do ícone.
   *
   * Valores válidos:
   *  - `xs`: tamanho `extra small`
   *  - `sm`: tamanho `small`
   *  - `md`: tamanho `medium`
   *  - `lg`: tamanho `large`
   *
   * @default `md`
   */
  @Input('p-size') set size(value: string) {
    this._size = PoLoadingIconSize[value] ? PoLoadingIconSize[value] : PoLoadingIconSize.md;
    if (this.createdRef) {
      this.createdRef.instance.size = this.size;
    }
  }

  get size(): string {
    return this._size;
  }

  @Input('p-in-overlay') inOverlay: boolean = false;

  constructor(@Optional() @Inject(LOADING_ICON_COMPONENT) public loadingIconComponent?: Type<LoadingIconComponent>) {}

  ngOnDestroy() {
    if (this.createdRef) {
      this.createdRef.destroy();
    }
  }

  ngAfterViewInit() {
    if (this.loadingIconComponent && this.loadingContainer && this.inOverlay) {
      this.loadingContainer.clear();
      this.createdRef = this.loadingContainer.createComponent(this.loadingIconComponent);
      this.createdRef.instance.size = this.size;
    }
  }
}
