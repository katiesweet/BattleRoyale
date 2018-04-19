// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Player = (function(graphics, assets) {
  'use strict';
  let that = {},
    healthBarHeight = 0.01;

  // ------------------------------------------------------------------
  //
  // Renders the sprite.
  //
  // ------------------------------------------------------------------
  function renderCharacter(model, playerTexture, skeletonTexture) {
    if (model.health > 0) {
      graphics.drawImage(
        playerTexture,
        model.sprite.walkingAnimationNumber * 128,
        model.sprite.rotateAnimationNumber * 128,
        128,
        128,
        model.position.x - model.size.width / 2,
        model.position.y - model.size.height / 2,
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
        model.position.x - model.size.width / 2,
        model.position.y - model.size.height / 2,
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
      model.position.x,
      model.position.y + 4 * model.size.height / 5,
      model.size.width,
      true
    );
  }

  // ------------------------------------------------------------------
  //
  // Renders the name
  //
  // ------------------------------------------------------------------
  function renderHealthBar(model) {
    // Render a little bar above the player that represents the health
    // of the ship.
    graphics.drawRectangle(
      'rgba(0, 0, 0, 255)',
      model.position.x - model.size.width / 2,
      model.position.y - (model.size.height / 2 + healthBarHeight * 2),
      model.size.width,
      healthBarHeight,
      true
    );

    //
    // Fill the whole thing with red
    graphics.drawFilledRectangle(
      'rgba(255, 0, 0, 255)',
      model.position.x - model.size.width / 2,
      model.position.y - (model.size.height / 2 + healthBarHeight * 2),
      model.size.width,
      healthBarHeight,
      true
    );

    //
    // Cover up with the green portion
    graphics.drawFilledRectangle(
      'rgba(0, 255, 0, 255)',
      model.position.x - model.size.width / 2,
      model.position.y - (model.size.height / 2 + healthBarHeight * 2),
      model.size.width * model.health,
      healthBarHeight,
      true
    );
  }

  function renderFieldOfView(model) {
    graphics.drawFieldOfView(model.fieldOfView, true);
  }

  // ------------------------------------------------------------------
  //
  // Renders a Player model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, playerTexture, skeletonTexture) {
    renderCharacter(model, playerTexture, skeletonTexture);
    renderUsername(model);

    if (model.health > 0) {
      renderHealthBar(model);
      renderFieldOfView(model);
    }
  };

  return that;
})(MyGame.graphics, MyGame.assets);
