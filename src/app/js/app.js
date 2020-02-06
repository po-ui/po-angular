var menuOverlayElement = document.querySelector('.po-menu-overlay');
var menuElement = document.querySelector('.po-menu');
var titleElement = document.querySelector('.po-cdn-app-content > header > h1');
var routerContentElement = document.querySelector('.router-content');

request('./components.json', function(response) {
  setToolbarTitle();

  createMenu(JSON.parse(response));

  hideMenu();
  loadInitialPage();
});

function setToolbarTitle() {
  var element = document.querySelector('.po-toolbar-title');
  element.textContent = 'PORTINARI UI | CDN APP - ' + version;
}

function hideMenu() {
  menuOverlayElement.style.display = 'none';
  removeCssClass(menuElement, 'po-menu-animation');
}

function showMenuResponsive() {
  menuOverlayElement.style.display = 'block';
  addCssClass(menuElement, 'po-menu-animation');
}

function loadInitialPage() {
  var params = {};

  window.location.search
    .replace('?', '') // Remove o "?" do ínicio dos query parameters
    .split('&') // Separa os parametros
    .forEach(function (param) {
      var name = param.split('=')[0];
      var value = param.split('=')[1];

      params[name] = value;
    });

  if (params.sample) {
    // Simula o click do menu
    var startMenu = document.querySelector('a[href="' + params.sample + '"] > div');
    var event = document.createEvent('Event');

    event.initEvent('click', true, true);
    startMenu.dispatchEvent(event);
  }
}

// ---------------------------------------------------
// Funções para criação e manipulação do Menu
// ---------------------------------------------------

function createMenu(menus) {
  var menuInnerElement = document.querySelector('.po-menu-inner');

  for (var i = 0; i < menus.length; i++) {
    var menuItem = menus[i];
    var menuItemElement = createMenuItemElement(menuItem);

    menuInnerElement.appendChild(menuItemElement);
  }
}

function createMenuItemElement(menuItem) {
  var menuItemElement = document.createElement('div');

  menuItemElement.className = 'po-menu-item-wrapper';
  menuItemElement.innerHTML =
    '<div class="po-menu-item po-menu-item-grouper-down po-clickable" onclick="toggleMenuItem(this)">' +
      '<span class="po-icon po-icon-arrow-down po-menu-group-icon"></span>' +
      menuItem.title +
    '</div>';

  var menuSubItemsContainerElement;

  if (menuItem.subItems) {
    menuSubItemsContainerElement = document.createElement('div');
    menuSubItemsContainerElement.className = 'po-menu-sub-items';

    for (var i = 0; i <= menuItem.subItems.length - 1; i++) {
      var menuSubItem = menuItem.subItems[i];

      var menuSubItemElement = createMenuSubItemElement(menuSubItem);
      menuSubItemsContainerElement.appendChild(menuSubItemElement);
    }

    menuItemElement.appendChild(menuSubItemsContainerElement);
  }

  return menuItemElement;
}

function toggleMenuItem(menuItemElement) {
  var menuSubItemsContainerElement = menuItemElement.parentElement.querySelector('.po-menu-sub-items');
  var menuItemIconElement = menuItemElement.querySelector('.po-icon');

  var menuItemIsClosed = menuItemElement.classList.contains('po-menu-item-grouper-down');

  if (menuItemIsClosed) {
    openMenuItem(menuItemElement, menuItemIconElement, menuSubItemsContainerElement);
  } else {
    closeMenuItem(menuItemElement, menuItemIconElement, menuSubItemsContainerElement);
  }
}

function openMenuItem(menuItemElement, menuItemIconElement, menuSubItemsContainerElement) {
  replaceCssClass(menuItemElement, 'po-menu-item-grouper-down', 'po-menu-item-grouper-up');
  replaceCssClass(menuItemIconElement, 'po-icon-arrow-down', 'po-icon-arrow-up');

  addCssClass(menuSubItemsContainerElement, 'po-menu-sub-items-visible');
}

function closeMenuItem(menuItemElement, menuItemIconElement, menuSubItemsContainerElement) {
  replaceCssClass(menuItemElement, 'po-menu-item-grouper-up', 'po-menu-item-grouper-down');
  replaceCssClass(menuItemIconElement, 'po-icon-arrow-up', 'po-icon-arrow-down');

  removeCssClass(menuSubItemsContainerElement, 'po-menu-sub-items-visible');
}

function createMenuSubItemElement(menuSubItem) {
  var menuSubItemElement = document.createElement('a');
  menuSubItemElement.setAttribute('href', menuSubItem.path);
  menuSubItemElement.className = 'po-menu-item-link';
  menuSubItemElement.onclick = clickMenuSubItem;
  menuSubItemElement.innerHTML = '<div class="po-menu-item">' + menuSubItem.title + '</div>';

  return menuSubItemElement;
}

function clickMenuSubItem(menuSubItem) {
  event.preventDefault();

  var menuSubItemElement = menuSubItem.target;
  var anchorSubItemElement = menuSubItemElement.parentElement;
  var pageHref = anchorSubItemElement.getAttribute('href');
  var title = anchorSubItemElement.innerText.trim();

  if (history.pushState) { // IE9 não tem history.pushState
    history.pushState(undefined, undefined, '?sample=' + pageHref);
  }

  loadPage(pageHref);
  loadTitlePage(title);

  unselectOpenSubItem();
  addCssClass(menuSubItemElement, 'po-menu-item-selected');

  hideMenu();
}

function unselectOpenSubItem() {
  var menuSubItemSelected = document.querySelector('.po-menu-item-selected');

  if (menuSubItemSelected) {
    removeCssClass(menuSubItemSelected, 'po-menu-item-selected');
  }
}

// ---------------------------------------------------
// Funções para manipulação da página
// ---------------------------------------------------

function loadPage(url) {
  if (!url || url === '#') {
    return;
  }

  request(url, loadContentPage);
}

function loadContentPage(content) {
  routerContentElement.innerHTML = content;

  var script = routerContentElement.querySelector('script');

  // Verifica se tem script js para ser carregado
  if (script) {
    if (script.getAttribute('src')) {
      execScript(script.getAttribute('src'));
    } else {
      eval(script.textContent);
    }
  }
}

function loadTitlePage(title) {
  titleElement.textContent = title;
}

function execScript(url) {
  request(url, eval);
}

// ---------------------------------------------------
// Funções genéricas
// ---------------------------------------------------

function request(url, success) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      success(xhr.responseText);
    } else {
      throw 'Não foi possível acessar a URL ' + url;
    }
  };
  xhr.send();
}

function replaceCssClass(element, oldClass, newClass) {
  removeCssClass(element, oldClass);
  addCssClass(element, newClass);
}

function removeCssClass(element, className) {
  element.className = element.className.replace(className, '');
}

function addCssClass(element, className) {
  element.className += ' ' + className;
}
