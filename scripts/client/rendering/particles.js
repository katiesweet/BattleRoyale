MyGame.renderer.ParticleSystem = (function(graphics, assets) {
	let that = {};
	that.systems = [];
	let mapWidth = 15 * 512;
	let images = [assets['dark-clouds-1'], assets['dark-clouds-2'], assets['dark-clouds-3']];

	that.createParticle = function() {
		let particlePack = {};
		let particles = [];
		particlePack.spec = {
			speed: { mean: 0.0001, stdev: 0},
			lifetime: { mean: 800, stdev: 500 },
			size: { mean: 0.05, stdev: 0 }
		}


		particlePack.update = function(elapsedTime, shield) {
			let keepMe = [];
			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}

			for (let particle = 0; particle < shield.radius * 12; particle++) {
				let randomAngle = Math.round(Math.random() * 360);
				let randomAdd = Math.round(Math.random() * 5) - 2;
				let randomSelect = Math.round(Math.random() * 2);
				let p = {
					position: { x: (Math.cos(randomAngle) * shield.radius) + randomAdd, y: (Math.sin(randomAngle) * shield.radius) + randomAdd},
					direction: nextCircleVector(),
	        speed: nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
	        lifetime: nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
					alive: 0,
	        size: nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
					image: images[randomSelect],
				};
				keepMe.push(p);
			}
			particles = keepMe;
		};

    particlePack.render = function(player, shield) {
	    for (let particle = 0; particle < particles.length; particle++) {
        let part = particles[particle];

				//       //     graphics.drawImage(particlePack.image,
				//       //       (part.position.x * mapWidth) - (player.position.x * mapWidth),
				//       //       (part.position.y * mapWidth) - (player.position.y * mapWidth),
				//       //       part.size, part.size, true);
        // graphics.drawImage(particlePack.image,
        //   (part.position.x * mapWidth) - (player.position.x * mapWidth),
				// 	(part.position.y * mapWidth) - (player.position.y * mapWidth),
        //   .05, .05, false);

					// graphics.drawImage(part.image,
					// 	(part.position.x * mapWidth) - ((shield.x * mapWidth) - (player.position.x * mapWidth)),
					// 	(part.position.y * mapWidth) - ((shield.y * mapWidth) - (player.position.y * mapWidth)),
					// 	0.1, 0.1, false);

					// console.log((part.position.x * mapWidth) -  (player.position.x * mapWidth))
					// console.log((part.position.y * mapWidth) - (player.position.y * mapWidth));
					// function drawShieldParticle(size, position, image, shield, player) {

					graphics.drawShieldParticle(0.1, part.position, part.image, shield, player);


						// (part.position.x * mapWidth) - ((shield.x * mapWidth) - (player.position.x * mapWidth)),
						// (part.position.y * mapWidth) - ((shield.y * mapWidth) - (player.position.y * mapWidth)),

				// graphics.drawRectangle('black', part.position.x, part.position.y, 3, 3, false);
					// function drawRectangle(style, left, top, width, height, useViewport) {

				// )
	    }
    }

    function nextCircleVector(scale = 1) {
      let angle = Math.random() * 2 * Math.PI;

      return {
        x: Math.cos(angle) * scale,
        y: Math.sin(angle) * scale,
      };
    }

    function nextGaussian(mean, stdDev) {
      let x1 = 0,
        x2 = 0,
        y1 = 0,
        z = 0;

      do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        z = x1 * x1 + x2 * x2;
      } while (z >= 1);

      z = Math.sqrt(-2 * Math.log(z) / z);
      y1 = x1 * z;
      y2 = x2 * z;

      return mean + y1 * stdDev;
    }

		return particlePack;
  }

	that.update = function(elapsedTime, shield) {
		if (!that.systems.length) {
			that.systems.push(that.createParticle(shield))
		}
    for (let system in that.systems) {
			that.systems[system].update(elapsedTime, shield);
    }
	}

	that.render = function(player, shield) {
			for (var system in that.systems) {
				that.systems[system].render(player, shield);
			}
	}

	return that;
})(MyGame.graphics, MyGame.assets);


