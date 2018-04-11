//------------------------------------------------------------------
//
// Model for each explosion in the game.
//
//------------------------------------------------------------------
MyGame.components.Explosion = function(spec, id) {
  'use strict';

  return MyGame.components.AnimatedSprite({
    id,
    spriteSheet: MyGame.assets.explosion,
    spriteSize: { width: 0.07, height: 0.07 },
    spriteCenter: spec.position,
    spriteCount: 16,
    spriteTime: [
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
      50,
    ],
  });
};
