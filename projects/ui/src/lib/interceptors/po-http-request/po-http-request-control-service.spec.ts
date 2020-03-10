import { Observable } from 'rxjs';

import { PoHttpRequesControltService } from './po-http-request-control-service';

describe('PoHttpRequesControltService: ', () => {
  const httpRequestControlService: PoHttpRequesControltService = new PoHttpRequesControltService();

  it('should be created.', () => {
    expect(httpRequestControlService instanceof PoHttpRequesControltService).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('getControlHttpRequest: should return a observable when call `getControlHttpRequest` method.', () => {
      const observable = httpRequestControlService.getControlHttpRequest();

      expect(observable instanceof Observable).toBeTruthy();
    });

    it('send: should call `next` when receive a request.', () => {
      spyOn(httpRequestControlService.controlHttpRequest, 'next');

      httpRequestControlService.send(2);

      expect(httpRequestControlService.controlHttpRequest.next).toHaveBeenCalled();
    });

    it('send: should call `next` when receive a request without value in `send` method.', () => {
      spyOn(httpRequestControlService.controlHttpRequest, 'next');

      httpRequestControlService.send();

      expect(httpRequestControlService.controlHttpRequest.next).toHaveBeenCalled();
    });
  });
});
