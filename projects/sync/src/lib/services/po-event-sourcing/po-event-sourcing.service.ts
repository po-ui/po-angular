import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as HttpStatus from 'http-status-codes';
import { Observable, of, Subject } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';

import { PoStorageService } from '@po-ui/ng-storage';

import { toBase64, toFile } from '../../utils/utils';

import { PoEventSourcingErrorResponse } from '../../models/po-event-sourcing-error-response.model';
import { PoEventSourcingItem } from './interfaces/po-event-sourcing-item.interface';
import { PoEventSourcingOperation } from './enums/po-event-sourcing-operation.enum';
import { PoEventSourcingSummaryItem } from './interfaces/po-event-sourcing-summary-item.interface';
import { PoHttpHeaderOption } from './../po-http-client/interfaces/po-http-header-option.interface';
import { PoHttpClientService } from './../po-http-client/po-http-client.service';
import { PoHttpRequestData } from '../po-http-client/interfaces/po-http-request-data.interface';
import { PoHttpRequestType } from '../po-http-client/po-http-request-type.enum';
import { PoRequestType } from '../../models/po-request-type.enum';
import { PoSchemaDefinitionService } from './../po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './../po-schema/po-schema.service';
import { PoSchemaUtil } from './../po-schema/po-schema-util/po-schema-util.model';
import { PoSyncConfig } from '../po-sync/interfaces/po-sync-config.interface';
import { PoSyncResponse } from '../po-sync/interfaces/po-sync-response.interface';
import { PoSyncSchema } from './../po-sync/interfaces/po-sync-schema.interface';

@Injectable()
export class PoEventSourcingService {
  static readonly event_sourcing_name: string = 'EventSourcing';

  private static readonly VALID_HTTP_STATUS_CODES = [
    HttpStatus.OK, // 200
    HttpStatus.CREATED, // 201
    HttpStatus.ACCEPTED, // 202
    HttpStatus.NON_AUTHORITATIVE_INFORMATION, // 203
    HttpStatus.NO_CONTENT, // 204
    HttpStatus.RESET_CONTENT, // 205
    HttpStatus.PARTIAL_CONTENT, // 206
    HttpStatus.MULTI_STATUS // 207
  ];

  config: PoSyncConfig;
  stoppedQueueEventSourcing: boolean = false;

  private emitter: any;
  private eventSub: Observable<null>;
  private responseSubject = new Subject<PoSyncResponse>();

  private schemasSyncConfig = {};

  private static getUrl(eventSourcingItem, schema, requestType): string {
    const schemaUrl = PoSchemaUtil.getUrl(schema, requestType);
    const schemaId = eventSourcingItem.record[schema.idField];

    if (requestType === PoRequestType.GET) {
      return schemaUrl;
    }

    if ([PoRequestType.DELETE, PoRequestType.PATCH].includes(requestType)) {
      return schemaUrl ? `${schemaUrl}/${schemaId}` : `${PoSchemaUtil.getUrl(schema, PoRequestType.GET)}/${schemaId}`;
    }

    if (requestType === PoRequestType.POST) {
      return schemaUrl ? schemaUrl : PoSchemaUtil.getUrl(schema, PoRequestType.GET);
    }
  }

  constructor(
    private poSchemaDefinition: PoSchemaDefinitionService,
    private poSchemaService: PoSchemaService,
    private poStorage: PoStorageService,
    private poHttpClient: PoHttpClientService
  ) {}

  create(schemaName: string, newItem: any, customRequestId?: string): Promise<any> {
    const eventSourcingItem = this.createEventSourcingItem(
      PoEventSourcingOperation.Insert,
      newItem,
      schemaName,
      customRequestId
    );
    return this.insertEventSourcingQueue(eventSourcingItem);
  }

  async createBatchEvents(schemaName: string, eventList: Array<PoEventSourcingSummaryItem>) {
    const eventSourcingList = this.createEventSourcingList(schemaName, eventList);

    await this.poStorage.appendArrayToArray(PoEventSourcingService.event_sourcing_name, eventSourcingList);

    this.notifyEventCreation();
  }

