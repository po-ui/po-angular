import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  InjectOptions,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, UntypedFormControl, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { convertToBoolean, getDefaultSize, isTypeof, validateSize } from '../../../utils/util';
import { PoTableColumnSpacing } from '../../po-table/enums/po-table-spacing.enum';
import { requiredFailed } from '../validators';
import { PoLookupAdvancedFilter } from './interfaces/po-lookup-advanced-filter.interface';
import { PoLookupColumn } from './interfaces/po-lookup-column.interface';
import { PoLookupFilter } from './interfaces/po-lookup-filter.interface';
import { PoLookupLiterals } from './interfaces/po-lookup-literals.interface';
import { PoLookupFilterService } from './services/po-lookup-filter.service';
import { PoLookupModalService } from './services/po-lookup-modal.service';

export const poLookupLiteralsDefault = {
  en: <PoLookupLiterals>{
    search: 'Search',
    clean: 'Clean'
  },
  es: <PoLookupLiterals>{
    search: 'Buscar',
    clean: 'Limpiar'
  },
  pt: <PoLookupLiterals>{
    search: 'Pesquisar',
    clean: 'Apagar'
  },
  ru: <PoLookupLiterals>{
    search: 'Поиск',
    clean: 'чистый'
  }
};

/**
 * @description
 *
 * Componente utilizado para abrir uma janela de busca com uma tabela que lista dados de um serviço. Nesta janela é possível buscar e
 * selecionar um ou mais registros que serão enviados para o campo. O `po-lookup` permite que o usuário digite um valor e pressione a tecla *TAB* para
 * buscar um registro.
 *
 * > Caso o campo seja iniciado ou preenchido com um valor inexistente na busca, o mesmo será limpado.
 * No segundo caso ocorrerá após este perder o foco; ambos os casos o campo ficará inválido quando requerido.
 *
 * > Enquanto o componente realiza a requisição ao servidor, o componente ficará desabilitado e com o status interno do
 * [modelo](https://angular.io/guide/form-validation#creating-asynchronous-validators) como `pending`.
 *
 * Este componente não é recomendado quando a busca dos dados possuir poucas informações, para isso utilize outros componentes como o
 * `po-select` ou o `po-combo`.
 */
