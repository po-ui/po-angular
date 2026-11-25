const fileWriter = require('./file-writer');

// Gera os arquivos sem gravar no disco: guarda o conteúdo por caminho.
const generate = (method, ...args) => {
  const files = {};
  const spy = spyOn(fileWriter, 'writeFile').and.callFake((path, contents) => (files[path] = contents));

  fileWriter[method](...args);
  spy.and.callThrough();

  return Object.values(files)[0];
};

const group = {
  componentName: 'PoAccordion',
  types: ['components'],
  fileInfo: { filePath: 'ui/src/lib/components/po-accordion.ts' }
};

describe('file-writer: página do componente', () => {
  it('template: cabeçalho padrão (sem o secundário), título do modo e sem as abas Exemplos/Documentação', () => {
    const html = generate('generateDocTemplateFile', 'po-accordion', [
      { name: 'po-accordion-basic' },
      { name: 'po-accordion-labs' }
    ]);

    // data-tour: alvo do tour da página do componente (PortalTourService)
    expect(html).toContain('<po-page-default data-tour="component-page" [p-title]="title" [p-actions]="actions">');
    expect(html).not.toMatch(/p-page-header-type|p-back/);
    expect(html).not.toMatch(/<po-tabs|<po-tab /);
    expect(html).toMatch(
      /<div data-tour-mode="web" \[hidden\]="activeTab !== 'web'">\s*<sample-po-accordion-basic-view><\/sample-po-accordion-basic-view>\s*<sample-po-accordion-labs-view>/
    );
    expect(html).toMatch(
      /<div data-tour-mode="doc" \[hidden\]="activeTab !== 'doc'">\s*<sample-po-accordion-doc><\/sample-po-accordion-doc>/
    );
  });

  it('componente: título com o modo, troca de modo como 1ª ação e "Voltar" no lugar de "Colabore"', () => {
    const ts = generate('generateDocComponentFile', 'po-accordion', group, 3);

    expect(ts).toContain("this.title = 'Accordion · ' + (this.activeTab === 'web' ? 'Exemplos' : 'Documentação');");
    expect(ts).toContain("label: 'Ver documentação', icon: 'an an-file-text', action: () => this.changeTab('doc')");
    expect(ts).toContain("label: 'Ver exemplos', icon: 'an an-browsers', action: () => this.changeTab('web')");
    expect(ts).toContain("label: 'Voltar', icon: 'an an-arrow-left', action: this.goBack.bind(this)");
    expect(ts).toContain("[this.activeTab === 'web' ? this.toDoc : this.toWeb, this.back]");
    expect(ts).toContain("this.router.navigate([], { queryParams: { view: tab }, queryParamsHandling: 'merge' });");
    expect(ts).toContain("this.router.navigate(['documentation']);");
    expect(ts).not.toMatch(/label: 'Documentação'|Colabore|improveDocs/);
    expect(ts).not.toMatch(/&#x27;|&amp;|[\x00-\x08\x0b-\x1f]/);
  });

  it('view de cada sample: sem o estado do po-button-group', () => {
    const ts = generate('generateSampleViewComponentFile', 'po-accordion', 'po-accordion-basic', 'PoAccordionBasic');

    expect(ts).toContain('export class SamplePoAccordionBasicViewComponent {}');
    expect(ts).not.toMatch(/PoButtonGroupItem|viewButtons|icons|view =/);
  });
});
