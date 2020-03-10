import { Component, Input } from '@angular/core';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoToolbarProfile } from './po-toolbar-profile.interface';
import { PoToolbarAction } from '../po-toolbar-action.interface';

/**
 * @docsPrivate
 *
 * @docsExtends PoToolbarProfileComponent
 *
 * @description
 *
 * Componente `po-toolbar-profile`.
 */
@Component({
  selector: 'po-toolbar-profile',
  templateUrl: './po-toolbar-profile.component.html',
  providers: [PoControlPositionService]
})
export class PoToolbarProfileComponent {
  /** Objeto que implementa a interface `PoToolbarProfile`. */
  @Input('p-profile') profile: PoToolbarProfile;

  /** Define uma lista de ações. */
  @Input('p-profile-actions') profileActions?: Array<PoToolbarAction>;

  get profileAvatar() {
    return this.profile ? this.profile.avatar : undefined;
  }
}
