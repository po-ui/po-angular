import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoIconService {
  private iconDefault = {
    po_icon_a11y_elderly: 'po-icon-a11y-elderly',
    po_icon_a11y_pregnant: 'po-icon-a11y-pregnant',
    po_icon_a11y_wheelchair: 'po-icon-a11y-wheelchair',
    po_icon_agro_business: 'po-icon-agro-business',
    po_icon_align_center: 'po-icon-align-center',
    po_icon_align_justify: 'po-icon-align-justify',
    po_icon_align_left: 'po-icon-align-left',
    po_icon_align_right: 'po-icon-align-right',
    po_icon_anchor: 'po-icon-anchor',
    po_icon_archive: 'po-icon-archive',
    po_icon_arrow_down: 'po-icon-arrow-down',
    po_icon_arrow_left: 'po-icon-arrow-left',
    po_icon_arrow_right: 'po-icon-arrow-right',
    po_icon_arrow_up: 'po-icon-arrow-up',
    po_icon_attach: 'po-icon-attach',
    po_icon_automatic_barrier: 'po-icon-automatic-barrier',
    po_icon_balance: 'po-icon-balance',
    po_icon_balance_weight: 'po-icon-balance-weight',
    po_icon_bar_code: 'po-icon-bar-code',
    po_icon_basket: 'po-icon-basket',
    po_icon_bluetooth: 'po-icon-bluetooth',
    po_icon_book: 'po-icon-book',
    po_icon_calculator: 'po-icon-calculator',
    po_icon_calendar: 'po-icon-calendar',
    po_icon_calendar_ok: 'po-icon-calendar-ok',
    po_icon_calendar_settings: 'po-icon-calendar-settings',
    po_icon_camera: 'po-icon-camera',
    po_icon_cart: 'po-icon-cart',
    po_icon_change: 'po-icon-change',
    po_icon_chart_area: 'po-icon-chart-area',
    po_icon_chart_columns: 'po-icon-chart-columns',
    po_icon_chat: 'po-icon-chat',
    po_icon_clear_content: 'po-icon-clear-content',
    po_icon_delete: 'po-icon-delete',
    po_icon_settings: 'po-icon-settings',
    po_icon_finance: 'po-icon-finance',
  };

  private iconParttern = {
    address_book: 'ph ph-address-book',
    air_traffic_control: 'ph ph-air_traffic_control',
    airplane: 'ph ph-airplane',
    airplane_in_flight: 'ph ph-airplane_in_flight',
    airplane_landing: 'ph ph-airplane_landing',
    airplane_takeoff: 'ph ph-airplane_takeoff',
    airplay: 'ph ph-airplay',
    alarm: 'ph ph-alarm',
    alien: 'ph ph-alien',
    align_bottom: 'ph ph-align_bottom',
    align_bottom_simple: 'ph ph-align_bottom_simple',
    align_center_horizontal: 'ph ph-align_center_horizontal',
    align_center_horizontal_simple: 'ph ph-align_center_horizontal_simple',
    align_center_vertical: 'ph ph-align_center_vertical',
    align_center_vertical_simple: 'ph ph-align_center_vertical_simple',
    align_left: 'ph ph-align_left',
    align_left_simple: 'ph ph-align_left_simple',
    align_right: 'ph ph-align_right',
    align_top: 'ph ph-align_top',
    question: 'ph ph-question',
    arrow_down: 'ph ph-arrow-down',
    arrow_up: 'ph ph-arrow-up'
  };

  get icons() {
    return {
      ...this.iconDefault,
      ...this.iconParttern
    };
  }
}