  /**
   * Destrói a chave do *storage* que contém a fila de dados que estão esperando para serem enviados ao
   * servidor *(EventSourcing)*.
   *
   * @returns {Promise<void>} Promessa que é resolvida quando a chave referente a fila de *EventSourcing* for destruída.
   */
  destroyEventSourcingQueue(): Promise<void> {
    return this.poStorage.remove(PoEventSourcingService.event_sourcing_name);
  }

  async httpCommand(httpOperationData: PoHttpRequestData, customRequestId?: string): Promise<number> {
    httpOperationData = await this.serializeBody(httpOperationData);

    const eventSourcingItem = this.createEventSourcingItem(
      PoEventSourcingOperation.Http,
      httpOperationData,
      undefined,
      customRequestId
    );

    await this.insertEventSourcingQueue(eventSourcingItem);
    return eventSourcingItem.id;
  }

  /* Avalia se o body é do tipo File e se for converte para base64 */
  private async serializeBody(requestData: PoHttpRequestData): Promise<PoHttpRequestData> {
    let { body, mimeType, bodyType, fileName } = requestData;

    if (body instanceof File) {
      bodyType = 'File';
      mimeType = body.type;
      fileName = body.name;
      body = await toBase64(body);
    }

    return { ...requestData, body, mimeType, bodyType, fileName };
  }

  responsesSubject(): Observable<PoSyncResponse> {
    return this.responseSubject.asObservable();
  }

  onSaveData(): Observable<null> {
    if (!this.eventSub) {
      this.eventSub = Observable.create(subscriber => (this.emitter = subscriber));
    }
    return this.eventSub;
  }

  remove(schemaName: string, itemToDelete: any, customRequestId?: string): Promise<any> {
    const eventSourcingItem = this.createEventSourcingItem(
      PoEventSourcingOperation.Delete,
      itemToDelete,
      schemaName,
      customRequestId
    );
    return this.insertEventSourcingQueue(eventSourcingItem);
  }

  removeEventSourcingItem(idEventSourcingItem) {
    return this.poStorage.removeItemFromArray(PoEventSourcingService.event_sourcing_name, 'id', idEventSourcingItem);
  }

  syncGet(): Promise<any> {
    const syncGetFunction = async () => {
      return this.poSchemaDefinition.getAll().then(schemas => {
        const schemaPromises = this.updateStorageSchemas(schemas);

        return Promise.all(schemaPromises);
      });
    };

    return this.poSchemaService.limitedCallWrap(syncGetFunction);
  }

  async syncSend(): Promise<any> {
    const syncSendFunction = async (): Promise<any> => {
      const itemOfQueue = await this.poStorage.getFirstItem(PoEventSourcingService.event_sourcing_name);

      if (itemOfQueue) {
        await this.selectOperation(itemOfQueue);
      }

      if (this.stoppedQueueEventSourcing || !itemOfQueue) {
        this.stoppedQueueEventSourcing = false;
        return Promise.resolve();
      }

      return syncSendFunction();
    };

    return this.poSchemaService.limitedCallWrap(syncSendFunction);
  }

  update(schemaName: string, itemUpdated: any, customRequestId?: string): Promise<any> {
    const eventSourcingItem = this.createEventSourcingItem(
      PoEventSourcingOperation.Update,
      itemUpdated,
      schemaName,
      customRequestId
    );
    return this.insertEventSourcingQueue(eventSourcingItem);
  }

  private buildUrlParams(schema: PoSyncSchema, baseUrl: string, pageNumber: number): string {
    const params = [];
    params.push(`${this.config.dataTransform.getPageSizeParamName()}=${schema.pageSize}`);
    params.push(`${this.config.dataTransform.getPageParamName()}=${pageNumber}`);
    return `${baseUrl}?${params.join('&')}`;
  }

  private checkRecordIdExists(recordId, operation) {
    if (!recordId) {
      const error = {
        message: 'Identifier not defined',
        operation: operation
      };

      throw new PoEventSourcingErrorResponse(error);
    }
  }

  private concatPageItems(pageAcumulator, requestBody): { entity: string; data: Array<any> } {
    if (requestBody[this.config.dataTransform.getItemsFieldName()]) {
      pageAcumulator.data = [...pageAcumulator.data, ...requestBody[this.config.dataTransform.getItemsFieldName()]];
    }
    return pageAcumulator;
  }

