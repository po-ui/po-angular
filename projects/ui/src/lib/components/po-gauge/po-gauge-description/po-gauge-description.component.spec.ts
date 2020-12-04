import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PoGaugeModule } from '../po-gauge.module';

import { PoGaugeDescriptionComponent } from './po-gauge-description.component';

describe('PoGaugeDescriptionComponent', () => {
  let component: PoGaugeDescriptionComponent;
  let fixture: ComponentFixture<PoGaugeDescriptionComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoGaugeModule],
      declarations: [PoGaugeDescriptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugeDescriptionComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('verifyIfHasEllipsis: should apply description value to tooltip if descriptionText.offsetWidth is lower than descriptionText.scrollWidth', fakeAsync(() => {
      const fakeThis = {
        descriptionText: {
          nativeElement: {
            offsetWidth: 200,
            scrollWidth: 400
          }
        },
        description: 'Descrição de texto',
        tooltip: undefined
      };

      component.verifyIfHasEllipsis.call(fakeThis);
      tick();
      expect(fakeThis.tooltip).toBe(fakeThis.description);
    }));

    it('verifyIfHasEllipsis: should apply undefined to tooltip if descriptionText.offsetWidth is greater than descriptionText.scrollWidth', fakeAsync(() => {
      const fakeThis = {
        descriptionText: {
          nativeElement: {
            offsetWidth: 400,
            scrollWidth: 200
          }
        },
        description: 'Descrição de texto',
        tooltip: 'text'
      };

      component.verifyIfHasEllipsis.call(fakeThis);
      tick();
      expect(fakeThis.tooltip).toBeUndefined();
    }));

    describe('Templates:', () => {
      it('should contain `po-gauge-description-upper-text` class if hasRanges is true', () => {
        component.description = 'Descrição de texto';
        component.hasRanges = true;

        fixture.detectChanges();

        const legends = nativeElement.querySelectorAll('.po-gauge-description-upper-text');

        expect(legends).toBeTruthy();
        expect(legends.length).toBe(1);
      });

      it('should contain `po-gauge-description-bottom` class if hasRanges is false', () => {
        component.description = 'Descrição de texto';
        component.hasRanges = false;

        fixture.detectChanges();

        const legends = nativeElement.querySelectorAll('.po-gauge-description-bottom-text');

        expect(legends).toBeTruthy();
        expect(legends.length).toBe(1);
      });

      it('shouldn`t contain `po-gauge-description-bottom-text` class if description is undefined', () => {
        component.description = undefined;
        component.hasRanges = false;

        fixture.detectChanges();

        const legends = nativeElement.querySelectorAll('.po-gauge-description-bottom-text');

        expect(legends.length).toBe(0);
      });

      it('should contain `po-gauge-description-bottom-value` class', () => {
        component.description = undefined;
        component.hasRanges = false;
        component.value = 20;

        fixture.detectChanges();

        const legends = nativeElement.querySelectorAll('.po-gauge-description-bottom-value');

        expect(legends.length).toBe(1);
      });

      it('shouldn`t contain `po-gauge-description-bottom-value` class if value is undefined', () => {
        component.description = undefined;
        component.hasRanges = false;

        fixture.detectChanges();

        const legends = nativeElement.querySelectorAll('.po-gauge-description-bottom-value');

        expect(legends.length).toBe(0);
      });
    });
  });
});
