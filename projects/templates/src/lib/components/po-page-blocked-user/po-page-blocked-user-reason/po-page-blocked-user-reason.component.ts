import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { PoLanguageService, poLocaleDefault } from '@po-ui/ng-components';

import { poPageBlockedUserLiterals } from './../literals/i18n/po-page-blocked-user-literals';
import { PoPageBlockedUserReason } from '../enums/po-page-blocked-user-reason.enum';
import { PoPageBlockedUserReasonParams } from '../interfaces/po-page-blocked-user-reason-params.interface';

@Component({
  selector: 'po-page-blocked-user-reason',
  templateUrl: './po-page-blocked-user-reason.component.html'
})
export class PoPageBlockedUserReasonComponent implements OnChanges, OnInit {
  literalParams;
  literals: { title: string; firstPhrase: string; secondPhrase: string; thirdPhrase: string };

  private language: string;

  @Input('p-params') params: PoPageBlockedUserReasonParams;

  @Input('p-reason') reason: PoPageBlockedUserReason;

  constructor(private changeDetector: ChangeDetectorRef, languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reason || changes.params) {
      this.getLiterals();
    }
  }

  ngOnInit() {
    this.getLiterals();
  }

  getImageByReasonType() {
    let reasonImage;

    switch (this.reason) {
      case 'none': {
        reasonImage = 'big-lock';
        break;
      }
      case 'exceededAttempts': {
        reasonImage = 'blocked-user';
        break;
      }
      case 'expiredPassword': {
        reasonImage = 'expired';
        break;
      }
    }
    return `./assets/images/${reasonImage}.svg`;
  }

  getParams() {
    this.literalParams =
      this.reason === 'expiredPassword'
        ? [this.params.days, this.params.days]
        : [this.params.attempts, this.params.hours];
  }

  private getLiterals() {
    this.getParams();

    this.literals = {
      ...poPageBlockedUserLiterals[this.reason][poLocaleDefault],
      ...poPageBlockedUserLiterals[this.reason][this.language]
    };

    this.changeDetector.detectChanges();
  }
}
