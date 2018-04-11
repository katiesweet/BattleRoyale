// ------------------------------------------------------------------
//
// Rendering function for a Bullet object.
//
// ------------------------------------------------------------------
MyGame.renderer.Bullet = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Bullet model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.drawCircle('#FFFFFF', model.position, model.radius * 2, true);
  };

  return that;
})(MyGame.graphics);
