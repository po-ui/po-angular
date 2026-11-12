import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { SearchAnalyticsService } from './search-analytics.service';
import { SearchLauncherService } from './search-launcher.service';
import { SearchModalComponent } from './search-modal.component';
import { SearchResultsComponent } from './search-results.component';
import { SearchChunk, SearchManifest } from './search.model';
import { SearchService } from './search.service';

const manifest: SearchManifest = {
  version: 1,
  chunks: { core: { file: 'search-core.11111111.json', count: 2, bytes: 1 } }
};

const core: SearchChunk = {
  pages: [{ name: 'PoButton', url: '/documentation/po-button?view=doc', component: 'po-button' }],
  docs: [
    { id: 'po-button', type: 'componente', title: 'PoButton', page: 0, text: 'Botão com vários estilos.' },
    {
      id: 'po-button#prop-p-kind',
      type: 'propriedade',
      title: 'po-button › p-kind',
      page: 0,
      fragment: 'prop-p-kind',
      text: 'Estilo visual do botão.'
    }
  ]
};

describe('SearchModalComponent (filtro por tipo)', () => {
  let fixture: ComponentFixture<SearchModalComponent>;
  let component: SearchModalComponent;

  const root = () => fixture.nativeElement as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    spyOn(window, 'fetch').and.callFake((url: RequestInfo | URL) => {
      const body = String(url).includes('manifest') ? manifest : core;

      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);
    });
    await TestBed.configureTestingModule({
      declarations: [SearchModalComponent, SearchResultsComponent],
      imports: [PoModule, FormsModule],
      providers: [
        { provide: SearchAnalyticsService, useValue: { track: () => undefined } },
        {
          provide: Router,
          useValue: {
            parseUrl: () => ({}),
            serializeUrl: () => '',
            url: '/',
            navigateByUrl: () => Promise.resolve(true)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(SearchService).setText('botao'); // texto que já estava no header
    TestBed.inject(SearchService).query.set('botao');
    component.open({ via: 'shortcut' });
    await new Promise(resolve => setTimeout(resolve, 50));
    await settle();
  });

  it('lista todos os tipos do índice em português e mostra a contagem da consulta por tipo', () => {
    const labels = component.typeOptions.map(o => o.label);

    expect(labels.length).toBe(11);
    expect(labels).toContain('Componente');
    expect(labels).toContain('Propriedade');
    expect(root().querySelector('.search-modal-counts').textContent).toContain('Componente 1 · Propriedade 1');
    expect(labels).toContain('Enum');
    expect(labels).toContain('Exemplo');
    expect(labels).toContain('Ícone');
    expect(root().querySelector('po-multiselect')).not.toBeNull();
  });

  it('escolher um tipo restringe a lista na hora, sem esperar o debounce', async () => {
    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(2);

    component.types.set(['propriedade']);
    await settle();

    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(1);
    expect(root().querySelector('.search-hit-page-name').textContent).toBe('PoButton');
  });

  it('não persiste: reabrir começa com todos os tipos', async () => {
    component.types.set(['propriedade']);
    component.modal.close();
    component.onClose();
    component.open({ via: 'shortcut' });

    expect(component.types()).toEqual([]);
  });

  it('Esc com a lista de tipos aberta fecha só a lista; fechada, deixa o modal tratar', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    const stop = spyOn(event, 'stopPropagation');

    (component as unknown as { typesOpenOnEscape: boolean }).typesOpenOnEscape = true;
    component.onTypesEscape(event);
    expect(stop).toHaveBeenCalledTimes(1);

    component.onTypesEscape(event);
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('abre com o texto que já estava no header e o filtro sem label visual, mas com nome acessível', async () => {
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(root().querySelector<HTMLInputElement>('po-search input').value).toBe('botao');
    expect(root().querySelector('po-multiselect po-label')).toBeNull();
    expect(root().querySelector('.po-multiselect-input').getAttribute('aria-label')).toBe('Filtrar por tipos');
  });

  it('digitar no modal muda o texto compartilhado; o eco da sincronização é ignorado', () => {
    const service = TestBed.inject(SearchService);
    const setText = spyOn(service, 'setText').and.callThrough();

    component.onChange('po-input');
    expect(service.text()).toBe('po-input');

    component.onChange('po-input'); // eco do input sincronizado
    expect(setText).toHaveBeenCalledTimes(1);
  });

  it('limpar o texto não limpa o filtro de tipos', () => {
    component.types.set(['propriedade']);
    component.onChange('');

    expect(TestBed.inject(SearchService).text()).toBe('');
    expect(component.types()).toEqual(['propriedade']);
  });

  it('fechar mantém o texto e avisa que o foco está voltando (não reabrir o popover)', () => {
    const launcher = TestBed.inject(SearchLauncherService);

    component.onChange('popover');
    component.modal.close();

    expect(TestBed.inject(SearchService).text()).toBe('popover');
    expect(launcher.isFocusReturning).toBeTrue();
  });
});