@Directive()
export abstract class PoLookupBaseComponent
  implements ControlValueAccessor, OnDestroy, OnInit, Validator, AfterViewInit, OnChanges
{
  private _literals?: PoLookupLiterals;
  private readonly language: string;
  private _size?: string = undefined;
  private _spacing: PoTableColumnSpacing;

  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional ao `p-help`, com o texto desta propriedade no tooltip.
   * Se o evento `p-additional-help` estiver definido, o tooltip não será exibido.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) será incluído no body da página e não
   * dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou overflow
   * escondido, garantindo o posicionamento correto do tooltip próximo ao elemento.
   *
   * > Quando utilizado com `p-additional-help-tooltip`, leitores de tela como o NVDA podem não ler o conteúdo do tooltip.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox?: boolean = false;

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
   * Label do campo.
   *
   * > Quando utilizar esta propriedade o seu valor será utilizado como título da modal do componente caso não tenha
   * sido definido um `modalTitle` na propriedade `p-literals`.
   */
  @Input('p-label') label?: string;

  /**
   * @description
   *
   * Objeto com as literais usadas no `po-lookup`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoLookupLiterals = {
   *    modalPrimaryActionLabel: 'Select',
   *    modalSecondaryActionLabel: 'Cancel',
   *    modalPlaceholder: 'Search Value',
   *    modalTableNoColumns: 'No columns',
   *    modalTableNoData: 'No data',
   *    modalTableLoadingData: 'Loading data',
   *    modalTableLoadMoreData: 'Load more',
   *    modalTitle: 'Select a user',
   *    modalAdvancedSearch: 'Advanced search',
   *    modalAdvancedSearchTitle: 'Advanced search',
   *    modalAdvancedSearchPrimaryActionLabel: 'Filter',
   *    modalAdvancedSearchSecondaryActionLabel: 'Return',
   *    modalDisclaimerGroupTitle: 'Presenting results filtered by:'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoLookupLiterals = {
   *    modalPrimaryActionLabel: 'Select'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-lookup
   *   [p-literals]="customLiterals">
   * </po-lookup>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoLookupLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poLookupLiteralsDefault[poLocaleDefault],
        ...poLookupLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poLookupLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poLookupLiteralsDefault[this.language];
  }

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  /** Mensagem que aparecerá enquanto o campo não estiver preenchido. */
  @Input('p-placeholder') set placeholder(value: string) {
    this._placeholder = value || '';
  }

  get placeholder() {
    return this._placeholder;
  }

  /** Nome e Id do componente. */
  @Input('name') name: string;

  /**
   * @description
   *
   * Indica a coluna que será utilizada como valor do campo.
   *
   * > Atenção: Caso não seja passada ou tenha o conteúdo incorreto, não irá atualizar o model do formulário.
   */
  @Input('p-field-value') fieldValue: string;

  /** Indica a coluna que será utilizada como descrição do campo e como filtro dentro da janela. */
  @Input('p-field-label') set fieldLabel(value: string) {
    this._fieldLabel = value;
    this.keysDescription = [this.fieldLabel];
  }

  get fieldLabel() {
    return this._fieldLabel;
  }

  /** Valor que será repassado como parâmetro para a URL ou aos métodos do serviço que implementam a interface `PoLookupFilter`. */
  @Input('p-filter-params') filterParams?: any;

  /**
   * @optional
   *
   * @description
   *
   * Formato de exibição do campo.
   *
   * Recebe uma função que deve retornar uma *string* com o/os valores do objeto formatados para exibição, por exemplo:
   *
   * ```
   * fieldFormat(obj) {
   *   return `${obj.id} - ${obj.name}`;
   * }
   * ```
   * > Esta propriedade sobrepõe o valor da propriedade `p-field-label` na descrição do campo.
   *
   * Pode-se informar uma lista de propriedades que deseja exibir como descrição do campo, Por exemplo:
   * ```
   * <po-lookup
   *  ...
   *  [p-field-format]="['id','nickname']"
   *  ...
   * >
   *
   * Objeto retornado:
   *   {
   *      id:123,
   *      name: 'Kakaroto',
   *      nickname: 'Goku',
   *   }
   * Apresentação no campo: 123 - Goku
   * ```
   *
   * > Será utilizado ` - ` como separador.
   */
  @Input('p-field-format') fieldFormat?: ((value) => string) | Array<string>;

  /**
   * Lista das colunas da tabela.
   * Essa propriedade deve receber um array de objetos que implementam a interface PoLookupColumn.
   */
  @Input('p-columns') columns?: Array<PoLookupColumn>;

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
   *
   * @optional
   *
   * @description
   *
   * Lista de objetos dos campos que serão criados na busca avançada.
   *
   * > Caso não seja passado um objeto ou então ele esteja em branco o link de busca avançada ficará escondido.
   *
   * Exemplo de URL com busca avançada:
   *
   * ```
   * url + ?page=1&pageSize=20&name=Tony%20Stark&nickname=Homem%20de%20Ferro
   * ```
   *
   * Caso algum parâmetro seja uma lista, a concatenação é feita utilizando vírgula.
   * Exemplo:
   *
   * ```
   * url + ?page=1&pageSize=20&name=Tony%20Stark,Peter%20Parker,Gohan
   * ```
   *
   */
  @Input('p-advanced-filters') advancedFilters: Array<PoLookupAdvancedFilter>;

  /**
   * @optional
   *
   * @description
   *
   * Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-columns-manager', transform: convertToBoolean })
  hideColumnsManager: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Ativa a funcionalidade de scroll infinito para a tabela exibida no retorno da consulta.
   *
   * @default `false`
   */
  @Input({ alias: 'p-infinite-scroll', transform: convertToBoolean }) infiniteScroll: boolean = false;

  /** Exibe um ícone que permite limpar o campo. */
  @Input({ alias: 'p-clean', transform: convertToBoolean }) clean: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a seleção de múltiplos itens.
   *
   * > Quando habilitado o valor do campo passará a ser uma lista de valores, por exemplo: `[ 12345, 67890 ]`
   *
   * @default `false`
   */
  @Input({ alias: 'p-multiple', transform: convertToBoolean }) multiple: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo
   * com o número de itens selecionados e a extensão dos mesmos, mantendo-os sempre visíveis.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-height', transform: convertToBoolean }) autoHeight: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   */
  @Input('p-field-error-message') fieldErrorMessage: string;

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do input como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o espaçamento interno das células, impactando diretamente na altura das linhas do table dentro do modal. Os
   * valores permitidos são definidos pelo enum **PoTableColumnSpacing**.
   *
   * > Em nível de acessibilidade **AA**, caso o valor de `p-spacing` não seja definido, o valor padrão será `extraSmall`
   * > nos seguintes cenários:
   * > - Quando o valor de `p-size` for `small`;
   * > - Quando o valor padrão dos componentes for configurado como `small` no
   * > [serviço de tema](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-spacing') set spacing(value: string) {
    if (Object.values(PoTableColumnSpacing).includes(value as PoTableColumnSpacing)) {
      this._spacing = value as PoTableColumnSpacing;
    } else {
      this._spacing = this.getDefaultSpacing();
    }
  }

  get spacing() {
    return this._spacing ?? this.getDefaultSpacing();
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * Esta propriedade aplica-se ao texto contido nas células da tabela.
   *
   * > Incompatível com `virtual-scroll`, que requer altura fixa nas linhas.
   *
   * @default `false`
   */
  @Input({ alias: 'p-text-wrap', transform: convertToBoolean }) textWrap?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados.
   * A altura da tabela já é pré-definida, portanto o `virtual-scroll` será ativado automaticamente.
   *
   * > Incompatível com `p-text-wrap` e `master-detail`, pois o `virtual-scroll` exige altura fixa nas linhas.
   *
   * @default `true`
   */
  @Input({ alias: 'p-virtual-scroll', transform: convertToBoolean }) virtualScroll?: boolean = true;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   * Este evento ativa automaticamente a exibição do ícone de ajuda adicional ao `p-help`.
   */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();

  /**
   * Evento será disparado quando ocorrer algum erro na requisição de busca do item.
   * Será passado por parâmetro o objeto de erro retornado.
   */
  @Output('p-error') onError: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * @optional
   *
   * @description
   *
   * Evento será disparado quando ocorrer alguma seleção.
   * Será passado por parâmetro o objeto com o valor selecionado.
   */
  @Output('p-selected') selected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   *  Evento que será disparado ao alterar o model.
   *  Por parâmetro será passado o novo valor.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
   *
   * O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-restore-column-manager') columnRestoreManager = new EventEmitter<Array<string>>();

  displayAdditionalHelp: boolean = false;
  service: any;

  protected selectedOptions = [];
  protected getSubscription: Subscription;
  protected keysDescription: Array<any>;
  protected oldValue: string = '';
  protected valueToModel;
  protected oldValueToModel = null;
  // eslint-disable-next-line
  protected onTouched: any = null;
  protected resizeListener: () => void;

  private _disabled?: boolean = false;
  private _fieldLabel: string;
  private _filterService: PoLookupFilter | string;
  private _noAutocomplete: boolean;
  private _placeholder: string = '';
  private _required?: boolean = false;
  private readonly _autoHeight: boolean = false;

  private readonly autoHeightInitialValue: boolean;
  private onChangePropagate: any = null;
  private validatorChange: any;

  private control!: AbstractControl;

  private readonly injectOptions: InjectOptions = {
    self: true
  };

  /**
   * Serviço responsável por buscar os dados da tabela na janela. Pode ser informado um serviço que implemente a interface
   * `PoLookupFilter` ou uma URL.
   *
   * Quando utilizada uma URL de um serviço, será concatenada nesta URL o valor que deseja-se filtrar, por exemplo:
   *
   * ```
   * url + ?page=1&pageSize=20&filter=Peter
   * ```
   *
   * Caso utilizar ordenação, a coluna ordenada será enviada através do parâmetro `order`, por exemplo:
   * - Coluna decrescente:
   *   ```
   *    url + ?page=1&pageSize=20&filter=Peter&order=-name
   *   ```
   *
   * - Coluna ascendente:
   *   ```
   *    url + ?page=1&pageSize=20&filter=Peter&order=name
   *   ```
   *
   * Se for definido a propriedade `p-filter-params`, o mesmo também será concatenado. Por exemplo, para o
   * parâmetro `{ age: 23 }` a URL ficaria:
   *
   * ```
   * url + ?page=1&pageSize=20&age=23&filter=Peter
   * ```
   *
   * Ao iniciar o campo com valor, os registros serão buscados da seguinte forma:
   * ```
   * model = 1234;
   *
   * GET url/1234
   * ```
   *
   * Caso estiver com múltipla seleção habilitada:
   * ```
   * model = [1234, 5678]
   *
   * GET url?${fieldValue}=1234,5678
   * ```
   *
   * > Esta URL deve retornar e receber os dados no padrão de [API do PO UI](https://po-ui.io/guides/api) e utiliza os valores
   * definidos nas propriedades `p-field-label` e `p-field-value` para a construção do `po-lookup`.
   *
   * Caso o usuário digite um valor e pressione a tecla *TAB* para realizar a busca de um registro específico, o valor que se
   * deseja filtrar será codificado utilizando a função [encodeURIComponent](https://tc39.es/ecma262/#sec-encodeuricomponent-uricomponent)
   * e concatenado na URL da seguinte forma:
   *
   * ```
   * url/valor%20que%20se%20deseja%20filtrar
   * ```
   *
   * > Quando informado um serviço que implemente a interface `PoLookupFilter` o tratamento de encoding do valor a ser filtrado ficará a cargo do desenvolvedor.
   *
   */
  @Input('p-filter-service') set filterService(filterService: PoLookupFilter | string) {
    this._filterService = filterService;
    this.setService(this.filterService);
  }

  get filterService() {
    return this._filterService;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a propriedade nativa `autocomplete` do campo como `off`.
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
   * Define que o campo será obrigatório.
   * > Esta propriedade é desconsiderada quando o input está desabilitado `(p-disabled)`.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel(this.valueToModel);
  }

  get required(): boolean {
    return this._required;
  }

  /**
   * Define se a indicação de campo obrigatório seré exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /**
   * @description
   *
   * Indica que o campo será desabilitado.
   *
   * @default false
   * @optional
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = <any>disabled === '' ? true : convertToBoolean(disabled);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(
    private readonly defaultService: PoLookupFilterService,
    @Inject(Injector) private readonly injector: Injector,
    public poLookupModalService: PoLookupModalService,
    languageService: PoLanguageService,
    protected poThemeService: PoThemeService
  ) {
    this.language = languageService.getShortLanguage();
  }

  ngOnDestroy() {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initializeColumn();
  }

  ngAfterViewInit(): void {
    this.setControl();
  }

  cleanModel() {
    this.cleanViewValue();
    this.callOnChange(undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns?.currentValue) {
      this.columns = changes.columns.currentValue;
      this.poLookupModalService?.setChangeColumns(this.columns);
    }

    if (changes.multiple && isTypeof(this.filterService, 'string')) {
      this.service.setConfig(this.filterService, this.fieldValue, this.multiple);
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  // Função implementada do ControlValueAccessor.
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model.
  registerOnChange(func: any): void {
    this.onChangePropagate = func;
  }

  // Função implementada do ControlValueAccessor.
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model.
  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  // Seleciona o valor do model.
  selectValue(valueSelected: any) {
    this.valueToModel = valueSelected;
    if (this.multiple) {
      this.callOnChange(this.valueToModel);
    } else if (this.valueToModel) {
      this.callOnChange(this.valueToModel[this.fieldValue]);
    } else {
      this.callOnChange(undefined);
    }
    this.selected.emit(valueSelected);
  }

  callOnChange(value: any) {
    // Quando o input não possui um formulário, então esta função não é registrada.
    if (this.onChangePropagate) {
      this.onChangePropagate(value);
    }

    if (this.oldValueToModel !== this.valueToModel) {
      this.change.emit(value);
    }

    // Armazenar o valor antigo do model
    this.oldValueToModel = this.valueToModel;
  }

  searchById(value) {
    let checkedValue = value;

    if (typeof checkedValue === 'string') {
      checkedValue = checkedValue.trim();
    }

    if (checkedValue !== '' && checkedValue !== '.') {
      const oldDisable = this.disabled;
      this.disabled = true;

      if (this.control) {
        // :TODO: Retirar no futuro pois esse setTimeout foi feito
        // pois quando o campo é acionado pelos métodos setValue ou patchValue
        // a mudança não é detectada
        setTimeout(() => this.control.markAsPending());
      }

      this.getSubscription = this.service
        .getObjectByValue(value, this.filterParams)
        .pipe(
          finalize(() => {
            this.disabled = oldDisable;

            if (this.control) {
              this.control.updateValueAndValidity();
            }
          })
        )
        .subscribe(
          element => {
            if (element?.length || (!Array.isArray(element) && element)) {
              if (Array.isArray(element) && element.length > 1) {
                this.setDisclaimers(element);
                this.updateVisibleItems();
              }

              this.selectModel(Array.isArray(element) ? element : [element]);
            } else {
              this.cleanModel();
            }
          },
          error => {
            this.cleanModel();
            this.onError.emit(error);
          }
        );
    } else {
      this.cleanModel();
    }
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }
  }

  writeValue(value: any): void {
    if (value?.length || (!Array.isArray(value) && value)) {
      // Esta condição é executada somente quando é passado o ID para realizar a busca pelo ID.
      this.searchById(value);
    } else {
      this.cleanViewValue();
    }
  }

  // Retorna o Subscriber da propriedade getSubscription que ocorre
  // no evento de blur que executa o método searchEvent().
  getSubscriptionFunction(): Subscription {
    return this.getSubscription;
  }

  protected cleanViewValue() {
    this.setDisclaimers([]);
    this.setViewValue('', {});
    this.oldValue = '';
    this.valueToModel = null;
  }

  // Formata a label do campo.
  protected getFormattedLabel(value: any): string {
    return value ? this.keysDescription.map(column => value[column]).join(' - ') : '';
  }

  // Chama o método writeValue e preenche o model.
  protected selectModel(options: Array<any>) {
    if (options.length) {
      this.selectedOptions = [...options];

      const newModel = this.multiple ? options.map(option => option[this.fieldValue]) : options[0];
      this.selectValue(newModel);

      if (options.length === 1) {
        this.oldValue = options[0][this.fieldLabel];
        this.setViewValue(this.getFormattedLabel(options[0]), options[0]);
      }
    } else {
      this.selectValue(undefined);
      this.cleanViewValue();
    }
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  private setService(service: PoLookupFilter | string) {
    if (isTypeof(service, 'object')) {
      this.service = <PoLookupFilterService>service;
    }

    if (service && isTypeof(service, 'string')) {
      this.service = this.defaultService;
      this.service.setConfig(service, this.fieldValue, this.multiple);
    }
  }

  private setControl() {
    const ngControl: NgControl = this.injector.get(NgControl, null, this.injectOptions);

    if (ngControl) {
      this.control = ngControl.control as UntypedFormControl;
    }
  }

  private initializeColumn(): void {
    if (this.fieldLabel) {
      this.keysDescription = [this.fieldLabel];
    } else {
      this.keysDescription = [];

      this.keysDescription = this.columns.filter(element => element.fieldLabel).map(element => element.property);
    }
  }

  // Atribui um ou mais valores ao campo.
  abstract setViewValue(value: any, object: any): void;

  // Método com a implementação para abrir o lookup.
  abstract openLookup(): void;

  abstract setDisclaimers(a);

  abstract updateVisibleItems();

  protected abstract getDefaultSpacing();
}
