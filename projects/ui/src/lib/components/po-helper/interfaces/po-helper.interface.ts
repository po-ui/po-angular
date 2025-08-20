export interface PoHelperOptions {
  title?: string;

  content?: string;

  type?: 'info' | 'help';

  footerAction?: { label: string; action: Function };

  popoverTrigger?: 'hover' | 'click';

  popoverPosition?: 'top' | 'bottom' | 'left' | 'right';

  eventOnClick?: (event: Event) => void;

  eventOnHover?: (event: Event) => void;
}
