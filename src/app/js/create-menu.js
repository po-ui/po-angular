$(document).ready(function () {

  // Faz a requisição do arquivo components.json para criar os itens de menu.
  $.ajax({
    url: './components.json',
    type: 'GET',
    dataType: 'json',
    success: createNav,
    error: function(response) {
      throw 'Não foi possível acessar a URL ./components.json';
    }
  });

  // Cria o menu conforme o valor passsado no parametro da função.
  function createNav(menus) {
    for (var i = 0; i < menus.length; i++) {
      var menuItem = menus[i];

      var createdMenu = createItem(menuItem);

      if (menuItem.subItems.length) {
        var subItemsCreated = createSubItems(menuItem.subItems);

        createdMenu.append(subItemsCreated);
      }

      $('.po-menu-inner').append(createdMenu);
    }
  }

  // Cria uma item de menu
  function createItem(item) {
    return $('<div class="po-menu-item-wrapper">' +
                '<div class="po-menu-item po-menu-item-grouper-down po-clickable" onclick="selecItem(this)">' +
                  '<span class="po-icon po-icon-arrow-down po-menu-group-icon"></span>' +
                  item.title +
                '</div>' +
              '</div>');
  }

  // Cria sub itens de menu conforme o valor passado por parametro.
  function createSubItems(items) {
    var subItemsContainer = $('<div class="po-menu-sub-items">');

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      var menuItem = $('<a href="' + item.path + '" class="po-menu-item-link" onclick="selectSubItem(this)">' +
                          '<div class="po-menu-item">' +
                            item.title +
                          '</div>' +
                        '</a>');

      subItemsContainer.append(menuItem);
    }

    return subItemsContainer;
  }
});
