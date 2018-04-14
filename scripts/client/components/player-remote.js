//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
MyGame.components.PlayerRemote = function() {
  'use strict';
  let that = {};
  let size = {
    width: 0.075,
    height: 0.075,
  };
  let state = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
  };
  let goal = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
    updateWindow: 0, // Server reported time elapsed since last update
  };

   that.sprite = MyGame.components.CowboySprite({
    walkingRate: 100
  });

  Object.defineProperty(that, 'state', {
    get: () => state,
  });

  Object.defineProperty(that, 'goal', {
    get: () => goal,
  });

  Object.defineProperty(that, 'size', {
    get: () => size,
  });

  that.initialize = function(spec) {
    state.position.x = spec.position.x;
    state.position.y = spec.position.y;
    state.direction = spec.direction;
    state.lastUpdate = performance.now();

    goal.position.x = spec.position.x;
    goal.position.y = spec.position.y;
    goal.direction = spec.direction;
    goal.updateWindow = 0;

    that.sprite.updateRotationAnimation(state.direction);
  };

  that.updateGoal = function(spec) {
    goal.updateWindow = spec.updateWindow;

    if (spec.position.x != goal.position.x || spec.position.y != goal.position.y) {
      that.sprite.updateWalkAnimation(spec.updateWindow);
    }

    goal.position.x = spec.position.x;
    goal.position.y = spec.position.y;
    goal.direction = spec.direction;
    that.sprite.updateRotationAnimation(spec.direction);
  };

  //------------------------------------------------------------------
  //
  // Update of the remote player is a simple linear progression/interpolation
  // from the previous state to the goal (new) state.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime) {
    // Protect agains divide by 0 before the first update from the server has been given
    if (goal.updateWindow === 0) return;

    let updateFraction = elapsedTime / goal.updateWindow;
    if (updateFraction > 0) {
      //
      // Turn first, then move.
      state.direction = goal.direction;

      state.position.x -= (state.position.x - goal.position.x) * updateFraction;
      state.position.y -= (state.position.y - goal.position.y) * updateFraction;
    }
  };

  return that;
};
