import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, map, startWith, Subscription } from 'rxjs';
import { isExternalLink } from '../../../utils/util';
import { PoMenuItem } from '../../po-menu';
import { PoHeaderBrand } from '../interfaces/po-header-brand.interface';

@Component({
  selector: 'po-header-brand',
  templateUrl: './po-header-brand.component.html',
  standalone: false
})
export class PoHeaderbrandComponent implements AfterViewInit, OnChanges, OnDestroy {
  private resizeSub!: Subscription;
  showTitleTooltip = false;
  smallLogo = false;

  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;
  @ViewChild('titleBrand') titleBrand: ElementRef;

  @Input('p-brand') brand: PoHeaderBrand;

  @Output('p-click-menu') clickMenu = new EventEmitter<any>();

  @Input('p-hide-button-menu') hideButtonMenu?: boolean;

  // itens do menu caso não seja enviado um menu externo pelo usuário
  @Input('p-menus') menuCollapse: Array<PoMenuItem> = [];

  @Input('p-external') externalMenu: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.showTitleTooltip = this.showTooltip;
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe(width => {
        this.smallLogo = width <= 960;
      });
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand']) {
      this.showTitleTooltip = this.showTooltip;
      this.cd.detectChanges();
    }
  }

  onClickLogo() {
    this.brand?.action?.();
    if (this.brand.link) {
      if (isExternalLink(this.brand.link)) {
        window.open(this.brand.link, '_blank');
      } else {
        this.router.navigateByUrl(this.brand.link);
      }
    }
  }

  get showTooltip() {
    return this.titleBrand?.nativeElement.offsetWidth >= 151;
  }
}
