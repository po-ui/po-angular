import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTableColumnActionsComponent } from './po-table-column-actions.component';
import { configureTestSuite } from 'projects/templates/src/lib/util-test/util-expect.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { PoTableModule } from '../po-table.module';
import { PoTableColumnAction } from './po-table-column-action.interface';

describe('PoTableColumnActionsComponent', () => {
  let component: PoTableColumnActionsComponent;
  let fixture: ComponentFixture<PoTableColumnActionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        PoTableModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnActionsComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('should set actions as empty array when no actions is set', () => {
      component.actions = undefined;

      expect(component.actions).toEqual(new Array<PoTableColumnAction>());
    });

    it('should set actions property', () => {
      component.actions = [<PoTableColumnAction>{}, <PoTableColumnAction>{}];

      expect(component.actions.length).toBe(2);
    });
  });
});
