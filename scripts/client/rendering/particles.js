function ParticleSystem(spec, graphics) {
	let that = {};
	let particles = [];
	let image = new Image();
	image.onload = function () {
		that.render = function() {
			for (let particle = 0; particle < particles.length; particle++) {
				if (particles[particle].alive >= 100) {
					//graphics.drawRectangle(
						// particles[particle].position,
						// particles[particle].size,
						// particles[particle].rotation,
						// particles[particle].fill,
						// particles[particle].stroke);
					graphics.drawImage(
						particles[particle].position,
						particles[particle].size,
						particles[particle].rotation,
						image);
				}
			}
		};
	};
	image.src = spec.image;

	that.update = function(elapsedTime) {
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

		for (let particle = 0; particle < 25; particle++) {
			let p = {
				position: { x: spec.position.x, y: spec.position.y },
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
				alive: 0,
				size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
				fill: spec.fill,
				stroke: 'rgb(0, 0, 0)'
			};
			keepMe.push(p);
		}
		particles = keepMe;
	};

	that.render = function() {};

	return that;
}
