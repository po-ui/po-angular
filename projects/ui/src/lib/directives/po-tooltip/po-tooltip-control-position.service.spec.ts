import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

import { PoTooltipControlPositionService } from './po-tooltip-control-position.service';

describe('PoTooltipControlPositionService:', () => {
  const service = new PoTooltipControlPositionService();

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(PoTooltipControlPositionService instanceof PoControlPositionService);
  });
});
