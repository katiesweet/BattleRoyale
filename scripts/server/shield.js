'use strict';

const random = require('./random');

function createShield(spec) {
  let that = {};

  let originX = Math.round(random.nextDouble() * 15);
  let originY = Math.round(random.nextDouble() * 15);

  let radius = Math.max(originX - 0, 15 - originX, originY - 0, 15 - originY);
  let rate = radius / 600000; // 600000 is 10 minutes in milliseconds

  Object.defineProperty(that, 'originX', {
    get: () => originX,
  });

  Object.defineProperty(that, 'originY', {
    get: () => originY,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  that.update = function(elapsedTime, gameStarted) {
    if (gameStarted) {
      radius = radius - rate * elapsedTime;
    }
  };

  that.collides = function(position, gameStarted) {
    if (gameStarted) {
      let xForm = Math.pow(Math.abs(position.x - originX), 2);
      let yForm = Math.pow(Math.abs(position.y - originY), 2);
      if (Math.sqrt(xForm + yForm) >= radius) {
        return true;
      }
    }
    return false;
  };

  return that;
}

module.exports.create = spec => createShield(spec);
