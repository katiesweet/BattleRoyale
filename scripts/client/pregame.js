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
  let prevRemaining = 0;
  let timeRemaining = 0;
  let lastTime;

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
        network.emit(NetworkIds.DISCONNECT_GAME);
        menu.showScreen('main-menu');
        stopListening();
      });
  }

  function updateCountdown(time) {
    const elapsedTime = time - lastTime;
    const countdown = document.getElementById('pregame-countdown');

    timeRemaining -= elapsedTime;
    lastTime = time;

    const text = Math.floor(timeRemaining / 1000);

    if (text !== countdown.innerHTML) {
      countdown.innerHTML = text;
    }

    if (timeRemaining > 0) {
      requestAnimationFrame(updateCountdown);
    } else {
      document.getElementById('pregame-countdown').innerHTML = '';
    }
  }

  function run() {
    MyGame.renderer.SpawnMap.reset();

    network.listen(NetworkIds.OPPONENT_STARTING_POSITION, setOpponentPosition);
    network.listen(NetworkIds.AUTO_JOIN_GAME, () => {
      stopListening();
      menu.showScreen('gameplay');
    });

    document
      .getElementById('spawn-map')
      .addEventListener('mousemove', updateMap);

    document.getElementById('spawn-map').addEventListener('click', setLocation);

    lastTime = performance.now();
    timeRemaining = 15000;
    requestAnimationFrame(updateCountdown);
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
