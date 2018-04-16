MyGame.screens['pregame'] = (function(menu, renderer, network) {
  'use strict';

  function updateMap(event) {
    renderer.SpawnMap.render(event);
  }

  function setLocation(event) {
    const position = renderer.SpawnMap.getWorldCoords(event);
    network.emit(NetworkIds.SET_STARTING_POSITION, { position });
  }

  function joinGame() {
    menu.showScreen('gameplay');
    stopListening();
  }

  function stopListening() {
    document
      .getElementById('spawn-map')
      .removeEventListener('mousemove', updateMap);

    document
      .getElementById('spawn-map')
      .removeEventListener('click', setLocation);
  }

  function initialize() {
    document
      .getElementById('pregame-quit-btn')
      .addEventListener('click', function() {
        menu.showScreen('main-menu');
        network.disconnect();
        stopListening();
      });
  }

  function run() {
    network.listen(NetworkIds.SET_STARTING_POSITION, joinGame);

    document
      .getElementById('spawn-map')
      .addEventListener('mousemove', updateMap);

    document.getElementById('spawn-map').addEventListener('click', setLocation);
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu, MyGame.renderer, MyGame.network);
