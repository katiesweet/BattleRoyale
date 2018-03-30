//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Arena = function() {
  'use strict';
  let that = {};
  let position = {
    x: 0,
    y: 0,
  };
  let size = {
    width: 1,
    height: 1,
  };

  Object.defineProperty(that, 'position', {
    get: () => position,
  });

  Object.defineProperty(that, 'size', {
    get: () => size,
  });

  that.update = function(elapsedTime) {};

  return that;
};
