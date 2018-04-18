'use strict';

const random = require('./random');

function createShield(spec) {
  let that = {};

  let originX = Math.round(random.nextDouble() * 15);  // TODO need to be adjusted
  let originY = Math.round(random.nextDouble() * 15);  // TODO need to be adjusted

  // let speed = spec.speed + 0.0002; // unit distance per millisecond
  // let timeRemaining = 1500; // milliseconds
  let radius =  Math.max(originX - 0, 15 - originX, originY  - 0, 15 - originY);
  let rate = 15/600000; // 600000 is 10 minutes in milliseconds

  Object.defineProperty(that, 'originX', {
    get: () => originX,
  });

  Object.defineProperty(that, 'originY', {
    get: () => originY,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  // Object.defineProperty(that, 'speed', {
  //   get: () => speed,
  // });
  //
  // Object.defineProperty(that, 'timeRemaining', {
  //   get: () => timeRemaining,
  // });

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
    // TODO double check this calculation
    
    // let angle = spec.direction * Math.PI / 4;
    // let vectorX = Math.cos(angle);
    // let vectorY = Math.sin(angle);
    //
    // spec.position.x += vectorX * elapsedTime * speed;
    // spec.position.y -= vectorY * elapsedTime * speed;
    //
    // timeRemaining -= elapsedTime;
    //
    // if (timeRemaining <= 0) {
    //   return false;
    // } else {
    //   return true;
    // }
  };

  that.collides = function(position) {

  }

  return that;
}

module.exports.create = spec => createShield(spec);
