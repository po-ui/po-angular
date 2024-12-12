import { ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator, Validators } from '@angular/forms';

import { Subject, Subscription, switchMap } from 'rxjs';
import { convertToBoolean } from '../../../utils/util';
import { ErrorAsyncProperties } from '../shared/interfaces/error-async-properties.interface';
import { maxlengpoailed, minlengpoailed, patternFailed, requiredFailed } from './../validators';
import { PoMask } from './po-mask';

/**
 * @description
 *
 * Este é um componente baseado em input, com várias propriedades do input nativo e outras
 * propriedades extras como: máscara, pattern, mensagem de erro e etc.
 * Você deve informar a variável que contém o valor como [(ngModel)]="variavel", para que o
 * input receba o valor da variável e para que ela receba as alterações do valor (two-way-databinding).
 * A propriedade name é obrigatória para que o formulário e o model funcionem corretamente.
 *
 * Importante:
 *
 * - Caso o input tenha um [(ngModel)] sem o atributo name, ocorrerá um erro de angular.
 * Então você precisa informar o atributo name ou o atributo [ngModelOptions]="{standalone: true}".
 * Exemplo: [(ngModel)]="pessoa.nome" [ngModelOptions]="{standalone: true}".
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS): <br>
 * Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`
 *
 * > Para correto alinhamento é recomendado o uso das classes de espaçamento do [Grid System](https://po-ui.io/guides/grid-system).
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
 * | `--text-color-placeholder`             | Cor do texto placeholder                              | `var(--color-neutral-light-30)`                 |
 * | `--color`                              | Cor pincipal do input                                 | `var(--color-neutral-dark-70)`                  |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                 |
 * | `--padding`                            | Preenchimento                                         |  `0 0.5rem`                                     |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                  |
 * | **Hover**                              |                                                       |                                                 |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-dark)`                    |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                |
 * | **Focused**                            |                                                       |                                                 |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                   |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-30)`                 |
 * | `--background-disabled`                | Cor de background no estado disabled                  | `var(--color-neutral-light-20)`                 |
 * | `--text-color-disabled`                | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                  |
 *
 * <br>
 */
