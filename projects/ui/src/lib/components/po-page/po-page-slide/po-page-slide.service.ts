import { Injectable } from '@angular/core';

@Injectable()
export class PoPageSlideService {
  private _activePage: string;

  /**
   * Define uma nova página como ativa.
   *
   * @param page página
   */
  public activePage(page: string) {
    this._activePage = page;
  }

  /**
   * Desativa a página.
   */
  public deactivePage() {
    this._activePage = undefined;
  }

  /**
   * Retorna a página ativa.
   *
   * @return página ativa
   */
  public getAtivePage(): string {
    return this._activePage;
  }

  /**
   * Retorna `true` se existe alguma página ativa.
   *
   * @returns `true` se houver alguma página ativa
   */
  public isAnyPageActive(): boolean {
    return this._activePage !== undefined;
  }
}
