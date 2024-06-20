import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Subject } from 'rxjs';
import { PoToasterMode } from './enum/po-toaster-mode.enum';
import { PoToasterOrientation } from './enum/po-toaster-orientation.enum';
import { PoToasterType } from './enum/po-toaster-type.enum';
import { PoToaster } from './interface/po-toaster.interface';
import { poToasterLiterals } from './literals/po-toaster.literals';
import { PoToasterBaseComponent } from './po-toaster-base.component';
import { PoButtonComponent } from '../po-button';
import { PoLanguageService } from '../../services/po-language';

const SPACE_BETWEEN_TOASTERS = 8;

/**
 * @docsExtends PoToasterBaseComponent
 *
 * @example
 *
 * <example name="po-toaster-basic" title="PO Toaster Basic">
 *  <file name="sample-po-toaster-basic/sample-po-toaster-basic.component.html"> </file>
 *  <file name="sample-po-toaster-basic/sample-po-toaster-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-toaster-labs" title="PO Toaster Labs">
 *  <file name="sample-po-toaster-labs/sample-po-toaster-labs.component.html"> </file>
 *  <file name="sample-po-toaster-labs/sample-po-toaster-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-toaster',
  templateUrl: './po-toaster.component.html'
})
export class PoToasterComponent extends PoToasterBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  /* Componente toaster */
  @ViewChild('toaster') toaster: ElementRef;
  @ViewChild('buttonClose') buttonClose: PoButtonComponent;

  alive: boolean = true;
  language: string;
  literals: any;

  /* Ícone do Toaster */
  icon: string;
  /* Margem do Toaster referênte à sua orientação e posição*/
  margin: number = 0;
  /* Observable para monitorar o Close to Toaster */
  observableOnClose = new Subject<any>();
  /* Posição do Toaster*/
  toasterPosition: string = 'po-toaster-bottom';
  /* Tipo do Toaster */
  toasterType: string;

  constructor(
    poLanguageService: PoLanguageService,
    public changeDetector: ChangeDetectorRef,
    private renderer?: Renderer2
  ) {
    super();
    this.language = poLanguageService.getShortLanguage();
    this.literals = {
      ...poToasterLiterals[this.language]
    };
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-visible');
      if (this.isInline()) {
        this.configToaster(this);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isHide && changes.isHide.previousValue !== undefined) {
      if (changes.isHide.currentValue === true) {
        this.hide();
      } else {
        this.show();
      }
      this.changeDetector.detectChanges();
    }
  }

  /* Muda a posição do Toaster na tela*/
  changePosition(position: number): void {
    setTimeout(() => {
      this.margin = SPACE_BETWEEN_TOASTERS;

      for (let i = 0; i < position; i++) {
        this.margin += this.returnHeightToaster(i) + SPACE_BETWEEN_TOASTERS;
      }

      if (this.orientation === PoToasterOrientation.Top) {
        this.toaster.nativeElement.style.top = this.margin + 'px';
      } else {
        this.toaster.nativeElement.style.bottom = this.margin + 'px';
      }
    });
  }

  /* Fecha o componente Toaster */
  close(): void {
    if (this.isAlert()) {
      this.observableOnClose.next(true);
    } else {
      this.hide();
    }
  }

  setFadeOut() {
    this.renderer.removeClass(this.toaster.nativeElement, 'po-toaster-visible');
    this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-invisible');
  }

  setFadeIn() {
    this.renderer.removeClass(this.toaster.nativeElement, 'po-toaster-invisible');
    this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-visible');
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
    this.mode = poToaster.mode;
    this.showClose = poToaster.showClose;
    this.supportMessage = poToaster.supportMessage;

    /* Muda a orientação do Toaster */
    if (this.orientation === PoToasterOrientation.Top) {
      this.toasterPosition = 'po-toaster-top';
    }
    if (!this.mode) {
      this.mode = PoToasterMode.Inline;
    }
    if (!this.type || !Object.values(PoToasterType).includes(this.type)) {
      this.type = PoToasterType.Information;
    }

    /* Muda a posição do Toaster */
    this.changePosition(this.position);

    if (this.type === PoToasterType.Error) {
      this.toaster.nativeElement.setAttribute('role', 'alert');
    } else if (this.action && this.actionLabel) {
      this.toaster.nativeElement.setAttribute('role', 'alertdialog');
    } else {
      this.toaster.nativeElement.setAttribute('role', 'status');
    }

    this.getToasterType();

    this.changeDetector.detectChanges();
    this.buttonClose?.buttonElement.nativeElement.setAttribute('aria-label', this.literals.close);
  }

  hasClose() {
    return this.isAlert() || this.showClose;
  }

  isAlert() {
    return this.mode === 'alert';
  }

  isInline() {
    return this.mode === 'inline';
  }

  getIcon() {
    return this.icon;
  }

  show() {
    this.isHide = true;
    this.setFadeIn();
    this.renderer.removeAttribute(this.toaster.nativeElement, 'hidden');
  }

  hide() {
    this.isHide = true;
    this.setFadeOut();
    this.renderer.setAttribute(this.toaster.nativeElement, 'hidden', 'true');
  }

  getToasterPosition() {
    return this.toasterPosition;
  }

  getToasterType() {
    switch (this.type) {
      case PoToasterType.Error: {
        this.toasterType = 'po-toaster-error';
        this.icon = 'ICON_CLOSE';
        break;
      }
      case PoToasterType.Information: {
        this.toasterType = 'po-toaster-info';
        this.icon = this.isAlert() ? 'ICON_INFO' : 'ICON_WARNING';
        break;
      }
      case PoToasterType.Success: {
        this.toasterType = 'po-toaster-success';
        this.icon = 'ICON_OK';
        break;
      }
      case PoToasterType.Warning: {
        this.toasterType = 'po-toaster-warning';
        this.icon = this.isAlert() ? 'ICON_EXCLAMATION' : 'ICON_WARNING';
        break;
      }
    }

    return this.toasterType;
  }

  onButtonClose(event) {
    if (this.action && !this.actionLabel) {
      this.poToasterAction(event);
    } else {
      this.close();
    }
    if (this.isInline()) {
      this.isHideChange.emit(this.isHide);
    }
  }

  /* Chama a função passada pelo atributo `action` */
  poToasterAction(event): void {
    this.action(this);
  }

  returnHeightToaster(position) {
    if (this.orientation === PoToasterOrientation.Top) {
      return (document.querySelectorAll('.po-toaster-top')[position] as HTMLElement).offsetHeight;
    }
    return (document.querySelectorAll('.po-toaster-bottom')[position] as HTMLElement).offsetHeight;
  }
}
