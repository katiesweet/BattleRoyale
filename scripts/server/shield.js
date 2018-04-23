'use strict';

const random = require('./random');

function createShield(spec) {
  let that = {};

  let center = {
    x: Math.round(random.nextDouble() * 15),
    y: Math.round(random.nextDouble() * 15),
  };

  let points = [
    {x: 0, y: 0},
    {x: 0, y: 15},
    {x: 15, y: 15},
    {x: 15, y: 0},
  ];

  let covered = false;
  let radius = Math.max(center.x - 0, 15 - center.x, center.y - 0, 15 - center.y);
  while(!covered) {
    covered = true;
    for (let point in points) {
      let p = points[point];
      let xForm = Math.pow(Math.abs(p.x - center.x), 2);
      let yForm = Math.pow(Math.abs(p.y - center.y), 2);
      if (Math.sqrt(xForm + yForm) > radius) {
        covered = false;
        break;
      }
    }
    if (!covered) {
      radius += 1;
    }
  }

  let rate = radius / spec.gameLength;

  Object.defineProperty(that, 'center', {
    get: () => center,
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius,
  });

  Object.defineProperty(that, 'rate', {
    get: () => rate,
  });

  that.toJSON = function() {
    return {
      center,
      radius,
      rate,
    };
  };

  that.update = function(elapsedTime, gameStarted) {
    if (gameStarted) {
      radius = radius - rate * elapsedTime;
    }
  };

  that.collides = function(position, gameStarted) {
    if (gameStarted) {
      let xForm = Math.pow(Math.abs(position.x - center.x), 2);
      let yForm = Math.pow(Math.abs(position.y - center.y), 2);

      if (Math.sqrt(xForm + yForm) >= radius) {
        return true;
      }
    }
    return false;
  };

  return that;
}

module.exports.create = spec => createShield(spec);
