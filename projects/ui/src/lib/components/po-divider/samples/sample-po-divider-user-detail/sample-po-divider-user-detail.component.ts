import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoBreadcrumb } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-divider-user-detail',
  templateUrl: './sample-po-divider-user-detail.component.html'
})
export class SamplePoDividerUserDetailComponent {
  birthDate: string = '26/12/1978';
  email: string = 'john.doe@portinari.com.br';
  fathersName: string = 'Mike Doe';
  genre: string = 'male';
  graduation: string = 'College Degree';
  mothersName: string = 'Jane Doe';
  name: string = 'John Doe';
  nationality: string = 'USA';
  nickname: string = 'Big John';
  placeOfBirth: string = 'Colorado';
  statusValue: string = 'Success';
  userId: number = 122635;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' }, { label: 'User Detail' }]
  };

  constructor(private router: Router) {}
}
