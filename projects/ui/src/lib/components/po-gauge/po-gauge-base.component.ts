import { Directive, Input } from '@angular/core';

import { convertToInt } from '../../utils/util';
import { poGaugeMinHeight } from './po-gauge-default-values.constant';

import { PoGaugeRanges } from './interfaces/po-gauge-ranges.interface';
import { PoGaugeOptions } from './interfaces/po-gauge-options.interface';

/**
 * @description
 *
 * > ESSE COMPONENTE ESTÁ DEPRECIADO E SERÁ REMOVIDO NA v22.x.x. Indicamos a utilização do `po-chart` com `type` Gauge.
 *
 * O componente `po-gauge` provê a representação de um valor através de um arco. É muito comum, por exemplo, para demonstrar o desempenho ou progresso de algo.
 * O `po-gauge` possui dois tipos de tratamentos:
 * - É possível demonstrar um dado percentual simples em conjunto com uma descrição resumida em seu interior;
 * - Para um demonstrativo mais elaborado, consegue-se definir alcances em cores, um breve texto descritivo e um ponteiro indicando o valor desejado.
 *
 * #### Guia de uso para Gráficos
 *
 * > Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
 * informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.
 */
@Directive()
export abstract class PoGaugeBaseComponent {
  private _description: string;
  private _height: number = poGaugeMinHeight;
  private _ranges: Array<PoGaugeRanges> = [];
  private _title: string;
  private _value: number;

  /**
   * @optional
   *
   * @description
   *
   * Define a exibição dos valores de `from` - `to` entre parênteses caso haja definição de `p-ranges`.
   *
   * @default `false`
   */
  @Input('p-show-from-to-legend') showFromToLegend: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define a exibição do ponteiro caso haja definição de `p-ranges`.
   *
   * @default `true`
   */
  @Input('p-show-pointer') showPointer: boolean = true;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as configurações usadas no `po-gauge`.
   *
   * É possível, por exemplo, esconder as funcionalidades do header,
   * ou habilitar uma legenda com `From` `To` da seguinte forma:
   *
   * ```
   *  chartOptions: PoGaugeOptions = {
   *    showFromToLegend: true,
   *    header: {
   *      hideExpand: true,
   *    },
   *  };
   * ```
   */
  @Input('p-options') options: PoGaugeOptions;

  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido no gauge.
   * Há dois posicionamentos para ele:
   * - Se houver definição para `p-ranges`, o descritivo será exibido no topo do container, ficando acima do gauge;
   * - Na ausência de `p-ranges`, será incorporado dentro do arco do gauge, e abaixo de `p-value`.
   *
   * > Para uma melhor experiência do usuário, é recomendado um descritivo breve e com poucas palavras.
   * > Indicamos a utilização da nova propriedade `descriptionChart` em `p-options`.
   */
  @Input('p-description') set description(value: string) {
    this._description = value;
  }

  get description() {
    return this._description;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do gauge.
   *
   * O valor mínimo aceito é 300px.
   *
   * @default `300px`
   */
  @Input('p-height') set height(value: number) {
    this._height = this.setGaugeHeight(value);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Definição para o alcance de cores. Ao adicionar pelo menos um item na lista,
   * incorpora-se o ponteiro que assinala o valor passado em `p-value`.
   * Se o valor de `p-value` for inferior ao mínimo valor definido em `PoGaugeRanges.from`, o domínio mínimo do gauge será `p-value`.
   * A mesma regra prevalece para valores máximos.
   */
  @Input('p-ranges') set ranges(value: Array<PoGaugeRanges>) {
    this._ranges = Array.isArray(value) ? value : [];
  }

  get ranges(): Array<PoGaugeRanges> {
    return this._ranges;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o título do gauge.
   */
  @Input('p-title') set title(value: string) {
    this._title = value;
  }

  get title() {
    return this._title;
  }

  /**
   * @optional
   *
   * @description
   *
   * Valor referente ao valor da série. Seu comportamento segue a seguintes regras:
   *
   * - Sem `p-ranges`: Os valores passados para `p-value` e `p-description` serão centralizados no interior do arco.
   * A base do valor será percentual tendo como base os alcances entre zero e 100%. Se passado um valor superior a 100,
   * A colorização do gauge será completa e o valor passado será exibido no interior do arco.
   * - Com `p-ranges`: A descrição será exibida acima do gauge e haverá um ponteiro marcando o valor passado em `p-value`.
   * Considerando que o alcance em `ranges` é aberto, então a escala de `p-value` será em relação ao menor/maior alcance
   * absoluto definido em `p-ranges`.
   * Se passado um `p-value` inferior em relação ao mínimo valor definido em `p-ranges`, o domínio mínimo do gauge partirá de `p-value`.
   * A mesma regra prevalece para valores máximos.
   *
   */
  @Input('p-value') set value(gaugeValue: number) {
    if (typeof gaugeValue === 'number' || (typeof gaugeValue === 'string' && (<string>gaugeValue).trim())) {
      const value = !isNaN(gaugeValue) ? Number(gaugeValue) : undefined;

      this._value = value;
    } else {
      this._value = undefined;
    }
  }

  get value(): number {
    return this._value;
  }

  private setGaugeHeight(height: number): number {
    const gaugeHeight = convertToInt(height);

    return gaugeHeight && gaugeHeight > poGaugeMinHeight ? gaugeHeight : poGaugeMinHeight;
  }
}
