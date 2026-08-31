import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SamplePoListViewHiringProcessesService {
  getItems() {
    return [
      {
        hireStatus: 'hired',
        hireTagType: 'success',
        name: 'James Johnson',
        city: 'Ontario',
        age: 24,
        idCard: 'AB34lxi90',
        email: 'james@johnson.com',
        telephone: '1-541-754-3010',
        jobDescription: 'Systems Analyst',
        url: 'https://po-ui.io/',
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      {
        hireStatus: 'progress',
        hireTagType: 'info',
        name: 'Brian Brown',
        city: 'Buffalo',
        age: 23,
        idCard: 'HG56lds54',
        email: 'brian@brown.com',
        telephone: '1-543-456-9876',
        jobDescription: 'Trainee',
        url: 'https://po-ui.io/',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      {
        hireStatus: 'canceled',
        hireTagType: 'danger',
        name: 'Mary Davis',
        city: 'Albany',
        age: 31,
        idCard: 'DF23cfr65',
        email: 'mary@davis.com',
        telephone: '1-521-223-3232',
        jobDescription: 'Programmer',
        avatar: 'https://i.pravatar.cc/150?img=13'
      },
      {
        hireStatus: 'progress',
        hireTagType: 'info',
        name: 'Margaret Garcia',
        city: 'New York',
        age: 29,
        idCard: 'GF45fgh34',
        email: 'margaret@garcia.com',
        telephone: '1-541-344-2211',
        jobDescription: 'Web developer',
        url: 'https://po-ui.io/',
        avatar: 'https://i.pravatar.cc/150?img=14'
      },
      {
        hireStatus: 'hired',
        hireTagType: 'success',
        name: 'Emma Hall',
        city: 'Ontario',
        age: 34,
        idCard: 'RF76jut21',
        email: 'emma@hall.com',
        telephone: '1-555-321-3234',
        jobDescription: 'Recruiter',
        url: 'https://po-ui.io/',
        avatar: 'https://i.pravatar.cc/150?img=15'
      },
      {
        hireStatus: 'progress',
        hireTagType: 'info',
        name: 'Lucas Clark',
        city: 'Utica',
        age: 32,
        idCard: 'HY21kgu65',
        email: 'lucas@clark.com',
        telephone: '1-541-322-4343',
        jobDescription: 'Consultant',
        avatar: 'https://i.pravatar.cc/150?img=16'
      },
      {
        hireStatus: 'progress',
        hireTagType: 'info',
        name: 'Ella Scott',
        city: 'Ontario',
        age: 24,
        idCard: 'UL78flg68',
        email: 'ella@scott.com',
        telephone: '1-229-324-3434',
        jobDescription: 'DBA',
        avatar: 'https://i.pravatar.cc/150?img=17'
      },
      {
        hireStatus: 'progress',
        hireTagType: 'info',
        name: 'Chloe Walker',
        city: 'Albany',
        age: 29,
        idCard: 'JH12oli98',
        email: 'chloe@walker.com',
        telephone: '1-518-222-1212',
        jobDescription: 'Programmer',
        avatar: 'https://i.pravatar.cc/150?img=18'
      }
    ];
  }
}
