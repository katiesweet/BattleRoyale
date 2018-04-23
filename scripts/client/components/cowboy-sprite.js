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
  };

  that.updateRotationAnimation = function(rotation) {
    // let scaledRotation = rotation % (2 * Math.PI);
    // if (scaledRotation < 0) {
    //     scaledRotation = (2 * Math.PI) - scaledRotation;
    // }
    let scaledRotation = rotation;
    while (scaledRotation < 0) {
      scaledRotation = 2 * Math.PI + scaledRotation;
    }
    scaledRotation = scaledRotation % (2 * Math.PI);

    if (scaledRotation < Math.PI / 8 || scaledRotation > 15 * Math.PI / 8) {
      that.rotateAnimationNumber = 3;
    } else if (
      scaledRotation > Math.PI / 8 &&
      scaledRotation <= 3 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 4;
    } else if (
      scaledRotation > 3 * Math.PI / 8 &&
      scaledRotation <= 5 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 5;
    } else if (
      scaledRotation > 5 * Math.PI / 8 &&
      scaledRotation <= 7 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 6;
    } else if (
      scaledRotation > 7 * Math.PI / 8 &&
      scaledRotation <= 9 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 7;
    } else if (
      scaledRotation > 9 * Math.PI / 8 &&
      scaledRotation <= 11 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 8;
    } else if (
      scaledRotation > 11 * Math.PI / 8 &&
      scaledRotation <= 13 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 9;
    } else if (
      scaledRotation > 13 * Math.PI / 8 &&
      scaledRotation <= 15 * Math.PI / 8
    ) {
      that.rotateAnimationNumber = 2;
    } else {
      console.log('Unexpected rotation number: ', scaledRotation);
    }

    // if (direction >= 0 && direction <= 6) {
    //     that.rotateAnimationNumber = direction + 3;
    // }
    // else if (direction == 7) {
    //     that.rotateAnimationNumber = 2;
    // }
    // else {
    //     console.log("Unexpected rotation number: ", direction);
    // }
  };

  return that;
};
