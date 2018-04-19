//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens['gameplay'] = (function(
  menu,
  graphics,
  renderer,
  input,
  components,
  assets,
  network,
  chat,
  barrierJson
) {
  'use strict';

  let lastTimeStamp = performance.now(),
    myKeyboard = input.Keyboard(),
    barriers = components.Barriers(barrierJson),
    playerSelf = components.Player(barriers),
    playerOthers = {},
    bullets = {},
    explosions = {},
    playerSelfTexture = assets['player-self'],
    playerOtherTexture = assets['player-other'],
    skeletonTexture = assets['skeleton'],
    background = null,
    nextExplosionId = 0,
    shield = {};

  //------------------------------------------------------------------
  //
  // Handler for when the server ack's the socket connection.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerSelf({ player, otherPlayers }) {
    playerSelf.initialize(player);

    for (let i = 0; i < otherPlayers.length; i++) {
      connectPlayerOther(otherPlayers[i]);
    }
  }

  //------------------------------------------------------------------
  //
  // Handler for when a new player connects to the game.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerOther(data) {
    let player = components.PlayerRemote();
    player.initialize(data);
    playerOthers[data.clientId] = player;
  }

  //------------------------------------------------------------------
  //
  // Handler for when another player disconnects from the game.
  //
  //------------------------------------------------------------------
  function disconnectPlayerOther(player) {
    delete playerOthers[player.clientId];
  }

  function updateMessageHistory(lastMessageId) {
    //
    // Remove messages from the queue up through the last one identified
    // by the server as having been processed.
    while (!network.history.empty) {
      if (network.history.front.id === lastMessageId) {
        network.history.dequeue();
        break;
      }
      network.history.dequeue();
    }

    //
    // Update the client simulation since this last server update, by
    // replaying the remaining inputs.
    let memory = Queue.create();
    while (!network.history.empty) {
      let message = network.history.dequeue();

      switch (message.type) {
        case 'move-up':
          playerSelf.moveUp(input.message.elapsedTime, barriers);
          break;
        case 'move-left':
          playerSelf.moveLeft(input.message.elapsedTime, barriers);
          break;
        case 'move-right':
          playerSelf.moveRight(input.message.elapsedTime, barriers);
          break;
        case 'move-down':
          playerSelf.moveDown(input.message.elapsedTime, barriers);
          break;
        case 'rotate-left':
          playerSelf.rotateLeft();
          break;
        case 'rotate-right':
          playerSelf.rotateRight();
      }

      memory.enqueue(message);
    }
    network.history = memory;
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about the self player.
  //
  //------------------------------------------------------------------
  function updatePlayerSelf(data) {
    playerSelf.update(data);
    updateMessageHistory(data.lastMessageId);
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about other players.
  //
  //------------------------------------------------------------------
  function updatePlayerOther(data) {
    if (playerOthers.hasOwnProperty(data.clientId)) {
      playerOthers[data.clientId].updateGoal(data);
    }
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice of a new bullet in the environment.
  //
  //------------------------------------------------------------------
  function bulletNew(data) {
    bullets[data.id] = components.Bullet(data);
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice that a bullet has hit a player.
  //
  //------------------------------------------------------------------
  function bulletHit(data) {
    explosions[nextExplosionId] = components.Explosion(data, nextExplosionId++);

    //
    // When we receive a hit notification, go ahead and remove the
    // associated bullet from the client model.
    delete bullets[data.bulletId];
  }

  function updateShield(data) {
    shield = data;
  }

  //------------------------------------------------------------------
  //
  // Process the registered input handlers here.
  //
  //------------------------------------------------------------------
  function processInput(elapsedTime) {
    //
    // Start with the keyboard updates so those messages can get in transit
    // while the local updating of received network messages are processed.
    myKeyboard.update(elapsedTime);

    //
    // Double buffering on the queue so we don't asynchronously receive messages
    // while processing.
    let processMe = network.getQueue();
    network.resetQueue();

    while (!processMe.empty) {
      let message = processMe.dequeue();

      switch (message.type) {
        case NetworkIds.CONNECT_ACK:
          connectPlayerSelf(message.data);
          break;
        case NetworkIds.CONNECT_OTHER:
          connectPlayerOther(message.data);
          break;
        case NetworkIds.DISCONNECT_OTHER:
          disconnectPlayerOther(message.data);
          break;
        case NetworkIds.UPDATE_SELF:
          updatePlayerSelf(message.data);
          break;
        case NetworkIds.UPDATE_OTHER:
          updatePlayerOther(message.data);
          break;
        case NetworkIds.BULLET_NEW:
          bulletNew(message.data);
          break;
        case NetworkIds.BULLET_HIT:
          bulletHit(message.data);
          break;
        case NetworkIds.SHIELD_INFO:
          updateShield(message.data);
          break;
      }
    }
  }

  //------------------------------------------------------------------
  //
  // Update the game simulation
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
    for (let id in playerOthers) {
      playerOthers[id].update(elapsedTime);
    }

    let removeBullets = [];
    for (let bullet in bullets) {
      if (!bullets[bullet].update(elapsedTime)) {
        removeBullets.push(bullets[bullet]);
      }
    }

    for (let bullet = 0; bullet < removeBullets.length; bullet++) {
      delete bullets[removeBullets[bullet].id];
    }

    for (let id in explosions) {
      if (!explosions[id].update(elapsedTime)) {
        delete explosions[id];
      }
    }

    graphics.viewport.update(playerSelf);
  }

  //------------------------------------------------------------------
  //
  // Render the current state of the game simulation
  //
  //------------------------------------------------------------------
  function render() {
    graphics.clear();

    renderer.TiledImage.render(background, graphics.viewport);
    renderer.MiniMap.render(playerSelf, shield);

    graphics.drawShield(shield, playerSelf);

    renderer.Player.render(playerSelf, playerSelfTexture, skeletonTexture);

    if (playerSelf.health > 0) {
      graphics.createFieldOfViewClippingRegion(playerSelf.fieldOfView);
    }

    for (let id in playerOthers) {
      renderer.PlayerRemote.render(
        playerOthers[id],
        playerOtherTexture,
        skeletonTexture
      );
    }
    graphics.removeFieldOfViewClippingRegion();

    for (let bullet in bullets) {
      renderer.Bullet.render(bullets[bullet]);
    }

    for (let id in explosions) {
      renderer.AnimatedSprite.render(explosions[id]);
    }
  }

  //------------------------------------------------------------------
  //
  // Client-side game loop
  //
  //------------------------------------------------------------------
  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
  }

  MyGame.unregisterEvent = function(key, id) {
    myKeyboard.unregisterHandler(key, id);
  };

  MyGame.registerEvent = function(networkId, keyboardInput, action) {
    let repeat = true;
    if (
      action == 'fire' ||
      action == 'rotate-left' ||
      action == 'rotate-right'
    ) {
      repeat = false;
    }

    let id = myKeyboard.registerHandler(
      elapsedTime => {
        if (playerSelf.health <= 0) {
          return;
        }

        let message = {
          id: network.messageId++,
          elapsedTime: elapsedTime,
          type: networkId,
        };
        network.emit(NetworkIds.INPUT, message);
        network.history.enqueue(message);

        // if (action.indexOf('move') >= 0) {
        //   playerSelf.move(elapsedTime);
        if (action == 'move-up') {
          playerSelf.moveUp(elapsedTime);
        } else if (action == 'move-left') {
          playerSelf.moveLeft(elapsedTime);
        } else if (action == 'move-right') {
          playerSelf.moveRight(elapsedTime);
        } else if (action == 'move-down') {
          playerSelf.moveDown(elapsedTime);
        } else if (action == 'rotate-right') {
          playerSelf.rotateRight();
        } else if (action == 'rotate-left') {
          playerSelf.rotateLeft();
        } else if (action == 'fire') {
          MyGame.assets['kaboom'].currentTime = 0;
          MyGame.assets['kaboom'].play();
        }
      },
      keyboardInput,
      repeat
    );
    return id;
  };

  //------------------------------------------------------------------
  //
  // Public function used to get the game initialized and then up
  // and running.
  //
  //------------------------------------------------------------------
  function initialize() {
    console.log('game initializing...');

    document
      .getElementById('game-quit-btn')
      .addEventListener('click', function() {
        menu.showScreen('main-menu');
        network.disconnect();
      });

    //
    // Get the intial viewport settings prepared.
    graphics.viewport.set(
      0,
      0,
      0.4,
      graphics.world.width,
      graphics.world.height
    ); // The buffer can't really be any larger than world.buffer, guess I could protect against that.

    //
    // Define the TiledImage model we'll be using for our background.
    background = components.TiledImage({
      pixel: {
        width: assets.background.width,
        height: assets.background.height,
      },
      size: { width: graphics.world.width, height: graphics.world.height },
      tileSize: assets.background.tileSize,
      assetKey: 'background',
    });
  }

  function run() {
    chat.initializeGame();

    network.emit(NetworkIds.START_GAME, {type: 'start-game'});
    lastTimeStamp = performance.now();
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
  };
})(
  MyGame.menu,
  MyGame.graphics,
  MyGame.renderer,
  MyGame.input,
  MyGame.components,
  MyGame.assets,
  MyGame.network,
  MyGame.chat,
  MyGame.barrierJson
);
