import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTableColumnActionsComponent } from './po-table-column-actions.component';
import { PoTableModule } from '../po-table.module';
import { PoTableColumnAction } from './po-table-column-actions.interface';
import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoPopupModule } from '../../po-popup';
import { RouterTestingModule } from '@angular/router/testing';

describe('PoTableColumnActionsComponent:', () => {
  let component: PoTableColumnActionsComponent;
  let fixture: ComponentFixture<PoTableColumnActionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        PoTableModule,
        PoPopupModule,
        RouterTestingModule.withRoutes([]),
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof PoTableColumnActionsComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('should set empty array when no action is provided', () => {
      component.actions = undefined;

      expect(component.actions).toEqual(new Array<PoTableColumnAction>());
    });

    it('should set actions as provided', () => {
      component.actions = [<PoTableColumnAction>{}, <PoTableColumnAction>{}];

      expect(component.actions.length).toBe(2);
    });
  });
});
