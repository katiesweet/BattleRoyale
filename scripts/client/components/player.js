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
  let rotationSinceLastDiscreteMove = 0;
  let speed = 0;

  that.sprite = MyGame.components.CowboySprite({
      walkingRate : 100
  });

  Object.defineProperty(that, 'direction', {
    get: () => direction,
    set: value => {
      direction = value;
      that.sprite.updateRotationAnimation(direction);
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

  that.initialize = function(spec) {
    position.x = spec.position.x;
    position.y = spec.position.y;

    size.x = spec.size.x;
    size.y = spec.size.y;

    direction = spec.direction;
    speed = spec.speed;
    rotateRate = spec.rotateRate;
    that.sprite.updateRotationAnimation(direction);
  };

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    let angle = direction * Math.PI / 4;
    let vectorX = Math.cos(angle);
    let vectorY = Math.sin(angle);
    // let vectorX = Math.cos(direction);
    // let vectorY = Math.sin(direction);

    position.x += vectorX * elapsedTime * speed;
    position.y -= vectorY * elapsedTime * speed;

    that.sprite.updateWalkAnimation(elapsedTime);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    // direction += rotateRate * elapsedTime;
    rotationSinceLastDiscreteMove += rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove > Math.PI/8) {
      rotationSinceLastDiscreteMove = - Math.PI/8;
      direction -= 1;
      if (direction <= 0) {
        direction = 7;
      }
    }
    that.sprite.updateRotationAnimation(direction);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    // direction -= rotateRate * elapsedTime;
    rotationSinceLastDiscreteMove -= rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove < -1 * Math.PI/8) {
      rotationSinceLastDiscreteMove = Math.PI/8;
      direction = (direction + 1) % 8;
    }
    that.sprite.updateRotationAnimation(direction);
  };

  that.update = function(spec) {
    position.x = spec.position.x;
    position.y = spec.position.y;
    direction = spec.direction;
    that.sprite.updateRotationAnimation(direction);
  };

  return that;
};
