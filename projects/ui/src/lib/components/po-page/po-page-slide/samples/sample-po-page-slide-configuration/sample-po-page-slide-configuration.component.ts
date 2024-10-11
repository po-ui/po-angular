import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sample-po-page-slide-configuration',
  templateUrl: './sample-po-page-slide-configuration.component.html'
})
export class SamplePoPageSlideConfigurationComponent {
  public bluetooth = true;
  public locked = false;
  public microphone = true;
  public notification = true;
  public favorited = false;
  public localization = true;

  constructor(private router: Router) {}

  openPageSlideFooterDocumentation() {
    this.router.navigate(['documentation', 'po-page-slide-footer']);
  }
}