// // const random = require('scripts/server/random');
//
// MyGame.renderer.ParticleSystem = (function(graphics, assets) {
// 	let that = {};
// 	that.systems = [];
//
// 	that.createParticle = function(shield, specs) {
// 		let particlePack = {};
// 		let particles = [];
// 		particlePack.spec = {
// 			position: { x: specs.x, y: specs.y},
// 			speed: { mean: 0.07, stdev: 0.025},
// 			lifetime: { mean: 5000, stdev: 1000 },
// 			size: { mean: 10, stdev: 2 }
// 		}
// 		// initialize particles
// 		for (let particle = 0; particle < 20; particle++) {
// 			let p = {
// 				position: { x: particlePack.spec.position.x, y: particlePack.spec.position.y },
//         direction: nextCircleVector(),
// 				// direction: Random.nextCircleVector(),
//         speed: nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
// 				// speed: Random.nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
//         lifetime: nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
// 				// lifetime: Random.nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
// 				alive: 0,
//         size: nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
// 				// size: Random.nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
// 			};
// 			particles.push(p);
// 		}
// 		// set up image
// 		particlePack.image = assets['light-particle'];
//
//     // set up update function
// 		particlePack.update = function(elapsedTime) {
// 			let keepMe = [];
// 			for (let particle = 0; particle < particles.length; particle++) {
// 				particles[particle].alive += elapsedTime;
// 				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
// 				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
//
// 				if (particles[particle].alive <= particles[particle].lifetime) {
// 					keepMe.push(particles[particle]);
// 				}
// 			}
// 			if (keepMe.length) {
// 				particles = keepMe;
// 				return true;
// 			} else {
// 				return false;
// 			}
// 		};
//
//     particlePack.render = function(player) {
//       let mapWidth = 15 * 512;
//       // for (let particle = 0; particle < particles.length; particle++) {
//       //   if (particles[particle].alive >= 100) {
//       //     let part = particles[particle];
//       //     graphics.drawImage(particlePack.image,
//       //       (part.position.x * mapWidth) - (player.position.x * mapWidth),
//       //       (part.position.y * mapWidth) - (player.position.y * mapWidth),
//       //       part.size, part.size, true);
//       //   }
//       // }
//     }
//
//     function nextCircleVector(scale = 1) {
//       let angle = Math.random() * 2 * Math.PI;
//
//       return {
//         x: Math.cos(angle) * scale,
//         y: Math.sin(angle) * scale,
//       };
//     }
//
//     function nextGaussian(mean, stdDev) {
//       let x1 = 0,
//         x2 = 0,
//         y1 = 0,
//         z = 0;
//
//       do {
//         x1 = 2 * Math.random() - 1;
//         x2 = 2 * Math.random() - 1;
//         z = x1 * x1 + x2 * x2;
//       } while (z >= 1);
//
//       z = Math.sqrt(-2 * Math.log(z) / z);
//       y1 = x1 * z;
//       y2 = x2 * z;
//
//       return mean + y1 * stdDev;
//     }
//
// 		return particlePack;
//   }
//
//
//
//
// 	that.update = function(elapsedTime, shield) {
//     if (Object.keys(shield).length > 0) {
//       let points = {};
//       let left = graphics.viewport.left;
//       let top = graphics.viewport.top;
//       let width = graphics.world.width;
//       let height = graphics.world.height;
//
//       points['p1'] = {
//         x: left, y: top,
//       };
//       points['p2'] = {
//         x: left + width, y: top,
//       };
//       points['p3'] = {
//         x: left + width, y: top + height,
//       };
//       points['p4'] = {
//         x: left, y: top + height,
//       };
//       // check for quad1
//       // console.log(points[0])
//       let draw = false;
//       for (let p in points) {
//         if (points[p].x >= shield.x && points[p].y >= shield.y) {
//           console.log('QUAD1');
//           draw = true;
//           break;
//         }
//       }
//       if (draw) {
//         for (let i = 0; i < shield.radius * 1; i ++) {
//           let randomAngle = Math.floor(Math.random() * 90);
//           that.systems.push(that.createParticle(shield, {
//             x: Math.cos(randomAngle) * shield.radius,
//             y: Math.sin(randomAngle) * shield.radius,
//           }));
//         }
//       }
//       // check for quad2
//       draw = false;
//       for (let p in points) {
//         if (points[p].x <= shield.x && points[p].y >= shield.y) {
//           draw = true;
//           console.log('QUAD2');
//           break;
//         }
//       }
//       if (draw) {
//         for (let i = 0; i < shield.radius * 1; i ++) {
//           let randomAngle =Math.floor(Math.random() * 90) + 90;
//           that.systems.push(that.createParticle(shield, {
//             x: Math.cos(randomAngle) * shield.radius,
//             y: Math.sin(randomAngle) * shield.radius,
//           }));
//         }
//       }
//       // check for quad3
//       draw = false;
//       for (let p in points) {
//         if (points[p].x <= shield.x && points[p].y <= shield.y) {
//           console.log('QUAD3');
//           draw = true;
//           break;
//         }
//       }
//       if (draw) {
//         for (let i = 0; i < shield.radius * 1; i ++) {
//           let randomAngle =Math.floor(Math.random() * 90) + 180;
//           that.systems.push(that.createParticle(shield, {
//             x: Math.cos(randomAngle) * shield.radius,
//             y: Math.sin(randomAngle) * shield.radius,
//           }));
//         }
//       }
//
//       // check for quad4
//       draw = false;
//       for (let p in points) {
//         if (points[p].x >= shield.x && points[p].y <= shield.y) {
//           console.log('QUAD4');
//           draw = true;
//           break;
//         }
//       }
//       if (draw) {
//         for (let i = 0; i < shield.radius * 1; i ++) {
//           let randomAngle =Math.floor(Math.random() * 90) + 270;
//           that.systems.push(that.createParticle(shield, {
//             x: Math.cos(randomAngle) * shield.radius,
//             y: Math.sin(randomAngle) * shield.radius,
//           }));
//         }
//       }
//       let keepMe = [];
//       for (var system in that.systems) {
//         if (that.systems[system].update(elapsedTime)) {
//           keepMe.push(that.systems[system]);
//         }
//       }
//       that.systems = keepMe;
//     }
// 	}
//
// 	that.render = function(player) {
// 		for (var system in that.systems) {
// 			that.systems[system].render(player);
// 		}
// 	}
//
// 	return that;
// })(MyGame.graphics, MyGame.assets);
