import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoNavbarActionsComponent } from './po-navbar-actions.component';
import { PoNavbarActionsModule } from './po-navbar-actions.module';
import { PoNavbarIconAction } from '../interfaces/po-navbar-icon-action.interface';
import { PoTooltipModule } from '../../../directives';

describe('PoNavbarActionsComponent:', () => {
  let component: PoNavbarActionsComponent;
  let fixture: ComponentFixture<PoNavbarActionsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTooltipModule, PoNavbarActionsModule, RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNavbarActionsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoNavbarActionsComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('iconActions: should return valid values', () => {
      const icons: Array<PoNavbarIconAction> = [
        { label: 'eye', icon: 'po-icon-eye', link: 'test/' },
        { label: 'gas', icon: 'po-icon-gas', link: 'test/' },
        { label: 'mail', icon: 'po-icon-mail', link: 'test/' },
        { label: 'menu', icon: 'po-icon-menu', link: 'test/' }
      ];

      const expectedIcons = [
        { label: 'eye', icon: 'po-icon-eye', link: 'test/', separator: true, url: 'test/' },
        { label: 'gas', icon: 'po-icon-gas', link: 'test/', separator: true, url: 'test/' },
        { label: 'mail', icon: 'po-icon-mail', link: 'test/', separator: true, url: 'test/' },
        { label: 'menu', icon: 'po-icon-menu', link: 'test/', separator: true, url: 'test/' }
      ];

      expectPropertiesValues(component, 'iconActions', [icons], [expectedIcons]);
    });
  });
});
