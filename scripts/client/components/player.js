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
    width: 0.09,
    height: 0.09,
  };
  let direction = 0;
  let rotationSinceLastDiscreteMove = 0;
  that.rotateAnimationNumber = 0;

  let rotateRate = 0;
  let speed = 0;
  let health = 0.75;
  let username = 'Katie';
  let walkingTimeSinceLastAnimationChange = 0;
  let walkingAnimationRate = 100;
  that.walkingAnimationNumber = 0;

  // let timeSinceLastCharacterRotation = 0;
  // let rotationAnimationRate = 150;
  // that.rotateAnimationNumber = 3;


  Object.defineProperty(that, 'direction', {
    get: () => direction * Math.PI/4,
    set: value => {
      direction = Math.round(value / (Math.PI/4));
      updateRotationSprite();
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
    walkingTimeSinceLastAnimationChange += elapsedTime;
    if (walkingTimeSinceLastAnimationChange > walkingAnimationRate) {
      that.walkingAnimationNumber = (that.walkingAnimationNumber + 1) % 9;
      walkingTimeSinceLastAnimationChange = 0;
    }
  }

  function updateRotationSprite() {
    if (direction >= 0 && direction <= 6) {
      that.rotateAnimationNumber = direction + 3;
    }
    else if (direction == 7) {
      that.rotateAnimationNumber = 2; 
    }
    else {
      console.log("Unexpected rotation number: ", direction);
    }
  }

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    // console.log("Move");
    let angle = direction * Math.PI/4;
    let vectorX = Math.cos(angle);
    let vectorY = Math.sin(angle);
    // console.log(vectorX, vectorY);
    // let vector = getRotationVector();

    position.x += vectorX * elapsedTime * speed;
    position.y -= vectorY * elapsedTime * speed;
    // position.x += vector.x * elapsedTime * speed;
    // let deltaY = vector.y * elapsedTime * speed;
    // position.y += vector.y * elapsedTime * speed;

    updateWalkAnimation(elapsedTime);
  };

  // that.proposedMove = function(elapsedTime) {
  //   var vectorX = Math.cos(spec.rotation + spec.orientation),
  //   vectorY = Math.sin(spec.rotation + spec.orientation),
  //   center = {
  //     x: sprite.center.x + (vectorX * spec.moveRate * elapsedTime),
  //     y: sprite.center.y + (vectorY * spec.moveRate * elapsedTime),
  //   };

  //   return center;
  // }

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    // console.log("Rotate right");
    // direction += rotateRate * elapsedTime;
    // updateRotateAnimation(elapsedTime, -1);
    rotationSinceLastDiscreteMove += rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove > Math.PI/8) {
      rotationSinceLastDiscreteMove = - Math.PI/8;
      direction -= 1;
      if (direction <= 0) {
        direction = 7;
      }
    }
    updateRotationSprite();
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    // console.log("Rotate left");
    // direction -= rotateRate * elapsedTime;
    // updateRotateAnimation(elapsedTime, 1);
    rotationSinceLastDiscreteMove -= rotateRate * elapsedTime;
    if (rotationSinceLastDiscreteMove < -Math.PI/8) {
      // rotate to next, but 
      rotationSinceLastDiscreteMove = Math.PI/8;
      direction = (direction + 1) % 8;
    }
    updateRotationSprite();
  };

  that.update = function(elapsedTime) {};

  return that;
};
