[comment]: # (@label Guia de uso para Gráficos)
[comment]: # (@link guides/guide-charts)

Este guia tem o objetivo de informar práticas de uso para cada tipo de gráfico do PO UI, o que devemos evitar ao utilizar determinado gráfico e também as boas práticas relacionadas às cores nos gráficos.

Gráficos em geral têm a função de garantir que as pessoas de qualquer cultura ou país tenham entendimento claro para tomar as melhores decisões com base nas suas visualizações.

## Conteúdo

- [Gráfico de área](guides/guide-charts#area)
- [Gráfico de barra](guides/guide-charts#bar)
- [Gráfico de coluna](guides/guide-charts#column)
- [Gráfico de coluna com linha](guides/guide-charts#column-line)
- [Gráfico de gauge semicircular](guides/guide-charts#gauge-semicircle)
- [Gráfico de linha](guides/guide-charts#line)
- [Gráfico de pizza](guides/guide-charts#pie)
- [Gráfico de rosca](guides/guide-charts#donut)
- [Guia de cores](guides/guide-charts#guide-colors)

<br>

<a id="area"></a>
## Gráfico de área (Area Chart)

O gráfico de área combina o gráfico de linhas e o gráfico de barras para mostrar como os valores numéricos de um ou mais grupos mudam ao longo da progressão de uma segunda variável, normalmente a do tempo. Um gráfico de área se distingue de um gráfico de linha pela adição de sombreamento entre as linhas e uma linha de base, como em um gráfico de barras.

A versão disponível no PO UI é o gráfico de área de sobreposição ou em inglês, *overlapping area chart*.

#### Quando usar?

- Para representar os totais acumulados usando números ou porcentagens (gráficos de área empilhados, neste caso) ao longo do tempo;
- Mostrar tendências ao longo do tempo entre os atributos relacionados.

<br>

<a id="bar"></a>
## Gráfico de barra (Bar Chart)

O gráfico de barra é organizado de forma temporal ou por tópicos ao longo do eixo vertical (y) e seus valores têm variação ao longo do eixo vertical (x). É uma variação direta da estrutura do gráfico de coluna.

#### Quando usar?

- Demonstrar as variações de dados em um período de tempo;
- Ilustrar comparações entre tópicos diretamente relacionados.

#### Boas práticas

Prefira utilizar o gráfico de barra quando for necessário muitos itens temporais ou de tópicos.


<br>

<a id="column"></a>
## Gráfico de coluna (Column Chart)

O gráfico de coluna é organizado de forma temporal ou por tópicos ao longo do eixo horizontal (x) e seus valores têm variação ao longo do eixo vertical (y).

#### Quando usar?

- Demonstrar as variações de dados em um período de tempo;
- Ilustrar comparações entre tópicos diretamente relacionados.

#### Boas práticas

Prefira utilizar o gráfico de barras caso seja necessário muitos itens,
pois o gráfico de coluna contém menos espaço para que sejam exibidos os rótulos no eixo horizontal.

<br>

<a id="column-line"></a>
## Gráfico de pareto / coluna com linha (Column and Line Chart)

O gráfico de pareto contém colunas e um gráfico de linhas, onde os valores individuais são representados em ordem decrescente por colunas e o total acumulado é representado pela linha.

#### Quando usar?

- Destacar o mais importante entre um conjunto de fatores, por exemplo:
  - Sempre que uma equipe não estiver certa sobre onde direcionar seus esforços de melhoria deve usar uma análise de pareto.

<br>

<a id="gauge-semicircle"></a>
## Gráfico de gauge semicircular (Semi Circle Gauge Chart)

O gráfico de gauge semicircular é uma variação direta do gauge tradicional.

#### Quando usar?

- Demonstrar cálculos de desempenho por um certo período (em andamento ou como histórico), por exemplo: 
  - Desempenho de vendas de uma equipe em relação a meta.

<br>

<a id="line"></a>
## Gráfico de linha (Line Chart)

O gráfico de linha pode exibir dados contínuos ao longo de um período de tempo, definidos em relação a uma escala comum. Os dados de categorias são comumente distribuídos uniformemente ao longo do eixo horizontal e todos os dados de valores que tem variação são subdivididos igualmente ao longo do eixo vertical. 

#### Quando usar?

- Quando deseja exibir tendências nos dados ao longo do tempo, por exemplo:
  - Demonstrar a alteração no preço das ações em um período de tempo;
  - Quantidade de visitas em um site durante um mês.

#### Boas práticas

- Ideal para demonstrar a frequência em que ocorrem os dados;
- Não é recomendado para caso de distribuição de dados, neste caso pode-se utilizar o gráfico de coluna.

<br>

<a id="pie"></a>
## Gráfico de pizza (Pie Chart)

O gráfico de pizza ou torta é adequado para mostrar partes divididas de um todo, pois representa fatias que somadas compõem 100% da forma.

#### Quando usar?

- Para demonstrar proporções, por exemplo:
  - Porcentagem de orçamento gasto em diferentes departamentos;
  - Respostas de pesquisa;
  - Divisão de tempo em uma atividade. 

#### Boas práticas

- Não é recomendado para comparar dados;
- Evite gráficos de pizza com mais de cinco partes, pois isso interfere diretamente no entendimento do gráfico ou visualização dos valores.


<br>

<a id="donut"></a>
## Gráfico de rosca (Donut Chart)

O gráfico de rosca é adequado para mostrar partes de um todo, pois representa fatias que somadas compõem 100% de algo. É uma variação visual do gráfico de pizza.

#### Quando usar?

- Para demonstrar proporções comparativas em porcentagem ou quantidade.

#### Boas práticas:

O valor mínimo de visualização deve ser de 10% do total para demonstrar as informações no gráfico, caso tenha mais de um item abaixo do valor de 10%, junte-os em uma sessão agrupada "Outros" e especifique o conteúdo que o compõe na legenda.

<br>

<a id="guide-colors"></a>
## Guia de cores

#### Boas práticas

- Use uma única cor para representar o mesmo tipo de dados. Por exemplo: para representar vendas mês a mês em um gráfico de barras, use uma única cor. Outro exemplo: para comparar as vendas do ano passado com as do ano vigente em um gráfico agrupado, prefira utilizar uma cor diferente para cada ano;
- Certifique-se de que existe contraste suficiente entre as cores. Por exemplo: utilize cores com contraste para facilitar a assimilação do usuário referente às informações traduzidas no gráfico;
- Escolha cores adequadamente. Algumas cores se destacam mais do que outras, dando peso desnecessário ou direcionamento errado aos dados.
- Prefira utilizar uma única cor com sombra variável ou um espectro entre duas cores análogas para mostrar intensidade;
- Destaque a informação mais relevante com cores fortes e utilize a mesma com tons com menos contraste para complementar o gráfico.


#### Evite

- Não use vermelho para números positivos ou verde para números negativos. Essas associações de cores são decisivas na interpretação do usuário;
- Não utilize combinações de cores de alto contraste, como vermelho e verde ou azul e amarelo (somente com direcionamento da marca);
- Não utilize cores com baixo contraste, como azul claro e cinza (somente com direcionamento da marca).

#### Opções de combinação de cores
Modelos de cores que podem combinar e facilitar a visualização dos gráficos: 
- Cinza e azul:

  - Para informações de atual e passado, mas atenção com o nível do contraste para que sejam legíveis as diferenças entre os dados;

- Azul e laranja:

  - Azul para indicação de dados positivos e laranja para negativos;

- Verde e vermelho:

  - Verde sinaliza dados positivo e vermelho os negativos;

- Azul, cinza e verde:

  - Para uma composição de três cores.

