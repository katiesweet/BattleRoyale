//------------------------------------------------------------------
//
// Manages all the barriers in the map.
//
//------------------------------------------------------------------

MyGame.components.Barriers = function(barriers) {
    'use strict';

    let that = {};
    let tileWidth = 1024;
    let numTilesPerRow = 15;

    function collidesWithWall(tlWorldCoord, brWorldCoord) {
        if (tlWorldCoord.x < 0) return true;
        if (tlWorldCoord.y < 0) return true;
        if (brWorldCoord.x > 15) return true;
        if (brWorldCoord.y > 15) return true;
        
        return false;
    }

    function collides(objectCoordWithinTile, barrier) {
        if (objectCoordWithinTile.tl_x < barrier.br_x &&
            objectCoordWithinTile.br_x > barrier.tl_x &&
            objectCoordWithinTile.tl_y < barrier.br_y &&
            objectCoordWithinTile.br_y > barrier.tl_y) {
                return true;
        }
        return false;
    }

    that.rectangularObjectCollides = function(tl, br) {
        // Get x,y tile coordinates
        let objectX = Math.floor(tl.x + (tl.x - br.x) / 2);
        let objectY = Math.floor(tl.y + (br.y - tl.y) / 2);
        let mapKey = 'map_' + (objectY * numTilesPerRow + objectX);

        // Check wall collision
        if (collidesWithWall(tl, br)) return true;

        // Get object coordinate within tile
        let objectCoordWithinTile = {
            tl_x : (tl.x - objectX) * tileWidth,
            tl_y : (tl.y - objectY) * tileWidth,
            br_x : (br.x - objectX) * tileWidth,
            br_y : (br.y - objectY) * tileWidth
        }        
        let possibleCollisionObjects = barriers[mapKey];

        let completeBarriers = possibleCollisionObjects['complete_barriers'];
        for (let i=0; i<completeBarriers.length; ++i) {
            if (collides(objectCoordWithinTile, completeBarriers[i])) {
                return true;
            }
        }   
        
        let shootingBarriers = possibleCollisionObjects['shooting_barriers'];
        for (let i=0; i<shootingBarriers.length; ++i) {
            if (collides(objectCoordWithinTile, shootingBarriers[i])) {
                return true;
            }
        }  

        let walkingBarriers = possibleCollisionObjects['walking_barriers'];
        for (let i=0; i<walkingBarriers.length; ++i) {
            if (collides(objectCoordWithinTile, walkingBarriers[i])) {
                return true;
            }
        }
        
        return false;
    }

    return that;
};