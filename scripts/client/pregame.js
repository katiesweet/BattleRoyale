MyGame.screens['pregame'] = (function(
  menu,
  renderer,
  network,
  barrierJson,
  components
) {
  'use strict';

  let barriers = components.Barriers(barrierJson);
  let opponentPositions = [];
  let playerRadius = 0.04;

  function updateMap(event) {
    const mousePosition = renderer.SpawnMap.getWorldCoords(event);
    const isValid = validPosition(mousePosition);
    renderer.SpawnMap.render(event, isValid);
  }

  function validPosition(center) {
    // Check barrier collision
    let tl = {
      x: center.x - playerRadius / 2,
      y: center.y - playerRadius / 2,
    };
    let br = {
      x: center.x + playerRadius / 2,
      y: center.y + playerRadius / 2,
    };
    if (barriers.rectangularObjectCollides(tl, br)) {
      return false;
    }

    // Check opponent collision
    for (let i = 0; i < opponentPositions.length; ++i) {
      const dist = Math.sqrt(
        Math.pow(center.x - opponentPositions[i].x, 2) +
          Math.pow(center.y - opponentPositions[i].y, 2)
      );
      if (dist <= playerRadius) {
        // collided
        return false;
      }
    }

    // No collisions -> valid
    return true;
  }

  function setOpponentPosition({ position }) {
    opponentPositions.push(position);
    renderer.SpawnMap.addOpponent(position);
  }

  function setLocation(event) {
    const position = renderer.SpawnMap.getWorldCoords(event);

    if (validPosition(position)) {
      stopListening();
      menu.showScreen('gameplay');
      network.emit(NetworkIds.SET_STARTING_POSITION, position);
    }
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
    MyGame.renderer.SpawnMap.reset();

    network.listen(NetworkIds.OPPONENT_STARTING_POSITION, setOpponentPosition);

    document
      .getElementById('spawn-map')
      .addEventListener('mousemove', updateMap);

    document.getElementById('spawn-map').addEventListener('click', setLocation);
  }

  return {
    initialize: initialize,
    run: run,
  };
})(
  MyGame.menu,
  MyGame.renderer,
  MyGame.network,
  MyGame.barrierJson,
  MyGame.components
);
