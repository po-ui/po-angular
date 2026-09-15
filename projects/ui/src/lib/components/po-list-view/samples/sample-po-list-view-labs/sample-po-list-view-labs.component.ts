import { Component, OnInit, inject } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoListViewAction,
  PoListViewLiterals,
  PoNotificationService,
  PoRadioGroupOption,
  PoSelectOption
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-list-view-labs',
  templateUrl: './sample-po-list-view-labs.component.html',
  standalone: false
})
export class SamplePoListViewLabsComponent implements OnInit {
  private poNotification = inject(PoNotificationService);

  action: PoListViewAction;
  actions: Array<PoListViewAction>;
  componentsSize: string = 'medium';
  customLiterals: PoListViewLiterals;
  detailDisplay: string = 'inline';
  height: number;
  items: Array<any>;
  literals: string;
  properties: Array<string>;
  propertyAvatar: string;
  propertyHighlighted: string;
  propertyLink: string;
  propertyLinkValue: string;
  propertySubtitle: string;
  propertyTag: string;
  propertyTagType: string;
  propertyTitle: string;
  selectionMode: string = 'multiple';
  tagPosition: string = 'bottom';
  titleAction: string;

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'select', label: 'Select' },
    { value: 'hideSelectAll', label: 'Hide Select All', disabled: true },
    { value: 'showMoreDisabled', label: 'Show More Disabled' }
  ];

  readonly actionOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Disabled', value: 'disabled' },
    { label: 'Separator', value: 'separator' },
    { label: 'Selected', value: 'selected' },
    { label: 'Visible', value: 'visible' }
  ];

  readonly componentsSizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  readonly detailDisplayOptions: Array<PoRadioGroupOption> = [
    { label: 'inline', value: 'inline' },
    { label: 'modal', value: 'modal' }
  ];

  readonly tagPositionOptions: Array<PoRadioGroupOption> = [
    { label: 'right', value: 'right' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' }
  ];

  readonly iconOptions: Array<PoSelectOption> = [
    { value: 'an an-newspaper', label: 'an an-newspaper' },
    { value: 'an an-magnifying-glass', label: 'an an-magnifying-glass' },
    { value: 'an an-globe', label: 'an an-globe' },
    { value: 'fa fa-calculator', label: 'fa fa-calculator' },
    { value: 'fa fa-podcast', label: 'fa fa-podcast' }
  ];

  readonly propertyTitleOptions: Array<PoSelectOption> = [
    { value: 'name', label: 'name' },
    { value: 'email', label: 'email' },
    { value: 'phone', label: 'phone' },
    { value: 'location', label: 'location' }
  ];

  readonly selectionModeOptions: Array<PoRadioGroupOption> = [
    { label: 'multiple', value: 'multiple' },
    { label: 'single', value: 'single' }
  ];

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Default', value: 'default' },
    { label: 'Danger', value: 'danger' }
  ];

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoListViewAction) {
    const newAction = Object.assign({}, action);
    newAction.action = newAction.action ? this.showAction.bind(this, newAction.action) : undefined;

    this.actions.push(newAction);
    this.restoreActionForm();
  }

  addItem() {
    this.items.push(this.generateNewItem(this.items.length + 1));
  }

  changeAction(action) {
    this.titleAction = action;
  }

  changeActionOptions() {
    this.propertiesOptions = this.propertiesOptions.map(propertyOption => {
      if (propertyOption.value === 'hideSelectAll') {
        return { ...propertyOption, disabled: !this.properties.includes('select') };
      } else {
        return propertyOption;
      }
    });
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  restore() {
    this.actions = [];
    this.componentsSize = 'medium';
    this.detailDisplay = 'inline';
    this.items = [];
    this.height = undefined;
    this.literals = '';
    this.properties = [];
    this.propertyAvatar = '';
    this.propertyHighlighted = '';
    this.propertyLink = 'url';
    this.propertyLinkValue = '';
    this.propertySubtitle = '';
    this.propertyTag = '';
    this.propertyTagType = '';
    this.propertyTitle = '';
    this.selectionMode = 'multiple';
    this.tagPosition = 'bottom';
    this.titleAction = '';
    this.restoreActionForm();
  }

  showMore() {
    this.addItem();
  }

  private generateNewItem(index) {
    const tagTypes = ['success', 'info', 'warning', 'danger', 'neutral'];

    return {
      name: `Register ${index}`,
      email: `register${index}@po-ui.com`,
      phone: `(55) ${index}234567`,
      location: 'Brazil',
      company: `Company ${index}`,
      url: this.propertyLinkValue,
      zipCode: `${index}221`,
      tag: index % 2 === 0 ? 'Concluído' : 'Em andamento',
      tagType: tagTypes[index % tagTypes.length],
      subtitle: `Há ${index * 5} min`,
      avatar: `https://i.pravatar.cc/150?img=${index}`,
      unread: index % 3 === 0
    };
  }

  private restoreActionForm() {
    this.action = {
      label: '',
      visible: null
    };
  }

  private showAction(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}
