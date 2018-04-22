const random = require('./random');

MyGame.renderer.ParticleSystem = (function(graphics, assets) {
	let that = {};

	that.systems = [];

	that.createParticle(shield, specs) {
		let particlePack = {};
		let particles = [];
		particlePack.spec = {
			position: { x: specs.x, y: specs.y},
			speed: { mean: 0.07, stdev: 0.025},
			lifetime: { mean: 2000, stdev: 1000 },
			size: { mean: 5, stdev: 2 }
		}
		// initialize particles
		for (let particle = 0; particle < 25; particle++) {
			let p = {
				position: { x: particlePack.spec.position.x, y: particlePack.spec.position.y },
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
				rotation: 0,
				lifetime: Random.nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
				alive: 0,
				size: Random.nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
			};
			particles.push(p);
		}
		// set up image
		particlePack.image = new Image();
		particlePack.image.onload = function () {
			that.render = function(player) {
				for (let particle = 0; particle < particles.length; particle++) {
					if (particles[particle].alive >= 100) {
						let part = particles[particle];
						graphics.drawImage(particlePack.image, particle.x, particle.y, particle.size, particle.size, true);
					}
				}
			};
		};
		particlePack.image.src = assets['light-particle'];

    // set up update function
		particlePack.update = function(elapsedTime) {
			let keepMe = [];
			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
				particles[particle].rotation += particles[particle].speed / .5;

				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}
			if (keepMe.length) {
				particles = keepMe;
				return true;
			} else {
				return false;
			}
		};

		particlePack.render = function() {};

		return particlePack;
	}

	that.updateParticles = function(elapsedTime, shield) {
    let points = {};
    let left = graphics.viewport.left;
    let top = graphics.viewport.top;
    let width = graphics.world.width;
    let height = graphics.world.height;
    points['p1'] = {
      x: left, y: top,
      // pairx: left + width, pairy: top,
      // off1x: left + width, off1y: top + height,
      // off2x: left, off2y: top + height,
    };
    points['p2'] = {
      x: left + width, y: top,
      // pairx: left, pairy: top,
      // off1x: left + width, off1y: top + height,
      // off2x: left, off2y: top + height
    };
    points['p3'] = {
      x: left + width, y: top + height,
      // pairx: left, pairy: top + height
      // off1x: left, off1y: top,
      // off2x: left + width, off2y: top,
    };
    points['p4'] = {
      x: left, y: top + height,
      // pairx:left + width, pairy: top + height,
      // off1x: left, off1y: top,
      // off2x: left + width, off2y: top
    };


    // let dist = Math.sqrt(Math.pow(points['p1'].x - points['p3'].x, 2) + Math.pow(points['p1'].y - points['p3'].y, 2));

    // check for quad1
    let draw = false;
    for (let p in points) {
      if (p.x >= shield.originX && p.y >= shield.originY) {
        draw = true;
      }
    }
    if (draw) {

    }
    // check for quad2
    let draw = false;
    for (let p in points) {
      if (p.x <= shield.originX && p.y >= shield.originY) {
        draw = true;
      }
    }
    if (draw) {

    }
    // check for quad3
    let draw = false;
    for (let p in points) {
      if (p.x <= shield.originX && p.y <= shield.originY) {
        draw = true;
      }
    }
    if (draw) {

    }

    // check for quad4
    let draw = false;
    for (let p in points) {
      if (p.x >= shield.originX && p.y <= shield.originY) {
        draw = true;
      }
    }
    if (draw) {

    }



		let randomAngle = Math.random() * Math.PI * 2;
		let keepMe = [];
		for (var system in that.systems) {
			if (system.update(elapsedTime)) {
				keepMe.push(system);
			}
		}
		that.systems = keepMe;
	}

	that.renderParticles = function(player) {
		for (var system in that.systems) {
			system.render(player);
		}
	}

	return that;
})(MyGame.graphics, MyGame.assets);
