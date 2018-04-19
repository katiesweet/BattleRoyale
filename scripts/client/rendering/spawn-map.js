MyGame.renderer.SpawnMap = (function(graphics, assets, components) {
  'use strict';
  let that = {};
  let map = document.getElementById('spawn-map');
  let context = map.getContext('2d');

  let opponentLocations = []

  window.addEventListener('resize', resizeMap);
  resizeMap();

  function resizeMap() {
    map.width = map.height = window.innerHeight - 225;
    render({ clientX: -1, clientY: -1 });
  }

  function getMousePosition(event) {
    let rect = map.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - 3,
      y: event.clientY - rect.top - 3,
    };
  }

  function renderOpponents() {
    context.beginPath();
    context.fillStyle = 'yellow';
    for (let i=0; i<opponentLocations.length; ++i) {
      const relativeCoordLoc = {
        x : opponentLocations[i].x * map.width / 15,
        y : opponentLocations[i].y * map.height / 15
      }
      context.arc(relativeCoordLoc.x, relativeCoordLoc.y, 2, 0, 2*Math.PI);
    }
    context.fill();
  }

  that.addOpponent = function(position) {
    opponentLocations.push(position);
    renderOpponents();
  }

  function render(event, isValid) {
    context.clear();
    context.drawImage(assets['mini-map'], 0, 0, map.width, map.height);

    renderOpponents();

    const mousePosition = getMousePosition(event);

    context.beginPath();
    context.arc(mousePosition.x, mousePosition.y, 2, 0, 2 * Math.PI);
    context.fillStyle = (isValid ? 'lime' : 'red');
    context.fill();
  }

  that.getWorldCoords = function(event) {
    const mousePosition = getMousePosition(event);
    return {
      x: mousePosition.x * 15 / map.width,
      y: mousePosition.y * 15 / map.height,
    };
  };

  that.reset = function() {
    opponentLocations = [];
  }

  that.render = render;

  return that;
})(MyGame.graphics, MyGame.assets, MyGame.components);
