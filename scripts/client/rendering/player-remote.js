// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics, assets) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders the sprite.
  //
  // ------------------------------------------------------------------
  function renderCharacter(model, playerTexture, skeletonTexture) {
    if (model.state.health > 0) {
      graphics.drawImage(
        playerTexture,
        model.sprite.walkingAnimationNumber * 128,
        model.sprite.rotateAnimationNumber * 128,
        128,
        128,
        model.state.position.x - model.size.width / 2,
        model.state.position.y - model.size.height / 2,
        model.size.width,
        model.size.height,
        true
      );
    } else {
      graphics.drawImage(
        skeletonTexture,
        0,
        0,
        128,
        128,
        model.state.position.x - model.size.width / 2,
        model.state.position.y - model.size.height / 2,
        model.size.width,
        model.size.height,
        true
      );
    }
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
      true
    );
  }

  // ------------------------------------------------------------------
  //
  // Renders a PlayerRemote model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, playerTexture, skeletonTexture) {
    renderCharacter(model, playerTexture, skeletonTexture);
    renderUsername(model);
  };

  return that;
})(MyGame.graphics, MyGame.assets);
