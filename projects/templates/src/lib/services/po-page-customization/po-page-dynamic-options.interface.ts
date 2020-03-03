export interface PoPageDynamicOptionsSchema<T> {
  schema: Array<PoPageDynamicOptionsProp<T>>;
}

export interface PoPageDynamicOptionsProp<T> {
  nameProp: string;
  merge?: boolean;
  keyForMerge?: string;
}
