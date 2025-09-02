import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoHelperComponent } from './po-helper.component';

describe('PoHelperComponent', () => {
  let component: PoHelperComponent;
  let fixture: ComponentFixture<PoHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoHelperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.id).toBeDefined();
  });

  describe('onKeyDown', () => {
    it('should call onKeyDown and handle event', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      // Espione o método se necessário
      spyOn(component, 'onKeyDown').and.callThrough();

      component.onKeyDown(event);

      expect(component.onKeyDown).toHaveBeenCalledWith(event);
      expect(event.defaultPrevented).toBeTrue();
      // Adicione asserts específicos se houver lógica interna
    });
  });
});
