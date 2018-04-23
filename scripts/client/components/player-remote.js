//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
MyGame.components.PlayerRemote = function() {
  'use strict';
  let that = {};
  let username = '';
  let size = {
    width: 0.075,
    height: 0.075,
  };
  let state = {
    rotation: 0,
    position: {
      x: 0,
      y: 0,
    },
    health: 0,
  };
  let goal = {
    rotation: 0,
    position: {
      x: 0,
      y: 0,
    },
    health: 0,
    updateWindow: 0, // Server reported time elapsed since last update
  };
  let lastUpdate = performance.now();

  that.sprite = MyGame.components.CowboySprite({
    walkingRate: 100,
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

  Object.defineProperty(that, 'username', {
    get: () => username,
  });

  Object.defineProperty(that, 'health', {
    get: () => health,
  });

  Object.defineProperty(that, 'lastUpdate', {
    get: () => lastUpdate,
  });

  that.initialize = function(spec) {
    state.position.x = spec.position.x;
    state.position.y = spec.position.y;
    state.rotation = spec.rotation;
    state.health = spec.health;

    goal.position.x = spec.position.x;
    goal.position.y = spec.position.y;
    goal.rotation = spec.rotation;
    goal.health = spec.health;
    goal.updateWindow = 0;

    size.x = spec.size.x;
    size.y = spec.size.y;

    that.sprite.updateRotationAnimation(state.rotation);
    username = spec.username;
    lastUpdate = performance.now();
  };

  that.updateGoal = function(spec) {
    goal.updateWindow = spec.updateWindow;

    if (
      spec.position.x != goal.position.x ||
      spec.position.y != goal.position.y
    ) {
      that.sprite.updateWalkAnimation(spec.updateWindow);
    }

    goal.position.x = spec.position.x;
    goal.position.y = spec.position.y;
    goal.rotation = spec.rotation;
    goal.health = spec.health;
    that.sprite.updateRotationAnimation(spec.rotation);
    lastUpdate = performance.now();
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
      state.rotation = goal.rotation;
      state.health = goal.health;

      state.position.x -= (state.position.x - goal.position.x) * updateFraction;
      state.position.y -= (state.position.y - goal.position.y) * updateFraction;
    }
  };

  return that;
};
