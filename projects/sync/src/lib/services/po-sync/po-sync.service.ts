import { Injectable } from '@angular/core';

import { forkJoin, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { expand, map, mergeMap, reduce } from 'rxjs/operators';
import { validateParameter, validateArray } from '../../utils/utils';

import { PoDataMessage, PoEntity } from '../../models';
import { PoEventSourcingService } from '../po-event-sourcing/po-event-sourcing.service';
import { PoHttpClientService } from '../po-http-client/po-http-client.service';
import { PoHttpRequestData } from '../po-http-client/interfaces/po-http-request-data.interface';
import { PoNetworkService } from '../po-network/po-network.service';
import { PoRequestType } from '../../models/po-request-type.enum';
import { PoSchemaDefinitionService } from './../po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './../po-schema/po-schema.service';
import { PoSchemaUtil } from './../po-schema/po-schema-util/po-schema-util.model';
import { PoSyncConfig } from './interfaces/po-sync-config.interface';
import { PoSyncResponse } from '../po-sync/interfaces/po-sync-response.interface';
import { PoSyncSchema } from './interfaces/po-sync-schema.interface';

/**
 * @description
 *
 * O `PoSyncService` é utilizado para configurar toda a base de dados que receberá as informações que serão
 * armazenadas *offline* vindas do servidor. Nele ocorre toda a preparação dos modelos de dados retornados por
 * cada consulta.
 */
@Injectable()
export class PoSyncService {
  private config: PoSyncConfig;
  private emitter: any;
  private eventSub: Observable<any>;
  private finishSyncSubject: Subject<null> = new Subject<null>();
  private isSyncEnabled: boolean = true;
  private schemas: Array<PoSyncSchema>;
  private subscription: Subscription;
  private syncing: boolean = false;
  private timer: Observable<number>;

  models: Array<PoEntity> = [];

  constructor(
    private poEventSourcingService: PoEventSourcingService,
    private poHttpClient: PoHttpClientService,
    private poNetworkService: PoNetworkService,
    private poSchemaDefinitionService: PoSchemaDefinitionService,
    private poSchemaService: PoSchemaService
  ) {}

  /**
   * Destrói todas as chaves do *storage* referentes ao `po-sync`, ou seja,
   * as definições dos *schemas*, os registros de cada *schema* e a fila
   * de eventos que estão para ser enviados ao servidor *(EventSourcing)*.
   *
   * > Para que não venham ocorrer erros em ações que dependam das definições dos *schemas*,
   * recomenda-se utilizar o método `prepare()` em seguida.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Alterando as definições dos schemas](/guides/sync-fundamentals).
   *
   * @returns {Promise<any>} Promessa que é resolvida quando as chaves referentes ao `po-sync` forem destruídas.
   */
  async destroy(): Promise<any> {
    const destroyFunction = async () => {
      await this.poSchemaService.destroySchemasRecords();
      await this.poSchemaDefinitionService.destroy();
      await this.poEventSourcingService.destroyEventSourcingQueue();
    };

    return this.poSchemaService.limitedCallWrap(destroyFunction);
  }

  /**
   * Desabilita todos os tipos de sincronização de dados (periódica, reativa e manual).
   *
   * > Para habilitar novamente a sincronização utilize o método [`PoSyncService.enableSync()`](documentation/po-sync#enable-sync).
   */
  disableSync() {
    this.isSyncEnabled = false;

    if (this.timer && this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * <a id="enable-sync"></a>
   * Habilita todos os tipos de sincronização de dados (periódica, reativa e manual).
   *
   * Por padrão, sempre que se inicializa uma aplicação com PO Sync as sincronizações já estão habilitadas.
   */
  enableSync() {
    this.isSyncEnabled = true;
    this.createSubscribe();
  }

  /**
   * Método que disponibiliza a partir de sua inscrição o evento de retorno das operações da fila de eventos que
   * foram enviadas ao servidor. A cada operação enviada para o servidor, será disparado um evento para a inscrição
   * deste método.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).
   *
   * @returns {Observable<PoSyncResponse>} Observable com um objeto do tipo `PoSyncResponse`.
   */
  getResponses(): Observable<PoSyncResponse> {
    return this.poEventSourcingService.responsesSubject();
  }

  /**
   * Retorna uma instância de `PoEntity` para um determinado *schema*.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Manipulando os registros de um schema](/guides/sync-fundamentals).
   *
   * @param {string} schemaName Nome do *schema*.
   * @returns {PoEntity} Objeto para efetuar consultas e alterações nos dados.
   */
  getModel(schemaName: string): PoEntity {
    const model = this.models[schemaName];
    if (!model) {
      throw new Error('Model not found: ' + schemaName);
    }
    return model;
  }

  /**
   * Insere uma requisição HTTP na fila de eventos do `po-sync`.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Inserindo requisições HTTP na fila de eventos](/guides/sync-fundamentals).
   *
   * @param {PoHttpRequestData} poHttpRequestData Dados da requisição HTTP.
   * @param {string} customRequestId Identificador customizado da requisição HTTP.
   * @returns {Promise<number>} Promessa com o identificador da requisição HTTP criada.
   */
  insertHttpCommand(requestData: PoHttpRequestData, customRequestId?: string): Promise<number> {
    validateParameter({ requestData });

    return this.poEventSourcingService.httpCommand(requestData, customRequestId);
  }

  /**
   * Efetua uma chamada na API do servidor para realizar a carga inicial dos dados. Deve ser chamado apenas uma vez
   * na aplicação, após a preparação dos *schemas* realizada através do método `PoSyncService.prepare()`.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Carga inicial dos dados](/guides/sync-fundamentals).
   *
   * @returns {Observable<Array<{ entity: string, data: Array<any> }>>} Observable que notificará quando a
   * carga inicial for concluída.
   */
  loadData(): Observable<Array<{ entity: string; data: Array<any> }>> {
    const loads: Array<Observable<{ entity: string; data: Array<any> }>> = [];
    this.schemas.forEach(el => loads.push(this.loadEntityData(el)));
    return forkJoin(loads);
  }

  /**
   * Responsável por notificar sempre que houver sincronismo.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Notificação pós-sincronização](/guides/sync-fundamentals).
   *
   * @returns {Observable<any>} Observable que é disparado a cada sincronismo realizado.
   */
  onSync(): Observable<any> {
    if (!this.eventSub) {
      this.eventSub = Observable.create(e => {
        this.emitter = e;
      });
    }
    return this.eventSub;
  }

  /**
   * Prepara a aplicação criando os schemas e aplica as configurações.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Preparando a aplicação](/guides/sync-fundamentals).
   *
   * @param {Array<PoSyncSchema>} schemas Lista de *schemas* a serem preparados.
   * @param {PoSyncConfig} config Configurações adicionais.
   * @returns {Promise<any>} Promessa que é resolvida quando a aplicação estiver preparada para a utilização do `po-sync`.
   */
  prepare(schemas: Array<PoSyncSchema>, config?: PoSyncConfig): Promise<any> {
    validateArray({ schemas });

    const defaultSyncConfig: PoSyncConfig = {
      type: this.poNetworkService.getConnectionStatus().type,
      period: 60,
      dataTransform: new PoDataMessage()
    };

    this.schemas = schemas;
    this.config = config || defaultSyncConfig;
    this.config.dataTransform = this.config.dataTransform || new PoDataMessage();
    this.poEventSourcingService.config = this.config;
    this.startTimer(this.config.period);
    this.reactiveSync();
    this.poEventSourcingService.onSaveData().subscribe(() => this.sync());

    return this.saveSchemas().then(() => {
      this.schemas.forEach(schema => {
        this.models[schema.name] = new PoEntity(this.poEventSourcingService, schema, this.poSchemaService);
      });
      return Promise.resolve();
    });
  }

  /**
   * Remove um item da fila de eventos que espera a sincronização.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).
   *
   * @param {any} idEventSourcing Identificador do item da fila de eventos.
   * @returns {Promise<any>} Promessa que é resolvida quando o item da fila de eventos é removido.
   */
  removeItemOfSync(idEventSourcing: any): Promise<any> {
    return this.poEventSourcingService.removeEventSourcingItem(idEventSourcing);
  }

  /**
   * Reenvia os comandos pendentes na fila (inclusão, alteração e exclusão) e busca novos dados do servidor.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).
   *
   * @returns {Promise<any>} Promessa que resolve o sincronismo disparado.
   */
  resumeSync(): Promise<any> {
    if (!this.canSync()) {
      const finishSyncSubscription = this.finishSyncSubject.asObservable().subscribe(() => {
        finishSyncSubscription.unsubscribe();
        return this.sync();
      });
      return Promise.resolve();
    }

    return this.sync();
  }

  /**
   * Dispara o sincronismo enviando os eventos pendentes (inclusão, alteração e exclusão) e buscando novos dados do servidor.
   *
   * O sincronismo somente será executado depois que o acesso a base de dados local do dispositivo for liberada.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Sincronização manual](/guides/sync-fundamentals).
   *
   * @returns {Promise<any>} Promessa que é resolvida quando o sincronismo for finalizado.
   */
  async sync(): Promise<any> {
    if (this.canSync()) {
      this.startSync();

      try {
        await this.poEventSourcingService.syncSend();
        await this.poEventSourcingService.syncGet();

        if (this.emitter) {
          this.emitter.next();
        }

        this.finishSync();
      } catch (error) {
        this.syncError();
      }
    }
  }

  private canSync(): boolean {
    if (this.syncing || !this.isSyncEnabled) {
      return false;
    } else {
      const currentConnection = this.poNetworkService.getConnectionStatus();
      const isConfiguredConnection = this.config && currentConnection.type === this.config.type;
      const isConfigIncludesType =
        this.config && this.config.type instanceof Array && this.config.type.includes(currentConnection.type);

      return currentConnection.status && (!this.config || isConfiguredConnection || isConfigIncludesType);
    }
  }

  private createSubscribe(): void {
    if (this.timer) {
      this.subscription = this.timer.subscribe(() => {
        this.sync().then(() => {
          this.subscription.unsubscribe();
          this.subscription = null;
          this.timer = null;
          this.startTimer(this.config.period);
        });
      });
    }
  }

  private finishSync(): void {
    this.syncing = false;
    this.finishSyncSubject.next();
  }

  private getOnePage(schema: PoSyncSchema, page: number = 1): Observable<any> {
    const params = [];
    params.push(`${this.config.dataTransform.getPageSizeParamName()}=${schema.pageSize}`);
    params.push(`${this.config.dataTransform.getPageParamName()}=${page}`);

    const url = `${PoSchemaUtil.getUrl(schema, PoRequestType.GET)}?${params.join('&')}`;

    return this.poHttpClient.get(url).pipe(
      map(response => response.body),
      mergeMap(responseBody => {
        const now = new Date().getTime();
        responseBody[this.config.dataTransform.getItemsFieldName()].map(item => {
          item.SyncInsertedDateTime = now;
          item.SyncUpdatedDateTime = null;
          item.SyncExclusionDateTime = null;
          item.SyncDeleted = false;
          item.SyncStatus = 2;
        });
        return this.poSchemaService
          .updateAll(schema, responseBody[this.config.dataTransform.getItemsFieldName()])
          .then(() => responseBody);
      })
    );
  }

  private loadEntityData(schema: PoSyncSchema): Observable<{ entity: string; data: Array<any> }> {
    let page = 1;
    return this.getOnePage(schema, page).pipe(
      expand(data => {
        this.config.dataTransform.transform(data);
        const hasNext = this.config.dataTransform.hasNext();
        if (hasNext) {
          return this.getOnePage(schema, ++page);
        } else {
          return of();
        }
      }),
      reduce(
        (acc, obj) => {
          acc.data = acc.data.concat(obj[this.config.dataTransform.getItemsFieldName()]);
          return acc;
        },
        {
          entity: schema.name,
          data: []
        }
      )
    );
  }

  private reactiveSync(): void {
    this.poNetworkService.onChange().subscribe(networkStatus => {
      if (networkStatus.status) {
        this.startTimer(this.config.period);
        return this.sync();
      }

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    });
  }

  private async saveSchemas(): Promise<any> {
    const storageSchemas: Array<PoSyncSchema> = await this.poSchemaDefinitionService.getAll();
    this.schemas.forEach(schema => (schema.lastSync = PoSchemaUtil.getLastSync(storageSchemas, schema.name)));
    return this.poSchemaDefinitionService.saveAll(this.schemas);
  }

  private startSync(): void {
    this.syncing = true;
  }

  private startTimer(period): void {
    if (period && this.isSyncEnabled) {
      this.timer = timer(period * 1000);
      this.createSubscribe();
    }
  }

  private syncError(): void {
    this.finishSync();
  }
}
