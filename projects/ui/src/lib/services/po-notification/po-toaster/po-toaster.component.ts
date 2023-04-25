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

import { PoLanguageService } from '../../po-language/po-language.service';
import { poToasterLiterals } from './po-toaster.literals';

import { PoToasterBaseComponent } from './po-toaster-base.component';
import { PoToaster } from './po-toaster.interface';
import { PoToasterType } from './po-toaster-type.enum';
import { PoToasterOrientation } from './po-toaster-orientation.enum';
import { PoButtonComponent } from '../../../components/po-button/po-button.component';

const SPACE_BETWEEN_TOASTERS = 8;

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
  @ViewChild('buttonClose') buttonClose: PoButtonComponent;

  alive: boolean = true;
  language: string;
  literals: any;

  /* Ícone do Toaster */
  private icon: string;
  /* Margem do Toaster referênte à sua orientação e posição*/
  private margin: number = 0;
  /* Observable para monitorar o Close to Toaster */
  private observableOnClose = new Subject<any>();
  /* Posição do Toaster*/
  private toasterPosition: string = 'po-toaster-bottom';
  /* Tipo do Toaster */
  private toasterType: string;

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
    setTimeout(() => this.renderer.addClass(this.toaster.nativeElement, 'po-toaster-visible'));
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

    if (this.type === PoToasterType.Error) {
      this.toaster.nativeElement.setAttribute('role', 'alert');
    } else if (this.action && this.actionLabel) {
      this.toaster.nativeElement.setAttribute('role', 'alertdialog');
    } else {
      this.toaster.nativeElement.setAttribute('role', 'status');
    }

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

    this.buttonClose.buttonElement.nativeElement.setAttribute('aria-label', this.literals.close);
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
    if (this.action && !this.actionLabel) {
      this.poToasterAction(event);
    } else {
      this.close();
    }
  }

  /* Chama a função passada pelo atributo `action` */
  poToasterAction(event): void {
    this.action(this);
  }

  private returnHeightToaster(position) {
    if (this.orientation === PoToasterOrientation.Top) {
      return (document.querySelectorAll('.po-toaster-top')[position] as HTMLElement).offsetHeight;
    }
    return (document.querySelectorAll('.po-toaster-bottom')[position] as HTMLElement).offsetHeight;
  }
}
