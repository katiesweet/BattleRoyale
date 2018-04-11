MyGame.renderer.MiniMap = (function(graphics, assets) {
  'use strict';
  let that = {};
  let map = document.getElementById('mini-map');
  let context = map.getContext('2d');

  window.addEventListener('resize', resizeMap);
  resizeMap();

  function resizeMap() {
    map.width = Math.min(
      (window.innerWidth - window.innerHeight + 20) / 2 - 20,
      window.innerHeight
    );
    map.height = Math.min(
      (window.innerWidth - window.innerHeight + 20) / 2 - 20,
      window.innerHeight
    );
  }

  that.render = function(model) {
    context.clear();
    context.drawImage(assets['mini-map'], 0, 0, map.width, map.height);

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
