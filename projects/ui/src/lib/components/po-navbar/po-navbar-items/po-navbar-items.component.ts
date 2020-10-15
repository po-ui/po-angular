import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { PoNavbarItem } from '../interfaces/po-navbar-item.interface';
import { PoNavbarItemComponent } from './po-navbar-item/po-navbar-item.component';

@Component({
  selector: 'po-navbar-items',
  templateUrl: './po-navbar-items.component.html'
})
export class PoNavbarItemsComponent implements OnInit, OnDestroy {
  selectedItem: PoNavbarItem;

  private routeSubscription: Subscription;

  @ViewChild('navbarItemsContainer', { read: ElementRef, static: true }) navbarItemsContainer: ElementRef;

  @ViewChildren(PoNavbarItemComponent, { read: ElementRef }) allNavbarItems: QueryList<any>;

  @Input('p-items') items: Array<PoNavbarItem>;

  constructor(private router: Router) {}

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.subscribeToRoute();
  }

  private checkActiveItemByUrl(urlRouter: string) {
    const urlArray = urlRouter.split('/');
    let counter = urlArray.length;

    while (counter >= 0) {
      const url = urlArray.slice(0, counter).join('/');
      this.selectedItem = this.items.find(item => item.link === url);

      if (this.selectedItem) {
        break;
      }
      counter--;
    }
  }

  private checkRouterChildrenFragments() {
    const childrenPrimary = this.router.parseUrl(this.router.url).root.children['primary'];

    return childrenPrimary ? `/${childrenPrimary.segments.map(it => it.path).join('/')}` : '/';
  }

  private subscribeToRoute() {
    this.routeSubscription = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd || val instanceof NavigationCancel) {
        const urlRouter = this.checkRouterChildrenFragments();
        this.checkActiveItemByUrl(urlRouter);
      }
    });
  }
}
