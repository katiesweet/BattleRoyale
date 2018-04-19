//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function(barriers) {
  'use strict';
  let that = {};
  let position = {
    x: 0,
    y: 0,
  };
  let size = {
    width: 0.075,
    height: 0.075,
    radius: 0.04,
  };
  let direction = 0;
  let rotateRate = 0;
  let speed = 0;
  let username = '';
  let health = 0;

  let fieldOfView = {
    angle: 2, // * Math.PI/4
    radius: 0.4,
  };

  let currentInputs = [];

  that.sprite = MyGame.components.CowboySprite({
    walkingRate: 100,
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
    set: value => {
      position = value;
    },
  });

  Object.defineProperty(that, 'size', {
    get: () => size,
  });

  Object.defineProperty(that, 'username', {
    get: () => username,
  });

  Object.defineProperty(that, 'health', {
    get: () => health,
  });

  Object.defineProperty(that, 'fieldOfView', {
    get: () => getFieldOfView(),
  });

  function getFieldOfView() {
    let firstAngle = (direction + fieldOfView.angle / 2) * Math.PI / 4;
    let p2 = {
      x: position.x + Math.cos(firstAngle) * fieldOfView.radius,
      y: position.y - Math.sin(firstAngle) * fieldOfView.radius,
    };

    let secondAngle = (direction - fieldOfView.angle / 2) * Math.PI / 4;
    let p3 = {
      x: position.x + Math.cos(secondAngle) * fieldOfView.radius,
      y: position.y - Math.sin(secondAngle) * fieldOfView.radius,
    };

    return {
      p1: position,
      p2: p2,
      p3: p3,
      radius: fieldOfView.radius,
      startAngle: -1 * firstAngle,
      endAngle: -1 * secondAngle,
    };
  }

  that.initialize = function(spec) {
    position.x = spec.position.x;
    position.y = spec.position.y;

    size.width = spec.size.width;
    size.height = spec.size.height;
    size.radius = spec.size.radius;

    direction = spec.direction;
    speed = spec.speed;
    rotateRate = spec.rotateRate;
    that.sprite.updateRotationAnimation(direction);

    username = spec.username;
    health = spec.health;
  };

  that.addMoveInput = function(action, elapsedTime) {
    currentInputs.push({
      moveType: action,
      elapsedTime: elapsedTime,
    });
  }

  that.processInputs = function() {
    for (let i=0; i<currentInputs.length; ++i) {
      if (currentInputs[i].moveType == 'move-left') {
        that.moveLeft(currentInputs[i].elapsedTime);
      }
      else if (currentInputs[i].moveType == 'move-right') {
        that.moveRight(currentInputs[i].elapsedTime);
      }
      else if (currentInputs[i].moveType == 'move-up') {
        that.moveUp(currentInputs[i].elapsedTime);
      }
      else if (currentInputs[i].moveType == 'move-down') {
        that.moveDown(currentInputs[i].elapsedTime);
      }
    }
    currentInputs.length = 0;
  }

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.moveUp = function(elapsedTime) {
    // let angle = direction * Math.PI / 4;
    // let vectorX = Math.cos(angle);
    // let vectorY = Math.sin(angle);

    // let proposedPosition = {
    //   x : position.x + vectorX * elapsedTime * speed,
    //   y : position.y - vectorY * elapsedTime * speed
    // }

    // position.x += vectorX * elapsedTime * speed;
    // position.y -= vectorY * elapsedTime * speed;
    let proposedPosition = {
      x: position.x,
      y: position.y - elapsedTime * speed,
    };

    if (!checkIfCausesCollision(proposedPosition)) {
      position = proposedPosition;
      that.sprite.updateWalkAnimation(elapsedTime);
    }
  };

  that.moveLeft = function(elapsedTime) {
    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing + Math.PI / 2;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x : position.x + vectorX * elapsedTime * speed,
    //   y : position.y - vectorY * elapsedTime * speed
    // }

    let proposedPosition = {
      x: position.x - elapsedTime * speed,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition)) {
      position = proposedPosition;
      that.sprite.updateWalkAnimation(elapsedTime);
    }
  };

  that.moveRight = function(elapsedTime) {
    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing - Math.PI / 2;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x : position.x + vectorX * elapsedTime * speed,
    //   y : position.y - vectorY * elapsedTime * speed
    // }

    let proposedPosition = {
      x: position.x + elapsedTime * speed,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition)) {
      position = proposedPosition;
      that.sprite.updateWalkAnimation(elapsedTime);
    }
  };

  that.moveDown = function(elapsedTime) {
    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing + Math.PI;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x : position.x + vectorX * elapsedTime * speed,
    //   y : position.y - vectorY * elapsedTime * speed
    // }
    let proposedPosition = {
      x: position.x,
      y: position.y + elapsedTime * speed,
    };

    if (!checkIfCausesCollision(proposedPosition)) {
      position = proposedPosition;
      that.sprite.updateWalkAnimation(elapsedTime);
    }
  };

  //------------------------------------------------------------------
  //
  // Function that checks if a move results in a collision
  //
  //------------------------------------------------------------------
  function checkIfCausesCollision(proposedPosition) {
    let tl = {
      x: proposedPosition.x - size.radius / 2,
      y: proposedPosition.y - size.radius / 2,
    };

    let br = {
      x: proposedPosition.x + size.radius / 2,
      y: proposedPosition.y + size.radius / 2,
    };

    return barriers.rectangularObjectCollides(tl, br);
  }

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function() {
    direction -= 1;
    if (direction < 0) {
      direction = 7;
    }
    that.sprite.updateRotationAnimation(direction);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function() {
    direction = (direction + 1) % 8;
    that.sprite.updateRotationAnimation(direction);
  };

  that.update = function(spec) {
    position.x = spec.position.x;
    position.y = spec.position.y;
    direction = spec.direction;
    health = spec.health;
    that.sprite.updateRotationAnimation(direction);
  };

  return that;
};
