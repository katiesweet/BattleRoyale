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
  let rotateRate = 0;
  let speed = 0;
  let health = 0.75;
  let username = 'Katie';
  let walkingTimeSinceLastAnimationChange = 0;
  let walkingAnimationRate = 100;
  that.walkingAnimationNumber = 0;

  let timeSinceLastCharacterRotation = 0;
  let rotationAnimationRate = 150;
  that.rotateAnimationNumber = 3;


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

  function updateRotateAnimation(elapsedTime, sign) {
    timeSinceLastCharacterRotation += sign * elapsedTime
    if (timeSinceLastCharacterRotation > rotationAnimationRate) {
      // rotate right
      that.rotateAnimationNumber += 1
      if (that.rotateAnimationNumber > 9) {
        that.rotateAnimationNumber = 2
      }
      timeSinceLastCharacterRotation = 0
    }
    else if (timeSinceLastCharacterRotation < -1*rotationAnimationRate) {
      // rotate left
      that.rotateAnimationNumber -=1
      if (that.rotateAnimationNumber < 2) {
        that.rotateAnimationNumber = 9
      }
      timeSinceLastCharacterRotation = 0
    }
  }
  // function updateRotateAnimation() {
  //     let currRotationVector = {
  //         x: Math.cos(direction);
  //         y: Math.sin(direction);
  //     }
  // }

  function getRotationVector() {
    let vector = {}

    if (that.rotateAnimationNumber == 3) {
      console.log(3);
      vector.x = 1.0
      vector.y = 0.0
    }
    else if (that.rotateAnimationNumber == 4) {
      console.log(4);
      vector.x = 0.70710678118
      vector.y = 0.70710678118
    }
    else if (that.rotateAnimationNumber == 5) {
      console.log(5);
      vector.x = 0.0
      vector.y = 1.0
    }
    else if (that.rotateAnimationNumber == 6) {
      console.log(6);
      vector.x = -0.70710678118
      vector.y = 0.70710678118
    }
    else if (that.rotateAnimationNumber == 7) {
      console.log(7);
      vector.x = -1.0
      vector.y = 0.0
    }
    else if (that.rotateAnimationNumber == 8) {
      console.log(8);
      vector.x = -0.70710678118
      vector.y = -0.70710678118
    }
    else if (that.rotateAnimationNumber == 9) {
      console.log(9);
      vector.x = 0.0
      vector.y = -1.0
    }
    else if (that.rotateAnimationNumber == 2) {
      console.log(2);
      vector.x = 0.70710678118
      vector.y = -0.70710678118
    }
    else {
      console.log("Rotation error!")
    }

    return vector;
  };

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);
    // console.log(vectorX, vectorY);
    // let vector = getRotationVector();

    position.x += vectorX * elapsedTime * speed;
    position.y += vectorY * elapsedTime * speed;
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
    direction += rotateRate * elapsedTime;
    // updateRotateAnimation(elapsedTime, -1);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    direction -= rotateRate * elapsedTime;
    // updateRotateAnimation(elapsedTime, 1);
  };

  that.update = function(elapsedTime) {};

  return that;
};
