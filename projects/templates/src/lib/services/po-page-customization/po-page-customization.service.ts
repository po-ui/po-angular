import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoPageDynamicOptionsSchema, PoPageDynamicOptionsProp } from './po-page-dynamic-options.interface';

type urlOrFunction = string | Function;

@Injectable({
  providedIn: 'root'
})
export class PoPageCustomizationService {
  constructor(private http: HttpClient) {}

  getCustomOptions<T>(
    origin: urlOrFunction,
    originalOption: T,
    optionSchema: PoPageDynamicOptionsSchema<T>
  ): Observable<T> {
    return this.createObservable<T>(origin).pipe(
      map(newPageOptions => this.mergePageOptions<T>(originalOption, newPageOptions, optionSchema))
    );
  }

  changeOriginalOptionsToNewOptions<T, K>(objectToChange: T, newOptions: K) {
    Object.keys(newOptions).forEach(key => {
      const value = newOptions[key];
      if (objectToChange[key] !== undefined) {
        if (Array.isArray(value)) {
          objectToChange[key] = [...value];
          return;
        }
        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          objectToChange[key] = value;
          return;
        }
        if (value !== null && typeof value === 'object') {
          objectToChange[key] = { ...value };
        }
      }
    });
  }

  private createObservable<T>(origin: urlOrFunction): Observable<T> {
    if (typeof origin === 'string') {
      return this.http.post<T>(origin, {});
    }
    return from(Promise.resolve(origin()));
  }

  private mergePageOptions<T>(originalOption: T, newPageOptions: T, optionSchema: PoPageDynamicOptionsSchema<T>) {
    const mergePageOptions: T = optionSchema.schema.reduce(
      (objWithNewProp, prop) => ({
        ...objWithNewProp,
        [prop.nameProp]: this.createNewProp(prop, originalOption, newPageOptions)
      }),
      {} as T
    );

    Object.keys(mergePageOptions).forEach(key => mergePageOptions[key] === undefined && delete mergePageOptions[key]);

    return mergePageOptions;
  }

  private createNewProp<T>(prop: PoPageDynamicOptionsProp<T>, originalOption: T, newPageOptions: T) {
    if (prop.merge) {
      return this.mergeOptions(originalOption[prop.nameProp], newPageOptions[prop.nameProp], prop.keyForMerge);
    } else {
      return newPageOptions[prop.nameProp] ?? originalOption[prop.nameProp];
    }
  }

  private mergeOptions<T>(originalOptions: Array<T> | T, newOptions: Array<T> | T, filterProp?: keyof T) {
    if (!originalOptions && !newOptions) {
      return;
    }
    if (!newOptions) {
      return originalOptions;
    }
    if (!originalOptions) {
      return newOptions;
    }

    if (originalOptions instanceof Array && newOptions instanceof Array) {
      return this.mergeOptionsArray(originalOptions, newOptions, filterProp);
    }

    return { ...originalOptions, ...newOptions };
  }

  private mergeOptionsArray<T>(originalOptions: Array<T>, newOptions: Array<T>, filterProp: keyof T) {
    const deduplicateNewOptions = newOptions.filter(
      newItem => !originalOptions.find(originalItem => originalItem[filterProp] === newItem[filterProp])
    );
    const mergedOriginalOptions = originalOptions.map(originalItem => {
      const newItem =
        newOptions.find(newOptionsItem => originalItem[filterProp] === newOptionsItem[filterProp]) || originalItem;
      return { ...originalItem, ...newItem };
    });
    return [...mergedOriginalOptions, ...deduplicateNewOptions];
  }
}
