import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PoModule } from '@po-ui/ng-components';

import { APPEARANCE_MODAL_QUERY, AppearancePopoverComponent } from './appearance-popover.component';

describe('AppearancePopoverComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoModule, FormsModule],
      declarations: [AppearancePopoverComponent]
    });
  });

  it('usa o mesmo breakpoint da busca no celular', () => {
    expect(APPEARANCE_MODAL_QUERY).toBe('(max-width: 767px)');
  });

  it('openModal mostra o mesmo conteúdo do popover no po-modal; fechar tira o conteúdo', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppearancePopoverComponent);
    const component = fixture.componentInstance;
    const host: HTMLElement = fixture.nativeElement;

    fixture.detectChanges();
    expect(host.querySelector('.appearance-popover-modal')).toBeNull();

    component.openModal();
    fixture.detectChanges();
    tick();

    const content = host.querySelector('po-modal .appearance-popover-modal');

    expect(content).not.toBeNull();
    expect(content.textContent).toContain('Tema');
    expect(content.textContent).toContain('Restaurar padrão');
    expect(host.querySelector('po-modal input[type=radio]').getAttribute('name')).toContain('themeModal');

    component.closeAction.action();
    fixture.detectChanges();
    tick();

    expect(component.modalOpen).toBe(false);
    expect(host.querySelector('.appearance-popover-modal')).toBeNull();
  }));
});
