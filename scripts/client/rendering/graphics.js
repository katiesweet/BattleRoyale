// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
  'use strict';

  let canvas = document.getElementById('canvas-main');
  let context = canvas.getContext('2d');

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let world = {
    // The size of the world must match the world-size of the background image
    get left() {
      return 0;
    },
    get top() {
      return 0;
    },
    // get width() { return 4.375; },
    get width() {
      return 15;
    },
    // get height() { return 2.5; },
    get height() {
      return 15;
    },
    get bufferSize() {
      return 0.25;
    },
    get size() {
      return canvas.height;
    },
  };
  let worldBuffer = {
    get left() {
      return world.left + world.bufferSize;
    },
    get top() {
      return world.top + world.bufferSize;
    },
    get right() {
      return world.width - world.bufferSize;
    },
    get bottom() {
      return world.height - world.bufferSize;
    },
  };
  let viewport = MyGame.components.Viewport({
    left: 0,
    top: 0,
    buffer: 0.15, // This can't really be any larger than world.buffer, guess I could protect against that.
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

  function resizeCanvas() {
    canvas.width = canvas.height = window.innerHeight - 25;
  }

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
    context.translate(
      (center.x - viewport.left) * world.size + world.left,
      (center.y - viewport.top) * world.size + world.top
    );
    context.rotate(rotation);
    context.translate(
      -((center.x - viewport.left) * world.size + world.left),
      -((center.y - viewport.top) * world.size + world.top)
    );
  }

  //------------------------------------------------------------------
  //
  // Draw an image into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImage() {
    var image = arguments[0],
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      dWidth,
      dHeight,
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
      sx,
      sy,
      sWidth,
      sHeight,
      Math.floor(dx * world.size + world.left),
      Math.floor(dy * world.size + world.top),
      Math.ceil(dWidth * world.size),
      Math.ceil(dHeight * world.size)
    );
  }

  //------------------------------------------------------------------
  //
  // Draw an image out of a spritesheet into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
    drawImage(
      spriteSheet,
      sprite * spriteSize.width,
      0, // which sprite to render
      spriteSize.width,
      spriteSize.height, // size in the spritesheet
      center.x - size.width / 2,
      center.y - size.height / 2,
      size.width,
      size.height,
      true
    );
  }

  //------------------------------------------------------------------
  //
  // Draw a circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawCircle(style, center, radius, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    //
    // 0.5, 0.5 is to ensure an actual 1 pixel line is drawn.
    context.fillStyle = style;
    context.beginPath();
    context.arc(
      0.5 + world.left + (center.x - adjustLeft) * world.size,
      0.5 + world.top + (center.y - adjustTop) * world.size,
      radius * world.size,
      0,
      2 * Math.PI
    );
    context.fill();
  }

  //------------------------------------------------------------------
  //
  // Draw an inverted circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawInvertedCircle(style, center, radius, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    context.fillStyle = style;
    context.beginPath();
    context.arc(
      0.5 + world.left + (center.x - adjustLeft) * world.size,
      0.5 + world.top + (center.y - adjustTop) * world.size,
      radius * world.size,
      0,
      2 * Math.PI,
      false
    );
    context.rect(15 * world.size, 0, - 15 * world.size, 15 * world.size);
    context.fill();
  }

  //------------------------------------------------------------------
  //
  // Draws a rectangle relative to the 'unit world'.
  //
  //------------------------------------------------------------------
  function drawRectangle(style, left, top, width, height, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    // 0.5, 0.5 is to ensure an actual 1 pixel line is drawn.
    context.strokeStyle = style;
    context.strokeRect(
      0.5 + world.left + (left - adjustLeft) * world.size,
      0.5 + world.top + (top - adjustTop) * world.size,
      width * world.size,
      height * world.size
    );
  }

  //------------------------------------------------------------------
  //
  // Draws a filled rectangle relative to the 'unit world'.
  //
  //------------------------------------------------------------------
  function drawFilledRectangle(style, left, top, width, height, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    //
    // 0.5, 0.5 is to ensure an actual 1 pixel line is drawn.
    context.fillStyle = style;
    context.fillRect(
      0.5 + world.left + (left - adjustLeft) * world.size,
      0.5 + world.top + (top - adjustTop) * world.size,
      width * world.size,
      height * world.size
    );
  }

  function createFieldOfViewPath(fieldOfView, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    context.moveTo(
      0.5 + world.left + (fieldOfView.p1.x - adjustLeft) * world.size,
      0.5 + world.top + (fieldOfView.p1.y - adjustTop) * world.size
    );
    context.lineTo(
      0.5 + world.left + (fieldOfView.p2.x - adjustLeft) * world.size,
      0.5 + world.top + (fieldOfView.p2.y - adjustTop) * world.size
    );
    context.arc(
      0.5 + world.left + (fieldOfView.p1.x - adjustLeft) * world.size,
      0.5 + world.top + (fieldOfView.p1.y - adjustTop) * world.size,
      fieldOfView.radius * world.size,
      fieldOfView.startAngle,
      fieldOfView.endAngle,
      false
    );
    context.closePath();
  }

  function drawFieldOfView(fieldOfView, useViewport) {
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);

    createFieldOfViewPath(fieldOfView, useViewport);

    context.fillStyle = 'rgba(0,0,0,0.2)';
    context.fill('evenodd');
  }

  function createFieldOfViewClippingRegion(fieldOfView) {
    context.save();
    context.beginPath();
    createFieldOfViewPath(fieldOfView, true);
    context.clip();
  }

  function removeFieldOfViewClippingRegion() {
    context.restore();
  }


	//------------------------------------------------------------------
  //
  // Draws text centered relative to the 'unit world'.
  //
  //------------------------------------------------------------------
  function drawText(color, font, text, left, top, maxWidth, useViewport) {
    var adjustLeft = useViewport === true ? viewport.left : 0,
      adjustTop = useViewport === true ? viewport.top : 0;

    context.fillStyle = color;
    context.font = font;
    context.textAlign = 'center';
    context.fillText(
      text,
      0.5 + world.left + (left - adjustLeft) * world.size,
      0.5 + world.top + (top - adjustTop) * world.size,
      maxWidth * world.size
    );
  }

  return {
    clear: clear,
    saveContext: saveContext,
    restoreContext: restoreContext,
    rotateCanvas: rotateCanvas,
    drawImage: drawImage,
    drawImageSpriteSheet: drawImageSpriteSheet,
    drawCircle: drawCircle,
    drawInvertedCircle: drawInvertedCircle,
    world: world,
    viewport: viewport,
    drawRectangle: drawRectangle,
    drawFilledRectangle: drawFilledRectangle,
    drawText: drawText,
    drawFieldOfView: drawFieldOfView,
    createFieldOfViewClippingRegion: createFieldOfViewClippingRegion,
    removeFieldOfViewClippingRegion: removeFieldOfViewClippingRegion,
  };
})();
