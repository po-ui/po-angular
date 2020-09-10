import { Component } from '@angular/core';
import { PoLanguage } from '@po-ui/ng-components';
import { PoPageLoginLiterals } from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-login-automatic-service',
  templateUrl: './sample-po-page-login-automatic-service.component.html'
})
export class SamplePoPageLoginAutomaticServiceComponent {
  literals: PoPageLoginLiterals;
  japoneseLiterals: PoPageLoginLiterals = {
    welcome: 'ようこそ',
    loginLabel: 'ユーザー名を入力してください',
    loginPlaceholder: 'アクセスユーザーを入力してください',
    passwordErrorPattern: 'パスワードが必要',
    passwordLabel: 'パスワードを入力してください',
    passwordPlaceholder: 'パスワードを入力してください',
    submitLabel: 'アクセスシステム',
    submittedLabel: 'ローディング中 ...',
    rememberUser: '自動的にログイン',
    rememberUserHint: 'このオプションはシステムメニューで無効にできます',
    loginHint: `ユーザーは最初の日にあなたに配達されました。
    この情報を紛失した場合は、サポートにお問い合わせください`
  };

  languages: Array<PoLanguage> = [
    { language: 'pt', description: 'Português' },
    { language: 'jp', description: '日本語' }
  ];

  changeLanguage(language: PoLanguage) {
    if (language?.language === 'jp') {
      this.literals = { ...this.japoneseLiterals };
    } else {
      this.literals = {};
    }
  }
}
