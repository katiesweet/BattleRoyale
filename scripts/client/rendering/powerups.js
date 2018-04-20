MyGame.renderer.Powerups = (function(graphics) {
    'use strict';
    let that = {};


    that.render = function(powerups, powerupTextures) {
        for (let i=0; i<powerups.length; ++i) {
            graphics.drawImage(
                powerupTextures[powerups[i].type],
                powerups[i].position.x - powerups[i].radius,
                powerups[i].position.y - powerups[i].radius,
                powerups[i].radius * 2,
                powerups[i].radius * 2,
                true
            );
        }
    }

    return that;


})(MyGame.graphics);