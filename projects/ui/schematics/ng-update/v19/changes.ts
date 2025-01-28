import { UpdateDependencies } from '@po-ui/ng-schematics/package-config';

//regex para remover po-icon
const regexRemovePoIconInside = new RegExp('(?<=\\s|^)po-icon(?=\\s|$)', 'gmi');
const regexRemovePoIcon = new RegExp('(?<!<)po-icon(?=\\s|$|"|\')', 'gmi');

const regexRemovePhIcon = new RegExp('(?<=\\s|^|["\'`])ph(?=\\s|$|["\'`])', 'gmi');
const regexRemovePhHifenIcon = new RegExp('(?<=\\s|^|["\'`])ph-(?=\\w)', 'gmi');

export const iconsReplaced: Array<ReplaceChanges> = [
  { replace: 'po-icon-a11y-elderly', replaceWith: 'an-elderly' },
  { replace: 'po-icon-a11y-pregnant', replaceWith: 'an-pregnant' },
  { replace: 'po-icon-a11y-wheelchair', replaceWith: 'an-wheelchair' },
  { replace: 'po-icon-agro-business', replaceWith: 'an-plant' },
  { replace: 'po-icon-align-center', replaceWith: 'an-text-align-center' },
  { replace: 'po-icon-align-justify', replaceWith: 'an-text-align-justify' },
  { replace: 'po-icon-align-left', replaceWith: 'an-text-align-left' },
  { replace: 'po-icon-align-right', replaceWith: 'an-text-align-right' },
  { replace: 'po-icon-anchor', replaceWith: 'an-anchor' },
  { replace: 'po-icon-archive', replaceWith: 'an-archive' },
  { replace: 'po-icon-arrow-down', replaceWith: 'an-caret-down' },
  { replace: 'po-icon-arrow-left', replaceWith: 'an-caret-left' },
  { replace: 'po-icon-arrow-right', replaceWith: 'an-caret-right' },
  { replace: 'po-icon-arrow-up', replaceWith: 'an-caret-up' },
  { replace: 'po-icon-attach', replaceWith: 'an-paperclip' },
  { replace: 'po-icon-automatic-barrier', replaceWith: 'an-automatic-barrier' },
  { replace: 'po-icon-balance', replaceWith: 'an-scales' },
  { replace: 'po-icon-balance-weight', replaceWith: 'an-balance-weight' },
  { replace: 'po-icon-bar-code', replaceWith: 'an-barcode' },
  { replace: 'po-icon-basket', replaceWith: 'an-basket' },
  { replace: 'po-icon-bluetooth', replaceWith: 'an-bluetooth' },
  { replace: 'po-icon-book', replaceWith: 'an-book-bookmark' },
  { replace: 'po-icon-calculator', replaceWith: 'an-calculator' },
  { replace: 'po-icon-calendar', replaceWith: 'an-calendar-dots' },
  { replace: 'po-icon-calendar-ok', replaceWith: 'an-calendar-check' },
  { replace: 'po-icon-calendar-settings', replaceWith: 'an-calendar-gear' },
  { replace: 'po-icon-camera', replaceWith: 'an-camera' },
  { replace: 'po-icon-cart', replaceWith: 'an-shopping-cart-simple' },
  { replace: 'po-icon-change', replaceWith: 'an-swap' },
  { replace: 'po-icon-chart-area', replaceWith: 'an-chart-line' },
  { replace: 'po-icon-chart-columns', replaceWith: 'an-chart-bar' },
  { replace: 'po-icon-chat', replaceWith: 'an-chats' },
  { replace: 'po-icon-clear-content', replaceWith: 'an-fill an-x-circle', fill: true },
  { replace: 'po-icon-clipboard', replaceWith: 'an-clipboard' },
  { replace: 'po-icon-clock', replaceWith: 'an-clock' },
  { replace: 'po-icon-close', replaceWith: 'an-x' },
  { replace: 'po-icon-company', replaceWith: 'an-building-apartment' },
  { replace: 'po-icon-construction', replaceWith: 'an-hard-hat' },
  { replace: 'po-icon-copy', replaceWith: 'an-copy' },
  { replace: 'po-icon-cotton', replaceWith: 'an-cotton' },
  { replace: 'po-icon-credit-payment', replaceWith: 'an-credit-card' },
  { replace: 'po-icon-cut', replaceWith: 'an-selection-background' },
  { replace: 'po-icon-database', replaceWith: 'an-database' },
  { replace: 'po-icon-debit-payment', replaceWith: 'an-debit-card' },
  { replace: 'po-icon-delete', replaceWith: 'an-trash' },
  { replace: 'po-icon-device-desktop', replaceWith: 'an-monitor' },
  { replace: 'po-icon-device-notebook', replaceWith: 'an-laptop' },
  { replace: 'po-icon-device-smartphone', replaceWith: 'an-device-mobile' },
  { replace: 'po-icon-device-tablet', replaceWith: 'an-device-tablet-speaker' },
  { replace: 'po-icon-doc-xls', replaceWith: 'an-file-xls' },
  { replace: 'po-icon-document', replaceWith: 'an-file' },
  { replace: 'po-icon-document-double', replaceWith: 'an-files' },
  { replace: 'po-icon-document-filled', replaceWith: 'an-file-text' },
  { replace: 'po-icon-download', replaceWith: 'an-download-simple' },
  { replace: 'po-icon-edit', replaceWith: 'an-pencil-simple' },
  { replace: 'po-icon-exam', replaceWith: 'an-flask' },
  { replace: 'po-icon-exclamation', replaceWith: 'an-warning-circle' },
  { replace: 'po-icon-exit', replaceWith: 'an-sign-out' },
  { replace: 'po-icon-export', replaceWith: 'an-arrow-square-out' },
  { replace: 'po-icon-eye', replaceWith: 'an-eye' },
  { replace: 'po-icon-eye-off', replaceWith: 'an-eye-closed' },
  { replace: 'po-icon-filter', replaceWith: 'an-funnel' },
  { replace: 'po-icon-finance', replaceWith: 'an-currency-circle-dollar' },
  { replace: 'po-icon-finance-bitcoin', replaceWith: 'an-currency-btc' },
  { replace: 'po-icon-finance-secure', replaceWith: 'an-currency-dollar-simple' },
  { replace: 'po-icon-first-page', replaceWith: 'an-caret-double-left' },
  { replace: 'po-icon-folder', replaceWith: 'an-folder' },
  { replace: 'po-icon-food', replaceWith: 'an-fork-knife' },
  { replace: 'po-icon-food-menu', replaceWith: 'an-fork-knife' },
  { replace: 'po-icon-gas', replaceWith: 'an-gas-pump' },
  { replace: 'po-icon-gift', replaceWith: 'an-gift' },
  { replace: 'po-icon-grid', replaceWith: 'an-squares-four' },
  { replace: 'po-icon-handshake', replaceWith: 'an-handshake' },
  { replace: 'po-icon-hdd', replaceWith: 'an-hard-drive-disk' },
  { replace: 'po-icon-help', replaceWith: 'an-question' },
  { replace: 'po-icon-history', replaceWith: 'an-clock-counter-clockwise' },
  { replace: 'po-icon-home', replaceWith: 'an-house-line' },
  { replace: 'po-icon-image-align-inline', replaceWith: 'an-image-align-inline' },
  { replace: 'po-icon-image-align-left', replaceWith: 'an-image-align-left' },
  { replace: 'po-icon-image-align-right', replaceWith: 'an-image-align-right' },
  { replace: 'po-icon-info', replaceWith: 'an-info' },
  { replace: 'po-icon-injector', replaceWith: 'an-syringe' },
  { replace: 'po-icon-keyboard', replaceWith: 'an-keyboard' },
  { replace: 'po-icon-last-page', replaceWith: 'an-caret-double-right' },
  { replace: 'po-icon-layers', replaceWith: 'an-stack-simple' },
  { replace: 'po-icon-light', replaceWith: 'an-lightbulb' },
  { replace: 'po-icon-like', replaceWith: 'an-heart' },
  { replace: 'po-icon-link', replaceWith: 'an-link' },
  { replace: 'po-icon-list', replaceWith: 'an-list-bullets' },
  { replace: 'po-icon-lock', replaceWith: 'an-lock' },
  { replace: 'po-icon-lock-off', replaceWith: 'an-lock-open' },
  { replace: 'po-icon-mail', replaceWith: 'an-envelope' },
  { replace: 'po-icon-manufacture', replaceWith: 'an-factory' },
  { replace: 'po-icon-map', replaceWith: 'an-map-trifold' },
  { replace: 'po-icon-menu', replaceWith: 'an-list' },
  { replace: 'po-icon-menu-close', replaceWith: 'an-menu-close' },
  { replace: 'po-icon-menu-open', replaceWith: 'an-menu-open' },
  { replace: 'po-icon-message', replaceWith: 'an-chat' },
  { replace: 'po-icon-microphone', replaceWith: 'an-microphone' },
  { replace: 'po-icon-minus', replaceWith: 'an-minus' },
  { replace: 'po-icon-minus-circle', replaceWith: 'an-minus-circle' },
  { replace: 'po-icon-money', replaceWith: 'an-money' },
  { replace: 'po-icon-more', replaceWith: 'an-dots-three' },
  { replace: 'po-icon-more-vert', replaceWith: 'an-dots-three-vertical' },
  { replace: 'po-icon-news', replaceWith: 'an-newspaper' },
  { replace: 'po-icon-no-signal', replaceWith: 'an-cloud-slash' },
  { replace: 'po-icon-notification', replaceWith: 'an-bell' },
  { replace: 'po-icon-oil', replaceWith: 'an-drop' },
  { replace: 'po-icon-oil-analysis', replaceWith: 'an-oil-magnifying-glass' },
  { replace: 'po-icon-ok', replaceWith: 'an-check' },
  { replace: 'po-icon-pallet-full', replaceWith: 'an-pallet-full' },
  { replace: 'po-icon-pallet-partial', replaceWith: 'an-pallet-partial' },
  { replace: 'po-icon-parameters', replaceWith: 'an-sliders-horizontal' },
  { replace: 'po-icon-paste', replaceWith: 'an-selection-foreground' },
  { replace: 'po-icon-payment', replaceWith: 'an-hand-coins' },
  { replace: 'po-icon-pdf', replaceWith: 'an-file-pdf' },
  { replace: 'po-icon-picker', replaceWith: 'an-eyedropper' },
  { replace: 'po-icon-picture', replaceWith: 'an-image' },
  { replace: 'po-icon-pin', replaceWith: 'an-map-pin' },
  { replace: 'po-icon-pix-logo', replaceWith: 'an-pix-logo' },
  { replace: 'po-icon-plus', replaceWith: 'an-plus' },
  { replace: 'po-icon-plus-circle', replaceWith: 'an-circle' },
  { replace: 'po-icon-print', replaceWith: 'an-printer' },
  { replace: 'po-icon-pushcart', replaceWith: 'an-shopping-cart-simple' },
  { replace: 'po-icon-qr-code', replaceWith: 'an-qr-code' },
  { replace: 'po-icon-refresh', replaceWith: 'an-arrows-clockwise' },
  { replace: 'po-icon-sale', replaceWith: 'an-newspaper-clipping' },
  { replace: 'po-icon-screen-full', replaceWith: 'an-corners-out' },
  { replace: 'po-icon-screen-minimize', replaceWith: 'an-corners-in' },
  { replace: 'po-icon-search', replaceWith: 'an-magnifying-glass' },
  { replace: 'po-icon-security-guard', replaceWith: 'an-shield-check' },
  { replace: 'po-icon-server', replaceWith: 'an-server' },
  { replace: 'po-icon-settings', replaceWith: 'an-gear' },
  { replace: 'po-icon-share', replaceWith: 'an-share' },
  { replace: 'po-icon-signal', replaceWith: 'an-radio-signal' },
  { replace: 'po-icon-sms', replaceWith: 'an-chat-dots' },
  { replace: 'po-icon-social-github', replaceWith: 'an-github-logo' },
  { replace: 'po-icon-social-instagram', replaceWith: 'an-instagram-logo' },
  { replace: 'po-icon-social-twitter', replaceWith: 'an-x-logo' },
  { replace: 'po-icon-social-whatsapp', replaceWith: 'an-whatsapp-logo' },
  { replace: 'po-icon-sort', replaceWith: 'an-arrows-down-up' },
  { replace: 'po-icon-sort-asc', replaceWith: 'an-arrow-down' },
  { replace: 'po-icon-sort-ascending', replaceWith: 'an-sort-ascending' },
  { replace: 'po-icon-sort-desc', replaceWith: 'an-arrow-up' },
  { replace: 'po-icon-sort-descending', replaceWith: 'an-sort-descending' },
  { replace: 'po-icon-star', replaceWith: 'an-star' },
  { replace: 'po-icon-star-filled', replaceWith: 'an-fill an-star', fill: true },
  { replace: 'po-icon-star-half', replaceWith: 'an-fill an-star-half', fill: true },
  { replace: 'po-icon-steering-wheel', replaceWith: 'an-steering-wheel' },
  { replace: 'po-icon-stock', replaceWith: 'an-package' },
  { replace: 'po-icon-table', replaceWith: 'an-desk' },
  { replace: 'po-icon-target', replaceWith: 'an-target' },
  { replace: 'po-icon-telephone', replaceWith: 'an-phone' },
  { replace: 'po-icon-text-bold', replaceWith: 'an-text-b' },
  { replace: 'po-icon-text-italic', replaceWith: 'an-text-italic' },
  { replace: 'po-icon-text-underline', replaceWith: 'an-text-underline' },
  { replace: 'po-icon-touch', replaceWith: 'an-hand-tap' },
  { replace: 'po-icon-travel', replaceWith: 'an-suitcase-rolling' },
  { replace: 'po-icon-truck', replaceWith: 'an-truck' },
  { replace: 'po-icon-upload', replaceWith: 'an-upload-simple' },
  { replace: 'po-icon-upload-cloud', replaceWith: 'an-cloud-arrow-up' },
  { replace: 'po-icon-user', replaceWith: 'an-user' },
  { replace: 'po-icon-user-add', replaceWith: 'an-user-plus' },
  { replace: 'po-icon-user-delete', replaceWith: 'an-user-x' },
  { replace: 'po-icon-users', replaceWith: 'an-users' },
  { replace: 'po-icon-video-call', replaceWith: 'an-video-camera' },
  { replace: 'po-icon-waiter', replaceWith: 'an-waiter' },
  { replace: 'po-icon-wallet', replaceWith: 'an-wallet' },
  { replace: 'po-icon-warehouse', replaceWith: 'an-warehouse' },
  { replace: 'po-icon-warning', replaceWith: 'an-warning-circle' },
  { replace: 'po-icon-weight', replaceWith: 'an-weight' },
  { replace: 'po-icon-world', replaceWith: 'an-globe' },
  { replace: 'po-icon-xml', replaceWith: 'an-file-xml' },
  { replace: 'po-icon-zoom-in', replaceWith: 'an-magnifying-glass-plus' },
  { replace: 'po-icon-zoom-out', replaceWith: 'an-magnifying-glass-minus' }
];

export interface ReplaceChanges {
  replace: string | RegExp;
  replaceWith: string | Function;
  fill?: boolean;
}

export const updateDepedenciesVersion: UpdateDependencies = {
  dependencies: [
    '@po-ui/ng-components',
    '@po-ui/ng-code-editor',
    '@po-ui/ng-templates',
    '@po-ui/ng-storage',
    '@po-ui/ng-sync',
    '@po-ui/style'
  ]
};

export const poIconInsideReplaces: Array<ReplaceChanges> = [{ replace: regexRemovePoIconInside, replaceWith: '' }];

export const poIconReplaces: Array<ReplaceChanges> = [{ replace: regexRemovePoIcon, replaceWith: '' }];

export const phIconReplaces: Array<ReplaceChanges> = [{ replace: regexRemovePhIcon, replaceWith: 'an' }];

export const phIconHifenReplaces: Array<ReplaceChanges> = [{ replace: regexRemovePhHifenIcon, replaceWith: 'an-' }];
