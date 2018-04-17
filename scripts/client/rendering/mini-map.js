MyGame.renderer.MiniMap = (function(graphics, assets) {
  'use strict';
  let that = {};
  let map = document.getElementById('mini-map');
  let context = map.getContext('2d');

  window.addEventListener('resize', resizeMap);
  resizeMap();

  function resizeMap() {
    const size = (window.innerWidth - window.innerHeight + 20) / 2 - 25;
    map.width = map.height = Math.max(80, size);
  }

  that.render = function(model, shield) {
    context.clear();
    context.drawImage(assets['mini-map'], 0, 0, map.width, map.height);

    // render shield here
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(
      shield.x / 15 * map.height,
      shield.y / 15 * map.height,
      shield.radius / 15 * map.height,
      0,
      2 * Math.PI,
      false,
    );
    context.rect(15*map.height, 0, -15*map.height, 15*map.height);
    context.fill();

    // render player dot here
    context.beginPath();
    context.arc(
      model.position.x / 15 * map.height,
      model.position.y / 15 * map.height,
      2,
      0,
      2 * Math.PI
    );
    context.fillStyle = 'red';
    context.fill();
  };

  return that;
})(MyGame.graphics, MyGame.assets);
