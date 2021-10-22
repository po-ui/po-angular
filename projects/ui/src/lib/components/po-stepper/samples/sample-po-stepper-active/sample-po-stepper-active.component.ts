import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoStepperComponent } from '@po-ui/ng-components';
import { SamplePoStepperActiveService } from './sample-po-stepper-active.service';

@Component({
  selector: 'sample-po-stepper-active',
  templateUrl: './sample-po-stepper-active.component.html'
})
export class SamplePoStepperActiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('basicInformation', { static: true }) basicInformationForm: NgForm;
  @ViewChild('academicFormation', { static: true }) academicFormationForm: NgForm;
  @ViewChild('professionalExperiences', { static: true }) professionalExperiencesForm: NgForm;
  @ViewChild(PoStepperComponent) stepper: PoStepperComponent;

  cityOptions: Array<PoSelectOption> = [];
  stateOptions: Array<PoSelectOption> = [];
  basicInformation: any;
  highSchool: any;
  universityEducation: any;
  professionalExperiences: Array<any>;
  experienceTitle: string;
  experienceDescripton: string;
  overview: any;

  private citiesSubscription: Subscription;
  private statesSubscription: Subscription;

  constructor(public sampleService: SamplePoStepperActiveService, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.activeStep());
  }

  ngOnInit(): void {
    this.basicInformation = this.getBasicInformations();
    this.highSchool = this.getHighSchool();
    this.universityEducation = this.getUniversityEducation();
    this.professionalExperiences = this.getProfessionalExperiencies();
    this.getStates();
  }

  ngOnDestroy() {
    this.citiesSubscription?.unsubscribe();
    this.statesSubscription?.unsubscribe();
  }

  activeStep() {
    this.stepper.active(2);
  }

  onChangeState() {
    this.getCitiesByState(this.basicInformation.state);
  }

  addProfessionalExperiences(form: NgForm) {
    const experience = {
      title: form.value['experienceTitle'],
      description: form.value['experienceDescripton']
    };
    this.professionalExperiences = [...this.professionalExperiences, experience];
  }

  private getBasicInformations() {
    return {
      name: 'Maria Alice',
      email: 'mariaalice@gmail.com',
      phone: '47988888888',
      state: 'sp',
      city: 1
    };
  }

  private getHighSchool() {
    return {
      name: 'Escola de Ensino Básico Dr Jorge Lacerda',
      city: 'Joinville',
      conclusionYear: '2016'
    };
  }

  private getUniversityEducation() {
    return {
      name: 'Universidade Federal do Santa Catarina',
      city: 'Florianópolis',
      conclusionYear: '2020'
    };
  }

  private getProfessionalExperiencies() {
    return [
      {
        title: 'Analista de desenvolvimento de software na TOTVS',
        description:
          'Responsável pelo desenvolvimento e manutenção de sistemas do segmento de manufatura. Do ano de 2019 à 2020'
      }
    ];
  }

  private getCitiesByState(state: string) {
    this.citiesSubscription = this.sampleService
      .getCitiesByState(state)
      .subscribe((cities: { items: Array<PoSelectOption> }) => {
        this.cityOptions = cities.items;
        this.basicInformation.city = this.cityOptions[0].value as number;
      });
  }

  private getStates() {
    this.statesSubscription = this.sampleService.getStates().subscribe((states: { items: Array<PoSelectOption> }) => {
      this.stateOptions = states.items;
      this.getCitiesByState(this.basicInformation.state);
    });
  }
}
