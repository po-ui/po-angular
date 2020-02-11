[comment]: # (@label Grid System)
[comment]: # (@link guides/grid-system)

O [Grid System](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) é uma estrutura
que permite combinar os elementos em linhas ou em colunas. Esta estrutura costuma seguir um padrão de configuração, determinando:

- Um número máximo de colunas que uma tela pode ser dividida.
- Padrão na nomenclatura das classes que referem-se as colunas.
- As colunas podem ser envolvidas por uma classe que delimita e representa a linha.
- O somatório dos números das colunas de uma linha deve ser igual ao número máximo de colunas. Por exemplo, supondo que o
número máximo seja igual a 12 colunas, então: po-md-5 + po-md-7 = 12 colunas.

O Grid System do PO, trabalha com a divisão máxima da tela em 12 colunas, ou seja, o somatório de todas as colunas dentro
de uma linha deve ser igual a 12. No exemplo abaixo, temos 12 colunas de tamanho igual a 1. Cada uma dessas colunas tem o
tamanho igual a 1/12 do seu elemento pai. 

<div class="po-row guides-grid-system-box">
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
  <div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
</div>

``` html
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
<div class="po-xl-1 po-lg-1 po-md-1 po-sm-1"></div>
```

> Estas classes podem ser usadas instalando o `@portinari/style` do **PO**. Veja mais em [Como instalar o PO](/guides/how-install).

## Nomenclatura das classes e tamanhos das telas 

A nomenclatura das classes das colunas seguem o padrão: `po-<tamanho-tela>-<tamanho-coluna>`, como por exemplo a classe
`po-md-6` que representa uma coluna com tamanho médio e que utiliza 6/12 da largura do elemento pai. Para os intervalos
de tamanhos, tem-se o padrão:

- `po-sm-*` para telas com tamanho máximo de 480px.
- `po-md-*` para telas com tamanho entre 481px e 960px.
- `po-lg-*` para telas com tamanho entre 961px e 1366px.
- `po-xl-*` para telas com tamanho mínimo de 1367px.

Para dividir a tela em duas colunas do mesmo tamanho, basta criar dois elementos com classes de tamanho 6, conforme o próximo
exemplo:

<div class="po-row guides-grid-system-box">
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
</div>

``` html
<div class="po-row">
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
</div>
```

Outro exemplo para criar duas colunas, sendo uma com tamanho 8 e outra com tamanho 4:

<div class="po-row guides-grid-system-box">
  <div class="po-xl-8 po-lg-8 po-md-8 po-sm-8"></div>
  <div class="po-xl-4 po-lg-4 po-md-4 po-sm-4"></div>
</div>

``` html
<div class="po-xl-8 po-lg-8 po-md-8 po-sm-8"></div>
<div class="po-xl-4 po-lg-4 po-md-4 po-sm-4"></div>
```

Ao definir apenas a classe `po-md-*`, os tamanhos de tela menores que po-md assumem o tamanho de coluna igual a 12 e os
maiores o tamanho definido no `*`. Da mesma forma ocorre com a classe `po-lg-*`, os tamanhos menores ficam igual a 12 e
os maiores igual ao tamanho do `*`.

> Este comportamento limita-se apenas as classes `po-md-*` e `po-lg-*`.

O exemplo abaixo mostra este comportamento, para isso redimensione a tela do navegador.

<div class="po-row guides-grid-system-box">
  <div class="po-md-6">po-md-6</div>
  <div class="po-md-6">po-md-6</div>
</div>

<div class="po-row guides-grid-system-box">
  <div class="po-lg-4">po-lg-4</div>
  <div class="po-lg-4">po-lg-4</div>
  <div class="po-lg-4">po-lg-4</div>
</div>

``` html
<div class="po-row">
  <div class="po-md-6">po-md-6</div>
  <div class="po-md-6">po-md-6</div>
</div>

<div class="po-row">
  <div class="po-lg-4">po-lg-4</div>
  <div class="po-lg-4">po-lg-4</div>
  <div class="po-lg-4">po-lg-4</div>
</div>
```

> A classe para envolver as colunas é chamada de `po-row`, sendo o seu uso opcional. Normalmente sendo utilizada para poder
organizar telas que contém diversas linhas. 

## Responsividade

Para alterar a largura das colunas conforme o tamanho da tela, é necessário determinar que tamanho estará a coluna em cada
tamanho de tela. Supondo que se tenha uma tela com duas colunas do mesmo tamanho, conforme o exemplo abaixo:

<div class="po-row guides-grid-system-box">
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
</div>

``` html
<div class="po-row">
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
  <div class="po-xl-6 po-lg-6 po-md-6 po-sm-6"></div>
</div>
```

No entanto, quando a tela diminui os elementos no interior da coluna podem não ficar bem estruturados, então podemos determinar
que quando a tela estiver pequena estas duas colunas terão a largura total do seu elemento pai, da seguinte forma:

<div class="po-row guides-grid-system-box">
  <div class="po-xl-6 po-lg-6 po-md-12 po-sm-12"></div>
  <div class="po-xl-6 po-lg-6 po-md-12 po-sm-12"></div>
</div>

``` html
<div class="po-row">
  <div class="po-xl-6 po-lg-6 po-md-12 po-sm-12"></div>
  <div class="po-xl-6 po-lg-6 po-md-12 po-sm-12"></div>
</div>
```

Se a tela for redimensionada, as colunas irão mudar de tamanho. Desta mesma forma, pode-se determinar e estruturar diversos
tamanhos de colunas para cada tamanho de tela.

> Consulte o Style Guide da Portinari, para saber o número máximo de colunas por tamanho de tela.

## Classes visible e hidden

