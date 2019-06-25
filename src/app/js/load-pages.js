$(function () {

  init();

  // Listener será executado quando alguma tag a que conter href for clicada.
  $(document).on('click', 'a[href]', function (event) {
    var pageHref = '';
    event.preventDefault();

    _hideMenu();

    pageHref = $(this).attr('href');

    if (history.pushState) { // IE9 não tem history.pushState
      history.pushState(undefined, undefined, '?sample=' + pageHref);
    }

    callPage(pageHref, this);
  });

  function init() {
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
      setTimeout(function (param) {
        $('a[href="' + params.sample + '"]').trigger('click')
      });
    }

    _setToolbarTitle();
  }

  // Faz a requisição conforme o path passado a função.
  function callPage(path, element) {
    if (path && path !== '#') {

      $.ajax({
        url: path,
        type: 'GET',
        dataType: 'text',
        success: function (response) {
          _successCallback(response, element);
        },
        error: function (response) {
          throw 'Não foi possível acessar a URL ' + path;
        }
      });
    }
  }

  // Apresenta o resultado na div de rota
  function _successCallback(content, element) {
    _setHeader(element);
    $('.router-content').html(content);
  }

  // Esconde o menu
  function _hideMenu() {
    $('.po-menu-overlay').css('display', 'none');
    $('.po-menu').removeClass('po-menu-animation');
  }

  // Altera o valor da tag header conforme o elemento passado a função.
  function _setHeader(element) {
    var elementSelected = $(element);

    var header = $('.po-cdn-app-content > header > h1');

    header.text(elementSelected.text().trim());
  }

  function _setToolbarTitle() {
    var element = $('.po-toolbar-title');
    element.text('PORTINARI HTML Framework | CDN CORE APP - ' + version);
  }
});
