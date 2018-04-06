// ------------------------------------------------------------------
//
// Rendering function for a Missile object.
//
// ------------------------------------------------------------------
MyGame.renderer.Missile = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Missile model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.drawCircle('#FFFFFF', model.position, model.radius*2, true);
  };

  return that;
})(MyGame.graphics);
