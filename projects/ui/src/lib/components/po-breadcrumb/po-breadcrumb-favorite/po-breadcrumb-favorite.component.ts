import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoBreadcrumbItem } from './../po-breadcrumb-item.interface';
import { PoBreadcrumbFavoriteService } from './po-breadcrumb-favorite.service';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que renderiza o serviço de favoritar do po-breadcrumb.
 */
@Component({
  selector: 'po-breadcrumb-favorite',
  templateUrl: './po-breadcrumb-favorite.component.html',
  providers: [PoBreadcrumbFavoriteService]
})
export class PoBreadcrumbFavoriteComponent implements OnInit, OnDestroy {
  favorite: boolean = false;
  private getSubscription: Subscription;
  private setSubscription: Subscription;

  // URL do serviço.
  @Input('p-favorite-service') favoriteService: string;

  // Item do breadcrumb ativo.
  @Input('p-item-active') itemActive: PoBreadcrumbItem;

  // Parâmetro que será enviado junto com o serviço de favoritar.
  @Input('p-params-service') paramsService: object;

  constructor(private service: PoBreadcrumbFavoriteService) {}

  ngOnInit() {
    this.service.configService(this.favoriteService, this.paramsService, this.itemActive);
    this.getStatusFavorite();
  }

  ngOnDestroy(): void {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }

    if (this.setSubscription) {
      this.setSubscription.unsubscribe();
    }
  }

  toggleFavoriteAction() {
    this.favorite ? this.setStatusFavorite(false) : this.setStatusFavorite(true);
  }

  private getStatusFavorite() {
    this.getSubscription = this.service.getFavorite().subscribe(result => (this.favorite = result.isFavorite));
  }

  private setStatusFavorite(status) {
    this.setSubscription = this.service
      .sendStatusFavorite(status)
      .subscribe(result => (this.favorite = result.isFavorite));
  }
}