  private createEventSourcingItem(
    operation: PoEventSourcingOperation,
    newItem: any | PoHttpRequestData,
    schemaName?: string,
    customRequestId?: string,
    id?: number
  ): PoEventSourcingItem {
    if (!schemaName && operation !== PoEventSourcingOperation.Http) {
      throw new Error('PoSyncSchema is not defined.');
    }

    return {
      id: id ? id : new Date().getTime(),
      dateTime: new Date().getTime(),
      schema: schemaName,
      operation: operation,
      record: newItem,
      customRequestId: customRequestId
    };
  }

  private createEventSourcingList(
    schemaName: string,
    eventList: Array<PoEventSourcingSummaryItem>
  ): Array<PoEventSourcingItem> {
    return eventList.map((eventItem, index) => {
      const id = new Date().getTime() + index;

      return this.createEventSourcingItem(
        eventItem.operation,
        eventItem.record,
        schemaName,
        eventItem.customRequestId,
        id
      );
    });
  }

  private createSchemaSyncConfig(schemaName) {
    this.schemasSyncConfig[schemaName] = {
      page: undefined,
      currentUrlDiff: undefined,
      responseDate: undefined
    };
  }

  private async deleteOperation(eventSourcingItem: PoEventSourcingItem): Promise<any> {
    try {
      const schema = await this.poSchemaDefinition.get(eventSourcingItem.schema);

      const recordId = eventSourcingItem.record[schema.idField];
      this.checkRecordIdExists(recordId, PoEventSourcingOperation.Delete);

      const url = PoEventSourcingService.getUrl(eventSourcingItem, schema, PoRequestType.DELETE);
      const response = await this.sendServerItem(url, PoHttpRequestType.DELETE);

      await this.removeEventSourcingValidItem(response.status, eventSourcingItem);

      return await this.sendResponseSubject(eventSourcingItem, response);
    } catch (errorResponse) {
      return this.sendResponseSubject(eventSourcingItem, errorResponse, true);
    }
  }

  private diffServerItems(currentUrlDiff): Observable<HttpResponse<Object>> {
    return this.poHttpClient.get(currentUrlDiff);
  }

  private getBodyAndDate(schemaName, response): any {
    const getDateFieldName = this.config.dataTransform.getDateFieldName();

    const responseSyncDate = response.body[getDateFieldName];

    this.schemasSyncConfig[schemaName]['responseDate'] = responseSyncDate;
    return response.body;
  }

  private async getServerDiffRecords(schema: PoSyncSchema, baseUrl: string): Promise<any> {
    const initialAcumulatorPage = { entity: schema.name, data: [] };
    const diffUrl = this.schemasSyncConfig[schema.name]['currentUrlDiff'];

    const serverResponse = await this.diffServerItems(diffUrl)
      .pipe(
        map(response => this.getBodyAndDate(schema.name, response)),
        expand(data => this.paginateSchemaData(data, schema, baseUrl)),
        reduce(
          (pageAcumulator, requestBody) => this.concatPageItems(pageAcumulator, requestBody),
          initialAcumulatorPage
        )
      )
      .toPromise();

    return serverResponse.data;
  }

  private async httpOperation(eventSourcingItem: PoEventSourcingItem): Promise<Array<PoEventSourcingItem> | number> {
    try {
      const requestData: PoHttpRequestData = await this.createPoHttpRequestData(
        eventSourcingItem.record.url,
        eventSourcingItem.record.method,
        eventSourcingItem.record,
        eventSourcingItem.record.headers
      );
      const response = await this.poHttpClient.createRequest(requestData).toPromise();
      const poHttpCommandResponse: PoSyncResponse = {
        id: eventSourcingItem.id,
        customRequestId: eventSourcingItem.customRequestId,
        request: eventSourcingItem.record,
        response: response
      };

      this.responseSubject.next(poHttpCommandResponse);

      return this.removeEventSourcingValidItem(response.status, eventSourcingItem);
    } catch (errorHttpClient) {
      return this.sendResponseSubject(eventSourcingItem, errorHttpClient, true);
    }
  }

  private async insertEventSourcingQueue(eventSourcingItem): Promise<Array<PoEventSourcingItem>> {
    const eventSourcingUpdatedQueue = await this.poStorage.appendItemToArray(
      PoEventSourcingService.event_sourcing_name,
      eventSourcingItem
    );

    this.notifyEventCreation();

    return Promise.resolve(eventSourcingUpdatedQueue);
  }

