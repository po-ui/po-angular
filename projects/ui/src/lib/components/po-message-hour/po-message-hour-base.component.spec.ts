import { PoMessageHourBaseComponent } from './po-message-hour-base.component';

describe('PoMessageHourBaseComponent:', () => {
  let component: PoMessageHourBaseComponent;

  beforeEach(() => {
    component = new PoMessageHourBaseComponent();
  });

  it('should be created', () => {
    expect(component instanceof PoMessageHourBaseComponent).toBeTruthy();
  });
});
