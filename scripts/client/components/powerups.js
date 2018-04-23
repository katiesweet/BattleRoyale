MyGame.components.Powerups = function() {
    'use strict';
    let that = {};
    let powerups = {};
  
    that.initialize = function(spec) {
      powerups = spec.powerups;
    };
  
    that.removePowerups = function(idsToRemove) {
      for (let i=0; i<idsToRemove.length; ++i) {
          delete powerups[idsToRemove[i]];
      }
    };

    function collided(powerup, location, radius) {
        const distance = Math.sqrt(
          Math.pow(powerup.position.x - location.x, 2) +
            Math.pow(powerup.position.y - location.y, 2)
        );
    
        const radii = powerup.radius + radius;
    
        return distance <= radius;
    };

    that.getWithinRegion = function(location, radius) {
        let powerupsInRegion = [];
        for (let powerup in powerups) {
            if (collided(powerups[powerup], location, radius)) {
                powerupsInRegion.push(powerups[powerup]);
            }
        }
        return powerupsInRegion;
    };
  
    return that;
  };