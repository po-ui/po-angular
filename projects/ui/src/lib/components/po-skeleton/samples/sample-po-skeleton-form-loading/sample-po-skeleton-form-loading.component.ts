import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-skeleton-form-loading',
  templateUrl: './sample-po-skeleton-form-loading.component.html',
  standalone: false
})
export class SamplePoSkeletonFormLoadingComponent {

  isLoading = true;
  name = '';
  email = '';
  description = '';
  city = '';
  cityOptions = [
    { label: 'São Paulo', value: 'sp' },
    { label: 'Rio de Janeiro', value: 'rj' },
    { label: 'Belo Horizonte', value: 'bh' }
  ];

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

}
