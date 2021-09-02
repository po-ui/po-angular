import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    console.log({ tileKind });
    return this.load(tileKind).pipe(
      tap(loaded => {
        if (loaded) {
          const tile = this.createComponent(tileKind, element, props, classStyle, events, slotText);
          this.componentsAdded.push(tile);
        }
      })
    );
  }

  notifyAll(props?: any) {
    // console.log('notify', this._model);
    this.componentsAdded.forEach(component => {
      console.log('testinho', props, this._model);
      if (typeof component.notify === 'function') {
        component.notify(props, this._model);
      }
    });
  }

  setModel(model) {
    this._model = { ...this._model, ...model };
    console.log('setModel', model, this._model);
  }

  private load(component: string): Observable<boolean> {
    const teste = this.loaded.find(custom => custom.component === component);
    console.log(teste);
    if (this.loaded.find(custom => custom.component === component)) {
      console.log('retornei');
      const element = document.getElementById(component);
      document.body.removeChild(element);
      this.loaded.shift();
      // return of(true);
    }

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
        console.log({ element });
        if (element == null) {
          console.log('nao exite');
          document.body.appendChild(script);
        } else {
          console.log('existe');
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
