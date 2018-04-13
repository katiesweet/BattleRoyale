MyGame.screens['main-menu'] = (function(menu) {
  'use strict';

  function initialize() {
    document.getElementById('id-logout').addEventListener('click', function() {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      menu.showScreen('login');
    });
  }

  function run() {}

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu);
