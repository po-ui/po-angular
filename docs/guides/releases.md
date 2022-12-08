[comment]: # (@label Releases)
[comment]: # (@link guides/releases)

Reconhecemos que você precisa da estabilidade da estrutura PO UI. A estabilidade garante que os componentes, samples e tutoriais não se tornem obsoletos inesperadamente. A estabilidade é essencial para um ecossistema com angular e PO UI prosperar.

Também compartilhamos com você o desejo de que o PO UI continue evoluindo. Nós nos esforçamos para garantir que a biblioteca de componentes sobre a qual está construindo sua aplicação continue melhorando e permitindo que você se mantenha atualizado com o resto do ecossistema do Angular e com as necessidades do usuário.

Este documento contém as práticas que seguimos para fornecer a você uma biblioteca de componentes de ponta, equilibrada e com estabilidade. Nós nos esforçamos para garantir que as mudanças futuras sejam sempre introduzidas de forma previsível. Queremos que todos que dependam do PO UI saibam quando e como os novos recursos serão adicionados e estejam bem preparados quando os obsoletos são removidos.

## Controle de Versão PO UI

Os números de versão do PO UI indicam o nível de mudanças introduzidas pelo lançamento. Este uso de [versionamento semântico](https://semver.org/) ajuda a entender o impacto potencial de atualizar para uma nova versão.

Números de versão PO UI tem três partes: `major.minor.patch`. Por exemplo, a versão 4.16.1 indica a versão principal 4, a versão secundária 2 e o nível de patch 1.

O número da versão principal é incrementado com base na versão do Angular que ele atende.
- **As versões principais** contêm os novos recursos disponibilizados pelo Angular, mas espera-se uma assistência mínima do desenvolvedor durante a atualização. Ao atualizar para uma nova versão principal, pode ser necessário executar scripts de atualização, refatorar códigos, executar testes adicionais e aprender novas APIs.
- **Versões secundárias** contém novos recursos menores. Versões menores são totalmente compatíveis com versões anteriores; nenhuma assistência do desenvolvedor é esperada durante a atualização, mas você pode opcionalmente modificar seus aplicativos e bibliotecas para começar a usar novas APIs, recursos e capacidades que foram adicionados na versão. São incrementadas regularmente ao final de nossas sprints.
- **Lançamentos de patch** são lançamentos de correção de bugs. Nenhuma ajuda do desenvolvedor é esperada durante a atualização.

## Caminhos de atualização suportados
Em alinhamento com o esquema de controle de versão descrito acima, nos comprometemos a oferecer suporte aos seguintes caminhos de atualização:
- Se você estiver atualizando na **versão principal**, poderá pular todas as versões intermediárias e atualizar diretamente para a versão de destino. Por exemplo, você pode atualizar diretamente da versão 4.0.0 para a 4.17.0.
- Se você estiver  atualizando de **uma versão principal para outra**, recomendamos que **não ignore as versões principais**. Siga as instruções para atualizar de forma incremental para a próxima versão principal, testando e validando em cada erapa. Por exemplo, se você deseja atualizar da versão 2.xx para a versão 4.xx, recomendamos que você atualize para a versão 3.xx mais recente primeiro. Depois de atualizar com sucesso para a versão 3.xx, você pode atualizar para a 4.xx.

Consulte abaixo nossos guias de migração de versão para obter mais informações sobre como atualizar o PO UI para a versão mais recente nos seus projetos Angular.

### Comparativo de versões Angular x PO UI

<div class="po-row">
  <div class="po-xl-6 po-lg-8 po-md-10 po-sm-12">
    <table class="po-table">
      <thead>
        <tr class="po-table-header">
          <th class="po-table-header-ellipsis">Angular</th>
          <th class="po-table-header-ellipsis">PO UI</th>
          <th class="po-table-header-ellipsis">Migração</th>
        </tr>
      </thead>
      <tbody>
      <tr class="po-table-row">
          <td class="po-table-column">15.0.0-next.0</td>
          <td class="po-table-column">15.0.0-next.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">14.0.0</td>
          <td class="po-table-column">14.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">13.0.0</td>
          <td class="po-table-column">6.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">12.0.0</td>
          <td class="po-table-column">5.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">11.0.0</td>
          <td class="po-table-column">4.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">10.0.0</td>
          <td class="po-table-column">3.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui">Migração do PO UI</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">9.0.0</td>
          <td class="po-table-column">2.0.0</td>
          <td class="po-table-column"><a href="guides/migration-poui-v2">Migração do PO UI para V2</a></td>
        </tr>
        <tr class="po-table-row">
          <td class="po-table-column">8.0.0</td>
          <td class="po-table-column">1.0.0</td>
          <td class="po-table-column"><a href="guides/migration-thf-to-po-ui">Migração THF para PO UI v1.x</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

> Conforme agenda de publicação de novas versões estáveis do Angular, nós atualizamos nossas versões como de costume e aproveitaremos para fazer uma mudança na nomenclatura das nossas versões. A versão `v7.x.x` foi lançada como **`v14.x.x`**, assim `a versão 14.x.x do PO UI tem compatibilidade com a v14 do Angular` e assim por diante. [Mais informações](https://github.com/po-ui/po-angular/issues/1184).

## Versões prévias

Permitimos que você visualize o que está por vir, fornecendo pré-lançamentos `next` ou Release Candidates (`rc`) para cada versão principal:
- **Next**: a versão que está em desenvolvimento, com testes ativos e com breaking changes a resolver. O próximo lançamento é indicado por uma tag de lançamento anexada ao identificador `-next`, como `15.0.0-next.1`.
- **Release Candidate**: um lançamento com recurso concluído, teste finalizado e sem breaking changes a resolver. Um candidato a lançamento é indicado por uma tag de lançamento anexada ao identificador `-rc`, como versão `15.0.0-rc.1`.

A versão mais recente `next` ou de pré-lançamento `rc` fica disponível no [npm do projeto](https://www.npmjs.com/package/@po-ui/ng-components?activeTab=versions).
