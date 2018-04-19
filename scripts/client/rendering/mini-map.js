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

  that.render = function(model, explosions) {
    context.clear();
    context.drawImage(assets['mini-map'], 0, 0, map.width, map.height);

    context.beginPath();
    context.arc(
      model.position.x / 15 * map.width,
      model.position.y / 15 * map.height,
      2,
      0,
      2 * Math.PI
    );
    context.fillStyle = 'red';
    context.fill();

    for (let id in explosions) {
      context.beginPath();
      context.arc(
        explosions[id].center.x / 15 * map.width,
        explosions[id].center.y / 15 * map.height,
        2,
        0,
        2 * Math.PI
      );
      context.fillStyle = 'orange';
      context.strokeStyle = 'black';
      context.fill();
      context.stroke();
    }
  };

  return that;
})(MyGame.graphics, MyGame.assets);
