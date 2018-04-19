'use strict';

// TODO
// particles

const random = require('./random');

function createShield(spec) {
  let that = {};

  let originX = Math.round(random.nextDouble() * 15);
  let originY = Math.round(random.nextDouble() * 15);

  let radius =  Math.max(originX - 0, 15 - originX, originY  - 0, 15 - originY);
  let rate = radius/600000; // 600000 is 10 minutes in milliseconds

  Object.defineProperty(that, 'originX', {
    get: () => originX,
  });

  Object.defineProperty(that, 'originY', {
    get: () => originY,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  that.update = function(elapsedTime) {
    radius = radius - (rate * elapsedTime);
  };

  that.collides = function(position) {
    let xForm = Math.square(Math.abs(position.x - originX));
    let yForm = Math.square(Math.abs(position.y - originY));
    if (Math.sqrt(xForm + yForm) <= r) {
      return true;
    }
    return false;
  }

  return that;
}

module.exports.create = spec => createShield(spec);
