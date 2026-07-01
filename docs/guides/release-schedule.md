[comment]: # (@label Lançamentos e suporte)
[comment]: # (@link guides/release-schedule)

Suporte estendido para versões principais ímpares por até 18 meses, a partir da versão 17.

### Cronograma de Lançamentos

<div class="po-row">
  <div class="po-xl-12 po-lg-12 po-md-12 po-sm-12">
    <img src="./assets/graphics/release-schedule.jpg" alt="Cronograma de Lançamentos" style="max-width:100%; max-height:33vh;">
  </div>
</div>

### Janela de Suporte PO UI

Todas as versões Major Ímpares possuem período ativo de 12 meses + suporte (LTS) de 18 meses:

<div class="po-row">
  <div class="po-xl-10 po-lg-12 po-md-12 po-sm-12">
    <table class="po-table po-text-color-neutral-dark-40">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Estágio de suporte</th>
          <th class="po-table-header-ellipsis">Tempo de suporte</th>
          <th class="po-table-header-ellipsis">Detalhes</th>
        </tr>
      </thead>
      <tbody>
        <tr class="po-table-row">
          <td class="po-table-column">Active (versões major ímpares)</td>
          <td class="po-table-column">12 meses</td>
          <td class="po-table-column">Atualizações e correções programadas regularmente</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">Longo prazo (LTS) (versões major ímpares)</td>
          <td class="po-table-column">18 meses</td>
          <td class="po-table-column">Apenas correções nas versões ímpares</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">Active (versões major pares)</td>
          <td class="po-table-column">6 meses</td>
          <td class="po-table-column">Atualizações e correções programadas regularmente até o lançamento da próxima versão major ímpar</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

### Versões PO UI

As bibliotecas seguem as regras de versionamento definidas pelo Semantic Versioning (SemVer), conforme descrito em: <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">https://semver.org/</a>

<div class="po-row">
  <div class="po-xl-10 po-lg-12 po-md-12 po-sm-12">
    <table class="po-table po-text-color-neutral-dark-40">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Versão</th>
          <th class="po-table-header-ellipsis">Status</th>
          <th class="po-table-header-ellipsis">Lançado</th>
          <th class="po-table-header-ellipsis">Fim do período ativo</th>
          <th class="po-table-header-ellipsis">Fim do LTS</th>
        </tr>
      </thead>
      <tbody>
        <tr class="po-table-row">
          <td class="po-table-column">^23.0.0*</td>
          <td class="po-table-column">Previsto</td>
          <td class="po-table-column">Janeiro/2027</td>
          <td class="po-table-column">Dezembro/2027</td>
          <td class="po-table-column">Junho/2029</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^22.0.0*</td>
          <td class="po-table-column">Previsto</td>
          <td class="po-table-column">Julho/2026</td>
          <td class="po-table-column">Dezembro/2026</td>
          <td class="po-table-column">N/A</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^21.0.0</td>
          <td class="po-table-column">Active</td>
          <td class="po-table-column">Janeiro/2026</td>
          <td class="po-table-column">Dezembro/2026</td>
          <td class="po-table-column">Junho/2028</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^19.0.0</td>
          <td class="po-table-column">LTS</td>
          <td class="po-table-column">Janeiro/2025</td>
          <td class="po-table-column">Dezembro/2025</td>
          <td class="po-table-column">Junho/2027</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^20.0.0</td>
          <td class="po-table-column">Active Encerrado</td>
          <td class="po-table-column">Setembro/2025</td>
          <td class="po-table-column">Janeiro/2026</td>
          <td class="po-table-column">N/A</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^18.0.0</td>
          <td class="po-table-column">Active Encerrado</td>
          <td class="po-table-column">Julho/2024</td>
          <td class="po-table-column">Dezembro/2024</td>
          <td class="po-table-column">N/A</td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">^17.0.0</td>
          <td class="po-table-column">LTS Encerrado</td>
          <td class="po-table-column">Março/2024</td>
          <td class="po-table-column">Agosto/2024</td>
          <td class="po-table-column">Agosto/2025</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

Versões LTS recebem apenas correções de segurança e bugs críticos. Não há novas funcionalidades ou melhorias visuais.

> *Datas aproximadas, sujeitas a alterações.

### Segurança — Vulnerabilidades em versões LTS

Versões LTS podem apresentar **vulnerabilidades altas ou críticas** no `npm audit` **sem patch disponível**, especialmente quando o Angular (peer dependency) já encerrou o suporte da versão utilizada (**EOL**).

> O Status EOL reflete o estado do suporte ao respectivo produto no lançamento da release. O PO UI prestará suporte em sistemas operacionais, produtos, bibliotecas terceiras ou serviços (incluindo o Angular), apenas dentro do ciclo de vida e correções de vulnerabilidades estabelecidos por seus respectivos fabricantes e mantenedores. **O PO UI não prestará suporte** em sistemas operacionais, produtos, bibliotecas terceiras ou serviços fora de seus ciclos de vida ativos.

Planeje a migração para a versão Active quando possível.

Referências:

- <a href="https://angular.dev/reference/releases" target="_blank" rel="noopener noreferrer">Angular Release Schedule</a>
- [Releases e versionamento](guides/releases)
- [Migração do PO UI](guides/migration-poui)
- [Primeiros passos](guides/getting-started)
