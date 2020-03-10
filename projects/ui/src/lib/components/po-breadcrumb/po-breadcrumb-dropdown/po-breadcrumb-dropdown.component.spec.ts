import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { DocumentationComponent, GuidesComponent, routes } from './../po-breadcrumb.component.spec';
import { PoBreadcrumbDropdownComponent } from './po-breadcrumb-dropdown.component';
import { PoBreadcrumbItem } from './../po-breadcrumb-item.interface';

describe('PoBreadcrumbDropdownComponent:', () => {
  let component: PoBreadcrumbDropdownComponent;
  let fixture: ComponentFixture<PoBreadcrumbDropdownComponent>;
  let nativeElement;

  const items: Array<PoBreadcrumbItem> = [
    { label: 'Teste nível 1', link: '/test/nivel/1' },
    { label: 'Teste nível 2', link: '/test/nivel/2' },
    { label: 'Teste nível 3', link: '/test/nivel/3' },
    { label: 'Teste nível 4', link: '/test/nivel/4' }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [PoBreadcrumbDropdownComponent, DocumentationComponent, GuidesComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBreadcrumbDropdownComponent);
    component = fixture.componentInstance;
    component.items = items;
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('.po-breadcrumb-dropdown')).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should find four items dropdown', () => {
      expect(nativeElement.querySelectorAll('.po-breadcrumb-dropdown-item').length).toBe(4);
    });
  });
});