Para poder deixar um determinado tamanho visível ou não, existem disponíveis as classes `po-visible-[tamanho]` e `po-hidden-[tamanho]`.

### po-visible-[tamanho]

Esta classe determina que o elemento será visível na tela quando estiver em determinado tamanho. 
Ao fazer essa declaração, o elemento assume a propriedade `display: block` e os demais tamanhos 
ficarão invisíveis `(display: none)`. Existem duas formas de descrever a classe po-visible. Uma forma seria a 
definição de visibilidade separado da definição do tamanho, como `po-visible-sm po-sm-6`. 
Outra forma seria a opção de utilizar a definição junto com a declaração do tamanho, como: `po-visible-sm-6`.

Abaixo tem-se um exemplo onde só irá aparecer a `<div>` quando atingir o tamanho especificado no po-visible. 

> Para isso, redimensione a tela do seu navegador.

<div class="guides-grid-system-containers">
  <div class="po-visible-sm po-sm-12">Visível no tamanho 'sm'</div>
  <div class="po-visible-md po-md-12">Visível no tamanho 'md'</div>
  <div class="po-visible-lg-12">Visível no tamanho 'lg'</div>
  <div class="po-visible-xl-12">Visível no tamanho 'xl'</div>
</div>


``` html
<div class="po-visible-sm po-sm-12">Visível no tamanho 'sm'</div>
<div class="po-visible-md po-md-12">Visível no tamanho 'md'</div>
<div class="po-visible-lg-12">Visível no tamanho 'lg'</div>
<div class="po-visible-xl-12">Visível no tamanho 'xl'</div>
```

> Atenção: ao utilizar esta classe, o elemento recebe a propriedade `display` com o valor `block`. 

### po-hidden-[tamanho]

Ao utilizar esta classe, o elemento ficará invisível `(display: none)` ao atingir o tamanho especificado. 
Por exemplo, as `<div>` abaixo irão desaparecer quando atingir o tamanho especificado no po-hidden. 

> Para isso, redimensione a tela do seu navegador.

<div class="guides-grid-system-containers">
  <div class="po-hidden-sm po-md-12 po-lg-12 po-xl-12">Ficará invisível no tamanho 'sm'</div>
  <div class="po-hidden-md po-sm-12 po-lg-12 po-xl-12">Ficará invisível no tamanho 'md'</div>
  <div class="po-hidden-lg po-sm-12 po-md-12 po-xl-12">Ficará invisível no tamanho 'lg'</div>
  <div class="po-hidden-xl po-sm-12 po-md-12 po-lg-12">Ficará invisível no tamanho 'xl'</div>
</div>

``` html
<div class="po-hidden-sm po-md-12 po-lg-12 po-xl-12">Ficará invisível no tamanho 'sm'</div>
<div class="po-hidden-md po-sm-12 po-lg-12 po-xl-12">Ficará invisível no tamanho 'md'</div>
<div class="po-hidden-lg po-sm-12 po-md-12 po-xl-12">Ficará invisível no tamanho 'lg'</div>
<div class="po-hidden-xl po-sm-12 po-md-12 po-lg-12">Ficará invisível no tamanho 'xl'</div>
```

## Deslocamento de colunas (po-offset)

É possível fazer o deslocamento das colunas para a direita utilizando a classe `po-offset-[ sm | md | lg | xl ]-[tamanho]`.
Quando esta classe é definida em um elemento, o mesmo receberá uma margem à esquerda quando atingir o tamanho de tela indicado,
como o `sm` ou `md`. A quantidade de deslocamento é definida por número de colunas, assim como no tamanho. Então, para ter
um deslocamento com tamanho 2 no tamanho de tela `sm`, basta escrever: `po-offset-sm-2`.

No exemplo abaixo, tem-se duas linhas e ambas utilizam o deslocamento para a direita quando atingirem o tamanho `lg` e `xl`.
A primeira linha tem um deslocamento igual à 4 na segunda coluna. E a segunda linha tem um deslocamento igual à 3 na primeira
coluna.

<div class="po-row guides-grid-system-box">
  <div class="po-xl-4 po-lg-4  po-md-6 po-sm-12">Tamanho 4 e sem offset</div>
  <div class="po-offset-lg-4 po-offset-xl-4 po-xl-4 po-lg-4 po-md-6 po-sm-12">Tamanho 4 e offset 4</div>
</div>

<div class="po-row guides-grid-system-box">
  <div class="po-offset-lg-3 po-offset-xl-3 po-xl-4 po-lg-4 po-md-6 po-sm-12">Tamanho 4 e offset 3</div>
  <div class="po-xl-3 po-lg-3 po-md-6 po-sm-12">Tamanho 3 e sem offset</div>
</div>

``` html
<div class="po-row">
  <div class="po-xl-4 po-lg-4  po-md-6 po-sm-12">Tamanho 4 e sem offset</div>
  <div class="po-offset-lg-4 po-offset-xl-4 po-xl-4 po-lg-4 po-md-6 po-sm-12">Tamanho 4 e offset 4</div>
</div>

<div class="po-row">
  <div class="po-offset-lg-3 po-offset-xl-3 po-xl-4 po-lg-4 po-md-6 po-sm-12">Tamanho 4 e offset 3</div>
  <div class="po-xl-3 po-lg-3 po-md-6 po-sm-12">Tamanho 3 e sem offset</div>
</div>
```
> O número de colunas para o deslocamento não necessita ser igual ao tamanho do elemento. Por exemplo: `po-offset-lg-3 po-lg-4`.

> É importante lembrar que o somatório de colunas com po-offset e os tamanhos dos elementos deve ser menor ou igual a 12.

> Os tamanhos de deslocamentos do po-offset variam de 1 a 11, não incluindo o espaçamento igual a 12.
