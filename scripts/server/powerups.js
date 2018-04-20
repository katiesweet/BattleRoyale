//------------------------------------------------------------------
//
// Manages all the barriers in the map.
//
//------------------------------------------------------------------

const random = require('./random');

// spec : {
// weaponUpgrades : numWeaponUpgrades,
// bullets : numBulletUpgrades,
// health : numHealthUpgrades,
// armour : numArmourUpgrades

function createPowerups(spec) {
    let that = {};
    let currentPowerupId = 0;
    let powerups = [];

    for (let i=0; i<spec.weaponUpgrades; ++i) {
        powerups.push({
            id: currentPowerupId++,
            type: 'weapon',
            position: {
                x: random.nextDouble() * 15,
                y: random.nextDouble() * 15,
            },
            radius: 0.03
        });
    }
    for (let i=0; i<spec.bullets; ++i) {
        powerups.push({
            id: currentPowerupId++,
            type: 'bullet',
            position: {
                x: random.nextDouble() * 15,
                y: random.nextDouble() * 15,
            },
            radius: 0.04
        });
    }

    for (let i=0; i<spec.health; ++i) {
        powerups.push({
            id: currentPowerupId++,
            type: 'health',
            position: {
                x: random.nextDouble() * 15,
                y: random.nextDouble() * 15,
            },
            radius: 0.02
        });
    }

    for (let i=0; i<spec.health; ++i) {
        powerups.push({
            id: currentPowerupId++,
            type: 'armour',
            position: {
                x: random.nextDouble() * 15,
                y: random.nextDouble() * 15,
            },
            radius: 0.02
        });
    }

    function collided(powerup, location, radius) {
        const distance = Math.sqrt(
            Math.pow(powerup.position.x - location.x, 2) +
            Math.pow(powerup.position.y - location.y, 2) 
        );

        const radii = powerup.radius + radius;

        return distance <= radius;
    }

    that.getSurroundingPowerups = function(location, radius) {
        let powerupsInRegion = [];
        for (let i=0; i<powerups.length; ++i) {
            if (collided(powerups[i], location, radius)) {
                powerupsInRegion.push(powerups[i]);
            }
        }
        return powerupsInRegion;
    }

    that.removePowerup = function(id) {
        let keptPowerups = []
        for (let i=0; i<powerups.length; ++i) {
            if (powerups[i].id != id) {
                keptPowerups.push(powerups[i]);
            }
        }
        powerups = keptPowerups;
    }

    return that;
}

module.exports.create = createPowerups;