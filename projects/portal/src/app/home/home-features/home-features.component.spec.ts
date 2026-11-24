import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { PoNotificationService } from '@po-ui/ng-components';

import { HomeFeaturesComponent } from './home-features.component';

describe('HomeFeaturesComponent', () => {
  let fixture: ComponentFixture<HomeFeaturesComponent>;
  let component: HomeFeaturesComponent;
  let router: jasmine.SpyObj<Router>;
  let notification: jasmine.SpyObj<PoNotificationService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    notification = jasmine.createSpyObj('PoNotificationService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [HomeFeaturesComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: PoNotificationService, useValue: notification }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the section title', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('tudo permanece conectado');
  });

  it('should render two columns, each with its example widget, and no illustration slot', () => {
    const el: HTMLElement = fixture.nativeElement;
    const columns = el.querySelectorAll('.home-features-column');
    expect(columns.length).toBe(2);
    expect(columns[0].querySelector('.home-features-example po-widget po-tree-view')).not.toBeNull();
    expect(columns[1].querySelector('.home-features-example po-widget po-list-view')).not.toBeNull();
    expect(el.querySelector('app-home-illustration-slot, [data-illustration]')).toBeNull();
  });

  it('should keep the titles of the columns and put the tree under "Desenvolvimento Padronizado"', () => {
    const titles = Array.from(fixture.nativeElement.querySelectorAll('.home-features-column-title')).map(
      (title: HTMLElement) => title.textContent.trim()
    );
    expect(titles).toEqual(['Desenvolvimento Padronizado', 'Foco no negócio']);
  });

  it('should have the widget actions of the old Home', () => {
    const widgets = Array.from(fixture.nativeElement.querySelectorAll('po-widget'));
    expect(widgets.map((widget: HTMLElement) => widget.getAttribute('p-primary-label'))).toEqual([
      'Visualização em Árvore',
      'Visualização em Lista'
    ]);
  });

  it('openInternalLink: should navigate to the given route', () => {
    component.openInternalLink('documentation/po-tree-view');
    expect(router.navigate).toHaveBeenCalledWith(['/documentation/po-tree-view']);
  });

  it('showMore: should notify that more notifications were loaded', () => {
    component.showMore();
    expect(notification.success).toHaveBeenCalledWith('Mais notificações carregadas com sucesso!');
  });

  it('should have the project tree and the two notifications of the old Home', () => {
    expect(component.folderItems[0].label).toBe('meu_projeto');
    expect(component.folderItems[0].subItems.map(item => item.label)).toEqual([
      'src',
      'public',
      '.gitignore',
      'angular.json',
      'package.json',
      'README.md',
      'tsconfig.json'
    ]);
    expect(component.folderItems[0].subItems[0].expanded).toBeFalse();
    expect(component.notificationList.map(item => item.title)).toEqual(['Relatório de faturamento', 'Nova versão 22']);
  });

  it('should color the notification avatars with theme tokens, never fixed hex colors', () => {
    component.notificationList.forEach(item => {
      expect(item.avatar.color).toMatch(/^var\(--color-/);
      expect(item.avatar.backgroundColor).toMatch(/^var\(--color-/);
    });
  });
});