  private async insertOperation(currentEventSourcingItem: PoEventSourcingItem): Promise<any> {
    const schema = await this.poSchemaDefinition.get(currentEventSourcingItem.schema);
    const url = PoEventSourcingService.getUrl(currentEventSourcingItem, schema, PoRequestType.POST);

    try {
      const response = await this.sendServerItem(url, PoHttpRequestType.POST, currentEventSourcingItem.record);
      const recordUpdatedByServer = response.body;

      await this.removeEventSourcingValidItem(response.status, currentEventSourcingItem);

      const id = currentEventSourcingItem.record[PoSchemaUtil.syncInternalIdFieldName];
      await this.poSchemaService.update(schema, recordUpdatedByServer, id);

      const eventSourcingItems: Array<PoEventSourcingItem> = await this.poStorage.get(
        PoEventSourcingService.event_sourcing_name
      );
      await this.updatePendingEventSourcing(
        currentEventSourcingItem,
        schema.idField,
        recordUpdatedByServer,
        eventSourcingItems
      );

      return this.sendResponseSubject(currentEventSourcingItem, response);
    } catch (errorHttpClient) {
      return this.sendResponseSubject(currentEventSourcingItem, errorHttpClient, true);
    }
  }

  private isValidStatus(status: number): boolean {
    return PoEventSourcingService.VALID_HTTP_STATUS_CODES.includes(status);
  }

  private notifyEventCreation(): void {
    if (this.emitter) {
      this.emitter.next();
    }
  }

  private paginateSchemaData(data, schema, baseUrl): Observable<null> {
    this.config.dataTransform.transform(data);

    if (this.config.dataTransform.hasNext()) {
      this.schemasSyncConfig[schema.name]['currentUrlDiff'] = this.buildUrlParams(
        schema,
        baseUrl,
        ++this.schemasSyncConfig[schema.name]['page']
      );

      return this.diffServerItems(this.schemasSyncConfig[schema.name]['currentUrlDiff']).pipe(
        map(response => this.getBodyAndDate(schema.name, response))
      );
    }

    return of();
  }

  private removeEventSourcingValidItem(
    status,
    eventSourcingItem: PoEventSourcingItem
  ): Promise<Array<PoEventSourcingItem>> {
    if (this.isValidStatus(status) || eventSourcingItem.operation === PoEventSourcingOperation.Http) {
      return this.removeEventSourcingItem(eventSourcingItem.id);
    }
  }

  private selectOperation(eventSourcingItem: PoEventSourcingItem): Promise<any> {
    switch (eventSourcingItem.operation) {
      case PoEventSourcingOperation.Insert:
        return this.insertOperation(eventSourcingItem);

      case PoEventSourcingOperation.Update:
        return this.updateOperation(eventSourcingItem);

      case PoEventSourcingOperation.Delete:
        return this.deleteOperation(eventSourcingItem);

      case PoEventSourcingOperation.Http:
        return this.httpOperation(eventSourcingItem);
    }
  }

  private sendResponseSubject(
    eventSourcingItem: PoEventSourcingItem,
    response: HttpResponse<Object> | HttpErrorResponse | PoEventSourcingErrorResponse,
    isSubjectError: boolean = false
  ): Promise<any> {
    const poSyncResponse: PoSyncResponse = {
      id: eventSourcingItem.id,
      customRequestId: eventSourcingItem.customRequestId,
      request: eventSourcingItem.record,
      response: response
    };

    this.stoppedQueueEventSourcing = isSubjectError;
    this.responseSubject.next(poSyncResponse);

    return Promise.resolve();
  }

  private async sendServerItem(url: string, method: PoHttpRequestType, body?: PoEventSourcingItem['record']) {
    const requestData: PoHttpRequestData = await this.createPoHttpRequestData(url, method, body);

    return this.poHttpClient.createRequest(requestData).toPromise();
  }

  private async createPoHttpRequestData(
    url: string,
    method: PoHttpRequestType,
    record?: PoEventSourcingItem['record'],
    headers?: Array<PoHttpHeaderOption>
  ): Promise<PoHttpRequestData> {
    let body = record.body;

    if (record.bodyType === 'File') {
      body = await this.createFormData(body, record.fileName, record.mimeType, record.formField);
    }

    return { url, method, body, headers };
  }

