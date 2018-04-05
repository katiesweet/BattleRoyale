MyGame.screens['main-menu'] = (function(menu) {
  'use strict';

  function initialize() {
    document
      .getElementById('id-new-game')
      .addEventListener('click', function() {
        menu.showScreen('gamePlay');
      });

    document
      .getElementById('id-highscores')
      .addEventListener('click', function() {
        menu.showScreen('highscores');
      });

    document.getElementById('id-credits').addEventListener('click', function() {
      menu.showScreen('credits');
    });

    document.getElementById('id-logout').addEventListener('click', function() {
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
