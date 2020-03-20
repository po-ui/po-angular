# Boas Práticas

## Conteúdo

- [Introdução](#introduction)
- [Fonte](#source)
- [Documentação](#documentation)
- [Propriedades](#properties)
- [Samples](#samples)
- [Testes unitários](#tests)
- [Formatação](#format)

<a id="introduction"></a>
## Introdução
Este guia tem por objetivo definir as boas práticas de código, documentação, como criar samples e testes unitários.

Importante quando contribuir ficar atento aos pontos levantados neste guia, para o processo de aprovação ser mais rápido e eficiente.

<a id="source"></a>
## Fonte
- Imports:
  - Separar em grupos
    - Angular
    - Terceiros
    - Componentes / Interfaces externos (po)
    - Componentes / Interfaces internos (po)

- Atributos e métodos (ordem)
  - Atributos
    - Propriedades privadas dos getters e setters
      - Use _ (underscore) nos nomes
      - Propriedades públicas (quando necessário use o readonly)
      variáveis genéricas
      - Propriedades privadas de uso da classe
      - Dispensa o uso do _ (underscore)- Decorators
      - ViewChild/ViewChildren
      - Input
      - Output
      - Getters and Setters
  - Métodos:
    - Constructor
    - Funções do ciclo do angular (ngOnInit, ngAfterCheck… )
    - @HostListener
    - Funções públicas
    - Funções privadas

Devem seguir o seguinte modelo:
```
private _prop: type = ;

/** Documentação */
@Input(’p-prop’) set prop(value: type) {
  this._prop = value;
}

get prop(): type {
  return this._prop;
}
```

Onde `prop` é o nome da propriedade e `type` é o tipo da propriedade, sempre declare um valor default para propriedades opcionais.

- Usar _ para a variável interna e privada
- Declarar a propriedade privada no início da classe
- Declare sempre o set antes do get, propriedades do tipo readonly não precisam de set
- Para propriedades booleanas utilize o decorator @InputBoolean

<a id="documentation"></a>
## Documentação
- Documentação clara sobre o que é o componente e o que mesmo faz.
- Documente o que o mesmo não faz, e se possível faça referência ao componente que deve ser usado no lugar.
- Escreva sobre os comportamentos implementados e como os mesmos devem ser usados (ex, tecla tab executa ação x, o del apaga todo o conteúdo, etc).
- Converse com a equipe de UX sobre o comportamento dos componentes.
- Seção de Boas práticas
- Utilize sujeito oculto, escrever de forma impessoal e formal
- Evite usar “Você deve …”, “você pode…”
- Evite erros ortográficos e erros de concordância, utilize um corretor ortográfico se necessário.

<a id="properties"></a>
## Propriedades

- Quando existir uma lista de valores pré definidos exibi-los em lista.
- Verificar se a propriedade já foi documentada em outro componente e validar se os mesmo estão bem descritos.
- Não use a descrição da propriedade para informar qual será o valor default, use a tag @default
- Não especifique na descrição que o campo é opcional, use a tag @optional ou o operador "?", opte sempre que possível pela tag @optional.
- Evite repetir texto do tipo “a propriedade x” várias vezes. (CTRL C + CTRL V)
- Não use “aspas duplas” para os valores, use crase simples para dar destaque a um valor ou nome de propriedade, use crases triplas apenas para trechos de código.

- Para valores default utilize crase simples

- ``` @default `sm` ```
- Para arrays utilize Array ao invés de type[]
  - ``` p-items: Array = []; // BOM ```
  - ``` p-items: any[] = []; // RUIM ```

- Em casos que a propriedade deve ser usada em conjunto com outra propriedade / componente, deve ser exibido algum trecho de código exemplificando o uso da propriedade.
- Quando for necessário / possível utilize links principalmente quando citar outros componente / referências (inclusive do angular).

<a id="samples"></a>
## Samples

- Use as classes do System Grid sempre que necessário e de forma correta.
- Verifique se seu exemplo é responsivo.
- Use inglês e não português para as variáveis e para os textos exibidos nos exemplos.
- Não use p-auto-focus nos samples.
- Separar os samples por pastas.

- Propriedades do tipo “label” devem usar o nome do componente
  - PO Button”
- Propriedades do tipo boolean devem ser usadas sem valor sempre que possível
  - ``` p-required // BOM ```
  - ``` p-required=“true” // RUIM ```
- Propriedades do tipo boolean podem ser agrupadas com um `po-checkbox-group`
  - Quando possível quebrar em mais de um grupo
- Propriedades dos elementos devem seguir a seguinte ordem:
  - class (CSS)
  - name (nome do componente quando houver necessidade, inputs, buttons, etc…)
  - ngModel (quando existir)
  - propriedades sem bind
  - propriedades com bind
  - eventos
```html
<po-button
class="po-sm-12"
[p-disabled]="properties.includes('disabled')"
[p-icon]="icon"
[p-label]="label"
[p-small]="properties.includes('small')"
[p-type]="type"
(p-click)="buttonClick()">

<po-input
class="po-md-6"
name="label"
[(ngModel)]="label"
p-clean
p-placeholder="Enter a label for the button"
p-required
[p-label]=“labelTitle”
(p-change)=“change()”>
```

- Usar aspas duplas para incluir o sample na documentação.
- Pular uma linha após tag @example
- Pular linha entre os samples
- incluir um espaço entre pois o dgeni não processa tags “vazias”
- Sempre incluir o título do sample iniciando com o nome do componente “PO Componente …”
  - PO Avatar Basic
  - PO Avatar Labs
  - PO Avatar - Caso de Uso
- **CUIDADO**: Não incentive práticas ruins, lembre-se nossos exemplos serão base para muitos desenvolvedores.

**Tipos que deve ser implementados**

- Basic (1): Deve ter o mínimo necessário para uso do componente, deve ser o mais clean possível (HTML e TS) e sem auxílio de nenhum outro elemento HTML.
  - Componente;

- Labs (1): Deve ser dinâmico e permitir ao usuário explorar as propriedades e os comportamentos do componente.

  - Componente: Deve ter o componente separado com / ou outros componentes para auxiliar na demonstração do comportamento do componente;
  - Separador: Usar um ```<hr>``` para separar as duas partes;
  - `po-info` com o model e os eventos ;
  - Separador: Usar um ```<hr>``` para separar as duas partes;
  - Propriedades: Deve ser composto por inputs (entre outros componentes) que auxiliarão na alteração do comportamento do componente. Use a propriedade p-required quando a propriedade for obrigatório.
  - Propriedades devem ter os valores default de acordo com a documentação
  - Criar função de restore do sample
  - Chamar `restore()` no `ngOnInit` e não no construtor.
  - Incluir botão do restore sempre ao final do sample.
  - Usar button com o tipo “default”
```
<po-button
class="po-md-3"
p-label="Sample Restore"
(p-click)="restore()">


ngOnInit() {
this.restore();
}

restore() {
this.src = 'http://lorempixel.com/144/144/cats';
this.size = undefined;
}
```
- Caso de Uso (0..n): Podem ser exemplos de uso do componente dentro de algum contexto, por exemplo:
  - uso do `po-email` dentro de um formulário de contato ou assinatura de newsletter.
  - Criatividade é o limite.
  - Os exemplos mais complexos devem abordar situações reais para melhorar o entendimento do uso do componente.
  Classes / Components

- Não use chaves vazia com quebra de linhas
```
export class SamplepoAvatarBasicComponent { } // BOM, não esqueça do espaço
export class SamplepoAvatarBasicComponent { // RUIM
}
```

- Sempre coloque uma linha em branco antes das declarações das propriedades / métodos da classe e no final da classe;
```
export class SamplepoButtonBasicComponent {
// LINHA EM BRANCO
text: string;

onClick() {
alert('po Button!');
}
// LINHA EM BRANCO
}
```

<a id="tests"></a>
## Testes Unitários

- Base
  - Testar a instancia correta do componente
  - Testar as propriedades (getters and setters)
  - Se uma propriedade usar uma interface, validar os tipos dessa interface com typeof (po-button-group)
  - Para os testes use a função expectPropertiesValues (leia documentação no fonte).

<a id="format"></a>
## Formatação

- O projeto utiliza o formatador [Prettier](https://prettier.io/) para realizar a formatação automática dos arquivos.
  - A ferramenta já está configurada no projeto e ela será executada no momento do commit dos fontes.
  - Na criação do Pull Request será verificado automaticamente se a formatação foi respeitada.
