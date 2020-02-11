[comment]: # (@label Espaçamento)
[comment]: # (@link guides/spacing)

O PO conta com um set de classes CSS utilitárias para modificação do espaçamento entre elementos HTML.

## Como funciona
Na composição de telas é eventual o ajuste do espaçamento entre os elementos adjacentes envolvidos. Exemplos disso são vistos quando trabalha-se responsivamente um grupo de elementos, como *widgets* (po-widget) ou linhas de um *grid system* (po-row).

Há cinco dimensões disponíveis para definição de **margin** e também para **padding**. A unidade de medida utilizada para elas no CSS é a REM. Basicamente, a REM sempre terá o valor do contexto do ROOT, ou seja, o valor de font-size definido em *body*. Considerando que `font-family: 16px` é o padrão no PO, então `margin: 1rem` também equivale a 16px. As variantes das classes de margem e padding vão de 0.5rem (8px) a 2.5rem (40px).

## Definições

Os nomes das classes usam o formato: 
* `po-<propriedade>-<tamanho-espaçamento>` para definição em todos os lados do elemento. Por exemplo: `po-m-1`; 
* `po-<propriedade><lado>-<tamanho-espaçamento>` para apenas um dos lados. Por exemplo: `po-ml-1`;
* `po-<propriedade><lado>-<tamanho-tela>-<tamanho-espaçamento>` para tamanhos específicos de telas. Por exemplo: `po-ml-md-1`.

As definições de propridades são:
* `m` - para classes de ajuste de `margin`;
* `p` - para classes de ajuste de `padding`.

As definições de lados são:

* `t` - para ajustes de `margin-top` ou `padding-top`;
* `r` - para ajustes de `margin-right` ou `padding-right`;
* `b` - para ajustes de `margin-bottom` ou `padding-bottom`;
* `l` - para ajustes de `margin-left` ou `padding-left`;
* *Para todos os lados basta ignorar essa definição*;

As definições de tamanho de tela são:

* `sm` - para telas com tamanho máximo de `480px`;
* `md` - para telas com tamanho a partir de `481px`;
* `lg` - para telas com tamanho a partir de `961px`;
* `xl` - para telas com tamanho a partir de `1367px`.

As definições de tamanhos disponíveis são:

* `0` - `margin` ou `padding` com valor igual a `0`; 
* `1` - `margin` ou `padding` com valor igual a `8px`; 
* `2` - `margin` ou `padding` com valor igual a `16px`; 
* `3` - `margin` ou `padding` com valor igual a `24px`; 
* `4` - `margin` ou `padding` com valor igual a `32px`; 
* `5` - `margin` ou `padding` com valor igual a `40px`; 

> Estas classes podem ser usadas instalando o `@portinari/style` do **PO**. Veja mais em [Como instalar o PO](/guides/how-install).

## Exemplos

Alguns exemplos de aplicação das classes:

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-m-5">po-m-5</div>
  </div>
</div>

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-ml-5">po-ml-5</div>
  </div>
</div>

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-ml-md-5">po-ml-md-5</div>
  </div>
</div>

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-ml-lg-5">po-ml-lg-5</div>
  </div>
</div>

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-ml-5 po-mr-5">po-ml-5 po-mr-5</div>
  </div>
</div>

<div class="guides-spacing-sample-container po-mt-1 po-mb-1">
  <div class="guides-spacing">
    <div class="po-ml-md-5 po-ml-xl-0">po-ml-md-5 po-ml-xl-0</div>
  </div>
</div>

```html
<div class="po-m-5">po-m-5</div>
<div class="po-ml-5">po-ml-5</div>
<div class="po-ml-md-5">po-ml-md-5</div>
<div class="po-ml-lg-5">po-ml-lg-5</div>
<div class="po-ml-5 po-mr-5">po-ml-5 po-mr-5</div>
<div class="po-ml-md-5 po-ml-xl-0">po-ml-md-5 po-ml-xl-0</div>
```

> Quando duas margens verticais entrarem em contato entre si, ocorrerá um [colapso de margem](https://www.w3schools.com/cssref/pr_margin.asp). Se uma margem for maior que a outra, esta sobrescreverá o valor da menor, sobrando apenas a definição de margem com maior valor.

> É considerada uma boa prática de CSS trabalhar, sempre que possível, apenas com definições de `margin-bottom` para espaçamento entre elementos adjacentes.

