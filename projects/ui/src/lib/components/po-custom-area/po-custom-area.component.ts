import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService } from './services/po-custom-area.service';

/**
 * @desciption
 *
 * O `po-custom-area` permite que seja exibido um webcomponent customizado criado de acordo
 * com a necessidade de um cliente específico.
 */
@Component({
  selector: 'po-custom-area',
  templateUrl: './po-custom-area.component.html',
  styleUrls: ['./po-custom-area.component.css']
})
export class PoCustomAreaComponent implements OnInit, OnDestroy {
  /**
   * @description
   *
   * Informa ao CustomArea qual a URL do serviço onde ficam guardados os web componentes customizados.
   */
  @Input('p-api-custom') apiCustom: string;

  /**
   * @description
   *
   * Nome do webcomponent customizado a ser buscado na URL informada na [p-custom-api].
   */
  @Input('p-component-name') componentName: string;

  /**
   * @description
   *
   * Dados que estão sendo enviados pelo webcomponent customizado para o componente pai.
   */
  @Input('p-props') props: { [key: string]: string };

  /**
   * @optional
   *
   * @description
   *
   * Classe de estilo personalizada.
   */
  @Input('p-class-style') classStyle: string;

  /**
   * @optional
   *
   * @description
   *
   * Eventos que será ouvido pelo webcomponent customizado.
   *
   * > Exemplo: eventButton = { emitValue: this.send.bind(this) };
   */
  @Input('p-events') events: { [key: string]: (event: any) => void };

  /**
   * @optional
   *
   * @description
   *
   * Texto a ser utilizado customizando alguma parte dentro de webcomponent customizado.
   */
  @Input('p-slot-text') slotText: string;

  /**
   * @option
   *
   * @description
   *
   * Classe a ser utilizado dentro do container do webcomponent customizado.
   *
   */
  @Input('p-class-container') classContainer: string;
  /**
   * @optional
   *
   * @description
   *
   * Identificação do container dentro do shadow dom.
   */
  @Input('p-id-container') idContainer: string;

  private sub = new Subscription();

  constructor(private poCustomAreaService: PoCustomAreaService) {}

  ngOnInit(): void {
    this.poCustomAreaService.api = this.apiCustom;
    this.sub = this.poCustomAreaService
      .add(this.componentName, this.idContainer, this.props, this.classStyle, this.events, this.slotText)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
