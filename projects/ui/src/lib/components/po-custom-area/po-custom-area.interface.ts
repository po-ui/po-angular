export interface CustomComponent {
  component?: string;
  src?: string;
  load?: boolean;
  integrity?: string;
}

export type CustomComponents = Array<CustomComponent>;
