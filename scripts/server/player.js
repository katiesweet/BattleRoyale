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
  // let direction = random.nextRange(0, 7); // * Math.PI/4
  let rotation = 0;
  let rotateRate = Math.PI / 1000; // radians per millisecond
  let speed = 0.0002; // unit distance per millisecond
  let reportUpdate = false; // Indicates if this model was updated during the last update
  let health = 1.0;
  let numBullets = 0; // Number of bullets character can shoot
  let weaponStrength = 1; // Standard bullet strength is 1
  let healthPacks = 0; // Number of health packs character has
  let armourLevel = 1; // Standard amount of damage caused by being hit is 1
  let score = 0;

  let sprintLevel = 1; // How much sprint time you have left (in seconds)
  let sprintMultiplier = 1;
  let sprintPressed = false;

  Object.defineProperty(that, 'username', {
    get: () => username,
  });

  Object.defineProperty(that, 'clientId', {
    get: () => clientId,
  });

  Object.defineProperty(that, 'rotation', {
    get: () => rotation,
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

  Object.defineProperty(that, 'sprintLevel', {
    get: () => sprintLevel,
  });

  Object.defineProperty(that, 'score', {
    get: () => score,
  });

  that.toJSON = function() {
    return {
      clientId,
      username,
      rotation,
      position,
      size,
      rotateRate,
      speed,
      health,
      numBullets,
      weaponStrength,
      healthPacks,
      armourLevel,
      sprintLevel,
    };
  };

  that.selfUpdateJSON = function(lastMessageId) {
    return {
      lastMessageId,
      rotation,
      position,
      health,
      numBullets,
      weaponStrength,
      healthPacks,
      armourLevel,
      sprintLevel,
    };
  };

  that.otherUpdateJSON = function(updateWindow) {
    return {
      updateWindow,
      clientId,
      rotation,
      position,
      health,
    };
  };

  that.increaseScore = function(increase) {
    score += increase;
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

    let proposedPosition = {
      x: position.x,
      y: position.y - elapsedTime * speed * sprintMultiplier,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }
    checkForPowerups(powerups);
  };

  that.moveLeft = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    let proposedPosition = {
      x: position.x - elapsedTime * speed * sprintMultiplier,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }
    checkForPowerups(powerups);
  };

  that.moveRight = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    let proposedPosition = {
      x: position.x + elapsedTime * speed * sprintMultiplier,
      y: position.y,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }

    checkForPowerups(powerups);
  };

  that.moveDown = function(elapsedTime, barriers, activeClients, powerups) {
    reportUpdate = true;

    let proposedPosition = {
      x: position.x,
      y: position.y + elapsedTime * speed * sprintMultiplier,
    };

    if (!checkIfCausesCollision(proposedPosition, barriers, activeClients)) {
      position = proposedPosition;
    }

    checkForPowerups(powerups);
  };

  that.sprint = function() {
    sprintPressed = true;
  };

  that.updateSprint = function(elapsedTime) {
    if (sprintPressed) {
      sprintLevel = Math.max(sprintLevel - elapsedTime / 1750, 0);
      sprintMultiplier = sprintLevel > 0 ? 2.25 : 1;
    } else {
      sprintLevel = Math.min(sprintLevel + elapsedTime / 7500, 1);
      sprintMultiplier = 1;
    }
    sprintPressed = false;
  };

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------

  that.rotateRight = function(elapsedTime) {
    reportUpdate = true;
    rotation -= rotateRate * elapsedTime;
  };

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    reportUpdate = true;
    rotation += rotateRate * elapsedTime;
  };

  function checkForPowerups(powerups) {
    const acquiredPowerups = powerups.getSurroundingPowerups(
      position,
      size.radius
    );

    // for (let i = 0; i < acquiredPowerups.length; ++i) {
    for (let id in acquiredPowerups) {
      if (acquiredPowerups[id].type == 'weapon' && weaponStrength <= 1) {
        // Walked over a weapon powerup, and don't already have one
        weaponStrength = 2;
        powerups.removePowerup(id);
      } else if (acquiredPowerups[id].type == 'bullet') {
        numBullets += 20;
        powerups.removePowerup(id);
      } else if (acquiredPowerups[id].type == 'health') {
        healthPacks += 1;
        powerups.removePowerup(id);
      } else if (acquiredPowerups[id].type == 'armour' && armourLevel <= 1) {
        armourLevel = 2;
        powerups.removePowerup(id);
      }
    }
  }

  that.useHealth = function() {
    if (healthPacks > 0) {
      reportUpdate = true;
      healthPacks -= 1;
      health = 1;
    }
  };

  return that;
}

module.exports.create = createPlayer;
