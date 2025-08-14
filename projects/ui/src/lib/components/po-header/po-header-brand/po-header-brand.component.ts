import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PoHeaderBrand } from '../interfaces/po-header-brand.interface';

@Component({
  selector: 'po-header-brand',
  templateUrl: './po-header-brand.component.html',
  standalone: false
})
export class PoHeaderbrandComponent implements AfterViewInit, OnChanges {
  showTitleTooltip = false;

  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;

  @ViewChild('titleBrand') titleBrand: ElementRef;

  @Input('p-brand') brand: PoHeaderBrand;

  @Output('p-click-menu') clickMenu = new EventEmitter<any>();

  @Input('p-hide-button-menu') hideButtonMenu?: boolean;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.showTitleTooltip = this.showTooltip;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand']) {
      this.showTitleTooltip = this.showTooltip;
      this.cd.detectChanges();
    }
  }

  get showTooltip() {
    return this.titleBrand?.nativeElement.offsetWidth >= 151;
  }
}
