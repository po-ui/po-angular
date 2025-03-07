import { PoColorService } from '../../services/po-color/po-color.service';
import { PoChartNewBaseComponent } from './po-chart-new-base.component';
import { PoChartNewComponent } from './po-chart-new.component';

describe('PoChartBaseComponent:', () => {
  let component: PoChartNewComponent;

  const colorService: PoColorService = new PoColorService();

  beforeEach(() => {
    component = new PoChartNewComponent();
  });

  it('should be create', () => {
    expect(component instanceof PoChartNewBaseComponent).toBeTruthy();
  });
});
