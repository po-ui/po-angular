# Como Documentar

A documentação é gerada automaticamente com base nos códigos fontes utilizando o processador de documentação 
[Dgeni](https://github.com/angular/dgeni) e o [JSDoc](http://usejsdoc.org/).

Este guia descreve como documentar os códigos-fonte, bem como os padrões de documentação do projeto PO UI. 
A seguir, serão apresentados exemplos e padrões para a criação da documentação.

## Documentação básica

A documentação do código ficará no mesmo arquivo do código-fonte, que será identificado por estar entre os símbolos de comentários: 
`/** */`. Abaixo, segue as tags comuns para documentação geral de componentes, módulos, serviços, entre outros.

### Descrição

Para inserir uma descrição utilize a tag `@description`, conforme o exemplo abaixo:

``` typescript
/**
 * @description
 *
 * Escreva descrições claras, concisas e objetivas de forma que o leitor saiba identificar:
 * - Do que se trata;
 * - Como usar;
 * - Onde é utilizado;
 * - Onde não é utilizado.
 */
```

### Propriedades

Como não existe uma tag específica para propriedades, a descrição deve vir antes da declaração da propriedade 
(linha acima). É importante que as propriedades estejam tipadas, para que o processador possa gerar a documentação especificando 
o tipo da propriedade de forma correta.

Existe também a tag `@description` que define a descrição de uma propriedade, ela é utilizada quando existem mais tags com 
informações na documentação.

Exemplo de documentação das propriedades:

``` typescript
/** Título do Widget. */
@Input('p-title') title: string;

/** 
 * Link de ajuda.
 * Também é possível usar mais de uma linha de comentário como descrição das propriedades.
 */
@Input('p-help') help?: string;

/** Função que será chamada na primeira ação. */
@Output('p-primary-action') primaryAction = new EventEmitter;

// Essa linha não será incluída na documentação.
@Input('p-primary-label') primaryLabel?: string;
```

Para indicar se a propriedade é opcional, basta utilizar o operador `?` (elvis), por exemplo:

```typescript 
@Input('p-optional') optional?: string; 
```

Caso não seja possível definir que a propriedade é opcional com o operador `?` (elvis), por exemplo quando existe um set 
da propriedade, é possível utilizar também a tag `@optional`, conforme exemplificado abaixo:

> Ao utilizar a tag `@optional`, a mesma deve vir antes de todas as outras tags, apenas a tag `@deprecated` pode vir antes
da tag `@optional`.

```typescript
/**
 * @optional
 *
 * @description
 *
 * Indica a quantidade mínima de caracteres que o campo aceita.
 */
@Input('p-minlength') set minLength(minLength: number) {
  this._minLength = minLength;
  this.validators['minlength'] = this.getValidatorMinlength();
  this.updateValidators();
}
```

No caso da propriedade possuir um valor padrão, é necessário adicionar a tag `@default` e utilização de crase simples no valor.
Por exemplo nesse caso onde o valor default da propriedade 'p-size' é 'md'. 

```typescript 
/**
 * @description
 * 
 * Define o tamanho do elemento, pode receber os valores 'lg' e 'md'.
 * 
 * @default `md`
 */
@Input('p-size') size: string; 
```

Quando uma propriedade é depreciada a tag `@deprecated` pode ser utilizada.

```typescript 
/**
 * @deprecated 12.1.21
 *
 * @description
 *
 * Define o botão com padrão de cor "primary" (principal) do contrário vai utilizar as cores "default".
 *
 * > Use a nova propriedade `p-type`.
 */
@Input('p-primary') primary: boolean; 
```

### Documentação Privada

Caso seja necessário ocultar algum comentário de documentação, pode ser utilizada a tag de JSDoc  `@docsPrivate` ou 
um comentário simples com `//`. Por exemplo:

``` typescript
/** @docsPrivate */
description: string;
// Função executada ao clicar na ação.
function?: string | Function;
```

> Ao se referir as propriedades, lembre-se:
>- O `@Input` é uma propriedade `@prop` (property binding).
>- O `@Output` é um evento `@event` (event binding).

Segue apresentação das documentações específicas de cada item da arquitetura:

## Components

### Extends

É possível herdar a descrição e as propriedades de outras classes. Para isso, adicione a tag `@docExtends` e o nome da 
classe que se deseja herdar, conforme o exemplo a seguir:

``` typescript
/**
 * @docExtends PoButtonBaseComponent
 */
```

## Samples

Os samples podem ser incluídos na documentação através da tag `@example` e incluindo o exemplo dentro de `<example></example>`. 
Para a criação ou referência de cada arquivo, utiliza-se a tag `<file> </file>`, conforme o exemplo a seguir:

``` typescript
/**
 * @docExtends PoButtonBaseComponent
 *
 * @example
 *
 * <example name='po-button' title='Tipos e tamanhos do po-button' >
 *  <file name='sample-po-button.component.html'> </file>
 *  <file name='sample-po-button.component.ts'> </file>
 * </example>
 *
 * <example name='po-button-click' title='Eventos de click e botão desabilitado'>
 *  <file name='sample-po-button-click.component.html'> </file>
 *  <file name='sample-po-button-click.component.ts'> </file>
 *  <file name='sample-po-button-click.component.css'> </file>
 * </example>
 *
 * <example name='po-button-labs' title='PO Button Labs'>
 *  <file name='sample-po-button-labs.component.html'> </file>
 *  <file name='sample-po-button-labs.component.ts'> </file>
 * </example>
 */
@Component({
  selector: 'po-button',
  templateUrl: './po-button.component.html',
  providers: []
})
export class PoButtonComponent extends PoButtonBaseComponent { }
```

### Boas práticas

Para criar diversos blocos de exemplo, adicione outras tags do tipo ```<example></example```. Sempre utilize o mesmo padrão 
de nome para os arquivos, como:
``` html
<file name='sample-po-button-click.component.html'> ... </file>
<file name='sample-po-button-click.component.ts'> ... </file>
``` 

Os arquivos referenciados devem ficar na pasta ```/samples``` do componente, conforme 
[exemplo do po-button](https://github.com/po-ui/po-angular/tree/master/projects/ui/src/lib/components/po-button/samples).
 
O padrão de nomenclatura dos samples deve ser `sample-po-<nome>.<type>.<extensao>`, por exemplo:

``` html
<file name='sample-po-button.component.html'> ... </file>
<file name='sample-po-button.component.ts'> ... </file>
```

O nome do componente exportado, o seletor e o template URL também devem seguir o padrão:

``` typescript
@Component({
  selector: 'sample-po-button',
  templateUrl: './sample-po-button.component.html',
})
export class SamplePoButtonComponent {}
``` 

Coloque nomes diferentes para os samples, por exemplo:

``` html
<example name='po-button'> ... </example>
<example name='po-button-click'> ... </example>
<example name='po-button-labs'> ... </example>
```

No caso de mais samples, lembre-se de seguir o mesmo padrão de nome definido para os arquivos:

``` typescript
export class SamplePoButtonClickComponent {
``` 

Também é possível criar uma tag `<file name='sample-po-button.component.css'> </file>` para arquivos .css, como:

``` typescript
stylesUrls: ['./sample-po-button.component.css'],
``` 

> Mantenha a indentação, organização, simplicidade e sempre valide o código do sample, para garantir a qualidade do seu 
código utilize ferramentas de LINT.

> Exemplo de fonte completo:
- [sample-po-button-basic.component.html](https://github.com/po-ui/po-angular/blob/master/projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.html)
- [sample-po-button-basic.component.ts](https://github.com/po-ui/po-angular/blob/master/projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component.ts)

## Interfaces e Enums

### Used By
 
A tag `@usedBy` é utilizada para descrever em quais componentes a documentação da interface/ enums deve aparecer.

``` typescript
/**
 * @usedBy PoPageListComponent, PoPageBaseComponent
 */
```

Exemplo de documentação completa de uma interface:

``` typescript
/**
 * @usedBy PoModalComponent
 *
 * @description
 *
 * Interface que define os botões de ação do componente `po-modal`.
 */
export interface PoModalAction {

  /** Função que será executada ao clicar sobre o botão. */
  action: Function;

  /**
   * Define o tipo *danger* no botão.
   *
   * > Caso a propriedade esteja definida em ambos os botões, apenas o botão primário recebe o tipo *danger*.
   */
  danger?: boolean;

  /** Desabilita o botão impossibilitando que sua ação seja executada. */
  disabled?: boolean;

  /** Rótulo do botão. */
  label: string;

  /** Habilita um estado de carregamento ao botão, desabilitando-o e exibindo um ícone de carregamento à esquerda de seu rótulo. */
  loading?: boolean;

}
```

> Fonte completo: [po-modal-action.interface.ts](https://github.com/po-ui/po-angular/blob/master/projects/ui/src/lib/components/po-modal/po-modal-action.interface.ts)

## Services

### Parâmetros

Para a documentação dos parâmetros do serviço, utiliza-se a tag `@param` dentro dos comentários, seguida do nome do parâmetro, 
do tipo e da descrição, conforme o exemplo abaixo:

``` typescript
/**
 * Emite uma notificação de sucesso.
 *
 * @param notification { PoNotification | string } Objeto com os dados da notificação ou somente a string com a 
 * mensagem da notificação.
 * @param viewContainerRef { ViewContainerRef } Container do componente.
 */
```

## Boas práticas

Nesta seção, serão apresentadas as boas práticas para a documentação no projeto do PO UI.

 - Coloque o comentário de documentação logo abaixo dos imports.
 
 - Ao se referir a um item da arquitetura, como por exemplo um componente, sempre utilize o nome do seletor:
   - Certo: "O componente po-widget".
   - Errado: "O componente Widget".

 - Ordem de precedência na escrita das tags na documentação:
  1. `@docExtends`, `@usedBy` e `@docsPrivate`.
  2. `@description`.
  3. `@example`.

 - Sempre deixe um espaçamento de uma linha entre a tag e o texto, por exemplo:

``` typescript
/** 
 * @description
 *
 * Interface para as ações dos componentes po-page-default e po-page-list.
 */
```

## Gerando o portal

"EM BREVE"
