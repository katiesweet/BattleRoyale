//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function() {
  'use strict';
  let that = {};
  let position = {
    x: 0,
    y: 0,
  };
  let size = {
    width: 0.075,
    height: 0.075,
  };
  let direction = 0;
  let rotateRate = 0;
  let speed = 0;
  let health = 0.75;
  let username = 'Katie';
  let walkingTimeSinceLastAnimationChange = 0;
  let walkingAnimationRate = 100;

  that.walkingAnimationNumber = 0;

  Object.defineProperty(that, 'direction', {
    get: () => direction,
    set: value => {
      direction = value;
    },
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed,
    set: value => {
      speed = value;
    },
  });

  Object.defineProperty(that, 'rotateRate', {
    get: () => rotateRate,
    set: value => {
      rotateRate = value;
    },
  });

  Object.defineProperty(that, 'position', {
    get: () => position,
  });

  Object.defineProperty(that, 'size', {
    get: () => size,
  });

  Object.defineProperty(that, 'health', {
    get: () => health
  });

  Object.defineProperty(that, 'username', {
    get: () => username
  });


  function updateWalkAnimation(elapsedTime) {
    // let walkingAnimationNumber = 0;
    // let walkingTimeSinceLastAnimationChange = 0;
    // let walkingAnimationRate = 0.1;
    walkingTimeSinceLastAnimationChange += elapsedTime;
    if (walkingTimeSinceLastAnimationChange > walkingAnimationRate) {
      that.walkingAnimationNumber = (that.walkingAnimationNumber + 1) % 9;
      walkingTimeSinceLastAnimationChange = 0;
    }
  }
  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    position.x += vectorX * elapsedTime * speed;
    position.y += vectorY * elapsedTime * speed;

    updateWalkAnimation(elapsedTime);
  };

  that.proposedMove = function(elapsedTime) {
    var vectorX = Math.cos(spec.rotation + spec.orientation),
    vectorY = Math.sin(spec.rotation + spec.orientation),
    center = {
      x: sprite.center.x + (vectorX * spec.moveRate * elapsedTime),
      y: sprite.center.y + (vectorY * spec.moveRate * elapsedTime),
    };

    return center;
  }

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    direction += rotateRate * elapsedTime;
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    direction -= rotateRate * elapsedTime;
  };

  that.update = function(elapsedTime) {};

  return that;
};
