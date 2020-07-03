import { Injectable } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

@Injectable()
export class MenuGuidesService {
  constructor() {}

  getMenus(documentationItems) {
    return new Array<PoMenuItem>(<% menuItems.guide.sort((a, b) => a.orderBy < b.orderBy ? -1 : 1).forEach(function(menu, index, menus) {%>
      { label: '<%- menu.label %>', link: '<%- menu.link %>' }<%- (index === menus.length - 1) ? '' : ',' %><% });%>
    );
  }
}
