//------------------------------------------------------------------
//
// Model for the shield in the game.
//
//------------------------------------------------------------------
MyGame.components.Shield = function() {
  'use strict';
  let that = {};
  let center = {
    x: -1,
    y: -1,
  };
  let radius = 0;
  let rate = 0;

  Object.defineProperty(that, 'center', {
    get: () => center,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  that.initialize = function(spec) {
    center = spec.center;
    radius = spec.radius;
    rate = spec.rate;

    that.update(100);
  };

  that.update = function(elapsedTime) {
    radius = radius - rate * elapsedTime;
  };

  return that;
};
