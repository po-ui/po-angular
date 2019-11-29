# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.18.0](https://github.com/portinariui/portinari-angular/compare/v1.17.0...v1.18.0) (2019-11-29)


### Bug Fixes

* **grid:** remove arquivos css ([137c96e](https://github.com/portinariui/portinari-angular/commit/137c96e))


### Features

* **checkbox:** novo componente ([bed9970](https://github.com/portinariui/portinari-angular/commit/bed9970))
* **rich-text:** permite que o usuário edite um link adicionado ([a4f4970](https://github.com/portinariui/portinari-angular/commit/a4f4970))
* **tree-view:** adiciona a opção de seleção de item ([3033b40](https://github.com/portinariui/portinari-angular/commit/3033b40))



## [1.17.0](https://github.com/portinariui/portinari-angular/compare/v1.16.0...v1.17.0) (2019-11-25)


### Bug Fixes

* **table:** corrige exibição dos ícones de acordo com o valor da coluna ([aad0013](https://github.com/portinariui/portinari-angular/commit/aad0013))


### Features

* **datepicker:** permite definir formato de data ([7477b6d](https://github.com/portinariui/portinari-angular/commit/7477b6d))



## [1.16.0](https://github.com/portinariui/portinari-angular/compare/v1.15.0...v1.16.0) (2019-11-18)


### Features

* **chart:** adiciona gráfico do tipo gauge ([a6ffb69](https://github.com/portinariui/portinari-angular/commit/a6ffb69))
* **tree-view:** novo componente ([5ee70df](https://github.com/portinariui/portinari-angular/commit/5ee70df))



## [1.15.0](https://github.com/portinariui/portinari-angular/compare/v1.14.0...v1.15.0) (2019-11-08)


### Bug Fixes

* **page-job-scheduler:** corrige altura do container ([a8aaae8](https://github.com/portinariui/portinari-angular/commit/a8aaae8))


### Features

* **button:** implementa ChangeDetectionStrategy.OnPush ([91b3189](https://github.com/portinariui/portinari-angular/commit/91b3189))
* **combo:** permite customizar a lista de opções ([b0afdf9](https://github.com/portinariui/portinari-angular/commit/b0afdf9))



## [1.14.0](https://github.com/portinariui/portinari-angular/compare/v1.13.1...v1.14.0) (2019-11-01)


### Features

* **popover:** permite informar o target dinamicamente ([3c0ff80](https://github.com/portinariui/portinari-angular/commit/3c0ff80))
* **table:** adiciona gerenciador de colunas ([35d1157](https://github.com/portinariui/portinari-angular/commit/35d1157))



### [1.13.1](https://github.com/portinariui/portinari-angular/compare/v1.13.0...v1.13.1) (2019-10-25)


### Bug Fixes

* **chart:** corrige animação em loop em series com valores zerados ([5fedcd5](https://github.com/portinariui/portinari-angular/commit/5fedcd5))
* **url:** corrige validação de links que contenham caracteres maiúsculos ([3b45ccb](https://github.com/portinariui/portinari-angular/commit/3b45ccb))



## [1.13.0](https://github.com/portinariui/portinari-angular/compare/v1.12.0...v1.13.0) (2019-10-18)


### Bug Fixes

* **page-login:** corrige literais customizadas ao trocar de idioma ([7538c6b](https://github.com/portinariui/portinari-angular/commit/7538c6b))


## Code Refactoring

* **table:** melhoria na componentização do componente interno `po-table-column-icon` ([98009bd](https://github.com/portinariui/portinari-angular/commit/98009bd))


### Features

* **dynamic-view:** permite definir cores e ícones para o tipo tag ([95eca9d](https://github.com/portinariui/portinari-angular/commit/95eca9d))



## [1.12.0](https://github.com/portinariui/portinari-angular/compare/v1.11.0...v1.12.0) (2019-10-11)


### Bug Fixes

* **page-dynamic-edit:** alterado para `{ static: false}` no ViewChild do PoDynamicFormComponent ([b9cf19b](https://github.com/portinariui/portinari-angular/commit/b9cf19b))


### Features

* **rich-text:** permite inclusão de links ([238385b](https://github.com/portinariui/portinari-angular/commit/238385b))
* **tag:** adiciona a propriedade `p-inverse` que permite inversão de cores ([338dfd0](https://github.com/portinariui/portinari-angular/commit/338dfd0))



## [1.11.0](https://github.com/portinariui/portinari-angular/compare/v1.10.0...v1.11.0) (2019-10-04)


### Bug Fixes

* **dynamic-form:** `name` não estava sendo repassado corretamente ao componente `po-lookup` ([f924060](https://github.com/portinariui/portinari-angular/commit/f924060))
* **readme:** fixada a versão do angular-cli@8.0.0 ([8a95f2e](https://github.com/portinariui/portinari-angular/commit/8a95f2e))
* **table:** utiliza ordenação local mesmo utilizando o evento `p-sort-by` ([1cacc4d](https://github.com/portinariui/portinari-angular/commit/1cacc4d))


### Features

* **accordion:** novo componente ([ca05d1b](https://github.com/portinariui/portinari-angular/commit/ca05d1b))
* **lookup:** inclui coluna de ordenação na chamada do serviço ([1cacc4d](https://github.com/portinariui/portinari-angular/commit/1cacc4d))
* **notification:** permite alterar tempo de duração da notificação através da propriedade `PoNotification.duration` ([23eb81a](https://github.com/portinariui/portinari-angular/commit/23eb81a))
* **page-dynamic-table:** inclui coluna de ordenação na chamada do serviço([a9718f6](https://github.com/portinariui/portinari-angular/commit/a9718f6))
* **rich-text:** permite inclusão de imagem ([303bf04](https://github.com/portinariui/portinari-angular/commit/303bf04))
* **storage:** adiciona `po-loki-driver` no storage ([0cf3222](https://github.com/portinariui/portinari-angular/commit/0cf3222))
* **tag:** permite o uso da paleta de cores e ícones através das propriedade `p-color`e `p-icon` ([13587a4](https://github.com/portinariui/portinari-angular/commit/13587a4))
* **ui:** adiciona suporte para o idioma russo nos componentes: ([d5ae905](https://github.com/portinariui/portinari-angular/commit/d5ae905))
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

## [1.10.0](https://github.com/portinariui/portinari-angular/compare/v1.9.0...v1.10.0) (2019-09-27)


### Bug Fixes

* **page-login:** corrige erro ao usar `title` e `loginHint` com `undefined` ([20a36f9](https://github.com/portinariui/portinari-angular/commit/20a36f9))
* **toolbar:** corrige o funcionamento sem o `p-profile` ([c26f85a](https://github.com/portinariui/portinari-angular/commit/c26f85a))


### Features

* **upload:** adiciona propriedade `p-directory`, possibilitando envio de pastas ([6e6de71](https://github.com/portinariui/portinari-angular/commit/6e6de71))



## [1.9.0](https://github.com/portinariui/portinari-angular/compare/v1.8.1...v1.9.0) (2019-09-20)


### Features

* **chart:** adiciona gráfico do tipo donut ([f4403cc](https://github.com/portinariui/portinari-angular/commit/f4403cc))



### [1.8.1](https://github.com/portinariui/portinari-angular/compare/v1.8.0...v1.8.1) (2019-09-13)


### Bug Fixes

* **checkbox-group:** corrige texto sobreposto quando há quebra de linha com textos grandes. ([a04f569](https://github.com/portinariui/portinari-angular/commit/a04f569))
* **checkbox-group:** corrige inconsistência de uso no Edge e IE ([8319b3c](https://github.com/portinariui/portinari-angular/commit/8319b3c))
* **table:** remove scroll duplo do eixo y no IE ao utilizá-lo dentro do lookup ([d09e58d](https://github.com/portinariui/portinari-style/commit/d09e58d))


## [1.8.0](https://github.com/portinariui/portinari-angular/compare/v1.7.0...v1.8.0) (2019-09-06)


### Bug Fixes

* **combo:** corrige links quebrados dos exemplos de heróis ([18b9539](https://github.com/portinariui/portinari-angular/commit/18b9539))
* **multiselect:** corrige comportamento do componente no IE, que ao informar valores grandes na propriedade `p-options`
não abria a lista supensa ([d82a6dc](https://github.com/portinariui/portinari-angular/commit/d82a6dc))


### Features

* **button:** implementa o método `focus` que habilita o foco no componente ([71ccfc8](https://github.com/portinariui/portinari-angular/commit/71ccfc8))
* **fields:** implementa o método `focus` que habilita o foco nos componentes: ([015f617](https://github.com/portinariui/portinari-angular/commit/015f617))
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

* **progress:** adiciona evento o `p-retry` que habilita um ícone de tentar novamente ([c06e7c9](https://github.com/portinariui/portinari-angular/commit/c06e7c9))
* **rich-text:** possibilita que usuário mude a cor do texto ([3e11fe7](https://github.com/portinariui/portinari-angular/commit/3e11fe7))
* **upload:** utiliza o componente `po-progress` como barra de progresso e deprecia as propriedades: `cancel`, `deleteFile` e `tryAgain` da interface `PoUploadLiterals` ([9593412](https://github.com/portinariui/portinari-angular/commit/9593412))



## [1.7.0](https://github.com/portinariui/portinari-angular/compare/v1.6.0...v1.7.0) (2019-08-30)


### Features

* **fields:** implementa a propriedade `no-autocomplete` nos campos de entrada ([881d7b1](https://github.com/portinariui/portinari-angular/commit/881d7b1))
* **rich-text:** adiciona eventos de mudança de valores ([1b7444c](https://github.com/portinariui/portinari-angular/commit/1b7444c))
* **table:** adiciona evento para ordenação de colunas ([4dbd51a](https://github.com/portinariui/portinari-angular/commit/4dbd51a))



## [1.6.0](https://github.com/portinariui/portinari-angular/compare/v1.5.0...v1.6.0) (2019-08-23)


### Bug Fixes

* **datepicker:** corrige foco no campo após selecionar data no mobile ([fbb61b8](https://github.com/portinariui/portinari-angular/commit/fbb61b8))
* **portinari:** corrige a falha no lint do projeto ([4ee6672](https://github.com/portinariui/portinari-angular/commit/4ee6672))


### Features

* **upload:** exibe restrições de arquivos ([fccbb10](https://github.com/portinariui/portinari-angular/commit/fccbb10))


### Tests

* **navbar:** corrige a falha no teste do método `validateMenuLogo` ([6f9d767](https://github.com/portinariui/portinari-angular/commit/6f9d767))



## [1.5.0](https://github.com/portinariui/portinari-angular/compare/v1.4.0...v1.5.0) (2019-08-16)

### Bug Fixes

* **menu:** aplica largura de 100% na area destinada ao menu-header-template ([23607f9](https://github.com/portinariui/portinari-style/commit/23607f9))

### Features

* **page-list:** traduz "busca avançada" com a linguagem utilizada no I18n ([eee5463](https://github.com/portinariui/portinari-angular/commit/eee5463))
* **tabs:** habilita scroll horizontal das tabs em dispositivos moveis ([30ed4ad](https://github.com/portinariui/portinari-angular/commit/30ed4ad))



## [1.4.0](https://github.com/portinariui/portinari-angular/compare/v1.3.1...v1.4.0) (2019-08-09)


### Bug Fixes

* **datepicker:** corrige disparo do p-change ([9cbe283](https://github.com/portinariui/portinari-angular/commit/9cbe283))
* **decimal:** impede a digitação de valores inválidos ([d8d2568](https://github.com/portinariui/portinari-angular/commit/d8d2568))
* **portinari-app:** possibilita a execução do projeto app localmente no IE ([c9baac4](https://github.com/portinariui/portinari-angular/commit/c9baac4))


### Features

* **progress:** cria o componente po-progress ([c3884bf](https://github.com/portinariui/portinari-angular/commit/c3884bf))



### [1.3.1](https://github.com/portinariui/portinari-angular/compare/v1.3.0...v1.3.1) (2019-08-02)


### Bug Fixes

* **build:** corrige erros de compilação com --prod ([9081b4d](https://github.com/portinariui/portinari-angular/commit/9081b4d))
* **samples:** altera o caminho dos serviços utilizados nos samples ([e8618c7](https://github.com/portinariui/portinari-angular/commit/e8618c7))



## [1.3.0](https://github.com/portinariui/portinari-angular/compare/v1.2.0...v1.3.0) (2019-07-26)


### Bug Fixes

* **app:** corrige os erros ao utilizar os samples ([1345cfb](https://github.com/portinariui/portinari-angular/commit/1345cfb))
* **modal:** corrige fechamento da modal ao selecionar opção no combo ([a5ebc3b](https://github.com/portinariui/portinari-angular/commit/a5ebc3b))
* **table:** corrige sobreposição do popup em dispositivos mobile iOS ([cf6764b](https://github.com/portinariui/portinari-angular/commit/cf6764b))


### Features

* **upload:** permite que o componente aceite drag and drop ([ef47ca8](https://github.com/portinariui/portinari-angular/commit/ef47ca8))



## [1.2.0](https://github.com/portinariui/portinari-angular/compare/v1.1.1...v1.2.0) (2019-07-19)


### Bug Fixes

* **loading:** trata o ícone de carregamento para conexões 3g ([ea3ba0a](https://github.com/portinariui/portinari-angular/commit/ea3ba0a))
* **table:** corrige a exibição do botão de visualizar legenda ([535a1af](https://github.com/portinariui/portinari-angular/commit/535a1af))


### Features

* **navbar:** remove a logo do menu utilizado com navbar ([6771395](https://github.com/portinariui/portinari-angular/commit/6771395))


### Tests

* **page-blocked-user-contacts:** remove o x do describe ([2ad40b7](https://github.com/portinariui/portinari-angular/commit/2ad40b7))



### [1.1.1](https://github.com/portinariui/portinari-angular/compare/v1.1.0...v1.1.1) (2019-07-12)


### Bug Fixes

* **lookup:** corrige ordenação das tabelas ([ee62bde](https://github.com/portinariui/portinari-angular/commit/ee62bde))
* **lookup:** corrige descrição dos registros ([ca9b4b4](https://github.com/portinariui/portinari-angular/commit/ca9b4b4))
* **sync:** corrige importação do thf-schema ([6e945ae](https://github.com/portinariui/portinari-angular/commit/6e945ae))

### Tests

* **navbar:** adiciona testes unitários ao componente ([4708a87](https://github.com/portinariui/portinari-angular/commit/4708a87))
* **rich-text:** adiciona testes unitários no componente ([89b6e44](https://github.com/portinariui/portinari-angular/commit/89b6e44))


## 1.1.0 (2019-07-05)


### Bug Fixes

* **po-language:** configuração do providedIn ([472464f](https://github.com/portinariui/portinari-angular/commit/472464f))
* **select:** corrigido scroll dos itens para quando houver valor atribuído no ngModel ([84da5f4](https://github.com/portinariui/portinari-angular/commit/84da5f4))
* **sync:** ajustes nas importações ([c5d58ee](https://github.com/portinariui/portinari-angular/commit/c5d58ee))


### Build System

* adiciona lint para os commits e cria tarefa de release ([f864873](https://github.com/portinariui/portinari-angular/commit/f864873))


### Features

* **page-login:** opção de tradução para o idioma russo ([00c93b8](https://github.com/portinariui/portinari-angular/commit/00c93b8))
