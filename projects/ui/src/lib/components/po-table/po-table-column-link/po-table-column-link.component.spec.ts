import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoTableColumnLinkComponent } from './po-table-column-link.component';
import { PoTableModule } from '../po-table.module';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoTableColumnLinkComponent:', () => {
  let component: PoTableColumnLinkComponent;
  let fixture: ComponentFixture<PoTableColumnLinkComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoTableModule, PoTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTableColumnLinkComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnLinkComponent).toBeTruthy();
  });

  describe('Templates:', () => {
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

    it('should set type with "internalLink" if link is empty', () => {
      component.disabled = false;
      component.link = '';
      component.value = 'link';

      expect(component.type).toBe('internalLink');
    });
  });
});
