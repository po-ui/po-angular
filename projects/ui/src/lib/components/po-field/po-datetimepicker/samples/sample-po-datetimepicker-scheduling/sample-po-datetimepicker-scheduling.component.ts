import { UntypedFormControl } from '@angular/forms';
import { Component, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';

import { PoDialogService, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datetimepicker-scheduling',
  templateUrl: './sample-po-datetimepicker-scheduling.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SamplePoDatetimepickerSchedulingComponent {
  private poDialog = inject(PoDialogService);
  private poNotification = inject(PoNotificationService);

  @ViewChild('formScheduling', { static: true }) formScheduling: UntypedFormControl;

  appointment: string;
  doctor: string;
  patient: string;
  specialty: string;

  public readonly specialtyOptions: Array<PoSelectOption> = [
    { value: 'general', label: 'Clínico Geral' },
    { value: 'cardiology', label: 'Cardiologia' },
    { value: 'dermatology', label: 'Dermatologia' },
    { value: 'orthopedics', label: 'Ortopedia' },
    { value: 'neurology', label: 'Neurologia' }
  ];

  confirm() {
    const dateFormatted = this.appointment ? this.appointment.slice(0, 16) : '';

    const message =
      `Confirmar agendamento de consulta?\n\n` +
      `Paciente: ${this.patient}\n` +
      `Médico: ${this.doctor}\n` +
      `Especialidade: ${this.getSpecialtyLabel()}\n` +
      `Data/Hora: ${dateFormatted}`;

    this.poDialog.confirm({
      title: 'Confirmar Agendamento',
      message,
      confirm: () => {
        this.poNotification.success('Consulta agendada com sucesso!');
        this.formScheduling.reset();
      },
      cancel: () => {
        this.poNotification.warning('Agendamento cancelado.');
      }
    });
  }

  private getSpecialtyLabel(): string {
    const option = this.specialtyOptions.find(o => o.value === this.specialty);
    return option ? option.label : '';
  }
}
