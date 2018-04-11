MyGame.screens['lobby'] = (function(menu) {
  'use strict';

  function initialize() {
    document
      .getElementById('id-lobby-back')
      .addEventListener('click', function() {
        menu.showScreen('main-menu');
      });

    document
      .getElementById('id-lobby-start-game')
      .addEventListener('click', function() {
        menu.showScreen('gameplay');
      });
  }

  function run() {}

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu);
