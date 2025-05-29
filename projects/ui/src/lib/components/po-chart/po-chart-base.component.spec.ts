import { PoChartBaseComponent } from './po-chart-base.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoChartLiterals } from '../po-chart/interfaces/po-chart-literals.interface';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { poChartLiteralsDefault } from '../po-chart/interfaces/po-chart-literals-default.interface';

class PoChartNewBaseComponentMock extends PoChartBaseComponent {}

describe('PoChartNewBaseComponent', () => {
  let component: PoChartNewBaseComponentMock;
  let languageService: PoLanguageService;

  const mockSeries = [{ label: 'Serie 1', data: [1, 2, 3] }];
  const mockCategories = ['Jan', 'Fev', 'Mar'];
  const mockLiterals: PoChartLiterals = { downloadCSV: 'Custom Download' };

  beforeEach(() => {
    languageService = new PoLanguageService();
    component = new PoChartNewBaseComponentMock(languageService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-title: should set title correctly', () => {
      const testTitle = 'Chart Title';
      component.title = testTitle;
      expect(component.title).toBe(testTitle);
    });

    it('p-series: should set series correctly', () => {
      component.series = mockSeries;
      expect(component.series).toEqual(mockSeries);
    });

    it('p-categories: should set categories correctly', () => {
      component.categories = mockCategories;
      expect(component.categories).toEqual(mockCategories);
    });

    it('p-height: should handle height correctly with default, valid and minimum values', () => {
      expect(component.height).toBe(400);

      component.height = 300;
      expect(component.height).toBe(300);

      component.height = 100;
      expect(component.height).toBe(200);

      component.height = null;
      expect(component.height).toBe(400);

      component.height = undefined;
      expect(component.height).toBe(400);
    });

    it('p-type: should set type correctly', () => {
      component.type = PoChartType.Line;
      expect(component.type).toBe(PoChartType.Line);
    });

    it('p-literals: should set literals correctly', () => {
      component.literals = mockLiterals;
      expect(component.literals.downloadCSV).toBe('Custom Download');
    });

    it('p-literals: should use default literals if not provided', () => {
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);
    });

    it('p-literals: should use default literals if value is invalid', () => {
      component.literals = null;
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);

      component.literals = undefined;
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);

      component.literals = 'invalid' as any;
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);

      component.literals = 123 as any;
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);

      component.literals = [] as any;
      expect(component.literals).toEqual(poChartLiteralsDefault[languageService.getShortLanguage()]);
    });

    it('t-id: should set id correctly', () => {
      const testId = 'customId';
      component.id = testId;
      expect(component.id).toBe(testId);
    });
  });

  describe('Outputs:', () => {
    it('p-series-click: should emit event', () => {
      const mockEvent = { label: 'Test', value: 10 };
      spyOn(component.seriesClick, 'emit');

      component.seriesClick.emit(mockEvent);
      expect(component.seriesClick.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('p-series-hover: should emit event', () => {
      const mockEvent = { label: 'Test', value: 10 };
      spyOn(component.seriesHover, 'emit');

      component.seriesHover.emit(mockEvent);
      expect(component.seriesHover.emit).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Constructor:', () => {
    it('should set language based on languageService', () => {
      const shortLanguage = languageService.getShortLanguage();
      expect(component['language']).toBe(shortLanguage);
    });
  });
});