@Directive()
export abstract class PoInputBaseComponent implements ControlValueAccessor, Validator, OnDestroy {
  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o ícone que será exibido no início do campo.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
   * ```
   * <po-input p-icon="ph ph-user" p-label="PO input"></po-input>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-input p-icon="fa fa-podcast" p-label="PO input"></po-input>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-input [p-icon]="template" p-label="input template ionic"></po-input>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  @Input('p-icon') icon?: string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   *
   * Sempre emite as alterações do model mesmo quando o valor atual for igual ao valor anterior.
   *
   * @default `false`
   */
  @Input({ alias: 'p-emit-all-changes', transform: convertToBoolean }) emitAllChanges: boolean = false;

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  /** Nome e identificador do campo. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Realiza alguma validação customizada assíncrona no componente.
   * Aconselhamos a utilização dessa propriedade somente em componentes que não estejam
   * utilizando `Reactive Forms`. Em formulários reativos, pode-se utilizar o próprio `asyncValidators`.
   */
  @Input('p-error-async-properties') errorAsyncProperties: ErrorAsyncProperties;

  /**
   * @description
   *
   * Mensagem que será apresentada quando o `pattern` ou a máscara não for satisfeita.
   *
   * > Por padrão, esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   * Para exibir a mensagem com o campo vazio, utilize a propriedade `p-required-field-error-message` em conjunto.
   */
  @Input('p-error-pattern') errorPattern?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   * @default `false`
   */
  @Input('p-required-field-error-message') showErrorMessageRequired: boolean = false;

  /**
   * @description
   *
   * Converte o conteúdo do campo em maiúsulo automaticamente.
   *
   */
  @Input({ alias: 'p-upper-case', transform: convertToBoolean }) upperCase: boolean = false;

  /**
   * @description
   *
   * Define se os caracteres especiais da máscara devem ser ignorados ao validar os comprimentos mínimo (`minLength`) e máximo (`maxLength`) do campo.
   *
   * - Quando `true`, apenas os caracteres alfanuméricos serão contabilizados para a validação dos comprimentos.
   * - Quando `false`, todos os caracteres, incluindo os especiais da máscara, serão considerados na validação.
   *
   * > Será ignorado essa propriedade , caso esteja utilizando junto com a propriedade `p-mask-format-model`.
   *
   * Exemplo:
   * ```
   * <po-input
   *   p-mask="999-999"
   *   p-maxlength="6"
   *   p-minlength="4"
   *   p-mask-no-length-validation="true"
   * ></po-input>
   * ```
   * - Entrada: `123-456` → Validação será aplicada somente aos números, ignorando o caractere especial `-`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-mask-no-length-validation', transform: convertToBoolean }) maskNoLengthValidation: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao entrar do campo.
   */
  @Output('p-enter') enter: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor e deixar o campo.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do model.
   */
  @Output('p-change-model') changeModel: EventEmitter<any> = new EventEmitter();

  type: string;

  onChangePropagate: any = null;
  objMask: any;
  modelLastUpdate: any;
  isInvalid: boolean;
  hasValidatorRequired = false;
  private subscription: Subscription = new Subscription();
  protected onTouched: any = null;

  protected passedWriteValue: boolean = false;
  protected validatorChange: any;

  private _maxlength?: number;
  private _minlength?: number;
  private _noAutocomplete?: boolean = false;
  private _placeholder?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Define a propriedade nativa `autocomplete` do campo como `off`.
   *
   * > No componente `po-password` será definido como `new-password`.
   *
   * Nos componentes `po-password` e `po-login` o valor padrão será `true`.
   *
   * @default `false`
   */
  @Input('p-no-autocomplete') set noAutocomplete(value: boolean) {
    this._noAutocomplete = convertToBoolean(value);
  }

  get noAutocomplete() {
    return this._noAutocomplete;
  }

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   *
   * @default ''
   */
  @Input('p-placeholder') set placeholder(value: string) {
    this._placeholder = value || '';
  }
  get placeholder() {
    return this._placeholder;
  }

  /**
   * @description
   *
   * Se verdadeiro, desabilita o campo.
   *
   * @default `false`
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  disabled?: boolean = false;
  @Input('p-disabled') set setDisabled(disabled: string) {
    this.disabled = disabled === '' ? true : convertToBoolean(disabled);

    this.validateModel();
  }

  /** Indica que o campo será somente leitura. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly?: boolean = false;
  @Input('p-readonly') set setReadonly(readonly: string) {
    this.readonly = readonly === '' ? true : convertToBoolean(readonly);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   * > Esta propriedade é desconsiderada quando o input está desabilitado `(p-disabled)`.
   *
   * @default `false`
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  required?: boolean = false;
  @Input('p-required') set setRequired(required: string) {
    this.required = required === '' ? true : convertToBoolean(required);

    this.validateModel();
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /** Se verdadeiro, o campo receberá um botão para ser limpo. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clean?: boolean = false;
  @Input('p-clean') set setClean(clean: string) {
    this.clean = clean === '' ? true : convertToBoolean(clean);
  }

  /**
   * @description
   *
   * Expressão regular para validar o campo.
   * Quando o campo possuir uma máscara `(p-mask)` será automaticamente validado por ela, porém
   * é possível definir um p-pattern para substituir a validação da máscara.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  pattern?: string;
  @Input('p-pattern') set setPattern(pattern: string) {
    this.pattern = pattern;

    this.validateModel();
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica a quantidade máxima de caracteres que o campo aceita.
   */
  @Input('p-maxlength') set maxlength(value: number) {
    if (!isNaN(parseInt(<any>value, 10))) {
      this._maxlength = parseInt(<any>value, 10);

      this.validateModel();
    } else if (!value) {
      this._maxlength = undefined;

      this.validateModel();
    }
  }

  get maxlength() {
    return this._maxlength;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica a quantidade mínima de caracteres que o campo aceita.
   */
  @Input('p-minlength') set minlength(value: number) {
    if (!isNaN(parseInt(<any>value, 10))) {
      this._minlength = parseInt(<any>value, 10);

      this.validateModel();
    } else if (!value) {
      this._minlength = undefined;

      this.validateModel();
    }
  }

  get minlength() {
    return this._minlength;
  }

  /**
   * @description
   *
   * Indica uma máscara para o campo. Exemplos: (+99) (99) 99999?-9999, 99999-999, 999.999.999-99.
   * A máscara gera uma validação automática do campo, podendo esta ser substituída por um REGEX específico
   * através da propriedade p-pattern.
   * O campo será sinalizado e o formulário ficará inválido quando o valor informado estiver fora do padrão definido,
   * mesmo quando desabilitado.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  mask?: string = '';
  @Input('p-mask') set setMask(mask: string) {
    this.mask = mask;

    // Atualiza Máscara do Campo
    this.objMask = new PoMask(this.mask, this.maskFormatModel);
  }

  /**
   * @description
   *
   * Indica se o `model` receberá o valor formatado pela máscara ou apenas o valor puro (sem formatação).
   *
   * @default `false`
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  maskFormatModel?: boolean = false;
  @Input('p-mask-format-model') set setMaskFormatModel(maskFormatModel: string) {
    this.maskFormatModel = maskFormatModel === '' ? true : convertToBoolean(maskFormatModel);

    if (this.objMask instanceof PoMask) {
      this.objMask.formatModel = this.maskFormatModel;

      this.validateModel();
    }
  }

  constructor(protected cd?: ChangeDetectorRef) {
    this.objMask = new PoMask(this.mask, this.maskFormatModel);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  callOnChange(value: any) {
    this.updateModel(value);

    this.controlChangeModelEmitter(value);
  }

  callUpdateModelWithTimeout(value) {
    setTimeout(() => this.updateModel(value));
  }

  controlChangeModelEmitter(value: any) {
    if (this.modelLastUpdate !== value || this.emitAllChanges) {
      this.changeModel.emit(value);
      this.modelLastUpdate = value;
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd?.markForCheck();
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangePropagate = func;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  updateModel(value: any) {
    // Quando o input não possui um formulário, então esta função não é registrada
    if (this.onChangePropagate) {
      this.onChangePropagate(value);
    }
  }

  validate(c: AbstractControl): { [key: string]: any } {
    this.subscription?.unsubscribe();
    if (!this.hasValidatorRequired && this.showErrorMessageRequired && c.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    if (requiredFailed(this.required, this.disabled, this.getScreenValue())) {
      this.isInvalid = true;
      return {
        required: {
          valid: false
        }
      };
    }

    if (
      maxlengpoailed(this.maxlength, this.getScreenValue(), this.maskFormatModel ? false : this.maskNoLengthValidation)
    ) {
      this.isInvalid = true;
      return {
        maxlength: {
          valid: false
        }
      };
    }

    if (
      minlengpoailed(this.minlength, this.getScreenValue(), this.maskFormatModel ? false : this.maskNoLengthValidation)
    ) {
      this.isInvalid = true;
      return {
        minlength: {
          valid: false
        }
      };
    }

    if (patternFailed(this.pattern, c.value)) {
      this.isInvalid = true;
      this.validatePatternOnWriteValue(c.value);
      return {
        pattern: {
          valid: false
        }
      };
    }

    if (this.errorPattern !== '') {
      this.subscription = c.statusChanges
        .pipe(
          switchMap(status => {
            if (status === 'INVALID') {
              this.isInvalid = true;
              this.cd.markForCheck();
            }
            return [];
          })
        )
        .subscribe();
    }

    this.isInvalid = false;
    return this.extraValidation(c);
  }

  // Função implementada do ControlValueAccessor
  writeValue(value: any) {
    this.writeValueModel(value);
    this.cd?.markForCheck();
  }

  protected validateModel() {
    if (this.validatorChange) {
      this.validatorChange();
    }
  }

  // utilizado para validar o pattern na inicializacao, fazendo dessa forma o campo fica sujo (dirty).
  private validatePatternOnWriteValue(value: string) {
    if (value && this.passedWriteValue) {
      setTimeout(() => {
        this.updateModel(value);
      });

      this.passedWriteValue = false;
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoNomeDoComponenteComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoNomeDoComponenteComponent, { static: true }) nomeDoComponente: PoNomeDoComponenteComponent;
   *
   * focusComponent() {
   *   this.nomeDoComponente.focus();
   * }
   * ```
   */
  abstract focus(): void;

  // Método que receberá o valor do model
  abstract writeValueModel(value: any): void;

  // Validações do campo
  abstract extraValidation(c: AbstractControl): { [key: string]: any };

  // Deve retornar o valor do campo
  abstract getScreenValue(): string;
}
