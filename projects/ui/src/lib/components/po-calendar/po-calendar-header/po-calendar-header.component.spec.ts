import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoCalendarHeaderComponent } from './po-calendar-header.component';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

describe('PoCalendarHeaderComponent', () => {
  let component: PoCalendarHeaderComponent;
  let fixture: ComponentFixture<PoCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCalendarHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call markForCheck and detectChanges when templateContext changes', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges');

    component.ngOnChanges({
      templateContext: { currentValue: {}, previousValue: {}, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should call markForCheck and detectChanges when monthOptions changes', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges');

    component.ngOnChanges({
      monthOptions: { currentValue: [], previousValue: [], firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should call markForCheck and detectChanges when headerTemplate changes', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges');

    component.ngOnChanges({
      headerTemplate: { currentValue: null, previousValue: null, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  describe('Locale and Labels', () => {
    let langService: PoCalendarLangService;

    beforeEach(() => {
      langService = TestBed.inject(PoCalendarLangService);
    });

    it('should initialize labels on ngOnInit', () => {
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Mês anterior');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Próximo mês');

      component.ngOnInit();

      expect(component.previousMonthLabel).toBe('Mês anterior');
      expect(component.nextMonthLabel).toBe('Próximo mês');
    });

    it('should update labels when locale changes to Portuguese', () => {
      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Mês anterior');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Próximo mês');

      component.locale = 'pt';

      expect(langService.setLanguage).toHaveBeenCalledWith('pt');
      expect(component.previousMonthLabel).toBe('Mês anterior');
      expect(component.nextMonthLabel).toBe('Próximo mês');
    });

    it('should update labels when locale changes to English', () => {
      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Previous month');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Next month');

      component.locale = 'en';

      expect(langService.setLanguage).toHaveBeenCalledWith('en');
      expect(component.previousMonthLabel).toBe('Previous month');
      expect(component.nextMonthLabel).toBe('Next month');
    });

    it('should update labels when locale changes to Spanish', () => {
      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Mes anterior');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Próximo mes');

      component.locale = 'es';

      expect(langService.setLanguage).toHaveBeenCalledWith('es');
      expect(component.previousMonthLabel).toBe('Mes anterior');
      expect(component.nextMonthLabel).toBe('Próximo mes');
    });

    it('should update labels when locale changes to Russian', () => {
      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Предыдущий месяц');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Следующий месяц');

      component.locale = 'ru';

      expect(langService.setLanguage).toHaveBeenCalledWith('ru');
      expect(component.previousMonthLabel).toBe('Предыдущий месяц');
      expect(component.nextMonthLabel).toBe('Следующий месяц');
    });

    it('should not call setupLabels if locale remains the same', () => {
      vi.spyOn(langService as any, 'setLanguage');

      component.locale = 'pt';
      component.locale = 'pt';

      expect(langService.setLanguage).toHaveBeenCalledTimes(1);
    });

    it('should mark for check when labels are updated', () => {
      const cdr = (component as any).cdr;
      vi.spyOn(cdr as any, 'markForCheck');

      component.locale = 'en';

      expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should return locale value from getter', () => {
      component.locale = 'pt-BR';

      expect(component.locale).toBe('pt-BR');
    });

    it('should setup labels without setting language when locale is not defined', () => {
      (component as any)._locale = undefined;
      (component as any).labelsInitialized = false;

      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel').mockReturnValue('Previous');
      vi.spyOn(langService as any, 'getNextMonthLabel').mockReturnValue('Next');

      (component as any).setupLabels();

      expect(langService.setLanguage).not.toHaveBeenCalled();
      expect(component.previousMonthLabel).toBe('Previous');
      expect(component.nextMonthLabel).toBe('Next');
    });

    it('should not call setupLabels on ngOnInit if labels already initialized', () => {
      (component as any).labelsInitialized = true;

      vi.spyOn(langService as any, 'setLanguage');
      vi.spyOn(langService as any, 'getPreviousMonthLabel');

      component.ngOnInit();

      expect(langService.setLanguage).not.toHaveBeenCalled();
      expect(langService.getPreviousMonthLabel).not.toHaveBeenCalled();
    });
  });

  it('should handle multiple changes at once in ngOnChanges', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges');

    component.ngOnChanges({
      templateContext: { currentValue: {}, previousValue: {}, firstChange: false, isFirstChange: () => false },
      monthOptions: { currentValue: [], previousValue: [], firstChange: false, isFirstChange: () => false },
      headerTemplate: { currentValue: null, previousValue: null, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should silently catch errors in detectChanges', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges').mockImplementation(() => {
      throw new Error('ExpressionChangedAfterItHasBeenCheckedError');
    });

    expect(() => {
      component.ngOnChanges({
        templateContext: { currentValue: {}, previousValue: {}, firstChange: false, isFirstChange: () => false }
      });
    }).not.toThrow();

    expect(cdr.markForCheck).toHaveBeenCalled();
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('should not call markForCheck when ngOnChanges receives unrelated changes', () => {
    const cdr = (component as any).cdr;

    vi.spyOn(cdr as any, 'markForCheck');
    vi.spyOn(cdr as any, 'detectChanges');

    component.ngOnChanges({
      displayMonth: { currentValue: 5, previousValue: 4, firstChange: false, isFirstChange: () => false }
    });

    expect(cdr.markForCheck).not.toHaveBeenCalled();
    expect(cdr.detectChanges).not.toHaveBeenCalled();
  });
});
