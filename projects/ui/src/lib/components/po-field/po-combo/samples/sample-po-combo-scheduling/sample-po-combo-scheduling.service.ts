import { Injectable } from '@angular/core';

import { PoComboOptionGroup } from '@po-ui/ng-components';

@Injectable()
export class SamplePoComboSchedulingService {
  getcities(): Array<PoComboOptionGroup> {
    return [
      {
        label: 'São Paulo',
        options: [
          { label: 'São Paulo', value: 'sao paulo' },
          { label: 'Campinas', value: 'campinas' }
        ]
      },
      {
        label: 'Paraná',
        options: [
          { label: 'São José dos Pinhais', value: 'sao jose dos pinhais' },
          { label: 'Londrina', value: 'londrina' },
          { label: 'Maringá', value: 'maringa' }
        ]
      },
      {
        label: 'Santa Catarina',
        options: [
          { label: 'Joinville', value: 'joinville' },
          { label: 'Florianópolis', value: 'florianopolis' },
          { label: 'Itajaí', value: 'itajai' }
        ]
      }
    ];
  }

  getMedicalSpecialty() {
    return [
      { label: 'Allergist', value: 'allergist' },
      { label: 'Cardiologist', value: 'cardiologist' },
      { label: 'General practitioner', value: 'generalPractitioner' },
      { label: 'Dermatologist', value: 'dermatologist' },
      { label: 'Gynecologist', value: 'gynecologist' },
      { label: 'Nutritionist', value: 'nutritionist' },
      { label: 'Pediatrist', value: 'pediatrist' },
      { label: 'Psychiatrist', value: 'psychiatrist' },
      { label: 'Orthopaedist', value: 'orthopaedist' }
    ];
  }
}
