// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Player = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Player model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.saveContext();
    graphics.rotateCanvas(model.position, model.direction);
    graphics.drawImage(
                      texture, 
                      model.position.x - model.size.width/2, 
                      model.position.y - model.size.width/2, 
                      model.size.width,
                      model.size.height,
                      true);
    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
