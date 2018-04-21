MyGame.renderer.MiniMap = (function(graphics, assets) {
  'use strict';
  const that = {};
  const map = document.getElementById('mini-map');
  const context = map.getContext('2d');

  window.addEventListener('resize', resizeMap);
  resizeMap();

  function resizeMap() {
    const size = (window.innerWidth - window.innerHeight + 20) / 2 - 25;
    map.width = map.height = Math.max(80, size);
  }

  that.render = function(model, explosions, shield) {
    context.clear();
    context.drawImage(assets['mini-map'], 0, 0, map.width, map.height);

    // render shield here
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.beginPath();
    context.arc(
      shield.center.x / 15 * map.height,
      shield.center.y / 15 * map.height,
      shield.radius / 15 * map.height,
      0,
      2 * Math.PI,
      false
    );
    context.rect(15 * map.height, 0, -15 * map.height, 15 * map.height);
    context.fill();

    // render player dot here
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
