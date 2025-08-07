export interface PoHeaderUser {
  avatar: string;
  customerBrand: string;
  action?: Function;
  status?: 'positive' | 'negative' | 'warning' | 'disabled';
}
