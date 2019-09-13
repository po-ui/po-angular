# Changelog

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
