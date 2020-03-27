import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoTableColumnLinkComponent } from './po-table-column-link.component';
import { PoTableModule } from '../po-table.module';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoTableColumnLinkComponent:', () => {
  let component: PoTableColumnLinkComponent;
  let fixture: ComponentFixture<PoTableColumnLinkComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoTableModule, PoTooltipModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnLinkComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnLinkComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should execute the link action', () => {
      component.action = () => {};
      fixture.detectChanges();

      spyOn(component, 'action');

      const link = nativeElement.querySelector('.po-table-link');
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', false, true);
      link.dispatchEvent(event);
      link.click();

      expect(component.action).toHaveBeenCalled();
    });

    it('should contain `po-table-link-disabled` class if disabled is true', () => {
      component.action = () => {};
      component.disabled = true;
      component.link = 'link';
      component.value = 'link';
      fixture.detectChanges();

      const poTableLinkDisabled = nativeElement.querySelector('.po-table-link-disabled');

      expect(poTableLinkDisabled).toBeTruthy();
    });

    it('shouldn`t contain `po-table-link-disabled` class if disabled is false', () => {
      component.action = () => {};
      component.disabled = false;
      component.link = 'link';
      component.value = 'link';
      fixture.detectChanges();

      const poTableLinkDisabled = nativeElement.querySelector('.po-table-link-disabled');

      expect(poTableLinkDisabled).toBeFalsy();
    });

    it('should contain `href` if `type` is `externalLink`', () => {
      component.disabled = false;
      component.link = 'http://po.com.br';
      component.value = 'link';

      fixture.detectChanges();

      const externalLink = nativeElement.querySelector('.po-table-link[href="http://po.com.br"]');
      expect(externalLink).toBeTruthy();
    });

    it('should contain `routerLink` if `type` is `internalLink`', () => {
      component.disabled = false;
      component.link = '/home';
      component.value = 'link';

      fixture.detectChanges();

      const internalLink = nativeElement.querySelector('.po-table-link[ng-reflect-router-link="/home"]');
      expect(internalLink).toBeTruthy();
    });
  });

  describe('Properties:', () => {
    it('should set type with "action"', () => {
      component.action = () => {};
      component.disabled = false;
      component.link = 'link';
      component.value = 'link';

      expect(component.type).toBe('action');
    });

    it('should set type with "externalLink"', () => {
      component.disabled = false;
      component.link = 'https://po-ui.io';
      component.value = 'link';

      expect(component.type).toBe('externalLink');
    });

    it('should set type with "internalLink"', () => {
      component.disabled = false;
      component.link = '/home';
      component.value = 'link';

      expect(component.type).toBe('internalLink');
    });

    it('should set type with "disabled"', () => {
      component.action = () => {};
      component.disabled = true;
      component.link = 'link';
      component.value = 'link';

      expect(component.type).toBe('disabled');
    });

    it('should set type with "disabled"', () => {
      component.disabled = true;
      component.link = 'https://po-ui.io';
      component.value = 'link';

      expect(component.type).toBe('disabled');
    });

    it('should set type with "internalLink" if link is empty', () => {
      component.disabled = false;
      component.link = '';
      component.value = 'link';

      expect(component.type).toBe('internalLink');
    });
  });
});
