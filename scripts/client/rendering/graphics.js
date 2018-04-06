// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
  'use strict';

  let canvas = document.getElementById('canvas-main');
  let context = canvas.getContext('2d');

  var world = {	// The size of the world must match the world-size of the background image
    get left() { return 0; },
    get top() { return 0; },
    // get width() { return 4.375; },
    get width() {return 15; },
    // get height() { return 2.5; },
    get height() {return 15;},
    get bufferSize() { return 0.25; },
    get size() {return 600;}
  },
  worldBuffer = {
    get left() { return world.left + world.bufferSize; },
    get top() { return world.top + world.bufferSize; },
    get right() { return world.width - world.bufferSize; },
    get bottom() { return world.height - world.bufferSize; }
  },
  viewport = MyGame.components.Viewport({
    left: 0,
    top: 0,
    buffer: 0.15	// This can't really be any larger than world.buffer, guess I could protect against that.
  });
  //------------------------------------------------------------------
  //
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  //
  //------------------------------------------------------------------
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };

  //------------------------------------------------------------------
  //
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear() {
    context.clear();
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through to save the canvas context.
  //
  //------------------------------------------------------------------
  function saveContext() {
    context.save();
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through the restore the canvas context.
  //
  //------------------------------------------------------------------
  function restoreContext() {
    context.restore();
  }

  //------------------------------------------------------------------
  //
  // Rotate the canvas to prepare it for rendering of a rotated object.
  //
  //------------------------------------------------------------------
  // function rotateCanvas(center, rotation) {
  //   context.translate(center.x * canvas.width, center.y * canvas.width);
  //   context.rotate(rotation);
  //   context.translate(-center.x * canvas.width, -center.y * canvas.width);
  // }

  function rotateCanvas(center, rotation) {
		context.translate((center.x - viewport.left) * world.size + world.left, (center.y - viewport.top) * world.size + world.top);
		context.rotate(rotation);
		context.translate(-((center.x - viewport.left) * world.size + world.left), -((center.y - viewport.top) * world.size + world.top));
	}

  //------------------------------------------------------------------
  //
  // Draw an image into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImage() {
		var image = arguments[0],
			sx, sy,
			sWidth, sHeight,
			dx, dy,
			dWidth, dHeight,
			useViewport;

		//
		// Figure out which version of drawImage was called and extrac the correct values
		if (arguments.length === 5 || arguments.length === 6) {
			sx = 0;
			sy = 0;
			sWidth = image.width;
			sHeight = image.height;
			dx = arguments[1];
			dy = arguments[2];
			dWidth = arguments[3];
			dHeight = arguments[4];
			useViewport = arguments[5];
		} else if (arguments.length === 9 || arguments.length === 10) {
			sx = arguments[1];
			sy = arguments[2];
			sWidth = arguments[3];
			sHeight = arguments[4];
			dx = arguments[5];
			dy = arguments[6];
			dWidth = arguments[7];
			dHeight = arguments[8];
			useViewport = arguments[9];
		}

		if (useViewport) {
			dx -= viewport.left;
      dy -= viewport.top;
    }
		//
		// Convert from world to pixel coordinates on a few items.  Using
		// floor and ceil to prevent pixel boundary rendering issues.
    	context.drawImage(
			image,
			sx, sy,
      sWidth, sHeight,
			Math.floor(dx * world.size + world.left), Math.floor(dy * world.size + world.top),
    	Math.ceil(dWidth * world.size), Math.ceil(dHeight * world.size));
	}

  //------------------------------------------------------------------
  //
  // Draw an image out of a spritesheet into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
    let localCenter = {
      x: center.x * canvas.width,
      y: center.y * canvas.width,
    };
    let localSize = {
      width: size.width * canvas.width,
      height: size.height * canvas.height,
    };

    context.drawImage(
      spriteSheet,
      sprite * spriteSize.width,
      0, // which sprite to render
      spriteSize.width,
      spriteSize.height, // size in the spritesheet
      localCenter.x - localSize.width / 2,
      localCenter.y - localSize.height / 2,
      localSize.width,
      localSize.height
    );
  }

  //------------------------------------------------------------------
  //
  // Draw a circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  // function drawCircle(center, radius, color) {
  //   context.beginPath();
  //   context.arc(
  //     center.x * canvas.width,
  //     center.y * canvas.width,
  //     2 * radius * canvas.width,
  //     2 * Math.PI,
  //     false
  //   );
  //   context.closePath();
  //   context.fillStyle = color;
  //   context.fill();
  // }
  function drawCircle(style, center, radius, useViewport) {
		var adjustLeft = (useViewport === true) ? viewport.left : 0,
			adjustTop = (useViewport === true) ? viewport.top : 0;

		//
		// 0.5, 0.5 is to ensure an actual 1 pixel line is drawn.
		context.fillStyle = style;
		context.beginPath();
		context.arc(
			0.5 + world.left + ((center.x - adjustLeft) * world.size),
			0.5 + world.top + ((center.y - adjustTop) * world.size),
			radius * world.size,
			0, 2 * Math.PI);
		context.fill();
	}

  return {
    clear: clear,
    saveContext: saveContext,
    restoreContext: restoreContext,
    rotateCanvas: rotateCanvas,
    drawImage: drawImage,
    drawImageSpriteSheet: drawImageSpriteSheet,
    drawCircle: drawCircle,
    // drawViewportImage: drawViewportImage,
    world: world,
    viewport: viewport
  };
})();
