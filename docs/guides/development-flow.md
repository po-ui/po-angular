[comment]: # (@label Contribuindo para o PO UI)
[comment]: # (@link guides/development-flow)

#### Obrigado pelo interesse em contribuir para a biblioteca PO UI!

## Conteúdo

- [Código de conduta](guides/development-flow#code-of-conduct)
- [Fluxo](guides/development-flow#flow)
  - [Criando *issue* no GitHub](guides/development-flow#create-issue)
  - [Criando reprodução de código para nova *issue*](guides/development-flow#code-reproduction)
  - [Colaborando com o PO UI](guides/development-flow#contribute)
  - [Setup Inicial](guides/development-flow#setup)
  - [Modificando Componentes](guides/development-flow#modifying-components)
  - [Subindo as modificações localmente](guides/development-flow#preview-changes)
  - [Testes Unitários](guides/development-flow#tests)
  - [TS Lint](guides/development-flow#lint)
  - [Po Style](guides/development-flow#po-style)
  - [Build das modificações](guides/development-flow#build)
  - [Criando Pull Request](guides/development-flow#pr)

<a id="code-of-conduct"></a>
### Código de conduta
Primeiramente, pedimos para que leiam com atenção nosso [Código de Conduta](https://github.com/po-ui/po-angular/blob/master/CODE_OF_CONDUCT.md) para se inteirarem sobre nossas regras.

<a id="flow"></a>
## Fluxo
Este guia tem por objetivo definir as regras para criação de *Issues* relacionadas à melhorias ou defeitos na biblioteca, assim como orientar no interesse em colaborar com o PO UI, definindo premissas para criação de novas *Branchs*, *Pull Requests* e *Commits* no projeto PO UI. 

<div>
  <div class="card-list-item">
    <a id="create-issue"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/bug.png">
        <h3 class="po-font-subtitle po-pb-1">Criando uma <em>issue</em> no GitHub</h3>
        <ul>
          <li>Antes de tudo, se você possui alguma questão relacionada ao uso da biblioteca, bem como dúvidas relacionadas a componentes, bibliotecas PO UI, por favor pergunte nos nossos <a href="https://github.com/po-ui/po-angular/issues/439">canais de comunicação</a>.</li>
          <li>A lista de <em>issues</em> do repositório PO UI é de uso exclusivo para informe de <em>bugs</em> e requisições de melhorias. <em>Issues</em> que não se enquadrarem nisso serão fechadas imediatamente.</li>
          <li>Se você tem uma nova <em>feature</em> para nos sugerir ou então deseja reportar um bug, por favor avalie se nas <a href="https://github.com/po-ui/po-angular/pulls"><em>Pull Requests</em> do PO UI</a> não tem nenhuma submissão anterior que resolva o problema, eliminando assim a eventual hipótese de duplicidade.</li>
          <li>É requerido que você descreva de maneira clara os passos necessários para reproduzir a <em>issue</em> reportada. Entenda que, apesar de sermos sempre solícitos e darmos o pronto-apoio em nossos canais, reproduzir erros sem evidências diretas tomam um grande tempo da equipe.</li>
          <li>As <em>issues</em> que não tiverem uma descrição detalhada e um passo-a-passo para reprodução terão menor prioridade. Se em caso de solicitação do <em>core team</em> por maiores evidências, o autor da <em>issue</em> terá 30 dias para resposta. Se neste período não houver qualquer resposta, então a <em>issue</em> será fechada.</li>
      </ul>
      </div>
    </div>
  </div>
  
  <div class="card-list-item">
    <a id="code-reproduction"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/ambiente_teste.png">
        <h3 class="po-font-subtitle po-pb-1">Criando reprodução de código para nova <em>issue</em></h3>
        <ul>
          <li>Crie uma nova aplicação em Angular incluindo o componente e o comportamento reportado para nossa análise.</li>
          <li>Adicione o mínimo de código necessário para reprodução do bug, facilitando assim a verificação da situação.</li>
          <li>Publique a aplicação no GitHub e inclua o link ao criar a issue.</li>
          <li>Pode-se também usar o <a href="https://stackblitz.com/edit/po-ui">Stackblitz</a> para reproduzir o <em>bug</em> relatado na <em>issue</em>.</li>
          <li>Certifique-se de incluir os passos para reprodução da issue. Estes passos devem ser claros e simples de seguir.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="card-list-item">
    <a id="contribute"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/colabore.png">
        <h3 class="po-font-subtitle po-pb-1">Colaborando com o PO UI</h3>
        <p class="po-font-text">Mais uma vez agradecemos por dedicar seu tempo para contribuir com o PO UI! Antes de submeter uma <em>pull request</em>, pedimos pra que você crie uma <em>issue</em> reportando uma eventual sugestão de melhoria, nova funcionalidade ou correção de bug e nos deixe ciente de que deseja criar uma <em>pull request</em> para isso. Caso se trate de uma <em>issue</em> já existente, por favor comente na <em>issue</em>. Isso nos ajuda a acompanhar as <em>pull requests</em> e também evitar duplicidades.</p>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="setup"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/setup.png">
        <h3 class="po-font-subtitle po-pb-1">Setup Inicial</h3>
          <blockquote>Para seguir o guia é fundamental o conhecimento da <a href="https://git-scm.com/book/en/v2">ferramenta Git.</a>
          </blockquote>
        <ul>
          <li>Para utilizar o PO UI, é pré-requisito ter o <code>Node.js</code> instalado (versão 10.13.0 ou acima) e o seu gerenciador de pacote favorito na versão mais atual.</li>
          <li>
            <p>É importante que tenha a versão equivalente do Angular instalada. Instale-o via <code>npm</code> ou <code>yarn</code>:</p>
            <p>Instalando com npm:</p>
            <pre><code>npm i -g @angular/cli@^10</code></pre>
            <p>Caso opte pelo yarn:</p>
            <pre><code>yarn global add @angular/cli@^10.0.2</code></pre>
          </li>
          <li>Faça um <a href="https://github.com/po-ui/po-angular"><em>fork</em> do repositório PO UI</a>.
            <blockquote>Membros do <em>Core Team</em> devem gerar uma nova <em>branch</em> ao invés do <em>fork</em>.</blockquote>
          </li>
          <li>Faça <em>clone</em> do <em>fork</em> gerado.</li>
          <li>Execute <code>npm install</code> para instalar as dependências.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="modifying-components"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/modificando.png">
        <h3 class="po-font-subtitle po-pb-1">Modificando componentes</h3>
        <ul>
          <li>Localize o componente em <code>projects/&lt;projeto&gt;/src/lib</code></li>
          <li>É muito importante que analise nossa documentação sobre <a href="https://github.com/po-ui/po-angular/blob/master/STYLEGUIDE.md">boas práticas</a> para entender a implementação dos componentes PO UI.</li>
          <li>Modifique a documentação com base em nosso <a href="https://github.com/po-ui/po-angular/blob/master/HOW_TO_DOCUMENT.md">guia detalhado de documentação</a>.</li>
          <li>Se as implementações também contemplarem estilo, note que deverá modificá-las no repositório <a href="guides/development-flow#po-style">PO UI Style</a>.</li>
          <li>Faça as implementações desejadas, seja um novo componente, correção ou melhoria, e <a href="guides/development-flow#preview-changes">verifique no portal</a> as modificações realizadas tanto nos <em>samples</em> quanto na documentação.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="preview-changes"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/rodando_local.png">
        <h3 class="po-font-subtitle po-pb-1">Subindo as modificações localmente</h3>
        <ul>
          <li><p>As modificações de código e documentação realizadas podem ser conferidas executando os comandos:</p>
            <pre><code>npm run build:portal && ng serve portal</code></pre></li>
          <li>O navegador exibirá o portal na url <code>http://localhost:4200/</code>.</li>
          <li>A partir disso, navegue até o componente para verificação das modificações.</li>
          <li>Pedimos para que atente para a inclusão da melhoria em nossos <em>samples</em>, em especial no sample <code>labs</code>. Na inviabilidade de usar os <em>samples</em> já existentes, considere a necessidade de criar um novo <em>sample</em> de uso.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="tests"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/teste_unitario.png">
        <h3 class="po-font-subtitle po-pb-1">Testes Unitários</h3>
        <p>A cobertura de testes do PO UI é total. Isso significa que, obrigatoriamente, as modificações devem ser totalmente testadas. Para tal, execute os testes nos arquivos <em>.spec</em> contidos no mesmo diretório do componente.</p>
        <p>Para rodar os testes, rode o comando:</p>
        <pre><code>npm run test</code></pre>
        <p>A cobertura de testes pode ser avaliada no arquivo <code>index.html</code> existente no diretório <code>./coverage</code>.
        </p>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="lint"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/lint.png">
        <h3 class="po-font-subtitle po-pb-1">TSLint</h3>
        <p>O PO UI utiliza o TSLint como linter de Typescript. Execute <code>ng lint</code> para fazer a checagem de código-fonte e verificar eventuais erros programáticos, estilísticos, construções suspeitas, entre outros.</p>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="po-style"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/css.png">
        <h3 class="po-font-subtitle po-pb-1">PO Style</h3>
        <p>As implementações de estilo do PO UI são armazenadas no <a href="https://github.com/po-ui/po-style">repositório PO Style</a>.</p>
        <p>O desenvolvimento dos estilos é aberto para todos os desenvolvedores e agradecemos aos desenvolvedores que contribuem com melhorias e correções de erros.</p>
        <p>Para saber como você pode pode participar na melhoria dos estilos, acesse o <a href="https://github.com/po-ui/po-style/blob/master/README.md">guia de implementação de estilo</a>.</p>
      </div>
    </div>
  </div>
  
  <div class="card-list-item">
    <a id="build"></a>
    <div class="po-row">
      <div class="po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/build.png">
        <h3 class="po-font-subtitle po-pb-1">Build das modificações</h3>
        <p>Uma vez em que as modificações desejadas forem concluidas e a documentação esteja atualizada, execute os comandos abaixo para testagem no Portal PO UI.</p>
        <pre><code>npm run build
npm run build:portal
ng serve portal</code></pre>
        <p>Revisadas as novas funcionalidades/correções, é chegada a hora da geração de commit. Confira as <a href="https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md#commits">regras para criação de commit</a>.</p>
      </div>
    </div>
  </div>
  
  <div class="card-list-item ">
    <a id="pr"></a>
    <div class="po-row">
      <div class="po-pl-sm-5 po-pl-md-5 po-pr-lg-5">
        <img class="card-list-icon" src="./assets/graphics/contribute/pr.png">
        <h3 class="po-font-subtitle po-pb-1">Criando Pull Request</h3>
        <p>Crie uma nova pull request com a master branch como base. Confira <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork">como criar pull request a partir de um fork</a>.</p>
        <p>É importante que siga guia contendo as <a href="https://github.com/po-ui/po-angular/blob/master/CONTRIBUTING.md#pull-requests">regras para geração de Pull Requests</a>.</p>
      </div>
    </div>
  </div>
</div>
