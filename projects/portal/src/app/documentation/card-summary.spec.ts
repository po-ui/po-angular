import { CARD_SUMMARY_MAX, cardSummary } from './card-summary';

describe('cardSummary (texto dos cards sem preview)', () => {
  it('po-storage: junta as linhas do 1º parágrafo e tira o link do markdown', () => {
    const md =
      'O PO Storage é uma biblioteca que fornece um serviço para armazenamento de dados no dispositivo local, sendo semelhante\n' +
      'ao funcionamento do [IonicStorage](https://ionicframework.com/docs/storage/).\n' +
      'É possível utilizar os drivers [Websql](https://dev.w3.org/html5/webdatabase/).';

    // antes: "O PO Storage é uma biblioteca ... local, sendo semelhante" (cortado na 1ª linha)
    expect(cardSummary(md)).toBe(
      'O PO Storage é uma biblioteca que fornece um serviço para armazenamento de dados no dispositivo local, sendo semelhante ao funcionamento do IonicStorage.'
    );
    expect(cardSummary(md).length).toBeLessThanOrEqual(CARD_SUMMARY_MAX);
  });

  it('po-data-transform: a frase continua na 2ª linha e termina no ponto', () => {
    const md =
      'Classe responsável por adaptar dados de APIs que não seguem\no padrão de [API do PO UI](https://po-ui.io/guides/api).\n\n' +
      'Essa classe deve ser estendida por uma classe que implemente cada um de seus métodos.';

    // antes: "Classe responsável por adaptar dados de APIs que não seguem"
    expect(cardSummary(md)).toBe(
      'Classe responsável por adaptar dados de APIs que não seguem o padrão de API do PO UI.'
    );
  });

  it('po-entity: tira crase e itálico e não para em "ex." nem em `PoSyncService.getModel`', () => {
    const md =
      'Uma instância `PoEntity` representa um *schema* e ela contém métodos que possibilitam manipular seus registros,\n' +
      'como ex. buscar e remover. Esta instância vem de `PoSyncService.getModel()`.';

    // antes: "Uma instância `PoEntity` representa um *schema* e ela contém métodos que possibilitam manipular seus registros,"
    expect(cardSummary(md)).toBe(
      'Uma instância PoEntity representa um schema e ela contém métodos que possibilitam manipular seus registros, como ex. buscar e remover.'
    );
  });

  it('po-sync: frase longa corta em limite de palavra com "..."', () => {
    const md =
      'O `PoSyncService` é utilizado para configurar toda a base de dados que receberá as informações que serão\n' +
      'armazenadas *offline* vindas do servidor. Nele ocorre toda a preparação dos modelos.';
    const text = cardSummary(md);

    expect(text).toBe(
      'O PoSyncService é utilizado para configurar toda a base de dados que receberá as informações que serão armazenadas offline vindas do servidor.'
    );
    expect(cardSummary(md, 60)).toBe('O PoSyncService é utilizado para configurar toda a base...');
  });

  it('ignora blocos de código, títulos e citações antes do texto; versões e números não fecham a frase', () => {
    const md =
      '```ts\nconst a = 1;\n```\n\n### Título\n\n> nota\n\nUse a versão 1.2 do po-x.y no Angular 17. Depois o resto.';

    expect(cardSummary(md)).toBe('Use a versão 1.2 do po-x.y no Angular 17.');
  });

  it('vazio ou só espaços: texto vazio (o card mostra o texto padrão)', () => {
    expect(cardSummary(undefined)).toBe('');
    expect(cardSummary(' ')).toBe('');
  });
});
