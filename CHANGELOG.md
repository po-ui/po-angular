# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.10.0"></a>
# [3.10.0](https://github.com/po-ui/po-angular/compare/v3.9.2...v3.10.0) (2020-10-26)


### Features

* **button:** adiciona propriedade `p-auto-focus` ([710033a](https://github.com/po-ui/po-angular/commit/710033a))
* **decimal:** cria propriedade `p-locale` para definição de formatação ([03dd53d](https://github.com/po-ui/po-angular/commit/03dd53d))
* **page-default:** define literais para idiomas suportados ([1824602](https://github.com/po-ui/po-angular/commit/1824602))
* **popover:** inclui evento `p-close` ao fechar ([6134b83](https://github.com/po-ui/po-angular/commit/6134b83))
* **table:** inclui evento `p-change-visible-columns` ([2a892f4](https://github.com/po-ui/po-angular/commit/2a892f4))



## [3.9.2](https://github.com/po-ui/po-angular/compare/v3.9.1...v3.9.2) (2020-10-19)


### Bug Fixes

* **navbar:** corrige marca do item selecionado a partir da rota ([3a08cbf](https://github.com/po-ui/po-angular/commit/3a08cbfb2b2cf37455747bd816abf13ed319a3c7))
* **number:** permite apenas números no campo ([0908856](https://github.com/po-ui/po-angular/commit/090885600a77824519a04c08f06a52fed2eb89df))


<a name="3.9.1"></a>
# [3.9.1](https://github.com/po-ui/po-angular/compare/v3.9.0...v3.9.1) (2020-10-13)

### Refactor

* **rich-text:** refatora po-rich-text-modal ([b629770](https://github.com/po-ui/po-angular/commit/b6297705f1de64d3979a441226fd163f3bde1e24))


<a name="3.9.0"></a>
# [3.9.0](https://github.com/po-ui/po-angular/compare/v3.8.0...v3.9.0) (2020-10-05)


### Bug Fixes

* **rich-text:** corrige compartilhamento do ngModel ([0888438](https://github.com/po-ui/po-angular/commit/0888438))
* **ui:** ajusta declaração incorreta dos event para uso de projetos Angular com a opção strict ([957f1c5](https://github.com/po-ui/po-angular/commit/957f1c5))


### Features

* **lookup:** criada a propriedade p-advanced-filters ([0fe5116](https://github.com/po-ui/po-angular/commit/0fe5116))



<a name="3.8.0"></a>
# [3.8.0](https://github.com/po-ui/po-angular/compare/v3.7.0...v3.8.0) (2020-09-28)


### Features

* **schematics:** adiciona testes unitários para o [@po-ui](https://github.com/po-ui)/ng-sync ([66b21be](https://github.com/po-ui/po-angular/commit/66b21be))



<a name="3.7.0"></a>
# [3.7.0](https://github.com/po-ui/po-angular/compare/v3.6.0...v3.7.0) (2020-09-21)


### Bug Fixes

* **lookup:** inclui encoding de caracteres especiais no filtro rápido ([cb9bb24](https://github.com/po-ui/po-angular/commit/cb9bb24))
* **menu:** corrige pesquisa para usar itens com subItens vazio ([28f6547](https://github.com/po-ui/po-angular/commit/28f6547))
* **popup:** ativa scroll quando o elemento chegar na altura máxima ([ac5b79b](https://github.com/po-ui/po-angular/commit/ac5b79b))


### Features

* adequação do projeto para versão 10.1.0 e TypeScript 4 ([95ac544](https://github.com/po-ui/po-angular/commit/95ac544))
* **schematics:** adiciona testes unitários para o [@po-ui](https://github.com/po-ui)/ng-code-editor ([449d170](https://github.com/po-ui/po-angular/commit/449d170))



<a name="3.6.0"></a>
# [3.6.0](https://github.com/po-ui/po-angular/compare/v3.5.0...v3.6.0) (2020-09-14)


### Features

* **combo:** adiciona a propriedade p-clean ([7e3a579](https://github.com/po-ui/po-angular/commit/7e3a579)), closes [#152](https://github.com/po-ui/po-angular/issues/152)
* **page-dynamic-search:** adiciona propriedade p-quick-search-width ([584dbf0](https://github.com/po-ui/po-angular/commit/584dbf0))
* **page-dynamic-table:** adiciona propriedade p-quick-search-width ([c6909b0](https://github.com/po-ui/po-angular/commit/c6909b0))
* **page-slide:** cria o componente po-page-slide ([080e2db](https://github.com/po-ui/po-angular/commit/080e2db))
* **po-login:** criada propriedade `p-languages` e o evento `p-language-change` ([b7ac5c1](https://github.com/po-ui/po-angular/commit/b7ac5c1))
* **schematics:** adiciona testes unitários para o [@po-ui](https://github.com/po-ui)/ng-storage ([685e3c4](https://github.com/po-ui/po-angular/commit/685e3c4))
* **schematics:** adiciona testes unitários para o [@po-ui](https://github.com/po-ui)/ng-templates ([1701eea](https://github.com/po-ui/po-angular/commit/1701eea))
* **storage:** atualiza pacote do localForage ([3d00bee](https://github.com/po-ui/po-angular/commit/3d00bee))



<a name="3.5.0"></a>
# [3.5.0](https://github.com/po-ui/po-angular/compare/v3.4.0...v3.5.0) (2020-09-08)


### Bug Fixes

* **i18n:** correção para uso do componente PoI18n nos testes unitários ([7b1d7cb](https://github.com/po-ui/po-angular/commit/7b1d7cb))


### Features

* **dynamic-form:** adiciona propriedade `p-validate-fields` ([c94d2fa](https://github.com/po-ui/po-angular/commit/c94d2fa))
* **dynamic-table:** esconde o botão `new` ao não informar `actions.new` ([f69fb34](https://github.com/po-ui/po-angular/commit/f69fb34))
* **dynamic-table:** adicionada propriedade `allowColumnsManager` que permite o campo aparecer no gerenciador de coluna mesmo que o visible seja `false` ([8a96058](https://github.com/po-ui/po-angular/commit/8a96058))


### Performance Improvements

* **field-container:** implementa ChangeDetectionStrategy.OnPush ([bb6a40f](https://github.com/po-ui/po-angular/commit/bb6a40f))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/po-ui/po-angular/compare/v3.3.0...v3.4.0) (2020-08-31)


### Bug Fixes

* **combo:** adiciona tratamento para retorno de erro HTTP na pesquisa ([2eb1d5c](https://github.com/po-ui/po-angular/commit/2eb1d5c))
* **navbar:** corrige scrollbar vertical desnecessário ([a9e4a0c](https://github.com/po-ui/po-angular/commit/a9e4a0c))
* **rich-text:** corrige atualização do model via código ([c3fe5f7](https://github.com/po-ui/po-angular/commit/c3fe5f7))


### Features

* **code-editor:** adiciona propriedade `p-suggestions` para incluir sugestões customizadas de código ([9eac396](https://github.com/po-ui/po-angular/commit/9eac396))


<a name="3.3.0"></a>
# [3.3.0](https://github.com/po-ui/po-angular/compare/v3.2.0...v3.3.0) (2020-08-24)


### Bug Fixes

* **combo:** corrige mudança para dirty caso alterar model via typescript ([1d143cf](https://github.com/po-ui/po-angular/commit/1d143cf))
* **number:** valida campo no evento blur ([e270b50](https://github.com/po-ui/po-angular/commit/e270b50))
* **table:** corrige ordenação das colunas dos tipos date e dateTime ([5251125](https://github.com/po-ui/po-angular/commit/5251125))
* **table:** corrige ordenação quando possui valores inválidos ([c991f7f](https://github.com/po-ui/po-angular/commit/c991f7f))


### Features

* **list-view:** permite traduzir literais usando serviço i18n ([e550a31](https://github.com/po-ui/po-angular/commit/e550a31))
* **modal-password-recovery:** faz tradução de literais com serviço i18n ([0b7e409](https://github.com/po-ui/po-angular/commit/0b7e409))
* **page-login:** use the i18n language to translate initially ([06958cb](https://github.com/po-ui/po-angular/commit/06958cb))


### Performance Improvements

* **switch:** implementa ChangeDetectionStrategy.OnPush ([b84621f](https://github.com/po-ui/po-angular/commit/b84621f))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/po-ui/po-angular/compare/v3.1.0...v3.2.0) (2020-08-17)


### Bug Fixes

* **datepicker:** valida input ao sair do campo ([1bb1190](https://github.com/po-ui/po-angular/commit/1bb1190))
* **dynamic-form:** corrige chamada de evento na seleção de um campo do tipo lookup [c7a67c2](https://github.com/po-ui/po-angular/commit/c7a67c2))
* **schematics:** corrige versão do po-ui/ng-tslint no ngUpdate ([52731f1](https://github.com/po-ui/po-angular/commit/52731f1))


### Features

* **disclaimer-group:** adiciona literais em russo ([97b1bf9](https://github.com/po-ui/po-angular/commit/97b1bf9))
* **disclaimer-group:** permite traduzir literais usando serviço i18n ([9a6a311](https://github.com/po-ui/po-angular/commit/9a6a311)), closes [#567](https://github.com/po-ui/po-angular/issues/567)
* **navbar:** permite traduzir literais usando serviço i18n ([ddc1d08](https://github.com/po-ui/po-angular/commit/ddc1d08))
* **table:** permite traduzir literais usando serviço i18n ([9d88206](https://github.com/po-ui/po-angular/commit/9d88206))


## [3.1.0](https://github.com/po-ui/po-angular/compare/v3.0.0...v3.1.0) (2020-08-10)


### Features

* **dialog:** permite traduzir literais usando serviço i18n ([f09b236](https://github.com/po-ui/po-angular/commit/f09b236d52890991148b9a652c67c5c40b393e83))
* **notification:** permite traduzir literais usando serviço i18n ([6c67aa3](https://github.com/po-ui/po-angular/commit/6c67aa3012ab8df62192dfe5820a1b735f433e37))
* **page-dynamic-table:** adiciona a propriedade p-table-custom-actions ([a03d35a](https://github.com/po-ui/po-angular/commit/a03d35a1540e4dd864554cc76b9aa00a8e6bd7b7))
* **page-job-scheduler:** permite traduzir literais usando serviço i18n ([b076757](https://github.com/po-ui/po-angular/commit/b076757958c25b274f2bd9c31ab567c3ca003d96))
* **portal:** adiciona o projeto ao monorepo ([754f740](https://github.com/po-ui/po-angular/commit/754f74057594f980110a3e04cb99b11df4b968fc))
* **schematics:** adiciona schematics de templates ([81970c9](https://github.com/po-ui/po-angular/commit/81970c9adf1dc657585cecf89a5d037548801c6b))


### Bug Fixes

* **lookup:** altera p-field-label dinamicamente ([79cec4e](https://github.com/po-ui/po-angular/commit/79cec4ebbea7686afa5972ee215274b723a9ab8b))
* **rich-text:** corrige abertura de links com CMD ou Ctrl ([10b6461](https://github.com/po-ui/po-angular/commit/10b64611c0021df1be8dbdf79ce3f45af4241c91))

### Documentation

* **sync:** corrige link do repositorio de demonstração ([5d98d5b](https://github.com/po-ui/po-angular/commit/5d98d5be642bbc922be02e401bf451aae24d1357))

### Tests

* **popover:** correção para erros intermitentes ([8548962](https://github.com/po-ui/po-angular/commit/85489623aaf5c0685f6f8a0aebd9d2171ff12bd5))

## [3.0.0](https://github.com/po-ui/po-angular/compare/v2.10.0...v3.0.0) (2020-08-03)

### ⚠ BREAKING CHANGES

* **angular:** atualiza para a versão 10

Atualize seu projeto para utilizar a versão 10 do Angular, acesse a documentação [**Guia de Atualização do Angular**](https://update.angular.io/) para fazer a migração completa.

Veja nossa [**documentação para fazer a migração**](https://github.com/po-ui/po-angular/blob/master/docs/guides/migration-poui-v3.md) para a versão 3.

* **sync:** remove suporte portinari_sync_date

Antes:
```
{
  "hasNext": false,
  "items": [],
  "portinari_sync_date": "2018-10-08T13:57:55.008Z"
}
```
Depois:
```
{
  "hasNext": false,
  "items": [],
  "po_sync_date": "2018-10-08T13:57:55.008Z"
}
```
* **upload:** removidas literais cancel, deleteFile e tryAgain

Foram removidas as literais `cancel`, `deleteFile` e `tryAgain` da interface `PoUploadLiterals`.

Essa remoção foi realizada pois não havia mais a necessidade, pois o componente havia sofrido alterações
onde essas literais passaram a não ser utilizadas.

* **lookup:** removido o método getFilteredData

Foi removido o método `getFilteredData` do `PoLookupFilter`.
Agora o usuário deve optar pelo método `getFilteredItems`.

Antes:
```
getFilteredData(search, pageSize, page) {}
```

Depois:
```
getFilteredItems(params: PoLookupFilteredItemsParams) {}
```
* **table:** remove a propriedade p-checkbox

Foi removida a propriedade `p-checkbox` do componente.
Agora o usuário deve optar pela propriedade `p-selectable`.

Antes:
```
<po-table p-checkbox></po-table>
```

Depois:
```
<po-table p-selectable></po-table>
```

### Features

* **ng-tslint:** nova regra `bool-param-default` ([5f5044c](https://github.com/po-ui/po-angular/commit/5f5044ca8418be03902c6a6d57b6c34cf55f43dd))
* **page-dynamic-table:** nova propriedade `p-page-custom-actions` ([aae9e87](https://github.com/po-ui/po-angular/commit/aae9e878f3cc35b0cdf19f02a0438935c575aeb5))
* **page-login:** adiciona a propriedade `p-support` ([c7a3b22](https://github.com/po-ui/po-angular/commit/c7a3b220d110a836f31f8b3028785c83780c03b6))
* **po-menu:** implement i18n to menu and menu filter ([95bab5a](https://github.com/po-ui/po-angular/commit/95bab5a241345073e6eb526b1f2cbf9e2b07e1d3))
* **table:** adiciona propriedade `p-loading-show-more` ([09b728e](https://github.com/po-ui/po-angular/commit/09b728e4de3e87c7e6214d0e653d34efa325793d))
* **table:** altera a posição do ícone ordenação ([0ddd169](https://github.com/po-ui/po-angular/commit/0ddd169212e4a791852668abcabda79a0e6d2cc6))
* atualizacao dos parametros do sonarqube ([3179bed](https://github.com/po-ui/po-angular/commit/3179bedeae976c099b388bdcdd334aa86edfb80e))
* **components:** implementa ng update para versão 3 ([08958fd](https://github.com/po-ui/po-angular/commit/08958fd0b1ae95395a0b7264e51d0c7bf7995bb7))
* **page-blocked-user:** adiciona literais em russo ([58d47d3](https://github.com/po-ui/po-angular/commit/58d47d31b26351030cf12265b7ae08991795bd1a))
* **page-blocked-user:** permite traduzir literais usando serviço i18n ([0134d11](https://github.com/po-ui/po-angular/commit/0134d1141c3579be3d30c9ad86bb3946d8fabe22))
* **page-change-password:** permite traduzir literais usando i18n ([58dba8b](https://github.com/po-ui/po-angular/commit/58dba8b5ebb6c621a47f7bf12e37add48d8071d7))
* **page-dynamic-detail:** adiciona literais em russo ([2e199c2](https://github.com/po-ui/po-angular/commit/2e199c2a25b0f82baae5e86e0d5576fd6d968564))
* **page-dynamic-detail:** permite traduzir literais usando serviço i18n ([55562e9](https://github.com/po-ui/po-angular/commit/55562e9670748191f9c68f9a9a1173db451edbd3))
* **page-dynamic-table:** adiciona literais em russo ([9590552](https://github.com/po-ui/po-angular/commit/959055233bebd3b5f5e33bd63182984367e58ff9))
* **page-dynamic-table:** permite traduzir literais usando serviço i18n ([900fc52](https://github.com/po-ui/po-angular/commit/900fc52574315427c9f7a0e41553ee200ce418a6))
* **page-dynamic-edit:** adiciona literais em russo ([add3a3c](https://github.com/po-ui/po-angular/commit/add3a3cf3d486f08c53fde49cc35124d1c380b7d))
* **page-dynamic-edit:** permite traduzir literais usando serviço i18n ([2ce09c3](https://github.com/po-ui/po-angular/commit/2ce09c31f5b0aeef5fc3e8918d2f30deb469faa1))
* **page-job-scheduler:** adiciona literais em russo ([e18308b](https://github.com/po-ui/po-angular/commit/e18308b00d9cc7f30f913728319bf16ca43ce965))
* **page-login:** adiciona a propriedade na interface `PoPageLoginLiterals.welcome` ([d7c7791](https://github.com/po-ui/po-angular/commit/d7c779194fa6cd8154f2e3a3a5d159c59715b163))
* **sync:** implementa ng update para versão 3 ([3e2a16d](https://github.com/po-ui/po-angular/commit/3e2a16d7280b99a40e32a9f392eae4eb920a2db8))
* **table:** implementa opção para mudar a posição do ícone de detail ([f997c21](https://github.com/po-ui/po-angular/commit/f997c21c5199fbe29cc0f84d114116d2d334b8c2))

### Bug Fixes

* **list-view:** corrige alinhamento da caixa de seleção ([a92721e](https://github.com/po-ui/po-angular/commit/a92721e491fc138702be6064cb584616a2f13852))
* **multiselect:** corrige desaparecimento do campo de pesquisa ([9f9fec7](https://github.com/po-ui/po-angular/commit/9f9fec7cfbb8244564b59203b42a9eb9f9565b46))
* **page-dynamic-table:** corrige uso do `concatFilters` e `keepFilters` no retorno do metadatas ([bfbf428](https://github.com/po-ui/po-angular/commit/bfbf4286463f7df4ec94936ac9633a0eeb7dd08a))
* **schematics:** corrige erro ao executar o ng generate ([6acbc00](https://github.com/po-ui/po-angular/commit/6acbc00cdc2b15df8962bdf407ac98d9d275e432))
* **multiselect:** corrige desaparecimento do campo de pesquisa ([cdf7879](https://github.com/po-ui/po-angular/commit/cdf7879f966697dd9a480d2ebce84acc9bd92625))
* **schematics:** corrige erro ao executar o ng generate ([eae14ed](https://github.com/po-ui/po-angular/commit/eae14ed1a1e01a419f6b8d9b0677e9a4203d69dc))

### Documentation

* **select:** corrige erro no SampleCustomerRegistration ([53a888d](https://github.com/po-ui/po-angular/commit/53a888d41d80cd3eddd99050a8048911618f087d))
* **table:** corrige no sample o uso da propriedade `p-show-more-disabled` ([f54b210](https://github.com/po-ui/po-angular/commit/f54b210d70cf6965bdf83c533e1a929369456bf5))
* **contributing:** corrige descrição do commit com breaking change ([82d6a10](https://github.com/po-ui/po-angular/commit/82d6a10c528bb219a2d85c7cb9ddfe736cfd6bdc))
* **lookup** atualiza endpoint dos samples ([8f67a0](https://github.com/po-ui/po-angular/commit/8f67a0609fd250e449cf2bce78b4d1e47dd1408a))

### Code Refactoring

* **lookup:** remove a método `getFilteredData` ([32f5d82](https://github.com/po-ui/po-angular/commit/32f5d828498d226d41ee1bfe8f9325a019a3f4c7))
* **sync:** remove suporte `portinari_sync_date` ([d298119](https://github.com/po-ui/po-angular/commit/d29811916b5874f3f7cdf9c3e39313c3dd3cb311))
* **table:** remove a propriedade `p-checkbox` ([802f7bf](https://github.com/po-ui/po-angular/commit/802f7bf6a43dd2ba15f5870bb2848e88ca1a9be5))
* **upload:** remove as literais `cancel`, `deleteFile` e `tryAgain` ([6c172cb](https://github.com/po-ui/po-angular/commit/6c172cbe52834ba9e4e1e61e2e3d3774466bbe6f))
* **code-editor:** retira a dependência do pacote `uuid` ([cc6f860](https://github.com/po-ui/po-angular/commit/cc6f860c21b5998cd1de47a8962e5a6fc8518d69))


## [2.10.0](https://github.com/po-ui/po-angular/compare/v2.9.0...v2.10.0) (2020-07-13)


### Features

* **combo:** permite traduzir as literais usando o serviço do i18n ([e3dcbbe](https://github.com/po-ui/po-angular/commit/e3dcbbe3f6a75708ef90a771b8697d2a0617f8e2))
* **disclaimer-group:** cria p-remove e p-remove-all ([3814deb](https://github.com/po-ui/po-angular/commit/3814debbd836532edc68d07b0946f7e850a8babb))
* **lookup:** permite traduzir as literais usando o serviço do i18n ([a6a7539](https://github.com/po-ui/po-angular/commit/a6a7539a51a537122c4761b82cb48efd0d366166))
* **multiselect:** permite traduzir as literais usando o serviço do i18n ([399ba06](https://github.com/po-ui/po-angular/commit/399ba06cf8f430bedc1b0881f30e632e60faff89))
* **page-detail:** permite traduzir as literais usando o serviço do i18n ([24d3590](https://github.com/po-ui/po-angular/commit/24d35908aa1e42343faa01201b83113e7292ee4e))
* **page-dynamic-search:** implementa `p-concat-filters` ([1f8aab3](https://github.com/po-ui/po-angular/commit/1f8aab30100af6e30768cf5e8b66b1feeda02992))
* **page-dynamic-table:** implementa `p-concat-filters` ([3100ca3](https://github.com/po-ui/po-angular/commit/3100ca34ec1ee4bc9876ef494b6814fed24705a0))
* **page-edit:** permite traduzir as literais usando o serviço do i18n ([00764a6](https://github.com/po-ui/po-angular/commit/00764a6fab7ff76eec2371b6e61ea9ca595ae25b))
* **page-list:** cria ações remove e removeAll ([451986e](https://github.com/po-ui/po-angular/commit/451986eac09761fb24b0ff353753e8188f0a0bd1))
* **page-list:** depreciação do atributo ngModel do PageFilter ([4b85e51](https://github.com/po-ui/po-angular/commit/4b85e515fa7c9813f0b463544d843d7385b549ea))
* **rich-text:** adiciona literais em russo ([ec2fa3e](https://github.com/po-ui/po-angular/commit/ec2fa3ec982703e72111591a6cd4c9bda564670c))
* **sync:** cria schematics ngAdd e ng generate ([ce4428f](https://github.com/po-ui/po-angular/commit/ce4428fa8151c833ef130155253d1e007e92a24e))
* **upload:** permite traduzir as literais usando o serviço do i18n ([01c6229](https://github.com/po-ui/po-angular/commit/01c6229c58a424776a70996438aa775916c24609))


### Bug Fixes

* **combo:** corrige erro ao não possuir p-field-value no item retornado ([1f09991](https://github.com/po-ui/po-angular/commit/1f099919e98874a86499b51ed83ee655d23e2528))

## [2.9.0](https://github.com/po-ui/po-angular/compare/v2.8.0...v2.9.0) (2020-07-03)


### Features

* **code-editor:** cria schematics ngAdd ([1b6cf59](https://github.com/po-ui/po-angular/commit/1b6cf599bde8e565e613b3c08ffd2051cd248fb7))
* **page-job-scheduler:** esconde informações sensíveis na confirmação ([a584101](https://github.com/po-ui/po-angular/commit/a584101e888927d7b17224201e3a420fdeeaeb83))
* **storage:** cria schematics ngAdd ([01ca432](https://github.com/po-ui/po-angular/commit/01ca432008431dc4cf212240a18a546b6538d6ad))
* **table:** adiciona loading ao botão carregar mais ([8956850](https://github.com/po-ui/po-angular/commit/8956850fcd1788123b7e1c276d96ea8873ccdc03))

## [2.8.0](https://github.com/po-ui/po-angular/compare/v2.7.0...v2.8.0) (2020-06-26)


### Features

* **avatar:** adiciona evento de clique ([10ce7a6](https://github.com/po-ui/po-angular/commit/10ce7a6d52be85e6c4574cc23e310ee0479a9a60))
* **dynamic-form:** adiciona as propriedades fieldValue e fieldLabel ([abe7a5d](https://github.com/po-ui/po-angular/commit/abe7a5d5b2793e95b3340c18e4de2ab185dff159))
* **table:** adiciona propriedade para remover o gerenciador ([13ff91a](https://github.com/po-ui/po-angular/commit/13ff91a6e18980f5179d4e4947c5881b5dd231b8))
* **table:** adiciona templates para colunas(`PoTableColumnTemplateDirective`) e células (`PoTableCellTemplateDirective`)  ([2e40610](https://github.com/po-ui/po-angular/commit/2e406100bbbcc90a3f5e7cad5ec8ce08fac0cf85)), closes [#97](https://github.com/po-ui/po-angular/issues/97) [#141](https://github.com/po-ui/po-angular/issues/141)


### Bug Fixes

* **dynamic-form:** corrige problema ao atualizar valores no validate ([9300361](https://github.com/po-ui/po-angular/commit/930036146718aebf46f68fc3023464c9e16d5929))
* **page-dynamic-table:** correção no tratamento da ação removeAll ([f62c3ad](https://github.com/po-ui/po-angular/commit/f62c3ad0c5c50f550a1185d6fbda1629ac0b3f54))

## [2.7.0](https://github.com/po-ui/po-angular/compare/v2.6.0...v2.7.0) (2020-06-19)


### Features

* **page-dynamic-edit:** adiciona a propriedade beforeSaveNew ([4c9a88b](https://github.com/po-ui/po-angular/commit/4c9a88be3a6a85d9ef67ad998158b94c37f61106))
* **page-dynamic-table:** adiciona a propriedade beforeDuplicate ([b85c11e](https://github.com/po-ui/po-angular/commit/b85c11e99102935d20e22bfac8aaa8aa88a9f5c3))
* **page-dynamic-table:** adiciona propriedade beforeRemoveAll ([08d05cd](https://github.com/po-ui/po-angular/commit/08d05cd4b1d82f9b58e46f2388f35ef720b55429))
* **table:** permite PoTableColumnLabel.value aceitar números ([463996f](https://github.com/po-ui/po-angular/commit/463996f86360114d410c35f7b8aac43a66009bac))
* **table:** permite PoTableSubtitleColumn.value aceitar números ([8641358](https://github.com/po-ui/po-angular/commit/86413586fae4060fb451b87eed7fd73dde971063))


### Bug Fixes

* **combo:** corrige filtragem dos itens ([8ffa2ff](https://github.com/po-ui/po-angular/commit/8ffa2ffd71557e83a300fa803cc31aeee10c8a02))


### Performance

* **avatar**  adiciona ChangeDetectionStrategy.OnPush ([9383a7a](https://github.com/po-ui/po-angular/commit/9383a7a0f62a62cde29cbb4cc0dc4a0fed8acf6d))


## [2.6.0](https://github.com/po-ui/po-angular/compare/v2.5.0...v2.6.0) (2020-06-12)


### Features

* **dynamic-form:** adiciona a propriedade `order` nos campos ([220414d](https://github.com/po-ui/po-angular/commit/220414da76ababb261ab5145181e71802fbc9e76))
* **dynamic-view:** adiciona a propriedade `order` nos campos ([41f5843](https://github.com/po-ui/po-angular/commit/41f58439bd9d41ab6912ad4927803ce95116cab1))


### Bug Fixes

* **components:** corrige erro ao subir aplicação com Ivy desabilitado ([18688d4](https://github.com/po-ui/po-angular/commit/18688d459eac346046294038099077c493153c87))
* **table:** corrige tooltip em colunas do tipo `label` ([098743f](https://github.com/po-ui/po-angular/commit/098743fa243bb9611d23872c6bbba921a874c514))
* **templates:** corrige erro ao subir aplicação com Ivy desabilitado ([787d6d4](https://github.com/po-ui/po-angular/commit/787d6d42a815ae11fb3f1ac7a65396ffe8e10718))

## [2.5.0](https://github.com/po-ui/po-angular/compare/v2.4.1...v2.5.0) (2020-06-05)


### Features

* **dynamic-search:** permite iniciar os filtros com valores preenchidos ([7e9c1f7](https://github.com/po-ui/po-angular/commit/7e9c1f71850a72e5dfa38add55da859368170068))
* **dynamic-table:** permite iniciar os filtros com valores preenchidos ([df3c7ad](https://github.com/po-ui/po-angular/commit/df3c7ad520d3f03a3448d1ec3d9364d9e249d378))
* **page-dynamic-detail:** adiciona propriedade `beforeEdit` na actions ([35058d1](https://github.com/po-ui/po-angular/commit/35058d13461167b12ea68c2d1726a54250d3b672))
* **page-dynamic-edit:** adiciona o parâmetro id no `beforeSave` e `save`([a64a82e](https://github.com/po-ui/po-angular/commit/a64a82eee2bc9745eb52f363ccd4d17bf49a2a06))
* **page-dynamic-table:** adiciona propriedade `beforeEdit` na actions ([dfb6605](https://github.com/po-ui/po-angular/commit/dfb660569ab59eb4332ad338f65b9d3e32561924))
* **page-dynamic-table:** adiciona propriedade `beforeDetail` na actions ([a588475](https://github.com/po-ui/po-angular/commit/a5884750b716ad1ecf6c07df274b61ecf940f9f1))
* **page-list:** adiciona tamanho no filtro ([5392ba9](https://github.com/po-ui/po-angular/commit/5392ba91f5169df9d8f1008d327744a0cd8bc5be))


### Tests

* **page-dynamic:** corrige testes falhos ([fea7b06](https://github.com/po-ui/po-angular/commit/fea7b06e8cd36500ee0cda43442dfd258d6d3942))

### [2.4.1](https://github.com/po-ui/po-angular/compare/v2.4.0...v2.4.1) (2020-05-29)


### Bug Fixes

* **lookup:** adiciona tratamento para status 404 ([cd59dda](https://github.com/po-ui/po-angular/commit/cd59dda38a1335e891936d4e881a9bb5ebf93ae2))

## [2.4.0](https://github.com/po-ui/po-angular/compare/v2.3.0...v2.4.0) (2020-05-22)


### Features

* **modal:** transforma serviço da modal em um singleton ([23270c5](https://github.com/po-ui/po-angular/commit/23270c57af3d35036a63ca678598462ffc5ab4df))
* **page-dynamic-detail:** adiciona propriedade beforeRemove na actions ([2673e59](https://github.com/po-ui/po-angular/commit/2673e599efeaf8454582f4e5c2c9ff53c9c11663))
* **page-dynamic-edit:** adiciona propriedade beforeCancel na actions ([28e7562](https://github.com/po-ui/po-angular/commit/28e75622ba1d3f126d011333530a3e7b5993feb0))
* **page-dynamic-table:** adiciona propriedade beforeRemove na actions ([4395423](https://github.com/po-ui/po-angular/commit/439542313cf314cb4b8663e04115fa89bf567efd))

## [2.3.0](https://github.com/po-ui/po-angular/compare/v2.2.0...v2.3.0) (2020-05-15)


### Features

* **dynamic-form:** implementa a propriedade `PoDynamicFormField.Format` ([0919ea0](https://github.com/po-ui/po-angular/commit/0919ea0a95eb0ff860798032bedf7d09c30d2219))
* **schematics:** cria biblioteca @po-ui/ng-schematics ([9c85a76](https://github.com/po-ui/po-angular/commit/9c85a768f347704532129e7c986f53db49a99549))


### Bug Fixes

* **multiselect:** corrige exibição do campo de pesquisa ([896d3d7](https://github.com/po-ui/po-angular/commit/896d3d7e76553307d6f2df6c80bce0de7fe7a60e))


### Documentation

* **schematics:** melhora exibição dos links dos schematics disponíveis ([15421db](https://github.com/po-ui/po-angular/commit/15421db76a67dc33d0fff222abfcf1ae0b67ff7d))

## [2.2.0](https://github.com/po-ui/po-angular/compare/v2.1.1...v2.2.0) (2020-05-08)


### Features

* **page-dynamic-detail:** implementa a propriedade `PoPageDynamicDetailActions.beforeBack` ([07a177b](https://github.com/po-ui/po-angular/commit/07a177bb5deab1cc3ee4e13fec7834527b82aa28))
* **page-dynamic-edit:** implementa propriedade `PoPageDynamicEditActions.beforeSave` ([7c6f98d](https://github.com/po-ui/po-angular/commit/7c6f98d959d3597ba7b38e69021bd16c55c52ca3))
* **page-dynamic-table:** implementa propriedade `PoPageDynamicTableActions.beforeNew` ([b535537](https://github.com/po-ui/po-angular/commit/b5355375e51519472a157cb4cf55d95e838aeb4e))

### [2.1.1](https://github.com/po-ui/po-angular/compare/v2.1.0...v2.1.1) (2020-04-30)


### Bug Fixes

* **chart:** corrige erro no Firefox ([7c18319](https://github.com/po-ui/po-angular/commit/7c183199865ce1bf08afbec2534dbc8ee635bc3c))
* **table:** previne selecionar linha ao clicar em ação ([1650c35](https://github.com/po-ui/po-angular/commit/1650c35bf06fd3004edf07348d6dd8b62f61cc89))

## [2.1.0](https://github.com/po-ui/po-angular/compare/v2.0.0...v2.1.0) (2020-04-24)


### Features

* **page-dynamic:** utiliza cache do metadados se servidor não responder nos componentes: ([27099a9](https://github.com/po-ui/po-angular/commit/27099a922098d52c2f5b2b805ec4d7238e1957ce))
- PoPageDynamicTable
- PoPageDynamicEdit
- PoPageDynamicDetail


### Bug Fixes

* **page-job-scheduler:** corrige validação dos parametros ([3615048](https://github.com/po-ui/po-angular/commit/36150481207eb3cd3c19cf9abc7fdbdbdba6af8b))

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
