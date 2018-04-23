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
    shield = components.Shield(),
    playerOthers = {},
    bullets = {},
    explosions = {},
    currentPowerups = components.Powerups(),
    background = null,
    playerSelfTexture = assets['player-self'],
    playerOtherTexture = assets['player-other'],
    skeletonTexture = assets['skeleton'],
    powerupTextures = {
      weapon: assets['weapon-powerup'],
      bullet: assets['bullet-powerup'],
      health: assets['health-powerup'],
      armour: assets['armour-powerup'],
    },
    nextExplosionId = 0,
    activePlayerCount = 0,
    score = 0,
    timeBeforeStart = 0,
    isCountingDown = false;

  function showCountdown(time) {
    isCountingDown = true;
    timeBeforeStart = time;
  }

  //------------------------------------------------------------------
  //
  // Handler for when the server ack's the socket connection.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerSelf({ player, otherPlayers, timeBeforeStart }) {
    playerSelf.initialize(player);
    activePlayerCount++;

    for (let i = 0; i < otherPlayers.length; i++) {
      connectPlayerOther(otherPlayers[i]);
    }

    showCountdown(timeBeforeStart);
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
    activePlayerCount++;
  }

  //------------------------------------------------------------------
  //
  // Handler for when another player disconnects from the game.
  //
  //------------------------------------------------------------------
  function disconnectPlayerOther(player) {
    activePlayerCount--;
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
          break;
        case 'sprint':
          playerSelf.sprint();
          break;
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

    if (playerSelf.health <= 0) {
      activePlayerCount--;
    }
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about other players.
  //
  //------------------------------------------------------------------
  function updatePlayerOther(data) {
    if (playerOthers.hasOwnProperty(data.clientId)) {
      playerOthers[data.clientId].updateGoal(data);

      if (data.health <= 0) {
        activePlayerCount--;
      }
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
        case NetworkIds.SET_STARTING_POSITION:
          connectPlayerSelf(message.data);
          break;
        case NetworkIds.OPPONENT_STARTING_POSITION:
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
        case NetworkIds.REMOVE_POWERUPS:
          currentPowerups.removePowerups(message.data);
          break;
        case NetworkIds.UPDATE_SCORE:
          score = message.data;
          break;
        case NetworkIds.SHIELD_INIT:
          shield.initialize(message.data);
          break;
        case NetworkIds.POWERUP_INIT:
          currentPowerups.initialize(message.data);
          break;
        case NetworkIds.WINNER:
          window.alert('You are the champion!');
          break;
        case NetworkIds.END_OF_GAME:
          let finalScores = JSON.parse(message.data);
          let formattedAlert = formatEndingAlert(finalScores);
          network.emit(NetworkIds.DISCONNECT_GAME);
          window.alert(`Final Scores:\n${formattedAlert}`);
          menu.showScreen('main-menu');
          break;
      }
    }
  }

  //------------------------------------------------------------------
  //
  // Format final scores to display
  //
  //------------------------------------------------------------------
  function formatEndingAlert(scores) {
    let usernames = Object.keys(scores);
    let users = usernames.map(username => ({
      username,
      score: scores[username],
    }));

    users.sort((a, b) => b.score - a.score);

    if (users.length > 20) {
      users.splice(20);
    }
    return users.reduce((formatted, user, i) => {
      return `${formatted}${i + 1}. ${user.username}: ${user.score}\n`;
    }, '');
  }

  //------------------------------------------------------------------
  //
  // Update the game simulation
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
    if (timeBeforeStart > 0) {
      timeBeforeStart -= elapsedTime;
    }

    playerSelf.updateSprint(elapsedTime);

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
    renderer.ParticleSystem.update(elapsedTime, shield);

    shield.update(elapsedTime);

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
    renderer.MiniMap.render(playerSelf, explosions, shield);

    // draw shield
    graphics.drawInvertedCircle("rgba(0, 0, 0, 0.5)", shield.center, shield.radius, true);

    renderer.ParticleSystem.render(playerSelf);

    renderer.Player.render(playerSelf, playerSelfTexture, skeletonTexture);

    if (playerSelf.health > 0) {
      graphics.createFieldOfViewClippingRegion(playerSelf.fieldOfView);
    }

    const now = performance.now();

    for (let id in playerOthers) {
      if (playerSelf.health <= 0 || now - playerOthers[id].lastUpdate < 3000) {
        renderer.PlayerRemote.render(
          playerOthers[id],
          playerOtherTexture,
          skeletonTexture
        );
      }
    }

    const surroundingPowerups = currentPowerups.getWithinRegion(playerSelf.position, 1);
    renderer.Powerups.render(surroundingPowerups, powerupTextures);

    graphics.removeFieldOfViewClippingRegion();

    for (let bullet in bullets) {
      renderer.Bullet.render(bullets[bullet]);
    }

    for (let id in explosions) {
      renderer.AnimatedSprite.render(explosions[id]);
    }

    const playerCount = document.getElementById('player-count');

    if (playerCount.innerHTML !== activePlayerCount) {
      playerCount.innerHTML = activePlayerCount;
    }

    const playerScore = document.getElementById('player-score');

    if (playerScore.innerHTML !== score) {
      playerScore.innerHTML = score;
    }

    if (timeBeforeStart > 0) {
      const countdown = document.getElementById('countdown-timer');
      countdown.innerHTML = Math.floor(timeBeforeStart / 1000);
    } else if (isCountingDown) {
      const countdown = document.getElementById('countdown-timer');
      countdown.innerHTML = '';
      isCountingDown = false;
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

    if (timeBeforeStart <= 0) {
      processInput(elapsedTime);
    }
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
  }

  MyGame.unregisterEvent = function(key, id) {
    myKeyboard.unregisterHandler(key, id);
  };

  MyGame.registerEvent = function(networkId, keyboardInput, action) {
    let repeat = true;
    if (action == 'use-health') {
      repeat = false;
    }

    let rate = 0;
    if (
      action == 'fire'
      // action == 'fire' ||
      // action == 'rotate-left' ||
      // action == 'rotate-right'
    ) {
      rate = 250;
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
          playerSelf.rotateRight(elapsedTime);
        } else if (action == 'rotate-left') {
          playerSelf.rotateLeft(elapsedTime);
        } else if (action == 'fire') {
          if (playerSelf.numBullets > 0) {
            MyGame.assets['kaboom'].currentTime = 0;
            MyGame.assets['kaboom'].play();
          } else {
            MyGame.assets['gun-click'].currentTime = 0;
            MyGame.assets['gun-click'].play();
          }
        } else if (action == 'use-health') {
          if (playerSelf.healthPacks > 0) {
            MyGame.assets['gulp'].currentTime = 0;
            MyGame.assets['gulp'].play();
          }
        } else if (action == 'sprint') {
          playerSelf.sprint(elapsedTime);
        }
      },
      keyboardInput,
      repeat,
      rate
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
        network.emit(NetworkIds.DISCONNECT_GAME);
        network.unlistenGameEvents();
        menu.showScreen('main-menu');
      });

    //
    // Get the intial viewport settings prepared.
    graphics.viewport.set(
      0,
      0,
      0.5,
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
    network.initializeGameEvents();

    lastTimeStamp = performance.now();
    playerSelf = components.Player(barriers);
    shield = components.Shield();
    playerOthers = {};
    bullets = {};
    explosions = {};
    currentPowerups = components.Powerups();
    nextExplosionId = 0;
    activePlayerCount = 0;
    timeBeforeStart = 0;
    isCountingDown = false;

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
