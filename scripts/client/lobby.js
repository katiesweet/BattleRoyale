MyGame.screens['lobby'] = (function(chat) {
  'use strict';

  function initialize() {
    chat.initializeLobby();
  }

  function run() {
    chat.connect();
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.chat);
