import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  PoEmailComponent,
  PoInputComponent,
  PoModalAction,
  PoModalComponent,
  PoNumberComponent,
  PoSearchFilterMode,
  PoSearchLiterals,
  PoUrlComponent
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-search-fields-locate',
  templateUrl: './sample-po-search-fields-locate.component.html',
  standalone: false
})
export class SamplePoSearchFieldsLocateComponent implements AfterViewInit {
  @ViewChild('nameInput', { static: true }) nameInput!: PoInputComponent;
  @ViewChild('cpfInput', { static: true }) cpfInput!: PoInputComponent;
  @ViewChild('addressInput', { static: true }) addressInput!: PoInputComponent;
  @ViewChild('numberInput', { static: true }) numberInput!: PoNumberComponent;
  @ViewChild('emailInput', { static: true }) emailInput!: PoEmailComponent;
  @ViewChild('websiteInput', { static: true }) websiteInput!: PoUrlComponent;
  @ViewChild('reactiveFormData', { static: true }) reactiveFormModal!: PoModalComponent;

  reactiveForm!: UntypedFormGroup;

  filterTargets: Array<{ label: string; index: number; focus: () => void }> = [];
  filteredIndexes: Array<number> = [];
  currentIndex: number = -1;
  currentIndexHighlight: number = -1;
  highlightEnabled: boolean = false;

  locateSummary: { currentIndex: number; total: number } = { currentIndex: 0, total: 0 };
  filterType: PoSearchFilterMode = PoSearchFilterMode.endsWith;
  searchLiterals: PoSearchLiterals = { search: 'Buscar campos' };
  modalPrimaryAction: PoModalAction = {
    label: 'Close',
    action: () => this.reactiveFormModal.close()
  };

  constructor(protected fb: UntypedFormBuilder) {
    this.createForm();
  }

  ngAfterViewInit() {
    this.filterTargets = [
      { label: 'Customer name', index: 0, focus: () => this.nameInput.focus() },
      { label: 'CPF', index: 1, focus: () => this.cpfInput.focus() },
      { label: 'Address', index: 2, focus: () => this.addressInput.focus() },
      { label: 'Number', index: 3, focus: () => this.numberInput.focus() },
      { label: 'Email', index: 4, focus: () => this.emailInput.focus() },
      { label: 'Website', index: 5, focus: () => this.websiteInput.focus() }
    ];
  }

  createForm() {
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', Validators.required],
      address: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required]
    });
  }

  // Atualiza os campos filtrados conforme o termo digitado
  updateSearchTerm(term: string) {
    const value = term.toLowerCase();

    this.filteredIndexes = this.filterTargets
      .map((t, i) => ({ i, t }))
      .filter(({ t }) => value && t.label.toLowerCase().startsWith(value))
      .map(({ i }) => i);

    if (value && this.filteredIndexes.length > 0) {
      this.currentIndex = 0;
      this.highlightEnabled = true;
      this.highlightCurrent();
    } else {
      this.currentIndex = -1;
      this.clearHighlight();
    }

    this.updateSummary();
  }

  // Navegação por teclado
  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.highlightEnabled = true;
      this.goToNextOccurrence();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightEnabled = true;
      this.goToPreviousOccurrence();
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.focusCurrent();
      this.highlightEnabled = false;
      this.clearHighlight();
      event.preventDefault();
    }
  }

  // Navegação pelos botões
  onNextOccurrenceClick() {
    this.goToNextOccurrence();
    this.focusCurrent();
    this.clearHighlight();
  }

  onPreviousOccurrenceClick() {
    this.goToPreviousOccurrence();
    this.focusCurrent();
    this.clearHighlight();
  }

  goToNextOccurrence() {
    if (!this.filteredIndexes.length) return;

    this.currentIndex = (this.currentIndex + 1) % this.filteredIndexes.length;
    this.highlightCurrent();
    this.updateSummary();
  }

  goToPreviousOccurrence() {
    if (!this.filteredIndexes.length) return;

    this.currentIndex = this.currentIndex <= 0 ? this.filteredIndexes.length - 1 : this.currentIndex - 1;
    this.highlightCurrent();
    this.updateSummary();
  }

  updateSummary() {
    const total = this.filteredIndexes.length;
    const current = total === 0 || this.currentIndex === -1 ? 0 : this.currentIndex + 1;

    this.locateSummary = {
      currentIndex: current,
      total: total
    };
  }

  // Aplica o outline visual no campo destacado
  highlightCurrent() {
    if (!this.highlightEnabled) return;

    const index = this.filteredIndexes[this.currentIndex];
    this.currentIndexHighlight = index ?? -1;
    if (index !== undefined) {
      this.highlightField(index);
    }
  }

  highlightField(index: number) {
    // Remove outline de todos
    this.filterTargets.forEach(t => {
      const inputEl = this.getInputElementByIndex(t.index);
      if (inputEl) {
        inputEl.style.outline = '';
        inputEl.style.outlineOffset = '';
        inputEl.style.borderRadius = '';
      }
    });

    // Aplica outline no campo atual
    const el = this.getInputElementByIndex(index);
    if (el) {
      el.style.outline = '2px solid purple';
      el.style.outlineOffset = '2px';
      el.style.borderRadius = '4px';
    }
  }

  clearHighlight() {
    this.highlightEnabled = false;
    this.currentIndexHighlight = -1;
    // Remove outline de todos
    this.filterTargets.forEach(t => {
      const inputEl = this.getInputElementByIndex(t.index);
      if (inputEl) {
        inputEl.style.outline = '';
        inputEl.style.outlineOffset = '';
        inputEl.style.borderRadius = '';
      }
    });
  }

  // Foca o campo selecionado
  focusCurrent() {
    const index = this.filteredIndexes[this.currentIndex];
    if (index !== undefined) {
      (document.activeElement as HTMLElement)?.blur();
      this.filterTargets[index].focus();
    }
  }

  // Obtêm o elemento real do campo
  getInputElementByIndex(index: number): HTMLElement | null {
    switch (index) {
      case 0:
        return this.nameInput?.inputEl?.nativeElement ?? null;
      case 1:
        return this.cpfInput?.inputEl?.nativeElement ?? null;
      case 2:
        return this.addressInput?.inputEl?.nativeElement ?? null;
      case 3:
        return this.numberInput?.inputEl?.nativeElement ?? null;
      case 4:
        return this.emailInput?.inputEl?.nativeElement ?? null;
      case 5:
        return this.websiteInput?.inputEl?.nativeElement ?? null;
      default:
        return null;
    }
  }

  saveForm() {
    this.reactiveFormModal.open();
  }

  onSearchBlur() {
    this.clearHighlight();
  }
}
