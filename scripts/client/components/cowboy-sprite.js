MyGame.components.CowboySprite = function(spec) {
    let that = {};

    let walkingTimeSinceLastAnimationChange = 0.0;
    that.walkingAnimationNumber = 0;

    let rotationSinceLastDiscreteMove = 0;
    that.rotateAnimationNumber = 0;

    that.updateWalkAnimation = function(elapsedTime) {
        walkingTimeSinceLastAnimationChange += elapsedTime;
            if (walkingTimeSinceLastAnimationChange > spec.walkingRate) {
            that.walkingAnimationNumber = (that.walkingAnimationNumber + 1) % 9;
                walkingTimeSinceLastAnimationChange = 0;
            }
    }

    that.updateRotationAnimation = function(direction) {
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

    return that;
}

