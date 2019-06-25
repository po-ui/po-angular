import { AbstractControl } from '@angular/forms';
import { Input } from '@angular/core';

import { PoBreadcrumb } from '@portinari/portinari-ui';

import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

/**
 * @description
 *
 * O `po-page-job-scheduler` é uma página para criação e atualização do *Job Scheduler* de forma simplificada, apenas informando
 * o serviço (endpoint) para consumo, sem a necessidade de criar componentes e tratamentos dos dados.
 */
export class PoPageJobSchedulerBaseComponent {

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /**
   * Endpoint usado pelo template para requisição do recurso que será utilizado para criação e edição.
   *
   * #### Processos
   *
   * Em sua inicialização será verificado a existência do endpoint `{end-point}/processes`.
   * Caso o endpoint seja válido, será utilizado um componente para selecionar o processo e filtrá-los.
   * Caso não seja válido, será utilizado um campo de entrada de texto para informar o endpoint.
   *
   * Para realizar o filtro de busca do processo, será enviado o conteúdo a ser filtrado através da propriedade *search*.
   * Os processos devem retornar uma lista de objetos que seguem a definição de dados abaixo:
   *
   * ```
   * GET {end-point}/processes?search=ac04
   * ...
   * { "processID": "string", "description": "string" }
   * ```
   *
   * Para retornar parâmetros dos processos, será realizado um `GET` como exemplificado abaixo.
   * Os parâmetros devem retornar uma lista de objetos que seguem a interface [PoDynamicFormField](/documentation/po-dynamic-form).
   *
   * ```
   * GET {end-point}/processes/:id/parameters
   * ...
   * { items: [{ "property": "server" }, { "property": "program" }] }
   * ```
   *
   * #### Salvar e Atualizar
   *
   * Para salvar o recurso, será feito uma requisição de criação no mesmo endpoint, passando os valores
   * preenchidos pelo usuário via *payload*. Abaixo uma requisição `POST` disparada,
   * onde as propriedades do *Job Scheduler* foram preenchidas:
   *
   * ```
   *  POST /api/po-samples/v1/jobschedulers HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * *Request payload*:
   *
   * ```
   * { "firstExecution": "2018-12-07T00:00:01-00:00", "recurrent": true, "daily": { "hour": 10, "minute": 12 }, "processID": "ac0405" }
   * ```
   *
   * Caso queira que o template carregue um recurso já existente, deve ser incluído um parâmetro na rota chamado `id`.
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
   * GET {end-point}/{id}
   * ```
   *
   * Ao salvar o recurso será disparado um `PUT` com os dados preenchidos. Abaixo uma requisição `PUT` disparada,
   * onde a propriedade *recurrent* e *daily* foram preenchidas/atualizadas e o `id` da url é 1:
   *
   * ```
   *  PUT /api/po-samples/v1/jobschedulers/1 HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * *Request payload*:
   *
   * ```
   * { "firstExecution": "2018-12-07T00:00:01-00:00", "recurrent": false, "daily": { "hour": 11, "minute": 30 }, "processID": "ac0405" }
   * ```
   */
  @Input('p-service-api') serviceApi: string;

  /** Título da página. */
  @Input('p-title') title: string;

  model: PoJobSchedulerInternal = new PoPageJobSchedulerInternal();

  constructor(protected poPageJobSchedulerService: PoPageJobSchedulerService) {}

  protected loadData(id: string | number) {
    if (!id) {
      this.model = new PoPageJobSchedulerInternal();
      return;
    }

    this.poPageJobSchedulerService.getResource(id).toPromise().then((response: PoJobSchedulerInternal) => {
      this.model = response;
    }).catch(() => {
      this.model = new PoPageJobSchedulerInternal();
    });

  }

  protected markAsDirtyInvalidControls(controls: { [key: string]: AbstractControl } ) {
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        const control = controls[key];

        if (control.invalid) {
          control.markAsDirty();
        }
      }
    }
  }

}