  private async createFormData(
    body: string,
    fileName: string,
    mimeType: string,
    formField: string = 'file'
  ): Promise<FormData> {
    const file = await toFile(body, fileName, mimeType);
    const formData: FormData = new FormData();

    formData.append(formField, file, fileName);
    return formData;
  }

  private async updateOperation(eventSourcingItem: PoEventSourcingItem): Promise<Array<any> | number> {
    const schema = await this.poSchemaDefinition.get(eventSourcingItem.schema);
    const url = PoEventSourcingService.getUrl(eventSourcingItem, schema, PoRequestType.PATCH);

    try {
      const recordId = eventSourcingItem.record[schema.idField];
      this.checkRecordIdExists(recordId, PoEventSourcingOperation.Update);

      const response = await this.sendServerItem(url, PoHttpRequestType.PUT, eventSourcingItem.record);
      await this.removeEventSourcingValidItem(response.status, eventSourcingItem);

      return await this.sendResponseSubject(eventSourcingItem, response);
    } catch (errorHttpClient) {
      return this.sendResponseSubject(eventSourcingItem, errorHttpClient, true);
    }
  }

  private updatePendingEventSourcing(
    currentEventSourcingItem: PoEventSourcingItem,
    idFieldSchema: string,
    inserted: object,
    eventSourcingItems: Array<PoEventSourcingItem>
  ) {
    if (currentEventSourcingItem.record[PoSchemaUtil.syncInternalIdFieldName]) {
      eventSourcingItems.forEach((eventSourcingItem, position) => {
        const isCurrentEventSourcingItem =
          !eventSourcingItem.record[idFieldSchema] &&
          eventSourcingItem.record[PoSchemaUtil.syncInternalIdFieldName] ===
            currentEventSourcingItem.record[PoSchemaUtil.syncInternalIdFieldName];

        if (isCurrentEventSourcingItem) {
          eventSourcingItems[position].record[idFieldSchema] = inserted[idFieldSchema];
        }
      });

      return this.poStorage.set(PoEventSourcingService.event_sourcing_name, eventSourcingItems);
    } else {
      return Promise.resolve();
    }
  }

  private async updateRecords(serverRecords: Array<any>, schema: PoSyncSchema) {
    for (const serverRecord of serverRecords) {
      await this.updateRecordByServerRecord(serverRecord, schema);
    }
  }

  private async updateRecordByServerRecord(serverRecord, schema) {
    const recordId = serverRecord[schema.idField];
    const storageRecord = await this.poSchemaService.get(schema.name, recordId);
    const existsStorageRecord = !!Object.keys(storageRecord).length;

    if (existsStorageRecord && serverRecord[schema.deletedField]) {
      return await this.poSchemaService.remove(schema.name, serverRecord[schema.idField]);
    }

    if (existsStorageRecord && !serverRecord[schema.deletedField]) {
      return await this.poSchemaService.update(schema, serverRecord);
    }

    if (!existsStorageRecord && !serverRecord[schema.deletedField]) {
      return await this.poSchemaService.create(schema, serverRecord);
    }
  }

  private async updateStorageBySchema(schema: PoSyncSchema): Promise<any> {
    this.createSchemaSyncConfig(schema.name);

    this.schemasSyncConfig[schema.name]['page'] = 1;
    const baseUrl = `${PoSchemaUtil.getUrl(schema, PoRequestType.DIFF)}/${schema.lastSync}`;
    this.schemasSyncConfig[schema.name]['currentUrlDiff'] = this.buildUrlParams(
      schema,
      baseUrl,
      this.schemasSyncConfig[schema.name]['page']
    );

    const serverRecords = await this.getServerDiffRecords(schema, baseUrl);

    await this.updateRecords(serverRecords, schema);

    schema.lastSync = this.schemasSyncConfig[schema.name]['responseDate'];
    await this.poSchemaDefinition.update(schema);
  }

  private updateStorageSchemas(schemas): Array<Promise<Array<any>>> {
    return schemas.map((schema: PoSyncSchema) => this.updateStorageBySchema(schema));
  }
}
