import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoListViewAction,
  PoListViewFieldProperties,
  PoListViewLiterals,
  PoNotificationService,
  PoRadioGroupOption,
  PoSelectOption
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-list-view-labs',
  templateUrl: './sample-po-list-view-labs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SamplePoListViewLabsComponent implements OnInit {
  private poNotification = inject(PoNotificationService);

  action!: PoListViewAction;
  actions!: Array<PoListViewAction>;
  componentsSize: string = 'medium';
  customLiterals?: PoListViewLiterals;
  detailDisplay: string = 'inline';
  height?: number;
  items!: Array<any>;
  literals!: string;
  properties!: Array<string>;
  propertyAvatar!: string;
  avatarType!: string;
  propertyHighlighted!: string;
  propertyLink!: string;
  propertyLinkValue!: string;
  propertySubtitle!: string;
  propertyTag!: string;
  propertyTagType!: string;
  propertyTitle!: string;
  tagPosition: string = 'bottom';
  tagTypeValue: string = '';
  highlightedValue: string = 'read';
  titleAction!: string;

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'select', label: 'Select' },
    { value: 'singleSelect', label: 'Single Select' },
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
    { value: 'none', label: 'None' },
    { value: 'name', label: 'name' },
    { value: 'email', label: 'email' },
    { value: 'phone', label: 'phone' },
    { value: 'location', label: 'location' }
  ];

  // Tipos de avatar válidos aplicados ao campo `avatar` de todos os itens.
  readonly avatarPropertyOptions: Array<PoSelectOption> = [
    { value: 'none', label: 'None' },
    { value: 'image', label: 'Image (URL)' },
    { value: 'icon', label: 'Icon' },
    { value: 'progress', label: 'Progress' },
    { value: 'indeterminate', label: 'Progress (indeterminate)' }
  ];

  // Valores de tipo de tag aplicados ao campo `tagType` de todos os itens.
  readonly tagTypeValueOptions: Array<PoSelectOption> = [
    { value: 'success', label: 'Success' },
    { value: 'info', label: 'Info' },
    { value: 'danger', label: 'Danger' },
    { value: 'warning', label: 'Warning' },
    { value: 'neutral', label: 'Neutral' }
  ];

  readonly highlightedValueOptions: Array<PoSelectOption> = [
    { value: 'read', label: 'read' },
    { value: 'unread', label: 'unread' }
  ];

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Default', value: 'default' },
    { label: 'Danger', value: 'danger' }
  ];

  get fieldProperties(): PoListViewFieldProperties {
    const properties: PoListViewFieldProperties = {};

    if (this.isMapped(this.propertyTitle)) {
      properties.title = this.propertyTitle;
    }
    if (this.isMapped(this.propertySubtitle)) {
      properties.subtitle = this.propertySubtitle;
    }
    if (this.isMapped(this.propertyLink)) {
      properties.link = this.propertyLink;
    }
    if (this.isMapped(this.propertyAvatar)) {
      properties.avatar = this.propertyAvatar;
    }
    if (this.isMapped(this.propertyHighlighted)) {
      properties.highlighted = this.propertyHighlighted;
    }
    if (this.isMapped(this.propertyTag)) {
      properties.tag = { value: this.propertyTag, type: this.propertyTagType };
    }

    return properties;
  }

  private isMapped(value: string): boolean {
    return !!value && value !== 'none';
  }

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoListViewAction) {
    const newAction = Object.assign({}, action);
    const actionLabel = newAction.action as unknown as string;
    newAction.action = actionLabel ? this.showAction.bind(this, actionLabel) : undefined;

    this.actions.push(newAction);
    this.restoreActionForm();
  }

  addItem() {
    this.items.push(this.generateNewItem(this.items.length + 1));
  }

  applyTagType() {
    this.items = this.items.map(item => ({ ...item, tagType: this.tagTypeValue }));
  }

  applyHighlighted() {
    this.propertyHighlighted = 'unread';
    const unread = this.highlightedValue === 'unread';
    this.items = this.items.map(item => ({ ...item, unread }));
  }

  applyAvatar() {
    if (!this.avatarType || this.avatarType === 'none') {
      this.propertyAvatar = '';
      this.items = this.items.map(item => ({ ...item, avatar: undefined }));
      return;
    }

    this.propertyAvatar = 'avatar';
    this.items = this.items.map((item, index) => ({ ...item, avatar: this.buildAvatarValue(index + 1) }));
  }

  changeAction(action: string) {
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
    // Propriedades com valor default no componente
    this.componentsSize = 'medium';
    this.detailDisplay = 'inline';
    this.tagPosition = 'bottom';
    // Propriedades opcionais (iniciam em None)
    this.items = [];
    this.height = undefined;
    this.literals = '';
    this.properties = [];
    this.propertyAvatar = '';
    this.avatarType = 'none';
    this.propertyHighlighted = 'unread';
    this.propertyLink = 'url';
    this.propertyLinkValue = '';
    this.propertySubtitle = 'none';
    this.propertyTag = 'none';
    this.propertyTagType = 'tagType';
    this.propertyTitle = 'none';
    this.tagTypeValue = 'success';
    this.highlightedValue = 'read';
    this.titleAction = '';
    this.restoreActionForm();
  }

  showMore() {
    this.addItem();
  }

  private generateNewItem(index: number) {
    const tagTypes = ['success', 'info', 'warning', 'danger', 'neutral'];

    return {
      name: `Register ${index}`,
      email: `register${index}@po-ui.com`,
      phone: `(55) ${index}234567`,
      location: 'Brazil',
      company: `Company ${index}`,
      url: this.propertyLinkValue,
      zipCode: `${index}221`,
      tag: index % 2 === 0 ? 'Completed' : 'In progress',
      tagType: this.tagTypeValue || tagTypes[index % tagTypes.length],
      subtitle: `${index * 5} min ago`,
      avatar: this.buildAvatarValue(index),
      unread: this.highlightedValue === 'unread'
    };
  }

  // Monta o valor de avatar conforme o tipo selecionado no laboratório.
  private buildAvatarValue(index: number): any {
    switch (this.avatarType) {
      case 'image':
        return `https://i.pravatar.cc/150?img=${index}`;
      case 'icon':
        return { icon: 'an an-user', color: '#1a73e8', backgroundColor: '#e8f0fe' };
      case 'progress':
        return { progress: (index * 15) % 100, showPercentage: true, size: 'large', radius: 35 };
      case 'indeterminate':
        return { indeterminate: true, size: 'large', radius: 35 };
      default:
        return undefined;
    }
  }

  private restoreActionForm() {
    this.action = {
      label: '',
      visible: true
    };
  }

  private showAction(action: string): void {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}
