// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a bullet.
//
// ------------------------------------------------------------------
'use strict';

//------------------------------------------------------------------
//
// Public function used to initially create a newly fired bullet.
//
//------------------------------------------------------------------
function createBullet(spec) {
  let that = {};

  let radius = 0.0025;
  let speed = spec.speed + 0.0002; // unit distance per millisecond
  let timeRemaining = 1500; // milliseconds
  let damage = 0.25;

  Object.defineProperty(that, 'clientId', {
    get: () => spec.clientId,
  });

  Object.defineProperty(that, 'id', {
    get: () => spec.id,
  });

  Object.defineProperty(that, 'direction', {
    get: () => spec.direction,
  });

  Object.defineProperty(that, 'position', {
    get: () => spec.position,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed,
  });

  Object.defineProperty(that, 'timeRemaining', {
    get: () => timeRemaining,
  });

  Object.defineProperty(that, 'damage', {
    get: () => damage,
  });

  that.toJSON = function() {
    return {
      id: that.id,
      direction: that.direction,
      position: that.position,
      radius: that.radius,
      speed: that.speed,
      damage: that.damage,
      timeRemaining: that.timeRemaining,
    };
  };

  //------------------------------------------------------------------
  //
  // Function used to update the bullet during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime) {
    let angle = spec.direction * Math.PI / 4;
    let vectorX = Math.cos(angle);
    let vectorY = Math.sin(angle);

    spec.position.x += vectorX * elapsedTime * speed;
    spec.position.y -= vectorY * elapsedTime * speed;

    timeRemaining -= elapsedTime;

    if (timeRemaining <= 0) {
      return false;
    } else {
      return true;
    }
  };

  return that;
}

module.exports.create = spec => createBullet(spec);
