MyGame.screens['lobby'] = (function(menu, chat, network) {
  'use strict';

  function initialize() {
    document
      .getElementById('lobby-back-btn')
      .addEventListener('click', function() {
        menu.showScreen('main-menu');
        network.emit(NetworkIds.DISCONNECT_LOBBY, {});
      });
  }

  function run() {
    chat.initializeLobby();
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu, MyGame.chat, MyGame.network);
