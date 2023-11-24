import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';

import { PoBadgeBaseComponent } from './po-badge-base.component';
import { PoBadgeLiterals } from './interfaces/po-badge-literals.interface';
import { PoBadgeLiteralsDefault } from './interfaces/po-badge-literals-default';
import { PoLanguageService } from '../../services/po-language/po-language.service';

const PO_BADGE_MAX_NOTIFICATIONS = 9;

/**
 * @docsExtends PoBadgeBaseComponent
 *
 * @example
 *
 * <example name="po-badge-basic" title="PO Badge Basic">
 *  <file name="sample-po-badge-basic/sample-po-badge-basic.component.html"> </file>
 *  <file name="sample-po-badge-basic/sample-po-badge-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-badge-labs" title="PO Badge Labs">
 *  <file name="sample-po-badge-labs/sample-po-badge-labs.component.html"> </file>
 *  <file name="sample-po-badge-labs/sample-po-badge-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-badge-message" title="PO Badge Message">
 *  <file name="sample-po-badge-message/sample-po-badge-message.component.html"> </file>
 *  <file name="sample-po-badge-message/sample-po-badge-message.component.css"> </file>
 *  <file name="sample-po-badge-message/sample-po-badge-message.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-badge',
  templateUrl: './po-badge.component.html',
  styles: [':host { display: inline-block; vertical-align: middle; }']
})
export class PoBadgeComponent extends PoBadgeBaseComponent implements OnInit, OnChanges {
  isNotification: boolean = false;
  notificationLabel: string = '';
  literals: PoBadgeLiterals;
  badgeIcon: string = '';
  isValidValue: boolean = false;

  private poLanguageService = inject(PoLanguageService);

  ngOnInit(): void {
    this.literals = PoBadgeLiteralsDefault[this.poLanguageService.getShortLanguage()];

    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'] || changes['icon']) {
      this.setStatus();
    }

    if (changes['value']) {
      this.setBadgeValue();
      this.setBadgeNotification(changes['value'].currentValue);
      this.setLiterals();
    }
  }

  initialize() {
    this.setStatus();
    this.setLiterals();
    this.setBadgeValue();
    this.setBadgeNotification(this.value);
  }

  getChangeStyle() {
    if ((this.color === 'color-07' && !this.customColor) || this.status) {
      return 'po-badge-default';
    } else if (this.color) {
      return `po-${this.color}`;
    }
  }

  setLiterals() {
    if (this.value) {
      this.notificationLabel =
        this.value > 1
          ? `${this.ariaLabel ?? ''} ${this.value} ${this.literals?.notifications}`
          : `${this.ariaLabel ?? ''} ${this.value} ${this.literals?.notification}`;
    } else {
      this.notificationLabel = `${this.ariaLabel ?? ''} ${this.literals?.notification}`;
    }
  }

  setStatus() {
    this.isNotification = false;
    this.badgeValue = null;
    this.switchIconStatus();
  }

  switchIconStatus() {
    if (typeof this.icon === 'boolean' && this.icon) {
      this.badgeIcon = '';

      if (['positive', 'negative', 'warning', 'disabled'].includes(this.status)) {
        switch (this.status) {
          case 'positive':
            this.badgeIcon = 'po-icon-ok';
            break;

          case 'negative':
            this.badgeIcon = 'po-icon-minus';
            break;

          case 'warning':
            this.badgeIcon = 'po-icon-warning';
            break;
        }
      }
    } else {
      this.badgeIcon = this.icon as string;
    }
  }

  private setBadgeNotification(value: number): boolean {
    if (value > 1 && !this.status) {
      this.isNotification = true;
      return true;
    } else {
      this.isNotification = false;
      this.badgeValue = null;
      return false;
    }
  }

  private setBadgeValue(): void {
    if (this.value) {
      this.checkBadgeValue(this.value);
    }
  }

  private checkBadgeValue(value: number): void {
    this.isValidValue = Number.isInteger(value) && value >= 1;
    this.badgeValue = this.isValidValue ? this.formatBadgeValue(value) : '';
  }

  private formatBadgeValue(value: number): string {
    return value > PO_BADGE_MAX_NOTIFICATIONS ? '9+' : value.toString();
  }
}
