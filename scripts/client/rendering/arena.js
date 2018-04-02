// ------------------------------------------------------------------
//
// Rendering function for a Arena object.
//
// ------------------------------------------------------------------
MyGame.renderer.Arena = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Arena model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.saveContext();
    graphics.drawImage(texture, model.position, model.size);
    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
