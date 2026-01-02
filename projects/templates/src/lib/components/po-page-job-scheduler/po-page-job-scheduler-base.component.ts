import { Directive, EventEmitter, HostBinding, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { PoBreadcrumb, PoDynamicFormField, PoStepperOrientation } from '@po-ui/ng-components';

import { Subscription } from 'rxjs';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

/**
 * @description
 *
 * O `po-page-job-scheduler` é uma página para criação e atualização de agendamentos da execução de processos (Job Scheduler),
 * como por exemplo: a geração da folha de pagamento dos funcionários.
 *
 * Para utilizar esta página, basta informar o serviço (endpoint) para consumo,
 * sem a necessidade de criar componentes e tratamentos dos dados.
 *
 * Veja mais sobre os padrões utilizados nas requisições no [Guia de implementação de APIs](guides/api).
 *
 * #### Tokens customizáveis
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade         | Descrição                                   | Valor Padrão                          |
 * |---------------------|---------------------------------------------|---------------------------------------|
 * | **Header**          |                                             |                                       |
 * | `--padding`         | Espaçamento do header                       | `var(--spacing-xs) var(--spacing-md)` |
 * | `--gap`             | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)`                   |
 * | `--gap-actions`     | Espaçamento entre as ações                  | `var(--spacing-xs)`                   |
 * | `--font-family`     | Família tipográfica do título               | `var(--font-family-theme)`            |
 * | **Content**         |                                             |                                       |
 * | `--padding-content` | Espaçamento do conteúdo                     | `var(--spacing-xs) var(--spacing-sm)` |
 */
@Directive()
export class PoPageJobSchedulerBaseComponent implements OnDestroy {
  private _componentsSize?: string = undefined;
  private _initialComponentsSize?: string = undefined;

  /** Objeto com as propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no template:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  set componentsSize(value: string) {
    this._initialComponentsSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-components-size')
  @HostBinding('attr.p-components-size')
  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSizeFn();
  }

  /**
   * Endpoint usado pelo componente para busca dos processos e parâmetros que serão utilizados para criação e edição dos agendamentos.
   *
   * #### Processos
   *
   * Os processos são as tarefas que estarão disponíveis para o usuário poder fazer os agendamentos.
   * Ao inicializar o componente, será feito uma requisição `GET` para o endpoint `{service-api}/processes`, para buscar
   * essa lista de processos.
   *
   * Este endpoint `{service-api}/processes` deve retornar uma lista de objetos que seguem a definição de dados abaixo:
   *
   * ```
   * GET {service-api}/processes
   * ```
   *
   * ```
   * {
   *   items: [
   *     { "processID": "ac4f", "description": "Gerar folha de pagamento" },
   *     { "processID": "df6l", "description": "Relatório de imposto a recolher" },
   *     { "processID": "dk3p", "description": "Títulos em aberto" },
   *   ]
   * }
   * ```
   *
   * Desta forma será renderizado um componente para selecionar o processo e/ou filtrá-los.
   *
   * Para realizar o filtro de busca do processo, será feita uma requisição enviando o conteúdo digitado na busca através do
   * parâmetro `search`. Da seguinte forma:
   *
   * ```
   * GET {service-api}/processes?search=relatorio
   * ```
   *
   * > Veja mais sobre paginação e filtros no [Guia de implementação de APIs](guides/api).
   * Caso seja informada a propriedade `p-parameters` não serão realizadas as requisições de processos e nem de parametros automaticamente.
   *
   * Também é possível fazer um agendamento de um processo específico, sem que seja necessário um endpoint para busca desses
   * processos. Então, caso o endpoint `{service-api}/processes` não seja válido, será apresentado um campo de entrada de
   * texto para o usuário informar diretamente
   * o **identificador do processo - `processID`** e ao salvar será enviado um `POST` para o endpoint difinido `serviceApi` conforme abaixo:
   *
   * ```
   * POST {service-api}
   * ```
   *
   * *Request payload* - estrutura de dados enviada no corpo da requisição conforme interface `PoJobScheduler`:
   *
   * ```
   * {
   *   "daily": { "hour": 10, "minute": 12 },
   *   "firstExecution": "2018-12-07T00:00:01-00:00",
   *   "recurrent": true,
   *   "processID": "ac0405"
   *   ...
   * }
   * ```
   *
   * Caso seja necessário informar parâmetros e adicionar configurações no processo selecionado, será realizado um `GET`
   * como exemplificado abaixo. Os parâmetros devem retornar uma lista de objetos que seguem a interface
   * [PoDynamicFormField](/documentation/po-dynamic-form). Porém, caso utilizar a propriedade `p-parameters` o componente não
   * realizará a busca automática e o campo de processos não será exibido.
   *
   * ```
   * GET {service-api}/processes/:id/parameters
   * ...
   * {
   *   items: [
   *     { "property": "vencimento", type: "date" },
   *     { "property": "imposto-retido", "label": "Imposto Retido", type: "boolean" }
   *   ]
   * }
   * ```
   *
   * #### Salvar e Atualizar
   *
   * Para salvar o agendamento, será feita uma requisição de criação, passando os valores preenchidos pelo usuário via *payload*.
   * Abaixo uma requisição `POST` disparada, onde as propriedades do *Job Scheduler* foram preenchidas:
   *
   * ```
   *  POST {service-api}
   * ```
   *
   * *Request payload* - estrutura de dados enviada no corpo da requisição conforme interface `PoJobScheduler`:
   *
   * ```
   * {
   *   "firstExecution": "2018-12-07T00:00:01-00:00",
   *   "recurrent": true,
   *   "monthly": { "day": 1, "hour": 10, "minute": 0 },
   *   "processID": "ac0405",
   *   "rangeExecutions: { "frequency": { "type": "hour", "value": 2 }, "rangeLimit": { "hour": 18, "minute": 0, "day": 20 } }
   * }
   * ```
   *
   * Caso queira que o componente carregue um agendamento já existente, deve ser incluído um parâmetro na rota chamado `id`.
   *
   * Exemplo de configuração de rota:
   *
   * ```
   *  RouterModule.forRoot([
   *    ...
   *    { path: 'edit/:id', component: ExampleJobSchedulerComponent },
   *    ...
   *  ],
   * ```
   *
   * Baseado nisso, na inicialização do template será disparado uma requisição para buscar o recurso que será editado.
   *
   * ```
   * GET {service-api}/{id}
   * ```
   *
   * Ao atualizar o agendamento, será disparado um `PUT` com os dados preenchidos.
   * Veja abaixo uma requisição `PUT` disparada, onde a propriedade *recurrent* e *daily* foram atualizadas:
   *
   * ```
   *  PUT {service-api}/{id}
   * ```
   *
   * *Request payload* - estrutura de dados enviada no corpo da requisição conforme interface `PoJobScheduler`:
   *
   * ```
   * {
   *   "firstExecution": "2018-12-07T00:00:01-00:00",
   *   "recurrent": true,
   *   "processID": "ac0405",
   *   "monthly": { "day": 1, "hour": 10, "minute": 0 },
   *   "processID": "ac0405",
   *   "rangeExecutions: { "frequency": { "type": "hour", "value": 2 }, "rangeLimit": { "hour": 18, "minute": 0, "day": 20 } }
   * }
   * ```
   */
  @Input('p-service-api') serviceApi: string;

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * Parâmetros que serão utilizados para criação e edição dos agendamentos.
   *
   * Ao utilizar esta propriedade, o componente não buscará automaticamente os parâmetros da API e o campo para preenchimento do processo não será exibido.
   *
   */
  @Input('p-parameters') parameters: Array<PoDynamicFormField> = [];

  @Input('p-value') set value(value: any) {
    this.model = this.poPageJobSchedulerService.convertToJobSchedulerInternal(value);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a orientação de exibição do `po-stepper`.
   *
   * > Quando não utilizada, segue o comportamento com base nas dimensões da tela.
   *
   * > Veja os valores válidos no *enum* [PoStepperOrientation](documentation/po-stepper#stepperOrientation).
   *
   */

  @Input('p-orientation') set stepperDefaultOrientation(value: PoStepperOrientation) {
    this._orientation = (<any>Object).values(PoStepperOrientation).includes(value) ? value : undefined;
  }

  get stepperDefaultOrientation(): PoStepperOrientation {
    return this._orientation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Função chamada após realizar a confirmação da execução no PoPageJobScheduler.
   * Permite alterar os valores do model do PoPageJobScheduler antes de realizar o envio para a Api.
   *
   * > Deve retornar um objeto do tipo `PoPageJobScheduler` para ser adicionado ao model do PoPageJobScheduler.
   *
   * > Ao ser disparada, a mesma receberá por parâmetro o model do PoPageJobScheduler de interface `PoJobSchedulerInternal`.
   *
   * O contexto da função que será chamada, será o mesmo que o do `PoPageJobScheduler`, então para poder alterar
   * para o contexto do componente que o está utilizando, pode ser utilizado a propriedade `bind` do Javascript.
   * Por exemplo, para a função `beforeSend`:
   *
   * ```
   * <po-page-job-scheduler [p-service-api]="serviceApi" [p-parameters]="params" [p-before-send]="beforeSend.bind(this)">
   * ...
   * </po-page-job-scheduler>
   * ```
   */
  @Input('p-before-send') beforeSendAction: (model: PoJobSchedulerInternal) => PoJobSchedulerInternal;

  /**
   * @optional
   *
   * @description
   *
   * Define se o step `Agendamento` deve ser exibido como o último na sequência de steps
   *
   * > Aplicável apenas quando utilizado `PoJobSchedulerParametersTemplateDirective`
   */
  @Input('p-step-execution-last') stepExecutionLast: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao concluir o processo de agendamento com sucesso.
   */
  @Output('p-success') success = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao ocorrer um erro impossibilitando a conclusão do agendamento.
   * Para este evento será passado como parâmetro os detalhes do erro.
   */
  @Output('p-error') error = new EventEmitter<any>();

  model: PoJobSchedulerInternal = new PoPageJobSchedulerInternal();

  private _subscription = new Subscription();
  private _orientation;

  constructor(protected poPageJobSchedulerService: PoPageJobSchedulerService) {}

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  protected loadData(id: string | number) {
    if (!id) {
      this.model = this.model || new PoPageJobSchedulerInternal();
      return;
    }

    this._subscription.add(
      this.poPageJobSchedulerService.getResource(id).subscribe(
        (response: PoJobSchedulerInternal) => {
          this.model = response;
        },
        () => {
          this.model = new PoPageJobSchedulerInternal();
        }
      )
    );
  }

  protected markAsDirtyInvalidControls(controls: { [key: string]: AbstractControl }) {
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        const control = controls[key];

        if (control.invalid) {
          control.markAsDirty();
        }
      }
    }
  }

  private applySizeBasedOnA11y(): void {
    this._componentsSize = validateSizeFn(this._initialComponentsSize);
  }
}
