import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { PoTableColumn } from '../interfaces/po-table-column.interface';
import { PoTableColumnSort } from '../interfaces/po-table-column-sort.interface';
import { PoTableModule } from '../po-table.module';

@Component({
  template: `
    <po-table [p-columns]="columns" [p-items]="items" [p-sort]="true" (p-sort-by)="onSort($event)">
      <ng-template p-table-header-template p-property="status" let-column>
        <span class="specific-header">specific-{{ column.property }}</span>
      </ng-template>
      <ng-template p-table-header-template let-column>
        <button type="button" class="generic-header">generic-{{ column.property }}</button>
      </ng-template>
    </po-table>
  `,
  standalone: false
})
class TableHostComponent {
  readonly columns: Array<PoTableColumn> = [
    { property: 'code', label: 'Code' },
    { property: 'status', label: 'Status' }
  ];
  readonly items = [
    { code: 2, status: 'OPENED' },
    { code: 1, status: 'FINISHED' }
  ];
  readonly sortEvents: Array<PoTableColumnSort> = [];

  onSort(event: PoTableColumnSort): void {
    this.sortEvents.push(event);
  }
}

describe('PoTableHeaderTemplateDirective (integration):', () => {
  let fixture: ComponentFixture<TableHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableHostComponent],
      imports: [PoTableModule, NoopAnimationsModule, RouterTestingModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    nativeElement = fixture.nativeElement;
  });

  it('should render a header template area below the title of each column', () => {
    const areas = nativeElement.querySelectorAll('thead th .po-table-header-template');

    expect(areas.length).toBe(2);
  });

  it('should prefer the template with matching p-property over the generic one', () => {
    const specific = nativeElement.querySelectorAll('thead .specific-header');
    const generic = nativeElement.querySelectorAll('thead .generic-header');

    expect(specific.length).toBe(1);
    expect(specific[0].textContent.trim()).toBe('specific-status');
    expect(generic.length).toBe(1);
    expect(generic[0].textContent.trim()).toBe('generic-code');
  });

  it('should not sort the column when clicking inside the header template', () => {
    const button = nativeElement.querySelector<HTMLButtonElement>('thead .generic-header');

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sortEvents.length).toBe(0);
  });

  it('should keep sorting the column when clicking the header title', () => {
    const headerCell = nativeElement.querySelector<HTMLElement>('thead th[data-po-table-column-name="code"]');

    headerCell.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sortEvents.length).toBe(1);
    expect(fixture.componentInstance.sortEvents[0].column.property).toBe('code');
  });
});
