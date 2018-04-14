// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

const random = require('./random');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer(username, clientId) {
  let that = { username, clientId };

  let position = {
    x: random.nextDouble() * 15,
    y: random.nextDouble() * 15,
  };

  let size = {
    width: 0.01,
    height: 0.01,
    radius: 0.02,
  };
  let direction = random.nextRange(0, 7); // * Math.PI/4
  let rotationSinceLastDiscreteMove = 0;
  let rotateRate = Math.PI / 750; // radians per millisecond
  let speed = 0.0002; // unit distance per millisecond
  let reportUpdate = false; // Indicates if this model was updated during the last update

  Object.defineProperty(that, 'username', {
    get: () => username,
  });

  Object.defineProperty(that, 'clientId', {
    get: () => clientId,
  });

  Object.defineProperty(that, 'direction', {
    get: () => direction,
  });

  Object.defineProperty(that, 'position', {
    get: () => position,
  });

  Object.defineProperty(that, 'size', {
    get: () => size,
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed,
  });

  Object.defineProperty(that, 'rotateRate', {
    get: () => rotateRate,
  });

  Object.defineProperty(that, 'reportUpdate', {
    get: () => reportUpdate,
    set: value => (reportUpdate = value),
  });

  Object.defineProperty(that, 'radius', {
    get: () => size.radius,
  });

  that.toJSON = function() {
    return {
      clientId,
      username,
      direction,
      position,
      size,
      rotateRate,
      speed,
    };
  };

  //------------------------------------------------------------------
  //
  // Moves the player forward based on how long it has been since the
  // last move took place.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    reportUpdate = true;

    let angle = direction * Math.PI / 4;
    let vectorX = Math.cos(angle);
    let vectorY = Math.sin(angle);
    // let vectorX = Math.cos(direction);
    // let vectorY = Math.sin(direction);

    position.x += vectorX * elapsedTime * speed;
    position.y -= vectorY * elapsedTime * speed;
  };

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    reportUpdate = true;
    // direction += rotateRate * elapsedTime;
    rotationSinceLastDiscreteMove += rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove > Math.PI/8) {
      rotationSinceLastDiscreteMove = - 1 * Math.PI/8;
      direction -= 1;
      if (direction <= 0) {
        direction = 7;
      }
    }
  };

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    reportUpdate = true;
    // direction -= rotateRate * elapsedTime;
    rotationSinceLastDiscreteMove -= rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove < -1 * Math.PI/8) {
      rotationSinceLastDiscreteMove = Math.PI/8;
      direction = (direction + 1) % 8;
    }
  };

  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(when) {};

  return that;
}

module.exports.create = createPlayer;
