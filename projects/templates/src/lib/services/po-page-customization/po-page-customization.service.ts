import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoPageDynamicOptions, UrlOrPoCustomizationFunction } from './po-page-dynamic-options.interface';

@Injectable({
  providedIn: 'root'
})

export class PoPageCustomizationService {

  constructor(private http: HttpClient) { }

  getCustomOptions(origin: UrlOrPoCustomizationFunction, originalOption: PoPageDynamicOptions): Observable<PoPageDynamicOptions> {
    return this.createObservable(origin).pipe(
      map(newPageOptions => this.mergePageOptions(originalOption, newPageOptions))
    );
  }

  changeOriginalOptionsToNewOptions<T, K>(objectToChange: T, newOptions: K) {
    Object.keys(newOptions).forEach(key => {
      const value = newOptions[key];
      if (objectToChange[key]) {
        if (Array.isArray(value)) {
          objectToChange[key] = [...value];
          return;
        }
        if ((typeof (value) === 'number' || typeof (value) === 'string')) {
          objectToChange[key] = value;
          return;
        }
        if (typeof (value) === 'object') {
          objectToChange[key] = { ...value };
        }
      }
    });
  }

  private createObservable(origin: UrlOrPoCustomizationFunction): Observable<PoPageDynamicOptions> {
    if (typeof origin === 'string') {
      return this.http.post<PoPageDynamicOptions>(origin, {});
    }
    return from(Promise.resolve(origin()));
  }

  private mergePageOptions(originalOption: PoPageDynamicOptions, newPageOptions: PoPageDynamicOptions): PoPageDynamicOptions {
    const mergePageOptions: PoPageDynamicOptions = {
      filters: this.mergeOptions(originalOption.filters, newPageOptions.filters, 'property'),
      actions: this.mergeOptions(originalOption.actions, newPageOptions.actions, 'label'),
      breadcrumb: newPageOptions.breadcrumb ? newPageOptions.breadcrumb : originalOption.breadcrumb,
      title: newPageOptions.title ? newPageOptions.title : originalOption.title
    };

    Object.keys(mergePageOptions).forEach(key => !mergePageOptions[key] && delete mergePageOptions[key]);

    return mergePageOptions;
  }

  private mergeOptions<T>(originalOptions: Array<T>, newOptions: Array<T>, filterProp: keyof T): Array<T> {

    if (!originalOptions && !newOptions) {
      return;
    }
    if (!newOptions) {
      return originalOptions;
    }
    if (!originalOptions) {
      return newOptions;
    }

    const deduplicateNewOptions = newOptions.filter(
      newItem => !originalOptions.find(originalItem => originalItem[filterProp] === newItem[filterProp]));
    const mergedOriginalOptions = originalOptions.map(originalItem => {
        const newItem = newOptions.find(newOptionsItem => originalItem[filterProp] === newOptionsItem[filterProp]) || originalItem;
        return {...originalItem, ...newItem};
      }
    );

    return [...mergedOriginalOptions, ...deduplicateNewOptions];
  }
}
