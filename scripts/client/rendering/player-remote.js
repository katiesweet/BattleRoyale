// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics) {
  'use strict';
  let that = {};

   // ------------------------------------------------------------------
  //
  // Renders the sprite.
  //
  // ------------------------------------------------------------------
  function renderCharacter(model, texture) {
    graphics.drawImage(
      texture,
      model.sprite.walkingAnimationNumber * 128,
      model.sprite.rotateAnimationNumber * 128,
      128,
      128,
      model.state.position.x - model.size.width / 2,
      model.state.position.y - model.size.width / 2,
      model.size.width,
      model.size.height,
      true
    );
  }

  // ------------------------------------------------------------------
  //
  // Renders the name
  //
  // ------------------------------------------------------------------
  function renderUsername(model) {
    graphics.drawText(
      'black',
      '12px sans-serif',
      model.username,
      model.state.position.x,
      model.state.position.y + 4 * model.size.height / 5,
      model.size.width,
      true);
  }

  // ------------------------------------------------------------------
  //
  // Renders a PlayerRemote model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    // graphics.saveContext();
    // graphics.rotateCanvas(model.state.position, model.state.direction);
    // graphics.drawImage(
    //   texture,
    //   model.sprite.walkingAnimationNumber * 128,
    //   model.sprite.rotateAnimationNumber * 128,
    //   128,
    //   128,
    //   model.state.position.x - model.size.width / 2,
    //   model.state.position.y - model.size.height / 2,
    //   model.size.width,
    //   model.size.height,
    //   true
    // );
    // graphics.restoreContext();
    renderCharacter(model, texture);
    renderUsername(model);
  };

  return that;
})(MyGame.graphics);
