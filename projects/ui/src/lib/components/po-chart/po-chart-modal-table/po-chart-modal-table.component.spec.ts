import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PoChartModalTableComponent } from './po-chart-modal-table.component';
import { PoModalModule } from '../../po-modal';
import { PoTableModule } from '../../po-table';
import { provideHttpClient } from '@angular/common/http';

describe('PoChartModalTableComponent', () => {
  let component: PoChartModalTableComponent;
  let fixture: ComponentFixture<PoChartModalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PoChartModalTableComponent, PoModalModule, PoTableModule],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoChartModalTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind inputs correctly', () => {
    const title = 'Meu título';
    const items = [{ name: 'Item 1' }, { name: 'Item 2' }];
    const columns = [{ property: 'name', label: 'Nome' }];
    const action = { label: 'Fechar', action: jasmine.createSpy() };

    component.title = title;
    component.itemsTable = items;
    component.columnsTable = columns;
    component.actionModal = action;

    fixture.detectChanges();

    const modal = component.modalComponent;
    expect(modal.title).toBe(title);
  });
});
