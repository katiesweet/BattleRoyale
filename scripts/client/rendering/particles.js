MyGame.renderer.ParticleSystem = (function(graphics, assets) {
	let that = {};
	that.systems = [];

	that.createParticle = function() {
		let particlePack = {};
		let particles = [];
		particlePack.spec = {
			speed: { mean: 0.0001, stdev: 0},
			lifetime: { mean: 800, stdev: 500 },
			size: { mean: 0.02, stdev: 0.001 }
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

			for (let particle = 0; particle < shield.radius * 5; particle++) {
				let randomAngle = Math.round(Math.random() * 360);
				let p = {
					position: { x: (Math.cos(randomAngle) * shield.radius) + shield.center.x, y: (Math.sin(randomAngle) * shield.radius) + shield.center.y},
					direction: nextCircleVector(),
	        speed: nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
	        lifetime: nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
					alive: 0,
	        size: nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
				};
				keepMe.push(p);
			}
			particles = keepMe;
		};

    particlePack.render = function() {
	    for (let particle = 0; particle < particles.length; particle++) {
        let part = particles[particle];
					graphics.drawCircle("rgb(0, 0, 0, 0.5)", part.position, part.size, true);
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

	that.render = function() {
			for (var system in that.systems) {
				that.systems[system].render();
			}
	}

	return that;
})(MyGame.graphics, MyGame.assets);
