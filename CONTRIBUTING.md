# Contribuindo com o PO UI

## Conteúdo

- [Introdução](#introduction)
- [Fluxo](#flow)
- [Regras para criação de *branches*](#branches)
- [Regras para criação de *commits*](#commits)
  - [Tipo](#type)
  - [Escopo](#scope)
  - [Descrição curta](#short-description)
  - [Corpo](#body)
  - [Rodapé](#footer)
  - [*Breaking Changes*](#breaking-changes)
  - [Exemplos de descrições de commits completos](#commit-example)
- [Regras para criação de *Pull Requests*](#pull-requests)
  - [Componente](#componente)
  - [Número da ISSUE](#issue-number)
  - [*PR Checklist*](#pr-checklist)
  - [Qual o comportamento atual?](#current-behavior)
  - [Qual o novo comportamento?](#new-behavior)
  - [Simulação](#simulation)


<a id="introduction"></a>
## Introdução

Este guia tem por objetivo definir as regras para criação de *Branches*, *Pull Requests* e *Commits* no projeto PO UI.
Para seguir o guia é fundamental o conhecimento da [ferramenta Git](https://git-scm.com/book/en/v2).

<a id="flow"></a>
## Fluxo

O fluxo para o desenvolvimento e criação de issues e Pull Requests está definido em [Contribuindo para o PO UI](https://po-ui.io/guides/development-flow)

<a id="branches"></a>
## Regras para criação da *Branch*

Antes de criar uma nova *branch* deve-se assegurar de estar na *branch master* do projeto.
Caso já esteja na *master* rode o comando:

```
git pull
```

Se não retornar nenhum erro ela estará atualizada e é hora de criar a *branch* no projeto PO UI. Para isso rode o comando:

```
git checkout -b <COMPONENTE>/<ISSUE>
```

Onde o `<COMPONENTE>` deve conter o nome do componente e não o projeto onde ele se encontra. E a `<ISSUE>` é o número da ocorrência a qual se refere a alteração.
Exemplos:

Caso a ISSUE seja gerada no Jira:
```
git checkout -b po-button/DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub:
```
git checkout -b po-button/235
```

Caso não exista uma ISSUE definida, crie a *branch* com o nome do desenvolvedor ou o nome do time e não esqueça de detalhar o que está sendo sugerido na descrição da *Pull Request*. Para isso rode o comando:

```
git checkout -b <COMPONENT>/<DEV|TEAM>
```

Exemplo:

```
git checkout -b po-button/fulano
```

<a id="commits"></a>
## Regras para criação de *Commits*

A descrição dos *commits* podem ser feitos em português ou inglês.

> Caso durante o desenvolvimento da melhoria ou correção forem gerados vários *commits* deve-se utilizar o comando *rebase* do git com a opção de *squash* para que o mesmo transforme em apenas um *commit* antes de gerar a *Pull Request*. Segue documentação: [Git rebase](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History).

Deve-se seguir um padrão para criação dos *commits*:

```
<TIPO>(ESCOPO): <DESCRIÇÃO CURTA>
<LINHA EM BRANCO>
<CORPO>
<LINHA EM BRANCO>
<RODAPÉ>
```
Agora vamos detalhar melhor o que deve ser descrito em cada parte:

<a id="type"></a>
### Tipo

Deve ser utilizado um dos tipos descritos abaixo conforme o objetivo da alteração:

- build (quando a alteração está relacionada ao *build*);
- docs (quando a alteração for na documentação);
- feat (quando for uma melhoria, for criada uma nova funcionalidade ou um novo componente);
- fix (para correção de *bugs*);
- perf (quando o item é gerado para melhoria de performance);
- refactor (quando for feito uma refatoração ou aplicação de boas práticas);
- test (quando forem adicionados ou refatorados os testes);

> Nunca colocar espaço entre a descrição do tipo e a abertura de parênteses do escopo.

<a id="scope"></a>
### Escopo

No escopo deverá ser definido o nome do componente ou serviço diretamente afetado pelo *commit*, caso mais de um componente seja afetado, deve-se definir o principal. Não deve ser utilizado o prefixo na nomenclatura, por exemplo:

Corretos:
(button): , (event-sourcing): , (avatar): , ...

Errados:
(po-button): , (po-event-sourcing): , (po-avatar): , ...

> Sempre deve estar entre parênteses e após o fechamento do parênteses deve-se colocar dois pontos e um espaço.

<a id="short-description"></a>
### Descrição curta

- Deve-se colocar uma breve descrição do que foi feito no *commit*.
- Nunca iniciar a descrição com letra maiúscula.
- Nunca deve utilizar ponto final na descrição.
- Deve-se utilizar o modo imperativo na descrição.
- Não deve-se ultrapassar 72 caracteres na soma dos caracteres do tipo, escopo e descrição curta.

por exemplo:

Corretas:

```
adiciona nova funcionalidade
```
```
remove variável não mais utilizada
```

Erradas:

```
Adicionada nova funcionalidade.
```
```
Removida variável não mais utilizada no componente po-button devido a quebra no uso do mesmo.
```

<a id="body"></a>
### Corpo

- Deve-se utilizar o modo imperativo na descrição.
- Deve-se quebrar linha a cada 72 caracteres para que a mesma não seja cortada no GitHub.
- Deve descrever a motivação que levou a mudança e também o que foi alterado em relação ao comportamento anterior.

> Antes da declaração do corpo deve-se deixar uma linha em branco.

<a id="footer"></a>
### Rodapé

No rodapé deve-se colocar a palavra `Fixes` e em seguida o número da ISSUE atendida. Exemplos:

Caso a ISSUE seja gerada no Jira:
```
Fixes DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub e no Jira:
```
Fixes #235, DTHFUI-222
```

Caso a ISSUE seja gerada no GitHub:
```
Fixes #235, #456, #665
```

> Antes da declaração do rodapé deve-se deixar uma linha em branco.

<a id="breaking-changes"></a>
### *Breaking Changes*

- As *breaking changes* devem ser declaradas no rodapé uma linha após a declaração do *Fixes*.
- Deve iniciar utilizando "BREAKING CHANGES: " e após o espaço colocar uma breve descrição da quebra iniciando sempre com caractere minúsculo e não colocar ponto final.
- Deve-se pular uma linha após a breve descrição e iniciar a descrição do que deve ser migrado ou alterado.
- Deve-se quebrar linha a cada 72 caracteres para que a mesma não seja cortada no GitHub.
- O tipo do item de *breaking change* depende do que está sendo implementado, por exemplo, caso for apenas removida alguma propriedade o tipo deve ser definido como *refactor*, caso ao corrigir um problema seja gerado um *breaking change* então o tipo deve ser definido como *fix*.

<a id="commit-example"></a>
### Exemplos de descrições de *commits* completos

Sem *Breaking Changes*:
```
feat(button): adiciona a propriedade p-size

O componente po-button apenas aceita o uso das classes de grid do PO UI para definir sua largura, não permitindo assim fazer um ajuste fino.
Adiciona a propriedade size para que o componente possa receber um valor em pixels fixo para sua largura.

Fixes DTHFUI-221
```

Com *Breaking Changes*:
```
refactor(button): remove a propriedade p-size

Foi removida a propriedade p-size do componente.

Fixes DTHFUI-225

BREAKING CHANGE: removida propriedade p-size

Foi removida a propriedade p-size do po-button pois o mesmo deve ser
definido através do uso das classes de grid do PO UI.

Antes: 
<po-button p-size="md"></po-button>

Depois:
<po-button class="po-md-4"></po-button>
```

<a id="pull-requests"></a>
## Regras para criação de *Pull Requests*

Antes de criar a *Pull Request* é importante verificar se algumas perguntas foram respondidas:

- Verifique nas [*Pull Requests* do PO UI](https://github.com/po-ui/po-angular/pulls) se nenhuma submissão anterior já resolveu o problema.
- A *Pull Request* resolveu o problema solicitado na ISSUE?
- Foi gerado apenas um *commit* para solução do problema? Caso tenha mais de um *commit* ou o padrão não esteja de acordo deve seguir este [Guia de *commits*](#commits).
- Foram rodados todos os testes unitários da aplicação?

Após essas verificações e tudo estando correto basta gerar a *Pull Request*. Por padrão virá um template onde deverão ser preenchidos alguns requisitos citados abaixo:

<a id="componente"></a>
### Componente

Esse texto deve ser substituído pelo nome do componente diretamente afetado pela alteração gerada na *Pull Request*. 
Exemplos:

```
po-modal
```
```
po-button
```

<a id="issue-number"></a>
### Número da ISSUE

Esse texto deve ser substituído pelo número da ISSUE gerada no Jira ou no GitHub. 
Exemplos:

```
DTHFUI-577
```
```
#334
```

<a id="pr-checklist"></a>
### PR Checklist

Deve-se adicionar um `x` dentro dos colchetes sem deixar espaço em cada um dos itens que forem alterados na *Pull Request*.
Exemplo:

```
- [x] Código
- [x] Testes unitários
- [ ] Documentação
- [x] Samples
```

<a id="current-behavior"></a>
### Qual o comportamento atual?

Deve-se descrever o atual comportamento e o motivo que levou a gerar a alteração.

Exemplo:

```
O po-modal não está permitindo definir uma largura maior que 768px. Está gerando problema pois ao criar um formulário maior gera-se um scroll dificultando a visualização do cliente.
```

<a id="new-behavior"></a>
### Qual o novo comportamento?

Deve-se descrever o novo comportamento gerado, bem como o que e como foi alterado para solucionar o motivo que foi descrito no comportamento atual.

Exemplo:

```
Criação do novo valor "full" na propriedade p-size.
Este valor serve para poder deixar o po-modal ter o tamanho conforme o conteúdo sem a limitação de tamanho.
```

<a id="simulation"></a>
### Simulação

Aqui deve-se descrever sugestões de formas de validar a alteração gerada.

Exemplo:

```
Esta correção pode ser validada utilizando o sample labs no portal
```

> Além desses requisitos podem ser adicionados tópicos para facilitar o entendimento da *Pull Request*. Exemplo: Observações, definições, links...


Após gerar a *Pull Request* é só aguardar aprovação. Caso tiver alguma sugestão deve-se fazer as atualizações necessárias e rodar os testes novamente.
Faça um *rebase* e em seguida faça um *push* com as alterações e aguarde a aprovação.
Caso seja aprovado, parabéns, sua alteração já estará na *branch master* do PO UI.
