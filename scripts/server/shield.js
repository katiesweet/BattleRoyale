'use strict';

// TODO
// render for viewport
// collision detection
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

  // that.toJSON = function() {
  //   return {
  //     id: that.id,
  //     direction: that.direction,
  //     position: that.position,
  //     radius: that.radius,
  //     speed: that.speed,
  //     timeRemaining: that.timeRemaining,
  //   };
  // };

  that.update = function(elapsedTime) {
    radius -= radius * rate;
    // radius -= radius * (rate / elapsedTime);
  };

  that.collides = function(position) {

  }

  return that;
}

module.exports.create = spec => createShield(spec);
