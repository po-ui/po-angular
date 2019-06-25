function showMenuResponsive() {
  $('.po-menu-overlay').css('display', 'block');
  $('.po-menu').addClass('po-menu-animation');
}

function selectSubItem(itemSelected) {
  removeAllSelected();

  var divItem = $(itemSelected).find('div');
  divItem.addClass('po-menu-item-selected');
}

function selecItem(item) {
  var divItem = $(item);
  var itemWrapper = divItem.parent();
  var subItem = itemWrapper.find('.po-menu-sub-items');
  var divIcon = divItem.find('.po-icon');

  divItem.addClass('po-menu-item-grouper-up po-clickable');

  isClosed = divItem.hasClass('po-menu-item-grouper-down');

  if (isClosed) {

    divItem.removeClass('po-menu-item-grouper-down');
    divItem.addClass('po-menu-item-grouper-up');

    subItem.addClass('po-menu-sub-items-visible');

    divIcon.removeClass('po-icon-arrow-down');
    divIcon.addClass('po-icon-arrow-up');
  } else {

    divItem.removeClass('po-menu-item-grouper-up');
    divItem.addClass('po-menu-item-grouper-down');

    subItem.removeClass('po-menu-sub-items-visible');

    divIcon.removeClass('po-icon-arrow-up');
    divIcon.addClass('po-icon-arrow-down');
  }

}

function removeAllSelected() {
  var itens = $('.po-menu-container-sample').find('.po-menu-item-selected');

  itens.removeClass('po-menu-item-selected');
}
