# Changelog


## [2.0.0](https://github.com/po-ui/po-angular/compare/v1.28.0...v2.0.0) (2020-04-17)


### ⚠ BREAKING CHANGES

* **angular:** atualiza para a versão 9

Atualize seu projeto para utilizar a versão 9 do Angular, acesse a documentação [**Guia de Atualização do Angular**](https://update.angular.io/) para fazer a migração completa.

Veja nossa [**documentação para fazer a migração**](https://github.com/po-ui/po-angular/blob/master/docs/guides/migration-poui-v2.md) para a versão 2.

* **fields:** removida a propriedade `p-focus`

Foi removida a propriedade `p-focus`, deve-se utilizar a propriedade `p-auto-focus`.
Os componentes afetados são:
- datepicker;
- decimal;
- email,
- input;
- login;
- lookup;
- multiselect
- number;
- password;
- textarea;
- url;

Antes: ``` <po-component p-focus></po-component> ```

Depois: ``` <po-component p-auto-focus></po-component> ```

* **packages:** altera nome dos pacotes

Os nomes dos pacotes foram alterados para a seguinte nomenclatura:

- `@portinari/portinari-ui` ==> `@po-ui/ng-components`
- `@portinari/portinari-templates` ==> `@po-ui/ng-templates`
- `@portinari/portinari-code-editor` ==> `@po-ui/ng-code-editor`
- `@portinari/portinari-storage` ==> `@po-ui/ng-storage`
- `@portinari/portinari-sync` ==> `@po-ui/ng-sync`

* **interceptors:** altera inicial das chaves dos headers nos interceptors

Antes:
```
const headers = { 'X-Portinari-No-Message': 'true' };
...
const headers = { 'X-Portinari-SCREEN-LOCK': 'true' };
...
const headers = { 'X-Portinari-No-Count-Pending-Requests': 'true' }
```

Depois:
```
const headers = { 'X-PO-No-Message': 'true' };
...
const headers = { 'X-PO-SCREEN-LOCK': 'true' };
...
const headers = { 'X-PO-No-Count-Pending-Requests': 'true' }
```

* **page-detail:** remove o reconhecimento das ações via funções no typescript

O reconhecimento das ações via funções no typescript foi removido,
com isso para utilizar os botões "Voltar", "Editar" e "Remover"
deve-se utilizar as novas propriedades.

Antes:

HTML
```<po-page-detail p-title="Titulo"> </po-page-detail> ```

TS
```
export class ExampleDetail {
  back() { }
}
```

Depois:

HTML
```
<po-page-detail p-title="Titulo" (p-back)="back()">
</po-page-detail>
```

TS
```
export class ExampleDetail {
  back() { }
}
```

* **page-edit:** remove o reconhecimento das ações via funções no typescript

O reconhecimento das ações via funções no typescript foi removido,
com isso para utilizar os botões "Cancelar", "Salvar" e "Salvar e Novo"
deve-se utilizar as novas propriedades.

Antes:

HTML
```<po-page-edit p-title="Titulo"> </po-page-edit > ```

TS
```
export class ExampleEdit {
     save() { }
}
```

Depois:

HTML
```
<po-page-edit p-title="Titulo" (p-save)="save()">
</po-page-edit>
```

TS
```
export class ExampleEdit {
  save() { }
}
```

### Features

* **packages:** atualiza pacotes do projeto com `Angular@9.1.X `([9ac1ea8](https://github.com/po-ui/po-angular/commit/9ac1ea8d052b7e083a540f711f038bb685738092))
* **packages:** atualização do prettier para versão `2.0.2` ([b3a204b](https://github.com/po-ui/po-angular/commit/b3a204b8e2a6fc146e31ab36a83c843371022acf))
* **page-detail:** adiciona propriedades para informar as ações ([7fd1050](https://github.com/po-ui/po-angular/commit/7fd10505504a7b1065942882d5317e7cbe0969c2))
* **page-edit:** adiciona propriedades para informar as ações ([49fb1c3](https://github.com/po-ui/po-angular/commit/49fb1c3ac3eeb59576f96f0e12e66f3d3c214d98))
* **prettier:** inclusão do formatador prettier ([dff1281](https://github.com/po-ui/po-angular/commit/dff1281151d9cec5de6863f6edb9117bd1fab179))
* **schematics:** implementa `ng update` para versão 2 ([ba496d3](https://github.com/po-ui/po-angular/commit/ba496d3bb3265285c57db363331c80b0b3139e8d))
* **sync:** implementa ng update para v2 ([a62ac37](https://github.com/po-ui/po-angular/commit/a62ac372bec4b42ecbbcde8364b1ad70c0c9d8b2))
* **templates:** cria schematics `ng add` e `ng generate` ([86252de](https://github.com/po-ui/po-angular/commit/86252debeaa983af3384f990f92e21068b5e52c2))

### Code Refactoring

* **fields:** remove propriedade `p-focus` ([d3ba2d5](https://github.com/po-ui/po-angular/commit/d3ba2d599d9029504a21bccb8e94a7477f78515b))
* **interceptors:** altera inicial das chaves dos headers ([c64e3d4](https://github.com/po-ui/po-angular/commit/c64e3d49b4d5fba024a988e7de31fa52692a0296))
* **packages:** altera nome dos pacotes ([3fd3255](https://github.com/po-ui/po-angular/commit/3fd3255a5de510e057330973df4da38fc0d79ec4))
* **sync:** deprecia a propriedade `portinari_sync_date` ([83f5d85](https://github.com/po-ui/po-angular/commit/83f5d851e0b8756e684dbee3d7ed153b31fc437a))


### Bug Fixes

* **chart:** corrige erros no console ([a9440b5](https://github.com/po-ui/po-angular/commit/a9440b5c64c7ee13326359e20611ab0ee5572ad6))
* **code-editor:** corrige exibição do editor ([e470b4c](https://github.com/po-ui/po-angular/commit/e470b4c1e897c8769a117fae226b2b9500286186))
* **combo:** passa métodos para OnChanges ([47e7ae1](https://github.com/po-ui/po-angular/commit/47e7ae1b01013713d68435d698dc0b21212e957a))
* **combo:** corrige HTML Injection no `option.label` ([7f19f1b](https://github.com/po-ui/po-angular/commit/7f19f1bd763464f2b1b58e5372833bd8d95296a3))
* **datepicker-range:** corrige erro ao mudar valor ([641b8b6](https://github.com/po-ui/po-angular/commit/641b8b691838aca769c133ebef93e520f0fda308))
* **page-blocked-user:** corrige colunas de contatos ([a1516fd](https://github.com/po-ui/po-angular/commit/a1516fd609790b8957260d96e871e22efa964d11))
* **page-dynamic-table:** corrige lentidão ([55201c3](https://github.com/po-ui/po-angular/commit/55201c3fb419414666870bdfe758bc2464ad5a20)), closes [#260](https://github.com/po-ui/po-angular/issues/260)
* **page-dynamic-detail:** corrige ação `back` com string ([5411472](https://github.com/po-ui/po-angular/commit/54114729e6b6b0dff75941e378b3e0557d2935eb))
* **page-dynamic-search:** corrige erro ao utilizar o filtro ([b2d9bf9](https://github.com/po-ui/po-angular/commit/b2d9bf92e6c0b916845e8e65318c652ca8d44819))
* **page-job-scheduler:** corrige manipulação incorreta da recorrência ([73021dd](https://github.com/po-ui/po-angular/commit/73021dd08c5cd1b5ffc7ad4eee2d5bc13e76cb4b))
* **page-list:** corrige erro ao utilizar o filtro ([3051b27](https://github.com/po-ui/po-angular/commit/3051b2723f632bb9eae1aad24da619b18ee7704c))
* **schematics:** altera todas ocorrencias encontradas no update ([e0dcf22](https://github.com/po-ui/po-angular/commit/e0dcf22b2437627b653e9170f0d2ea6ae595e73f))
* **slide:** passa métodos para OnChanges ([7684812](https://github.com/po-ui/po-angular/commit/76848123a725d748e4f4527dae1be94048058411))
* **table:** corrige erro ao renderizar a tabela com container ([7e57e14](https://github.com/po-ui/po-angular/commit/7e57e14ca2457ca4829a6868e02df2defc4afaf5))
* **table:** corrige erro ao utilizar o `p-height` ([3263df3](https://github.com/po-ui/po-angular/commit/3263df3d6a441b383e4a7eee721ef68a68bb4e53))
* **table:** corrige exibição das seleções únicas ([12fa03e](https://github.com/po-ui/po-angular/commit/12fa03ed3eda76fc4a62437e89236f1a80fb5966))

### Documentation

* **code-editor:** correção caminho assets ([86f6117](https://github.com/po-ui/po-angular/commit/86f6117593db773cd148e2b2c251d3c703ec4c30))
* **contributing:** remove menção a branch em fork ([4b82313](https://github.com/po-ui/po-angular/commit/4b82313c8c4f4a470265567e5fc1d315b1962470))
* **docs:** informa a versão que as propriedades serão depreciadas no futuro ([9204b1c](https://github.com/po-ui/po-angular/commit/9204b1cf6998ae03260ce4cf2a4063f706cbaa75))
* **getting-started:** atualiza para a nova versão ([dfe0c91](https://github.com/po-ui/po-angular/commit/dfe0c91f890d2f27439979225cf18720a6cc89a4))
* **migration:** atualiza documento com @po-ui/ng-sync ([889a4b5](https://github.com/po-ui/po-angular/commit/889a4b5fe5d3e511e853ed3419bb466674a3bc46))
* **migration:** adiciona guia de migração para versão 2 ([bbdbb9b](https://github.com/po-ui/po-angular/commit/bbdbb9b943c7c79d4fbcc7605a2d694711aca350))
* **migration-thf:** atualiza para a nova versão ([4a4ec0b](https://github.com/po-ui/po-angular/commit/4a4ec0b1830220260265c04ede3ce74efee9b0d3))
* **packages:** adiciona README.md na distribuição dos pacotes ([98036ae](https://github.com/po-ui/po-angular/commit/98036aed783c42c92fd2485ebb56cab3ea6a2e6b))
* **page-dynamic-detail:** atualização serviço do sample ([419f5b4](https://github.com/po-ui/po-angular/commit/419f5b499cc7934602d65c9a39d68354da5ba7fe))
* **page-dynamic-edit:** atualização serviço do sample ([ebb1a8a](https://github.com/po-ui/po-angular/commit/ebb1a8ad859ca272812bd5854e37d385b4903d75))
* **page-dynamic-table:** atualização serviço do sample ([b682c2f](https://github.com/po-ui/po-angular/commit/b682c2f675f36379bd11d6920b3b1986812248bc))
* **select:** atualização serviço do sample ([df3cbc6](https://github.com/po-ui/po-angular/commit/df3cbc6d604c15092b8aef54c5ea1b7e1c36ed62))
* **sync-getting-started:** atualiza para a nova versão ([7705327](https://github.com/po-ui/po-angular/commit/7705327d57aac7f976cfcfd56c8b2ec519ab5342))
* **sync-getting-started:** atualiza versão @ionic/angular ([efcb8fa](https://github.com/po-ui/po-angular/commit/efcb8fa8c95d2b3a90974e313160ed9cb33a701e))

## [1.28.0](https://github.com/po-ui/po-angular/compare/v1.27.1...v1.28.0) (2020-03-06)


### Build System

* configura Travis para validação dos commits com commitlint ([11a374b](https://github.com/po-ui/po-angular/commit/11a374b))


### Features

* **assets:** cria link press kit no portal ([5acf6dd](https://github.com/po-ui/po-angular/commit/5acf6dd))
* **assets:** criada pasta assets com logos do PO UI ([72ec294](https://github.com/po-ui/po-angular/commit/72ec294))
* **page-dynamic-detail:** adiciona propriedade `serviceMetadataApi` ([c0ccb38](https://github.com/po-ui/po-angular/commit/c0ccb38))
* **page-dynamic-detail:** implementa a propriedade `p-load` e `serviceLoadApi` ([43cd0e1](https://github.com/po-ui/po-angular/commit/43cd0e1))
* **page-dynamic-edit:** adiciona propriedade `p-load` e `serviceLoadApi` ([083a728](https://github.com/po-ui/po-angular/commit/083a728))
* **page-dynamic-table:** adiciona propriedade `serviceLoadApi` ([cd1fc89](https://github.com/po-ui/po-angular/commit/cd1fc89))
* **stepper:** implementa tratamento de `catchError` ao `canActiveNextStep` ([132a568](https://github.com/po-ui/po-angular/commit/132a568))


### Tests

* **http-interceptor-detail:** utiliza literais de tradução em ingles ([d708f7b](https://github.com/po-ui/po-angular/commit/d708f7b))


### Documentation

* **code-editor-register:** corrige objeto de exemplo customEditor ([50efa36](https://github.com/po-ui/po-angular/commit/50efa36))

* **page-job-scheduler:** atualiza a documentação dos endpoints ([2d3fa64](https://github.com/po-ui/po-angular/commit/2d3fa64))

* **api:** remove parâmetro `filter` ([79017a9](https://github.com/po-ui/po-angular/commit/79017a9))



## [1.27.1](https://github.com/po-ui/po-angular/compare/v1.27.0...v1.27.1) (2020-02-28)


### Bug Fixes

* **page-default:** corrige abertura de URL externa nos botões de ações ([879877f](https://github.com/po-ui/po-angular/commit/879877f))
* **page-list:** corrige abertura de URL externa nos botões de ações ([d952c38](https://github.com/po-ui/po-angular/commit/d952c38))
* **page-list:** corrige a literal "Busca Avançada" em russo ([9a8e1fb](https://github.com/po-ui/po-angular/commit/9a8e1fb))
* **table:** corrige erro no console do IE/EDGE ([88f8b7a](https://github.com/po-ui/po-angular/commit/88f8b7a))


### Documentation

* **getting-started:** melhoria na documentação de primeiros passos ([f5c3120](https://github.com/po-ui/po-angular/commit/f5c3120))
* **readme:** melhoria na documentação dos primeiros passos ([1b7746b](https://github.com/po-ui/po-angular/commit/1b7746b))



## [1.27.0](https://github.com/po-ui/po-angular/compare/v1.26.0...v1.27.0) (2020-02-21)


### Bug Fixes

* **page-dynamic-search:** altera nome de interface `PoPageDynamicOptions` para `PoPageDynamicSearchOptions` ([263fdae](https://github.com/po-ui/po-angular/commit/263fdae))


### Features

* **page-dynamic-table:** adiciona a propriedade `serviceMetadataApi` ([b27501a](https://github.com/po-ui/po-angular/commit/b27501a))
* **page-dynamic-table:** adiciona a propriedade `p-load` ([1f5cfc4](https://github.com/po-ui/po-angular/commit/1f5cfc4))


### Documentation

* **http-interceptor:** melhora a documentação do funcionamento ([5aba713](https://github.com/po-ui/po-angular/commit/5aba713))
* **api:** adiciona documento guia de implementão de API ([a5a9c35](https://github.com/po-ui/po-angular/commit/a5a9c35))


## [1.26.0](https://github.com/po-ui/po-angular/compare/v1.25.0...v1.26.0) (2020-02-14)


### Bug Fixes

* **dynamic-view:** corrige impressão da página ([72f3544](https://github.com/po-ui/po-angular/commit/72f3544)), closes [#258](https://github.com/po-ui/po-angular/issues/258)
* **page-login:** ajusta quebra de layout no popover no idioma russo ([827cad4](https://github.com/po-ui/po-angular/commit/827cad4))
* **tooltip:** corrige o compartilhamento do serviço de posição ([cfc2b7a](https://github.com/po-ui/po-angular/commit/cfc2b7a))
* **tooltip:** esconde os múltiplos tooltips quando realizar mouseleave ([7e3d6bd](https://github.com/po-ui/po-angular/commit/7e3d6bd))


### Features

* **page-dynamic-edit:** adiciona propriedade `serviceMetadataApi` ([246ef13](https://github.com/po-ui/po-angular/commit/246ef13))
* **stepper:** permite próximo passo assíncrono ([095ce4f](https://github.com/po-ui/po-angular/commit/095ce4f)), closes [#171](https://github.com/po-ui/po-angular/issues/171)

### Documentation

* **readme:** adiciona twitter badge ([78726f3](https://github.com/po-ui/po-angular/commit/78726f3))
* **how-to-document:** adiciona documento de guia para documentação ([19455c5](https://github.com/po-ui/po-angular/commit/19455c5))
* **code-of-conduct:** adiciona documento de código de conduta ([b46d6e1](https://github.com/po-ui/po-angular/commit/b46d6e1))
* **style-guide:** adiciona documento de boas práticas ([4f57588](https://github.com/po-ui/po-angular/commit/4f57588))
* **page-login:** atualiza exemplos da documentação ([4497e83](https://github.com/po-ui/po-angular/commit/4497e83))

## [1.25.0](https://github.com/po-ui/po-angular/compare/v1.24.0...v1.25.0) (2020-02-07)


### Bug Fixes

* **decimal:** corrige falha no arredondamento dos decimais ([08f2382](https://github.com/po-ui/po-angular/commit/08f2382))


### Features

* **page-dynamic-search:** adiciona a propriedade `p-literals` ([ec298f9](https://github.com/po-ui/po-angular/commit/ec298f9))
* **page-dynamic-search:** implementa a propriedade `p-load` ([36160f2](https://github.com/po-ui/po-angular/commit/36160f2))

### Documentation

* **sync:** atualização das versões do tutorial ([acf5afb](https://github.com/po-ui/po-angular/commit/acf5afb))
* **loading-overlay:** documenta como utilizar `p-screen-lock="false"` ([65dedd7](https://github.com/po-ui/po-angular/commit/65dedd7))

## [1.24.0](https://github.com/po-ui/po-angular/compare/v1.23.0...v1.24.0) (2020-01-24)


### Documentation

* **multiselect:** corrige mutabilidade no sample labs ([01e6576](https://github.com/po-ui/po-angular/commit/01e6576))


### Features

* **dynamic-form:** adiciona a propriedade `PoDynamicFormField.optional` ([f54cdc1](https://github.com/po-ui/po-angular/commit/f54cdc1))
* **dynamic-form:** implementa a propriedade `PoDynamicFormField.errorMessage` ([1467cae](https://github.com/po-ui/po-angular/commit/1467cae))
* **field:** cria nova propriedade `p-auto-focus` e deprecia a propriedade `p-focus` ([e9e2eac](https://github.com/po-ui/po-angular/commit/e9e2eac))

Componentes atualizados:
* checkbox
* datepicker
* datepicker-range
* decimal
* email
* input
* lookup
* login
* number
* multiselect
* password
* textarea
* upload
* url
* richtext

Antes:
```
<po-input
  name="input"
  p-focus
  p-label="PO Input">
</po-input>
```
Agora:
```
<po-input
  name="input"
  p-auto-focus
  p-label="PO Input">
</po-input>
```




## [1.23.0](https://github.com/po-ui/po-angular/compare/v1.22.2...v1.23.0) (2020-01-17)


### Bug Fixes

* **page-dynamic-search:** corrige disclaimer com label undefined ([0cd6f1d](https://github.com/po-ui/po-angular/commit/0cd6f1d))
* **page-dynamic-search:** corrige disclaimers da busca avançada ([f56bfed](https://github.com/po-ui/po-angular/commit/f56bfed))


### Features

* **combo:** permite utilizar `p-filter-params` nas requisições ([faf2505](https://github.com/po-ui/po-angular/commit/faf2505))
* **dynamic-form:** nova propriedade `params` ([9c0aed5](https://github.com/po-ui/po-angular/commit/9c0aed5))
* **dynamic-form:** inclui novos `fields` na propriedade `p-auto-focus` ([f7fb47c](https://github.com/po-ui/po-angular/commit/f7fb47c))
* **combo:** implementa a propriedade `p-auto-focus` ([72c4f35](https://github.com/po-ui/po-angular/commit/72c4f35))
* **checkbox-group:** implementa a propriedade `p-auto-focus` ([497fee0](https://github.com/po-ui/po-angular/commit/497fee0))
* **radio-group:** implementa a propriedade `p-auto-focus` ([52caaf2](https://github.com/po-ui/po-angular/commit/52caaf2))
* **select:** implementa a propriedade `p-auto-focus` ([83b157b](https://github.com/po-ui/po-angular/commit/83b157b))
* **switch:** implementa a propriedade `p-auto-focus` ([d4c4f8b](https://github.com/po-ui/po-angular/commit/d4c4f8b))



### [1.22.2](https://github.com/po-ui/po-angular/compare/v1.22.1...v1.22.2) (2020-01-10)


### Code Refactoring

* **table:** propriedade `p-selectable` substitui a propriedade `p-checkbox` ([9cdd3d4](https://github.com/po-ui/po-angular/commit/9cdd3d4))


### [1.22.1](https://github.com/po-ui/po-angular/compare/v1.22.0...v1.22.1) (2020-01-06)


### Performance

* **divider:**: adiciona ChangeDetectionStrategy.OnPush ([4b8f3ce](https://github.com/po-ui/po-angular/commit/4b8f3ce))

* **table:**  implementa alguns itens de performance ([30ac592](https://github.com/po-ui/po-angular/commit/30ac592))

* **tag:** adiciona ChangeDetectionStrategy.OnPush ([2fe04cf](https://github.com/po-ui/po-angular/commit/2fe04cf))


## [1.22.0](https://github.com/po-ui/po-angular/compare/v1.21.0...v1.22.0) (2019-12-27)


### Features

* **http-interceptor:** permite a exibição de múltiplas mensagens do backend e depreciado o parâmetro `X-Portinari-No-Error` ([b7505dc](https://github.com/po-ui/po-angular/commit/b7505dc))



## [1.21.0](https://github.com/po-ui/po-angular/compare/v1.20.0...v1.21.0) (2019-12-23)


### Bug Fixes

* **input:** corrige o *bug* ao colar um texto com o *mouse* no input ([0b48421](https://github.com/po-ui/po-angular/commit/0b48421)), closes [#146](https://github.com/po-ui/po-angular/issues/146)
* **lookup:** corrige comportamento focal na tabulação do html ([4e2432b](https://github.com/po-ui/po-angular/commit/4e2432b))
* **multiselect:** corrige disparo do evento de *change* na inicialização ([d1b7124](https://github.com/po-ui/po-angular/commit/d1b7124))


### Features

* **dynamic-form:** adiciona métodos para inicialização ([d68ecef](https://github.com/po-ui/po-angular/commit/d68ecef))
* **table:** adiciona eventos e métodos para colapsar e expandir ([e632fbc](https://github.com/po-ui/po-angular/commit/e632fbc))



## [1.20.0](https://github.com/po-ui/po-angular/compare/v1.19.0...v1.20.0) (2019-12-13)


### Bug Fixes

* **table:** corrige colspan quando *detail* estiver expandido ([0ef53d7](https://github.com/po-ui/po-angular/commit/0ef53d7))


### Features

* **combo:** permite agrupamento dos itens ([a851fe2](https://github.com/po-ui/po-angular/commit/a851fe2))
* **dynamic-form:** adiciona métodos para validação dos campos ([941cfdb](https://github.com/po-ui/po-angular/commit/941cfdb))
* **dynamic-view:** permite executar uma função durante a inicialização ([2791236](https://github.com/po-ui/po-angular/commit/2791236))



## [1.19.0](https://github.com/po-ui/po-angular/compare/v1.18.0...v1.19.0) (2019-12-06)


### Build System

* **tsconfig:** altera annotateForClosureCompiler para false ([6a861e9](https://github.com/po-ui/po-angular/commit/6a861e9))


### Features

* **dynamic-form:** permite atribuir foco nos campos ([4bdab45](https://github.com/po-ui/po-angular/commit/4bdab45))
* **info:** possibilita transformar o valor em um *link* ([99c2eee](https://github.com/po-ui/po-angular/commit/99c2eee))



## [1.18.0](https://github.com/po-ui/po-angular/compare/v1.17.0...v1.18.0) (2019-11-29)


### Bug Fixes

* **grid:** remove arquivos css ([137c96e](https://github.com/po-ui/po-angular/commit/137c96e))


### Features

* **checkbox:** novo componente ([bed9970](https://github.com/po-ui/po-angular/commit/bed9970))
* **rich-text:** permite que o usuário edite um link adicionado ([a4f4970](https://github.com/po-ui/po-angular/commit/a4f4970))
* **tree-view:** adiciona a opção de seleção de item ([3033b40](https://github.com/po-ui/po-angular/commit/3033b40))



## [1.17.0](https://github.com/po-ui/po-angular/compare/v1.16.0...v1.17.0) (2019-11-25)


### Bug Fixes

* **table:** corrige exibição dos ícones de acordo com o valor da coluna ([aad0013](https://github.com/po-ui/po-angular/commit/aad0013))


### Features

* **datepicker:** permite definir formato de data ([7477b6d](https://github.com/po-ui/po-angular/commit/7477b6d))



## [1.16.0](https://github.com/po-ui/po-angular/compare/v1.15.0...v1.16.0) (2019-11-18)


### Features

* **chart:** adiciona gráfico do tipo gauge ([a6ffb69](https://github.com/po-ui/po-angular/commit/a6ffb69))
* **tree-view:** novo componente ([5ee70df](https://github.com/po-ui/po-angular/commit/5ee70df))



## [1.15.0](https://github.com/po-ui/po-angular/compare/v1.14.0...v1.15.0) (2019-11-08)


### Bug Fixes

* **page-job-scheduler:** corrige altura do container ([a8aaae8](https://github.com/po-ui/po-angular/commit/a8aaae8))


### Features

* **button:** implementa ChangeDetectionStrategy.OnPush ([91b3189](https://github.com/po-ui/po-angular/commit/91b3189))
* **combo:** permite customizar a lista de opções ([b0afdf9](https://github.com/po-ui/po-angular/commit/b0afdf9))



## [1.14.0](https://github.com/po-ui/po-angular/compare/v1.13.1...v1.14.0) (2019-11-01)


### Features

* **popover:** permite informar o target dinamicamente ([3c0ff80](https://github.com/po-ui/po-angular/commit/3c0ff80))
* **table:** adiciona gerenciador de colunas ([35d1157](https://github.com/po-ui/po-angular/commit/35d1157))



### [1.13.1](https://github.com/po-ui/po-angular/compare/v1.13.0...v1.13.1) (2019-10-25)


### Bug Fixes

* **chart:** corrige animação em loop em series com valores zerados ([5fedcd5](https://github.com/po-ui/po-angular/commit/5fedcd5))
* **url:** corrige validação de links que contenham caracteres maiúsculos ([3b45ccb](https://github.com/po-ui/po-angular/commit/3b45ccb))



## [1.13.0](https://github.com/po-ui/po-angular/compare/v1.12.0...v1.13.0) (2019-10-18)


### Bug Fixes

* **page-login:** corrige literais customizadas ao trocar de idioma ([7538c6b](https://github.com/po-ui/po-angular/commit/7538c6b))


### Code Refactoring

* **table:** melhoria na componentização do componente interno `po-table-column-icon` ([98009bd](https://github.com/po-ui/po-angular/commit/98009bd))


### Features

* **dynamic-view:** permite definir cores e ícones para o tipo tag ([95eca9d](https://github.com/po-ui/po-angular/commit/95eca9d))



## [1.12.0](https://github.com/po-ui/po-angular/compare/v1.11.0...v1.12.0) (2019-10-11)


### Bug Fixes

* **page-dynamic-edit:** alterado para `{ static: false}` no ViewChild do PoDynamicFormComponent ([b9cf19b](https://github.com/po-ui/po-angular/commit/b9cf19b))


### Features

* **rich-text:** permite inclusão de links ([238385b](https://github.com/po-ui/po-angular/commit/238385b))
* **tag:** adiciona a propriedade `p-inverse` que permite inversão de cores ([338dfd0](https://github.com/po-ui/po-angular/commit/338dfd0))



## [1.11.0](https://github.com/po-ui/po-angular/compare/v1.10.0...v1.11.0) (2019-10-04)


### Bug Fixes

* **dynamic-form:** `name` não estava sendo repassado corretamente ao componente `po-lookup` ([f924060](https://github.com/po-ui/po-angular/commit/f924060))
* **readme:** fixada a versão do angular-cli@8.0.0 ([8a95f2e](https://github.com/po-ui/po-angular/commit/8a95f2e))
* **table:** utiliza ordenação local mesmo utilizando o evento `p-sort-by` ([1cacc4d](https://github.com/po-ui/po-angular/commit/1cacc4d))


### Features

* **accordion:** novo componente ([ca05d1b](https://github.com/po-ui/po-angular/commit/ca05d1b))
* **lookup:** inclui coluna de ordenação na chamada do serviço ([1cacc4d](https://github.com/po-ui/po-angular/commit/1cacc4d))
* **notification:** permite alterar tempo de duração da notificação através da propriedade `PoNotification.duration` ([23eb81a](https://github.com/po-ui/po-angular/commit/23eb81a))
* **page-dynamic-table:** inclui coluna de ordenação na chamada do serviço([a9718f6](https://github.com/po-ui/po-angular/commit/a9718f6))
* **rich-text:** permite inclusão de imagem ([303bf04](https://github.com/po-ui/po-angular/commit/303bf04))
* **storage:** adiciona `po-loki-driver` no storage ([0cf3222](https://github.com/po-ui/po-angular/commit/0cf3222))
* **tag:** permite o uso da paleta de cores e ícones através das propriedade `p-color`e `p-icon` ([13587a4](https://github.com/po-ui/po-angular/commit/13587a4))
* **ui:** adiciona suporte para o idioma russo nos componentes: ([d5ae905](https://github.com/po-ui/po-angular/commit/d5ae905))
  - Componentes do pacote `@portinari/portinari-templates`:
    - PoModalPasswordRecovery;
    - PoPageBlockedUser;
    - PoPageChangePassword;

  - Componentes e seviço do pacote `@portinari/portinari-ui`:
    - PoCombo;
    - PoDatePickerRange;
    - PoLookup;
    - PoMultiselect;
    - PoUpload;
    - PoListView;
    - PoLoadingOverlay;
    - PoNavbar;
    - PoPageDetail;
    - PoPageEdit;
    - PoPageList;
    - PoTable;
    - PoDialog;

## [1.10.0](https://github.com/po-ui/po-angular/compare/v1.9.0...v1.10.0) (2019-09-27)


### Bug Fixes

* **page-login:** corrige erro ao usar `title` e `loginHint` com `undefined` ([20a36f9](https://github.com/po-ui/po-angular/commit/20a36f9))
* **toolbar:** corrige o funcionamento sem o `p-profile` ([c26f85a](https://github.com/po-ui/po-angular/commit/c26f85a))


### Features

* **upload:** adiciona propriedade `p-directory`, possibilitando envio de pastas ([6e6de71](https://github.com/po-ui/po-angular/commit/6e6de71))



## [1.9.0](https://github.com/po-ui/po-angular/compare/v1.8.1...v1.9.0) (2019-09-20)


### Features

* **chart:** adiciona gráfico do tipo donut ([f4403cc](https://github.com/po-ui/po-angular/commit/f4403cc))



### [1.8.1](https://github.com/po-ui/po-angular/compare/v1.8.0...v1.8.1) (2019-09-13)


### Bug Fixes

* **checkbox-group:** corrige texto sobreposto quando há quebra de linha com textos grandes. ([a04f569](https://github.com/po-ui/po-angular/commit/a04f569))
* **checkbox-group:** corrige inconsistência de uso no Edge e IE ([8319b3c](https://github.com/po-ui/po-angular/commit/8319b3c))
* **table:** remove scroll duplo do eixo y no IE ao utilizá-lo dentro do lookup ([d09e58d](https://github.com/po-ui/po-style/commit/d09e58d))


## [1.8.0](https://github.com/po-ui/po-angular/compare/v1.7.0...v1.8.0) (2019-09-06)


### Bug Fixes

* **combo:** corrige links quebrados dos exemplos de heróis ([18b9539](https://github.com/po-ui/po-angular/commit/18b9539))
* **multiselect:** corrige comportamento do componente no IE, que ao informar valores grandes na propriedade `p-options`
não abria a lista supensa ([d82a6dc](https://github.com/po-ui/po-angular/commit/d82a6dc))


### Features

* **button:** implementa o método `focus` que habilita o foco no componente ([71ccfc8](https://github.com/po-ui/po-angular/commit/71ccfc8))
* **fields:** implementa o método `focus` que habilita o foco nos componentes: ([015f617](https://github.com/po-ui/po-angular/commit/015f617))
  - Checkbox Group
  - Combo
  - Datepicker
  - Datepicker Range
  - Decimal
  - Email
  - Input
  - Login
  - Lookup
  - Multiselect
  - Number
  - Password
  - Radio Group
  - Rich Text
  - Select
  - Switch
  - Textarea
  - Upload
  - Url

* **progress:** adiciona evento o `p-retry` que habilita um ícone de tentar novamente ([c06e7c9](https://github.com/po-ui/po-angular/commit/c06e7c9))
* **rich-text:** possibilita que usuário mude a cor do texto ([3e11fe7](https://github.com/po-ui/po-angular/commit/3e11fe7))
* **upload:** utiliza o componente `po-progress` como barra de progresso e deprecia as propriedades: `cancel`, `deleteFile` e `tryAgain` da interface `PoUploadLiterals` ([9593412](https://github.com/po-ui/po-angular/commit/9593412))



## [1.7.0](https://github.com/po-ui/po-angular/compare/v1.6.0...v1.7.0) (2019-08-30)


### Features

* **fields:** implementa a propriedade `no-autocomplete` nos campos de entrada ([881d7b1](https://github.com/po-ui/po-angular/commit/881d7b1))
* **rich-text:** adiciona eventos de mudança de valores ([1b7444c](https://github.com/po-ui/po-angular/commit/1b7444c))
* **table:** adiciona evento para ordenação de colunas ([4dbd51a](https://github.com/po-ui/po-angular/commit/4dbd51a))



## [1.6.0](https://github.com/po-ui/po-angular/compare/v1.5.0...v1.6.0) (2019-08-23)


### Bug Fixes

* **datepicker:** corrige foco no campo após selecionar data no mobile ([fbb61b8](https://github.com/po-ui/po-angular/commit/fbb61b8))
* **lint:** corrige a falha no lint do projeto ([4ee6672](https://github.com/po-ui/po-angular/commit/4ee6672))


### Features

* **upload:** exibe restrições de arquivos ([fccbb10](https://github.com/po-ui/po-angular/commit/fccbb10))


### Tests

* **navbar:** corrige a falha no teste do método `validateMenuLogo` ([6f9d767](https://github.com/po-ui/po-angular/commit/6f9d767))



## [1.5.0](https://github.com/po-ui/po-angular/compare/v1.4.0...v1.5.0) (2019-08-16)

### Bug Fixes

* **menu:** aplica largura de 100% na area destinada ao menu-header-template ([23607f9](https://github.com/po-ui/po-style/commit/23607f9))

### Features

* **page-list:** traduz "busca avançada" com a linguagem utilizada no I18n ([eee5463](https://github.com/po-ui/po-angular/commit/eee5463))
* **tabs:** habilita scroll horizontal das tabs em dispositivos moveis ([30ed4ad](https://github.com/po-ui/po-angular/commit/30ed4ad))



## [1.4.0](https://github.com/po-ui/po-angular/compare/v1.3.1...v1.4.0) (2019-08-09)


### Bug Fixes

* **datepicker:** corrige disparo do p-change ([9cbe283](https://github.com/po-ui/po-angular/commit/9cbe283))
* **decimal:** impede a digitação de valores inválidos ([d8d2568](https://github.com/po-ui/po-angular/commit/d8d2568))
* **po-app:** possibilita a execução do projeto app localmente no IE ([c9baac4](https://github.com/po-ui/po-angular/commit/c9baac4))


### Features

* **progress:** cria o componente po-progress ([c3884bf](https://github.com/po-ui/po-angular/commit/c3884bf))



### [1.3.1](https://github.com/po-ui/po-angular/compare/v1.3.0...v1.3.1) (2019-08-02)


### Bug Fixes

* **build:** corrige erros de compilação com --prod ([9081b4d](https://github.com/po-ui/po-angular/commit/9081b4d))
* **samples:** altera o caminho dos serviços utilizados nos samples ([e8618c7](https://github.com/po-ui/po-angular/commit/e8618c7))



## [1.3.0](https://github.com/po-ui/po-angular/compare/v1.2.0...v1.3.0) (2019-07-26)


### Bug Fixes

* **app:** corrige os erros ao utilizar os samples ([1345cfb](https://github.com/po-ui/po-angular/commit/1345cfb))
* **modal:** corrige fechamento da modal ao selecionar opção no combo ([a5ebc3b](https://github.com/po-ui/po-angular/commit/a5ebc3b))
* **table:** corrige sobreposição do popup em dispositivos mobile iOS ([cf6764b](https://github.com/po-ui/po-angular/commit/cf6764b))


### Features

* **upload:** permite que o componente aceite drag and drop ([ef47ca8](https://github.com/po-ui/po-angular/commit/ef47ca8))



## [1.2.0](https://github.com/po-ui/po-angular/compare/v1.1.1...v1.2.0) (2019-07-19)


### Bug Fixes

* **loading:** trata o ícone de carregamento para conexões 3g ([ea3ba0a](https://github.com/po-ui/po-angular/commit/ea3ba0a))
* **table:** corrige a exibição do botão de visualizar legenda ([535a1af](https://github.com/po-ui/po-angular/commit/535a1af))


### Features

* **navbar:** remove a logo do menu utilizado com navbar ([6771395](https://github.com/po-ui/po-angular/commit/6771395))


### Tests

* **page-blocked-user-contacts:** remove o x do describe ([2ad40b7](https://github.com/po-ui/po-angular/commit/2ad40b7))



### [1.1.1](https://github.com/po-ui/po-angular/compare/v1.1.0...v1.1.1) (2019-07-12)


### Bug Fixes

* **lookup:** corrige ordenação das tabelas ([ee62bde](https://github.com/po-ui/po-angular/commit/ee62bde))
* **lookup:** corrige descrição dos registros ([ca9b4b4](https://github.com/po-ui/po-angular/commit/ca9b4b4))
* **sync:** corrige importação do thf-schema ([6e945ae](https://github.com/po-ui/po-angular/commit/6e945ae))

### Tests

* **navbar:** adiciona testes unitários ao componente ([4708a87](https://github.com/po-ui/po-angular/commit/4708a87))
* **rich-text:** adiciona testes unitários no componente ([89b6e44](https://github.com/po-ui/po-angular/commit/89b6e44))


## 1.1.0 (2019-07-05)


### Bug Fixes

* **po-language:** configuração do providedIn ([472464f](https://github.com/po-ui/po-angular/commit/472464f))
* **select:** corrigido scroll dos itens para quando houver valor atribuído no ngModel ([84da5f4](https://github.com/po-ui/po-angular/commit/84da5f4))
* **sync:** ajustes nas importações ([c5d58ee](https://github.com/po-ui/po-angular/commit/c5d58ee))


### Build System

* adiciona lint para os commits e cria tarefa de release ([f864873](https://github.com/po-ui/po-angular/commit/f864873))


### Features

* **page-login:** opção de tradução para o idioma russo ([00c93b8](https://github.com/po-ui/po-angular/commit/00c93b8))
