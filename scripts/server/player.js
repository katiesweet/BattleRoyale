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
    width: 0.075,
    height: 0.075,
    radius: 0.04,
  };
  let direction = random.nextRange(0, 7); // * Math.PI/4
  let rotateRate = Math.PI / 750; // radians per millisecond
  let speed = 0.0002; // unit distance per millisecond
  let reportUpdate = false; // Indicates if this model was updated during the last update
  let health = 1.0;

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
    set: value => (position = value),
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

  Object.defineProperty(that, 'health', {
    get: () => health,
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
      health,
    };
  };

  //------------------------------------------------------------------
  //
  // Function that checks if a move results in a collision
  //
  //------------------------------------------------------------------
  function checkIfCausesCollision(proposedPosition, barriers) {
    // suppose we have MyGame.Barriers == barriers
    let tl = {
      x : proposedPosition.x - size.radius /2,
      y : proposedPosition.y - size.radius /2
    }

    let br = {
      x : proposedPosition.x + size.radius / 2,
      y : proposedPosition.y + size.radius / 2
    }
    return barriers.rectangularObjectCollides(tl, br);
  }

  //------------------------------------------------------------------
  //
  // Moves the player forward based on how long it has been since the
  // last move took place.
  //
  //------------------------------------------------------------------
  that.moveUp = function(elapsedTime, barriers) {
    reportUpdate = true;

    let angle = direction * Math.PI / 4;
    let vectorX = Math.cos(angle);
    let vectorY = Math.sin(angle);

    let proposedPosition = {
      x : position.x + vectorX * elapsedTime * speed,
      y : position.y - vectorY * elapsedTime * speed
    }

    // position.x += vectorX * elapsedTime * speed;
    // position.y -= vectorY * elapsedTime * speed;

    if (!checkIfCausesCollision(proposedPosition, barriers)) {
      position = proposedPosition;
    }
  };

  that.moveLeft = function(elapsedTime, barriers) {
    let angleFacing = direction * Math.PI / 4;
    let leftAngle = angleFacing + Math.PI / 2;
    let vectorX = Math.cos(leftAngle);
    let vectorY = Math.sin(leftAngle);

    let proposedPosition = {
      x : position.x + vectorX * elapsedTime * speed,
      y : position.y - vectorY * elapsedTime * speed
    }

    if (!checkIfCausesCollision(proposedPosition, barriers)) {
      position = proposedPosition;
    }

  }

  that.moveRight = function(elapsedTime, barriers) {
    let angleFacing = direction * Math.PI / 4;
    let leftAngle = angleFacing - Math.PI / 2;
    let vectorX = Math.cos(leftAngle);
    let vectorY = Math.sin(leftAngle);

    let proposedPosition = {
      x : position.x + vectorX * elapsedTime * speed,
      y : position.y - vectorY * elapsedTime * speed
    }

    if (!checkIfCausesCollision(proposedPosition, barriers)) {
      position = proposedPosition;
    }

  }

  that.moveDown = function(elapsedTime, barriers) {
    let angleFacing = direction * Math.PI / 4;
    let leftAngle = angleFacing + Math.PI;
    let vectorX = Math.cos(leftAngle);
    let vectorY = Math.sin(leftAngle);

    let proposedPosition = {
      x : position.x + vectorX * elapsedTime * speed,
      y : position.y - vectorY * elapsedTime * speed
    }

    if (!checkIfCausesCollision(proposedPosition, barriers)) {
      position = proposedPosition;
    }

  }

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------

  that.rotateRight = function() {
    reportUpdate = true;
    direction -=1;
    if (direction <= 0) {
      direction = 7;
    }
  }

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function() {
    reportUpdate = true;
    direction = (direction + 1) % 8;
  }
  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(when) {};

  return that;
}

module.exports.create = createPlayer;
