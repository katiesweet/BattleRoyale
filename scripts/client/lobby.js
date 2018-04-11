MyGame.screens['lobby'] = (function(menu, network) {
  'use strict';

  function initialize() {
    network.initialize();
  }

  function run() {}

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu, MyGame.network);
