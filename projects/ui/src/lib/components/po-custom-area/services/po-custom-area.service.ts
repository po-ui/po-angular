import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CustomComponent, CustomComponents } from '../po-custom-area.interface';

@Injectable({
  providedIn: 'root'
})
export class PoCustomAreaService {
  loaded: CustomComponents = [];
  componentsAdded: Array<any> = [];

  //:TODO: Implementar o método de set da API do I18N
  private _api: string;

  private _model: any = {};

  get api() {
    return this._api;
  }

  set api(api: string) {
    this._api = api;
  }

  constructor(private http: HttpClient) {}

  add(
    tileKind: string,
    element: string,
    props?: { [key: string]: string },
    classStyle?: string,
    events?: { [key: string]: (event: any) => void },
    slotText?: string
  ): Observable<boolean> {
    return this.load(tileKind).pipe(
      tap(loaded => {
        if (loaded) {
          const tile = this.createComponent(tileKind, element, props, classStyle, events, slotText);
          this.componentsAdded.push(tile);
        }
      })
    );
  }

  /**
   *
   * @param props
   *
   * Função utilizada para comunicação entre componente pai e webcomponent.
   */
  notifyAll(props?: any) {
    this.componentsAdded.forEach(component => {
      if (typeof component.notify === 'function') {
        component.notify(props, this._model);
      }
    });
  }

  setModel(model) {
    this._model = { ...this._model, ...model };
  }

  private load(component: string): Observable<boolean> {
    if (this.loaded.find(custom => custom.component === component)) {
      const element = document.getElementById(component);
      document.body.removeChild(element);
      this.loaded.shift();
      // return of(true);
    }

    // Este `authorization` precisa ser recebido do backend do produto padrão
    const authorization =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTY0MzcyMjg5MiwiZXhwIjoxNjQzODA5MjkyfQ.cOnEMXRCTE_y0LkSrgMUhTtbTD18_-ivOMTHYtSfrHQ';

    const customHeaders = {
      'Authorization': `Bearer ${authorization}`
    };
    const requestOptions = {
      headers: new HttpHeaders(customHeaders)
    };

    return this.http.get<CustomComponent>(`${this.api}/${component}`).pipe(
      map(custom => ({ ...custom, src: atob(custom.src) })),
      map(custom => {
        const { src, ...customNoSrc } = custom;
        const customId = customNoSrc.component;
        this.loaded.push(customNoSrc);
        const script = document.createElement('script');
        script.text = src;
        script.id = customId;
        if (custom?.integrity) {
          script.integrity = custom.integrity;
          script.crossOrigin = 'anonymous';
        }
        const element = document.getElementById(customId);
        if (element == null) {
          document.body.appendChild(script);
        } else {
          document.body.removeChild(element);
          document.body.appendChild(script);
        }
        return true;
      })
    );
  }

  private createComponent(
    tileKind: string,
    element: string,
    props?: { [key: string]: string },
    classStyle?: string,
    events?: { [key: string]: (event: any) => void },
    slotText?: string
  ) {
    const tile = document.createElement(tileKind);
    if (props) {
      Object.keys(props).forEach(prop => {
        tile.setAttribute(prop, props[prop]);
      });
    }

    if (events) {
      Object.keys(events).forEach(event => {
        tile.addEventListener(event, events[event]);
      });
    }

    if (classStyle) {
      tile.setAttribute('class', classStyle);
    }

    if (slotText) {
      tile.innerHTML = slotText;
    }

    const content = document.getElementById(element);
    content.appendChild(tile);

    return tile;
  }
}
