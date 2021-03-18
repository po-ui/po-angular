export interface CustomComponent {
  component?: string;
  src?: string;
  load?: boolean;
}

export type CustomComponents = Array<CustomComponent>;
