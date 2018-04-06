MyGame.renderer.MiniMap = (function(graphics, assets) {
    'use strict';
    let that = {};
    let map = document.getElementById('mini-map');
    let context = map.getContext('2d');
    context.fillStyle = "red";

    that.render = function(model) {
        context.clear();
        context.drawImage(assets['mini-map'], 0, 0, map.width, map.height)

        context.beginPath();
        context.arc(model.position.x*10, model.position.y*10, 2, 0, 2*Math.PI);
        context.fill();
        // context.drawCircle('rgb(255,0,0)', (model.position.x*10, model.position.y*10), 10)
    }
    return that;
})(MyGame.graphics, MyGame.assets);