import ui.ParticleEngine as ParticleEngine;
import ui.resource.Image;

const PARTICLE_URL = 'resources/images/particle.png';
const PARTICLE_DEFAULT_COUNT = 18;

exports = Class(ParticleEngine, function(supr)
{
	this.init = function(portW, portH)
	{
		var opts =
		{
			width: portW,
			height: portH,
		};

		supr(this, 'init', [opts]);
		GC.app.engine.on('Tick', bind(this, function(dt){this._tick();}));
	};

	this.addParticle = function(_x, _y, duration, customTextureURL)
	{
		var data = this.obtainParticleArray(PARTICLE_DEFAULT_COUNT);

		var image = (customTextureURL === undefined) ? PARTICLE_URL : customTextureURL;

		for (var i = 0; i < PARTICLE_DEFAULT_COUNT; i++)
		{
			var particle = data[i];
			particle.x = _x;
			particle.y = _y;
			particle.ax = ((Math.random() * 300) - 150);
			particle.ay = ((Math.random() * 300) - 150);
			particle.dx = ((Math.random() * 200) - 100);
			particle.dy = ((Math.random() * 200) - 100);
			particle.width = particle.height = Math.random() * 20 + 5;
			particle.tll = duration;
			particle.image = image;
			particle.opacity = 1;
			particle.dopacity = -1;
			particle.ddopacity = -1;
		}

		this.emitParticles(data);
	};

	this.addDirectionalSparks = function(_x, _y, direction)
	{
		var particleArray = this.obtainParticleArray(8);

		for (var i = 0; i < 8; i++)
		{
			var particle = particleArray[i];
			particle.x = _x;
			particle.y = _y;
			particle.ax = Math.random() * 300 * direction;
			particle.ay = ((Math.random() * 300) - 150);
			particle.dx = Math.random() * 200 * direction;
			particle.dy = ((Math.random() * 200) - 100);
			particle.width = particle.height = Math.random() * 5 + 3;
			particle.tll = 400;
			particle.image = PARTICLE_URL;
			particle.opacity = .7;
			particle.dopacity = -1;
			particle.ddopacity = -1;
		}

		this.emitParticles(particleArray);
	}

	this._tick = function(dt)
	{
		if (dt === undefined)
			return;
		this.runTick(dt);
	};
});