import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { poLocaleDefault } from '../../po-language/po-language.constant';

import { PoLanguageService } from '../../po-language/po-language.service';

import { PoToasterBaseComponent } from './po-toaster-base.component';
import { PoToaster } from './po-toaster.interface';
import { PoToasterType } from './po-toaster-type.enum';
import { PoToasterOrientation } from './po-toaster-orientation.enum';

export const poToasterLiteralsDefault = {
  en: {
    closeToaster: 'Close'
  },
  es: {
    closeToaster: 'Cerca'
  },
  pt: {
    closeToaster: 'Fechar'
  },
  ru: {
    closeToaster: 'близко'
  }
};

/**
 * @docsPrivate
 *
 * @docsExtends PoToasterBaseComponent
 */
@Component({
  selector: 'po-toaster',
  templateUrl: './po-toaster.component.html'
})
export class PoToasterComponent extends PoToasterBaseComponent {
  private literals = {
    ...poToasterLiteralsDefault[poLocaleDefault]
  };

  /* Ícone do Toaster */
  private icon: string;
  /* Margem do Toaster referênte à sua orientação e posição*/
  private margin: number = 20;
  /* Observable para monitorar o Close to Toaster */
  private observableOnClose = new Subject<any>();
  /* Mostra ou oculta o Toaster */
  private showToaster: boolean = true;
  /* Posição do Toaster*/
  private toasterPosition: string = 'po-toaster-bottom';
  /* Tipo do Toaster */
  private toasterType: string;

  /* Componente toaster */
  @ViewChild('toaster') toaster: ElementRef;

  constructor(
    languageService: PoLanguageService,
    public changeDetector: ChangeDetectorRef,
    private elementeRef?: ElementRef
  ) {
    super();

    this.literals = {
      ...this.literals,
      ...poToasterLiteralsDefault[languageService.getShortLanguage()]
    };
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
    this.showToaster = false;
    this.observableOnClose.next(true);
  }

  /* Configura o Toaster com os atributos passados para ele */
  configToaster(poToaster: PoToaster) {
    this.type = poToaster.type;
    this.message = poToaster.message;
    this.orientation = poToaster.orientation;
    this.position = poToaster.position;
    this.action = poToaster.action;
    this.actionLabel = poToaster.actionLabel ? poToaster.actionLabel : this.literals.closeToaster;
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
        this.icon = 'po-icon-close';
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

  getShowToaster() {
    return this.showToaster;
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

  /* Chama a função passada pelo atributo `action` */
  poToasterAction(): void {
    this.action(this);
  }
}
