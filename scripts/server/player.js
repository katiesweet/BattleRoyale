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

  let position = { x: -1, y: -1 };
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
  let numBullets = 0; // Number of bullets character can shoot
  let weaponStrength = 1; // Standard bullet strength is 1
  let healthPacks = 0; // Number of health packs character has
  let armourLevel = 1; // Standard amount of damage caused by being hit is 1

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

  Object.defineProperty(that, 'numBullets', {
    get: () => numBullets,
    set: value => {
      numBullets = value;
      reportUpdate = true;
    },
  });

  Object.defineProperty(that, 'weaponStrength', {
    get: () => weaponStrength,
  });

  Object.defineProperty(that, 'healthPacks', {
    get: () => healthPacks,
  });

  Object.defineProperty(that, 'armourLevel', {
    get: () => armourLevel,
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
      numBullets,
      weaponStrength,
      healthPacks,
      armourLevel
    };
  };

  that.setStartingPosition = function(start) {
    reportUpdate = true;
    position = start;
    health = 1.0;
  };

  that.hitByBullet = function(bullet) {
    health = Math.max((health - bullet.damage) / armourLevel, 0);
    reportUpdate = true;
  };

  that.dieByShield = function() {
    health = 0;
    reportUpdate = true;
  };

  //------------------------------------------------------------------
  //
  // Utility function to perform a hit test between two objects.  The
  // objects must have a position: { x: , y: } property and radius property.
  //
  //------------------------------------------------------------------
  function collide(proposedPosition, otherObject) {
    const distance = Math.sqrt(
      Math.pow(proposedPosition.x - otherObject.position.x, 2) +
        Math.pow(proposedPosition.y - otherObject.position.y, 2)
    );
    const radii = size.radius / 2 + otherObject.size.radius / 2;

    return distance <= radii;
  }

  //------------------------------------------------------------------
  //
  // Function that checks if a move results in a collision
  //
  //------------------------------------------------------------------
  function checkIfCausesCollision(proposedPosition, barriers, activeClients) {
    // Check barrier collisions
    let tl = {
      x: proposedPosition.x - size.radius / 2,
      y: proposedPosition.y - size.radius / 2,
    };

    let br = {
      x: proposedPosition.x + size.radius / 2,
      y: proposedPosition.y + size.radius / 2,
    };

    //
    if (barriers.rectangularObjectCollides(tl, br)) {
      return true;
    }

    // Check other client collisions
    for (let opponentClientId in activeClients) {
      if (that.clientId == opponentClientId) {
        continue;
      }
      if (collide(proposedPosition, activeClients[opponentClientId].player)) {
        return true;
      }
    }

    return false;
  }

  //------------------------------------------------------------------
  //
  // Moves the player forward based on how long it has been since the
  // last move took place.
  //
  //------------------------------------------------------------------
  that.moveUp = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    // let angle = direction * Math.PI / 4;
    // let vectorX = Math.cos(angle);
    // let vectorY = Math.sin(angle);

    // let proposedPosition = {
    //   x: position.x + vectorX * elapsedTime * speed,
    //   y: position.y - vectorY * elapsedTime * speed,
    // };

    let proposedPosition = {
      x: position.x,
      y: position.y - elapsedTime * speed,
    };

    // position.x += vectorX * elapsedTime * speed;
    // position.y -= vectorY * elapsedTime * speed;

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }
    checkForPowerups(powerups);
  };

  that.moveLeft = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing + Math.PI / 2;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x: position.x + vectorX * elapsedTime * speed,
    //   y: position.y - vectorY * elapsedTime * speed,
    // };

    let proposedPosition = {
      x: position.x - elapsedTime * speed,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }
    checkForPowerups(powerups);
  };

  that.moveRight = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing - Math.PI / 2;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x: position.x + vectorX * elapsedTime * speed,
    //   y: position.y - vectorY * elapsedTime * speed,
    // };

    let proposedPosition = {
      x: position.x + elapsedTime * speed,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }

    checkForPowerups(powerups);
  };

  that.moveDown = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    // let angleFacing = direction * Math.PI / 4;
    // let leftAngle = angleFacing + Math.PI;
    // let vectorX = Math.cos(leftAngle);
    // let vectorY = Math.sin(leftAngle);

    // let proposedPosition = {
    //   x: position.x + vectorX * elapsedTime * speed,
    //   y: position.y - vectorY * elapsedTime * speed,
    // };

    let proposedPosition = {
      x: position.x,
      y: position.y + elapsedTime * speed,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }

    checkForPowerups(powerups);
  };

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------

  that.rotateRight = function() {
    reportUpdate = true;
    direction -= 1;
    if (direction < 0) {
      direction = 7;
    }
  };

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function() {
    reportUpdate = true;
    direction = (direction + 1) % 8;
  };

  function checkForPowerups(powerups) {
    const acquiredPowerups = powerups.getSurroundingPowerups(position, size.radius);

    for (let i=0; i<acquiredPowerups.length; ++i) {
      if (acquiredPowerups[i].type == 'weapon' && weaponStrength <= 1) {
        // Walked over a weapon powerup, and don't already have one
        weaponStrength = 2;
        powerups.removePowerup(acquiredPowerups[i].id);
      }
      else if (acquiredPowerups[i].type == 'bullet') {
        numBullets += 20;
        powerups.removePowerup(acquiredPowerups[i].id);
      }
      else if (acquiredPowerups[i].type == 'health') {
        healthPacks += 1;
        powerups.removePowerup(acquiredPowerups[i].id);
      }
      else if (acquiredPowerups[i].type == 'armour' && armourLevel <= 1) {
        armourLevel = 2;
        powerups.removePowerup(acquiredPowerups[i].id);
      }
    }
  }

  that.useHealth = function() {
    if (healthPacks > 0) {
      reportUpdate = true;
      healthPacks -=1;
      health = 1;
    }
  }

  return that;
}

module.exports.create = createPlayer;
