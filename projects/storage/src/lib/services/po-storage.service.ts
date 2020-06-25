import { Inject, Injectable, InjectionToken } from '@angular/core';

import * as LocalForage from 'localforage';
import IdleQueue from 'custom-idle-queue';

import { PoLokiDriver } from '../drivers/lokijs/po-loki-driver';
import { PoStorageConfig } from './po-storage-config.interface';

export const PO_STORAGE_CONFIG_TOKEN = new InjectionToken('PO_STORAGE_CONFIG_TOKEN');

/**
 * @description
 *
 * O PO Storage é uma biblioteca que fornece um serviço para armazenamento de dados no dispositivo local, sendo semelhante
 * ao funcionamento do [IonicStorage](https://ionicframework.com/docs/storage/).
 * É possível utilizar os drivers [Websql](https://dev.w3.org/html5/webdatabase/), [Indexeddb](https://www.w3.org/TR/IndexedDB/),
 * [LocalStorage](https://html.spec.whatwg.org/multipage/webstorage.html) e também [LokiJS](https://github.com/techfort/LokiJS/wiki).
 *
 * Para um melhor ganho de performance ao buscar e salvar dados, recomendamos a utilização do `LokiJS`, um *database*
 * orientado a documento semelhante ao MongoDB, que além de permitir a persistência dos dados no dispositivo possibilita
 * também o armazenamento dos dados em memória. Outra vantagem, é o aumento do limite de armazenamento para
 * aproximadamente `300mb`.
 *
 * A estrutura utilizada para armazenar os dados é a de chave/valor, onde uma chave funciona como um identificador exclusivo.
 *
 * #### Instalando o PO Storage
 *
 * Para instalar o `po-storage` em sua aplicação execute o seguinte comando:
 *
 * ```shell
 * ng add @po-ui/ng-storage
 * ```
 * Será instalado o pacote `@po-ui/ng-storage` e também já importará `PoStorageModule` no módulo principal da sua aplicação, conforme abaixo:
 *
 * ```typescript
 * import { PoStorageModule } from '@po-ui/ng-storage';
 *
 * @NgModule({
 *  declarations: [...],
 *  imports: [
 *    // Importação do módulo PoStorageModule
 *    PoStorageModule.forRoot(),
 *  ],
 *  bootstrap: [IonicApp],
 *  providers: [...]
 * })
 * export class AppModule {}
 * ```
 *
 * Com a declaração do módulo, é criada uma base de dados no armazenamento local e o serviço `PoStorageService` estará
 * pronto para ser utilizada na sua aplicação.
 *
 * #### Configurando as opções de armazenamento
 *
 * Na importação do módulo, o método `PoStorageModule.forRoot()` pode receber como parâmetro um objeto do tipo
 * [`PoStorageConfig`](documentation/po-storage#po-storage-config),
 * que serve para configurar as opções personalizadas do armazenamento, como por exemplo: o tipo de armazenamento
 * preferêncial.
 *
 * Caso não seja passada nenhuma configuração a ordem padrão será: ['websql', 'indexeddb', 'localstorage', 'lokijs'].
 *
 * Abaixo segue um exemplo de configuração onde o storage preferencial passa a ser o `lokijs`:
 *
 * ```typescript
 * import { PoStorageModule } from '@po-ui/ng-storage';
 *
 * @NgModule({
 *  declarations: [...],
 *  imports: [
 *    // Importação do módulo PoStorageModule com a configuração personalizada
 *    PoStorageModule.forRoot({
 *      name: 'mystorage',
 *      storeName: '_mystore',
 *      driverOrder: ['lokijs', 'websql', 'indexeddb', 'localstorage']
 *    }),
 *  ],
 *  bootstrap: [IonicApp],
 *  providers: [...]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class PoStorageService {
  private driver: string = null;
  private idleQueue = new IdleQueue();
  private storagePromise: Promise<LocalForage>;
  private lokijsDriver: PoLokiDriver;

  /**
   * Retorna a configuração padrão para o armazenamento. Caso nenhuma configuração seja inserida,
   * essa configuração será utilizada.
   *
   * @returns {PoStorageConfig} Objeto com a configuração padrão do armazenamento.
   */
  static getDefaultConfig(): PoStorageConfig {
    return {
      name: '_postorage',
      storeName: '_pokv',
      driverOrder: ['websql', 'indexeddb', 'localstorage', 'lokijs']
    };
  }

  /**
   * Cria uma instância do `PoStorageService` com a configuração de armazenamento passada como parâmetro.
   *
   * @param {PoStorageConfig} storageConfig Configuração para o armazenamento.
   * @returns {PoStorageService} Instância do `PoStorageService`.
   */
  static providePoStorage(storageConfig?: PoStorageConfig): PoStorageService {
    return new PoStorageService(PoStorageService.getConfig(storageConfig));
  }

  private static getConfig(storageConfig?: PoStorageConfig) {
    return storageConfig || PoStorageService.getDefaultConfig();
  }

  constructor(@Inject(PO_STORAGE_CONFIG_TOKEN) config?: PoStorageConfig) {
    this.lokijsDriver = new PoLokiDriver();
    this.setStoragePromise(config);
  }

  /**
   * Busca uma lista armazenada pela chave e concatena com a lista passada por parâmetro.
   *
   * Por exemplo:
   *
   * ``` typescript
   * const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];
   *
   * this.poStorageService.set('clientKey', clients).then(() => {});
   *
   * ...
   *
   * const newClients = [ { name: 'Lisa', age: 36 }, { name: 'Bruce', age: 18 } ];
   *
   * this.poStorageService.appendArrayToArray('clientKey', newClients).then(() => {
   *   // A lista agora será:
   *   // [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }, { name: 'Lisa', age: 36 }, { name: 'Bruce', age: 18 }];
   * });
   * ```
   *
   * @param {string} key Chave da lista armazenada.
   * @param {Array} value Lista que será concatenada.
   *
   * @returns {Promise<any>} Promessa que é resolvida após as duas listas serem concatenadas e armazenadas localmente.
   */
  async appendArrayToArray(key: string, value: Array<any>): Promise<any> {
    const data = await this.getArrayOfStorage(key);

    const newData = [...data, ...value];
    return this.set(key, newData);
  }

  /**
   * Acrescenta um item em uma lista armazenada pela chave.
   *
   * @param {string} key Chave da lista armazenada.
   * @param {Array} value Item que será acrescentado na lista.
   *
   * @returns {Promise<any>} Promessa que é resolvida após o item ser acrescentado na lista armazenada.
   */
  async appendItemToArray(key: string, value: any): Promise<any> {
    const data = await this.getArrayOfStorage(key);

    data.push(value);
    return this.set(key, data);
  }

  /**
   * Remove todos os itens da base de dados local configurada na declaração do módulo `PoStorageModule`.
   *
   * > Utilize este método com cautela, para evitar a perda indesejada de dados.
   *
   * @returns {Promise<void>} Promessa que é resolvida após todos os itens da base de dados local serem removidos.
   */
  clear(): Promise<void> {
    return this.storagePromise.then(store => store.clear());
  }

  /**
   * Verifica se existe um valor dentro de uma determinada chave.
   *
   * @param {string} key Chave que será verificada.
   *
   * @returns {Promise<boolean>} Promessa que é resolvida quando a verificação da existência do valor na chave é concluída.
   */
  exists(key: string): Promise<boolean> {
    return this.get(key).then(data => Promise.resolve(data !== null));
  }

  /**
   * Itera sobre todas as chaves armazenadas.
   *
   * @param {any} iteratorCallback Função de `callback` que é chamada a cada iteração, com os seguintes parâmetros:
   * valor, chave e número da iteração.
   *
   * Exemplo de utilização:
   *
   * ``` typescript
   * this.poStorageService.forEach((value: any, key: string, iterationNumber: number) => {
   *   // Iteração sobre cada chave armazenada.
   * });
   * ```
   *
   * @returns {Promise<void>} Promessa que é resolvida após a iteração sobre todas as chaves armazenadas.
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: number) => any): Promise<void> {
    return this.storagePromise.then(store => store.iterate(iteratorCallback));
  }

  /**
   * Retorna o valor armazenado em uma determinada chave.
   *
   * @param {string} key Chave que identifica o item.
   * @param {boolean} lock Define se irá travar a leitura e a escrita da base de dados para não ser acessada de forma paralela.
   * Caso outra leitura/escrita já tenha sido iniciada, este método irá esperar o outro terminar para então começar.
   *
   * Padrão: `false`.
   *
   * > Esta definição só será válida se o outro acesso paralelo a este método também estiver com o parâmetro *lock* ativado.
   * @returns {Promise<any>} Promessa que é resolvida após o item ser buscado.
   */
  async get(key: string, lock: boolean = false): Promise<any> {
    if (lock) {
      await this.requestIdlePromise();
      return await this.idleQueue.wrapCall(async () => {
        await this.getImmutableItem(key);
      });
    }
    return await this.getImmutableItem(key);
  }

  /**
   * Retorna o nome do *driver* que está sendo usado para armazenar os dados, por exemplo: localStorage.
   *
   * @returns {string | null} Nome do *driver*.
   */
  getDriver(): string {
    return this.driver;
  }

  /**
   * Retorna o primeiro item de uma lista para uma determinada chave.
   *
   * @param {string} key Chave da lista.
   * @returns {Promise<any>} Promessa que é resolvida após o primeiro item ser encontrado.
   */
  getFirstItem(key: string): Promise<any> {
    return this.get(key).then((data: Array<any>) => Promise.resolve(data ? data[0] : null));
  }

  /**
   * Remove o primeiro item de uma lista a partir da chave.
   *
   * @param {string} key Chave da lista que será removido o primeiro item.
   * @returns {Promise<any>} Promessa que é resolvida após o primeiro item da lista ser removido.
   */
  getItemAndRemove(key: string): Promise<any> {
    return this.get(key).then((data: Array<any>) => {
      if (data === null) {
        return null;
      }

      const item = data.shift();
      return this.set(key, data).then(() => Promise.resolve(item));
    });
  }

  /**
   * Busca o primeiro objeto encontrado dentro de uma lista pelo do valor de um campo.
   *
   * Por exemplo:
   *
   * ``` typescript
   * const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];
   *
   * this.poStorageService.set('clientKey', clients).then(() => {});
   *
   * ...
   *
   * this.poStorageService.getItemByField('clientKey', 'name', 'Marie').then(client => {
   *   // Resultado do console.log: { name: 'Marie', age: 23 }
   *   console.log(client);
   * });
   * ```
   *
   * @param {string} key Chave da lista.
   * @param {string} fieldName O campo a ser filtrado.
   * @param {any} fieldValue O valor do campo.
   * @returns {Promise<any>} Promessa que é resolvida com o item que foi encontrado.
   */
  getItemByField(key: string, fieldName: string, fieldValue: any): Promise<any> {
    return this.get(key).then((storageRecords: Array<any>) => {
      let storageRecordsFiltered = storageRecords.find(storageRecord => storageRecord[fieldName] === fieldValue);
      storageRecordsFiltered = storageRecordsFiltered || null;

      return Promise.resolve(storageRecordsFiltered);
    });
  }

  /**
   * Lista com todas as chaves armazenadas.
   * @returns {Promise<Array<string>>} Promessa que é resolvida com todas as chaves armazenadas.
   */
  keys(): Promise<Array<string>> {
    return this.storagePromise.then(store => store.keys());
  }

  /**
   * Quantidade de chaves armazenadas.
   * @returns {Promise<number>} Promessa que é resolvida com o número de chaves armazenadas.
   */
  length(): Promise<number> {
    return this.storagePromise.then(store => store.length());
  }

  /**
   * Utilizado para gerenciar o bloqueio e desbloqueio de recursos no `PoStorageService`.
   * Aguardando a liberação da utilização dos recursos que participam deste comportamento e posteriormente envolve o recurso
   * passado como parâmetro em um comportamento de bloqueio e desbloqueio.
   *
   * Este método se comporta igual a utilização em conjunta dos métodos: `PoStorageService.requestIdlePromise()`,
   * `PoStorageService.lock()` e `PoStorageService.unlook()`.
   *
   * Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).
   *
   * @param {Function} limitedResource Função que será envolvida no comportamento de bloqueio e desbloqueio.
   */
  async limitedCallWrap(limitedResource: Function): Promise<any> {
    await this.requestIdlePromise();
    return this.idleQueue.wrapCall(limitedResource);
  }

  /**
   * Incrementa um valor na fila de bloqueio do `PoStorageService`. Utilizado juntamente com o método `unlock` para poder
   * controlar a execução de uma determinada tarefa com o `PoStorage.requestIdlePromise()`.
   *
   * Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).
   */
  lock() {
    this.idleQueue.lock();
  }

  /**
   * Determina se o processo de inicialização do *driver* assíncrono foi concluído.
   *
   * @returns {Promise<LocalForage>} Promessa que é resolvida quando o processo de inicialização do *driver* assíncrono
   * for concluído.
   */
  ready(): Promise<LocalForage> {
    return this.storagePromise;
  }

  /**
   * Remove um valor associado a uma chave.
   *
   * @param {key} key Chave do valor que será removido.
   * @returns {Promise<any>} Promessa que é resolvida após o valor ser removido.
   */
  remove(key: string): Promise<any> {
    return this.storagePromise.then(store => store.removeItem(key));
  }

  /**
   * Remove uma propriedade de um objeto armazenado.
   *
   * @param {string} key Chave do objeto armazenado.
   * @param {string} property Propriedade que será removida.
   *
   * @returns {Promise<any>} Promessa que é resolvida após a propriedade ser removida.
   */
  async removeIndexFromObject(key: string, property: string): Promise<any> {
    const data = await this.getObjectOfStorage(key);

    delete data[property];
    return this.set(key, data);
  }

  /**
   * Remove um objeto de uma lista armazenada pelo valor de uma propriedade.
   *
   * Por exemplo:
   *
   * ``` typescript
   * const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];
   *
   * this.poStorageService.set('clientKey', clients).then(() => {});
   *
   * ...
   *
   * this.poStorageService.removeItemFromArray('clientKey', 'name', 'Marie').then(() => {
   *   // O objeto { name: 'Marie', age: 23 } foi removido da lista que está na chave 'clientKey'
   * });
   * ```
   *
   * @param {string} key Chave da lista que contém o item que será removido.
   * @param {string} field O campo a ser filtrado no item.
   * @param {string} value O valor do filtro.
   * @returns {Promise<any>} Promessa que é resolvida quando o objeto for removido da lista.
   */
  async removeItemFromArray(key: string, field: string, value: any): Promise<any> {
    let data = await this.getArrayOfStorage(key);

    data = data.filter(item => item[field] !== value);
    return this.set(key, data);
  }

  /**
   * <a id="request-idle-promise"></a>
   * Método que verifica se o acesso a base de dados configurada está liberado.
   *
   * Utilizado em conjunto com os métodos `lock()` e `unlock()` entre tarefas que não podem ser executadas de forma
   * paralela, para não causar inconsistências nos dados.
   *
   * Exemplo de utilização:
   *
   * ```
   * // Aguarda a liberação para continuar
   * await this.poStorage.requestIdlePromise();
   *
   * this.poStorage.lock();
   *
   * // Executa uma tarefa que irá ler e/ou escrever na base de dados configurada.
   *
   * this.poStorage.unlock();
   * ```
   *
   * > É importante sempre utilizá-lo antes de executar os métodos `lock()` e `unlock()` para garantir que a tarefa só
   * será executada caso o acesso esteja livre.
   *
   * @returns {Promise<any>} Promessa que é resolvida quando o acesso a base de dados configurada estiver liberado.
   */
  requestIdlePromise(): Promise<any> {
    return this.idleQueue.requestIdlePromise();
  }

  /**
   * Grava um valor em uma determinada chave.
   *
   * @param {string} key Chave para o valor que será gravado.
   * @param {any} value Valor que será gravado.
   * @param {boolean} lock Define se irá travar a leitura e a escrita da base de dados para não ser acessada de forma paralela.
   * Caso outra leitura/escrita já tenha sido iniciada, este método irá esperar o outro terminar para então começar.
   *
   * Padrão: `false`.
   *
   * > Esta definição só será válida se o outro acesso paralelo a este método também estiver com o parâmetro *lock* ativado.
   * @returns {Promise<any>} Promessa que é resolvida após o valor ter sido gravado.
   */
  async set(key: string, value: any, lock: boolean = false): Promise<any> {
    const store = await this.storagePromise;
    const newValue = typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;

    if (lock) {
      await this.requestIdlePromise();
      return this.idleQueue.wrapCall(() => store.setItem(key, newValue));
    }

    return store.setItem(key, newValue);
  }

  /**
   * Atribui um valor a uma propriedade de um objeto armazenado pela chave.
   *
   * Por exemplo:
   *
   * ``` typescript
   * const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];
   *
   * this.poStorageService.set('clientKey', clients).then(() => {});
   *
   * ...
   *
   * this.poStorageService.setIndexToObject('clientKey', 'name', 'Clare').then(() => {
   *   // O objeto { name: 'Marie', age: 23 } passa a ser { name: 'Clare', age: 23 }
   * });
   * ```
   *
   * @param {string} key Chave do objeto.
   * @param {string} property Nome da propriedade do objeto.
   * @param {any} value Valor que será gravado na propriedade do objeto.
   */
  async setIndexToObject(key: string, property: string, value: any): Promise<any> {
    const data = await this.getObjectOfStorage(key);

    data[property] = value;
    return this.set(key, data);
  }

  /**
   * Decrementa um valor na fila de bloqueio. Utilizado juntamente com o método `lock` para poder
   * controlar a execução de uma determinada tarefa com o `PoStorage.requestIdlePromise()`.
   *
   * Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).
   */
  unlock() {
    this.idleQueue.unlock();
  }

  private async getArrayOfStorage(key: string) {
    const data = await this.get(key);
    return data || [];
  }

  private async getImmutableItem(key: string) {
    const store = await this.storagePromise;
    const items = await store.getItem(key);
    return items ? JSON.parse(JSON.stringify(items)) : null;
  }

  private async defineLocalForageDriver(localForageInstance: any, driverOrder) {
    await localForageInstance.defineDriver(this.lokijsDriver.getDriver());
    await this.setDriver(localForageInstance, driverOrder);
    return localForageInstance;
  }

  private getDriverOrder(driverOrder: Array<string>): Array<string> {
    return driverOrder.map(driver => {
      switch (driver) {
        case 'indexeddb':
          return LocalForage.INDEXEDDB;
        case 'websql':
          return LocalForage.WEBSQL;
        case 'localstorage':
          return LocalForage.LOCALSTORAGE;
        default:
          return driver;
      }
    });
  }

  private async getObjectOfStorage(key: string) {
    const data = await this.get(key);
    return data || {};
  }

  private async setDriver(localForageInstance: LocalForage, driverOrder) {
    await localForageInstance.setDriver(this.getDriverOrder(driverOrder));
    this.driver = localForageInstance.driver();
  }

  private setStoragePromise(config: PoStorageConfig) {
    this.storagePromise = this.getStorageInstance(config);
  }

  private async getStorageInstance(config: PoStorageConfig) {
    const defaultConfig = PoStorageService.getDefaultConfig();
    const actualConfig = Object.assign(defaultConfig, config || {});

    const localForageInstance = LocalForage.createInstance(actualConfig);

    try {
      return await this.defineLocalForageDriver(localForageInstance, actualConfig.driverOrder);
    } catch {
      throw new Error(`Cannot use this drivers: ${actualConfig.driverOrder.join(', ')}.`);
    }
  }
}
