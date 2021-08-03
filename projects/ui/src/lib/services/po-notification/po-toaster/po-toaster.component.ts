import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';

import { Subject } from 'rxjs';

import { poLocaleDefault } from '../../po-language/po-language.constant';

import { PoLanguageService } from '../../po-language/po-language.service';

import { PoToasterBaseComponent } from './po-toaster-base.component';
import { PoToaster } from './po-toaster.interface';
import { PoToasterType } from './po-toaster-type.enum';
import { PoToasterOrientation } from './po-toaster-orientation.enum';

/**
 * @docsPrivate
 *
 * @docsExtends PoToasterBaseComponent
 */
@Component({
  selector: 'po-toaster',
  templateUrl: './po-toaster.component.html'
})
export class PoToasterComponent extends PoToasterBaseComponent implements AfterViewInit, OnDestroy {
  /* Componente toaster */
  @ViewChild('toaster') toaster: ElementRef;
  alive: boolean = true;
  /* Ícone do Toaster */
  private icon: string;
  /* Margem do Toaster referênte à sua orientação e posição*/
  private margin: number = 20;
  /* Observable para monitorar o Close to Toaster */
  private observableOnClose = new Subject<any>();
  /* Posição do Toaster*/
  private toasterPosition: string = 'po-toaster-bottom';
  /* Tipo do Toaster */
  private toasterType: string;

  constructor(
    languageService: PoLanguageService,
    public changeDetector: ChangeDetectorRef,
    private elementeRef?: ElementRef,
    private renderer?: Renderer2
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-visible'));
  }

  /* Muda a posição do Toaster na tela*/
  changePosition(position: number): void {
    this.elementeRef.nativeElement.style.display = 'table';

    this.margin = 6 + 44 * position + position * 6;

    if (this.orientation === PoToasterOrientation.Top) {
      this.toaster.nativeElement.style.top = this.margin + 'px';
    } else {
      this.toaster.nativeElement.style.bottom = this.margin + 'px';
    }
  }

  /* Fecha o componente Toaster */
  close(): void {
    this.observableOnClose.next(true);
  }

  setFadeOut() {
    this.renderer.removeClass(this.toaster.nativeElement, 'po-toaster-visible');
    this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-invisible');
  }

  /* Configura o Toaster com os atributos passados para ele */
  configToaster(poToaster: PoToaster) {
    this.type = poToaster.type;
    this.message = poToaster.message;
    this.orientation = poToaster.orientation;
    this.position = poToaster.position;
    this.action = poToaster.action;
    this.actionLabel = poToaster.actionLabel;
    this.componentRef = poToaster.componentRef;

    /* Muda a orientação do Toaster */
    if (this.orientation === PoToasterOrientation.Top) {
      this.toasterPosition = 'po-toaster-top';
    }

    /* Muda a posição do Toaster */
    this.changePosition(this.position);

    /* Switch para o tipo de Toaster */
    switch (this.type) {
      case PoToasterType.Error: {
        this.toasterType = 'po-toaster-error';
        this.icon = 'po-icon-warning';
        break;
      }
      case PoToasterType.Information: {
        this.toasterType = 'po-toaster-info';
        this.icon = 'po-icon-info';
        break;
      }
      case PoToasterType.Success: {
        this.toasterType = 'po-toaster-success';
        this.icon = 'po-icon-ok';
        break;
      }
      case PoToasterType.Warning: {
        this.toasterType = 'po-toaster-warning';
        this.icon = 'po-icon-warning';
        break;
      }
    }

    this.changeDetector.detectChanges();
  }

  getIcon() {
    return this.icon;
  }

  getToasterPosition() {
    return this.toasterPosition;
  }

  getToasterType() {
    return this.toasterType;
  }

  onButtonClose(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.action && !this.actionLabel) {
      this.poToasterAction(event);
    } else {
      this.close();
    }
  }

  /* Chama a função passada pelo atributo `action` */
  poToasterAction(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.action(this);
  }
}
