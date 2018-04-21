// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

const present = require('present');
const socketIo = require('socket.io');
const socketIoJwt = require('socketio-jwt');

const Player = require('./player');
const Bullet = require('./bullet');
const Barriers = require('./barriers');
const Powerups = require('./powerups');
const Shield = require('./shield');
const NetworkIds = require('../shared/network-ids');
const Queue = require('../shared/queue.js');

const SIMULATION_UPDATE_RATE_MS = 100;
const STATE_UPDATE_RATE_MS = 20;
let lastUpdate = 0;
let quit = false;
let countdownStarted = false;
let gameStarted = false;
let timeBeforeStart = 0;
let inLobbyClients = {};
let inGameClients = {};
let newBullets = [];
let activeBullets = [];
let hits = [];
let nextBulletId = 1;
let inputQueue = Queue.create();
let barriers = Barriers.create();
let powerups = Powerups.create({
  weaponUpgrades: 25,
  bullets: 200,
  health: 25,
  armour: 25,
});
let shield = Shield.create();
let io;

//------------------------------------------------------------------
//
// Used to create a bullet in response to user input.
//
//------------------------------------------------------------------
function createBullet(clientId, playerModel) {
  if (playerModel.numBullets > 0) {
    const bullet = Bullet.create({
      id: nextBulletId++,
      clientId: clientId,
      position: {
        x: playerModel.position.x,
        y: playerModel.position.y,
      },
      direction: playerModel.direction,
      speed: playerModel.speed * playerModel.weaponStrength,
      weaponStrength: playerModel.weaponStrength,
    });
    playerModel.numBullets = playerModel.numBullets - 1;
    newBullets.push(bullet);
  }
}

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput(elapsedTime) {
  //
  // Double buffering on the queue so we don't asynchronously receive inputs
  // while processing.
  const processMe = inputQueue;
  inputQueue = Queue.create();

  while (!processMe.empty) {
    const input = processMe.dequeue();

    if (inGameClients.hasOwnProperty(input.clientId)) {
      const client = inGameClients[input.clientId];
      client.lastMessageId = input.message.id;

      switch (input.message.type) {
        case NetworkIds.INPUT_MOVE_UP:
          client.player.moveUp(
            input.message.elapsedTime,
            barriers,
            inGameClients,
            powerups
          );
          break;
        case NetworkIds.INPUT_MOVE_LEFT:
          client.player.moveLeft(
            input.message.elapsedTime,
            barriers,
            inGameClients,
            powerups
          );
          break;
        case NetworkIds.INPUT_MOVE_RIGHT:
          client.player.moveRight(
            input.message.elapsedTime,
            barriers,
            inGameClients,
            powerups
          );
          break;
        case NetworkIds.INPUT_MOVE_DOWN:
          client.player.moveDown(
            input.message.elapsedTime,
            barriers,
            inGameClients,
            powerups
          );
          break;
        case NetworkIds.INPUT_ROTATE_LEFT:
          client.player.rotateLeft();
          break;
        case NetworkIds.INPUT_ROTATE_RIGHT:
          client.player.rotateRight();
          break;
        case NetworkIds.INPUT_FIRE:
          createBullet(input.clientId, client.player);
          break;
        case NetworkIds.SPRINT:
          client.player.sprint();
          break;
        case NetworkIds.USE_HEALTH:
          client.player.useHealth();
          break;
      }
    }
  }
}

function distance(obj1, obj2) {
  return Math.sqrt(
    Math.pow(obj1.position.x - obj2.position.x, 2) +
      Math.pow(obj1.position.y - obj2.position.y, 2)
  );
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between two objects.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function collided(obj1, obj2) {
  const dist = distance(obj1, obj2);
  const radii = obj1.radius + obj2.radius;

  return dist <= radii;
}

function randomPosition() {
  return {
    x: Math.random() * 15,
    y: Math.random() * 15,
  };
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
  if (timeBeforeStart > 0) {
    timeBeforeStart = Math.max(timeBeforeStart - elapsedTime, 0);
  } else if (countdownStarted && !gameStarted) {
    gameStarted = true;
    countdownStarted = false;

    for (let id in inLobbyClients) {
      let position = randomPosition();
      inLobbyClients[id].socket.emit(NetworkIds.AUTO_JOIN_GAME);
      joinGame(inLobbyClients[id].socket, position);
    }
  }

  // Update clients
  for (let clientId in inGameClients) {
    const player = inGameClients[clientId].player;

    player.updateSprint(elapsedTime);

    if (player.health > 0 && player.update) {
      player.update(currentTime);
    }

    if (player.health > 0 && shield.collides(player.position, gameStarted)) {
      player.dieByShield();

      io.emit(NetworkIds.GAME_MESSAGE_NEW, {
        firstUser: player.username,
        event: ' was vaporized by the shield',
      });
    }
  }

  for (let bullet = 0; bullet < newBullets.length; bullet++) {
    newBullets[bullet].update(elapsedTime);
  }

  let keepBullets = [];
  for (let bullet = 0; bullet < activeBullets.length; bullet++) {
    //
    // If update returns false, that means the bullet lifetime ended and
    // we don't keep it around any longer.
    if (activeBullets[bullet].update(elapsedTime)) {
      keepBullets.push(activeBullets[bullet]);
    }
  }
  activeBullets = keepBullets;

  //
  // Check to see if any bullets collide with any players (no friendly fire)
  keepBullets = [];
  for (let bullet = 0; bullet < activeBullets.length; bullet++) {
    let hit = false;
    for (let clientId in inGameClients) {
      //
      // Don't allow a bullet to hit the player it was fired from.
      if (clientId !== activeBullets[bullet].clientId) {
        const player = inGameClients[clientId].player;

        if (collided(activeBullets[bullet], player)) {
          hit = true;
          hits.push({
            clientId: clientId,
            bulletId: activeBullets[bullet].id,
            position: player.position,
          });

          if (player.health > 0) {
            const shootingClient =
              inGameClients[activeBullets[bullet].clientId];
            player.hitByBullet(activeBullets[bullet]);

            if (player.health <= 0) {
              shootingClient.player.increaseScore(100);
              io.emit(NetworkIds.GAME_MESSAGE_NEW, {
                firstUser: shootingClient.player.username,
                event: ' totally obliterated ',
                secondUser: player.username,
              });
            } else {
              shootingClient.player.increaseScore(50);
            }

            shootingClient.socket.emit(
              NetworkIds.UPDATE_SCORE,
              shootingClient.player.score
            );
          }
        }
      }
    }
    // Check if bullet hits barrier
    if (barriers.circularObjectCollides(activeBullets[bullet])) {
      hit = true;
      hits.push({
        clientId: null,
        bulletId: activeBullets[bullet].id,
        position: activeBullets[bullet].position,
      });
    }

    if (!hit) {
      keepBullets.push(activeBullets[bullet]);
    }
  }
  activeBullets = keepBullets;

  shield.update(elapsedTime, gameStarted);
}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
  //
  // For demonstration purposes, network updates run at a slower rate than
  // the game simulation.
  lastUpdate += elapsedTime;
  if (!gameStarted || lastUpdate < STATE_UPDATE_RATE_MS) {
    return;
  }

  //
  // Build the bullet messages one time, then reuse inside the loop
  let bulletMessages = [];
  for (let item = 0; item < newBullets.length; item++) {
    const bullet = newBullets[item];
    bulletMessages.push(bullet.toJSON());
  }

  //
  // Move all the new bullets over to the active bullets array
  for (let bullet = 0; bullet < newBullets.length; bullet++) {
    activeBullets.push(newBullets[bullet]);
  }
  newBullets.length = 0;

  let activeCount = 0;
  const alivePlayers = [];
  for (let clientId in inGameClients) {
    const client = inGameClients[clientId];

    if (client.player.reportUpdate) {
      client.socket.emit(
        NetworkIds.UPDATE_SELF,
        client.player.selfUpdateJSON()
      );

      for (let id in inGameClients) {
        if (
          id !== clientId &&
          distance(client.player, inGameClients[id].player) < 1
        ) {
          inGameClients[id].socket.emit(
            NetworkIds.UPDATE_OTHER,
            client.player.otherUpdateJSON(lastUpdate)
          );
        }
      }

      // Since we moved, report all powerups in region
      const powerupsInRegion = powerups.getSurroundingPowerups(
        client.player.position,
        1
      );
      client.socket.emit(NetworkIds.UPDATE_POWERUP, powerupsInRegion);
    }

    //
    // Report any new bullets to the active clients
    for (let bullet = 0; bullet < bulletMessages.length; bullet++) {
      if (distance(client.player, bulletMessages[bullet]) < 1) {
        client.socket.emit(NetworkIds.BULLET_NEW, bulletMessages[bullet]);
      }
    }

    //
    // Report any bullet hits to this client
    for (let hit = 0; hit < hits.length; hit++) {
      if (distance(client.player, hits[hit]) < 1) {
        client.socket.emit(NetworkIds.BULLET_HIT, hits[hit]);
      }
    }

    // update client on shield status
    client.socket.emit(NetworkIds.SHIELD_INFO, {
      radius: shield.radius,
      x: shield.originX,
      y: shield.originY,
    });

    if (inGameClients[clientId].player.health > 0) {
      activeCount += 1;
      alivePlayers.push(inGameClients[clientId]);
    }

    inGameClients[clientId].player.reportUpdate = false;
  }

  if (alivePlayers.length === 1) {
    gameStarted = false;
    alivePlayers[0].player.increaseScore(300);

    const finalScores = JSON.stringify(mapFinalScores());

    alivePlayers[0].socket.emit(NetworkIds.WINNER);
    io.emit(NetworkIds.END_OF_GAME, finalScores);
  }

  //
  // Don't need these anymore, clean up
  hits.length = 0;
  //
  // Reset the elapsedt time since last update so we can know
  // when to put out the next update.
  lastUpdate = 0;
}

//------------------------------------------------------------------
//
// Package final scores to send to clients
//
//------------------------------------------------------------------
function mapFinalScores() {
  let scores = {};
  for (let clientId in inGameClients) {
    scores[inGameClients[clientId].player.username] =
      inGameClients[clientId].player.score;
  }
  return scores;
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
  if (timeBeforeStart <= 0) {
    processInput(elapsedTime);
  }
  update(elapsedTime, currentTime, io);
  updateClients(elapsedTime);

  if (!quit) {
    setTimeout(() => {
      let now = present();
      gameLoop(now, now - currentTime);
    }, SIMULATION_UPDATE_RATE_MS);
  }
}

function initializeSocketIo(httpServer) {
  const io = socketIo(httpServer);

  io.use(
    socketIoJwt.authorize({
      secret: process.env.SECRET_KEY,
      handshake: true,
    })
  );

  return io;
}

function joinLobby(socket) {
  //
  // Create an entry in our list of connected clients
  const { username } = socket.decoded_token;
  const player = Player.create(username, socket.id);
  const otherPlayers = [];

  for (let clientId in inLobbyClients) {
    const client = inLobbyClients[clientId];

    if (client.hasOwnProperty('player')) {
      otherPlayers.push(client.player.toJSON());
    }
  }

  socket.broadcast.emit(NetworkIds.JOIN_LOBBY_OTHER, player.toJSON());
  socket.emit(NetworkIds.JOIN_LOBBY, {
    player: player.toJSON(),
    otherPlayers,
  });

  inLobbyClients[socket.id] = {
    socket,
    player,
  };
}

function joinGame(socket, position) {
  const client = inLobbyClients[socket.id];
  const otherPlayers = [];

  if (!client) {
    return;
  }

  for (let clientId in inGameClients) {
    const otherClient = inGameClients[clientId];

    if (otherClient.hasOwnProperty('player')) {
      otherPlayers.push(otherClient.player.toJSON());
    }
  }

  client.socket.broadcast.emit(NetworkIds.DISCONNECT_LOBBY_OTHER, {
    clientId: socket.id,
  });

  client.player.setStartingPosition(position);
  client.socket.emit(NetworkIds.SET_STARTING_POSITION, {
    player: client.player.toJSON(),
    otherPlayers,
    timeBeforeStart,
  });
  client.socket.broadcast.emit(
    NetworkIds.OPPONENT_STARTING_POSITION,
    client.player.toJSON()
  );

  client.socket.emit(NetworkIds.UPDATE_SELF, client.player.selfUpdateJSON());
  client.socket.broadcast.emit(
    NetworkIds.UPDATE_OTHER,
    client.player.otherUpdateJSON(lastUpdate)
  );

  inGameClients[socket.id] = inLobbyClients[socket.id];
  delete inLobbyClients[socket.id];
}

function removeLobbyClient(socket) {
  delete inLobbyClients[socket.id];

  socket.broadcast.emit(NetworkIds.DISCONNECT_LOBBY_OTHER, {
    clientId: socket.id,
  });
}

function removeGameClient(socket) {
  delete inGameClients[socket.id];

  socket.broadcast.emit(NetworkIds.DISCONNECT_OTHER, {
    clientId: socket.id,
  });
}

function startGame() {
  if (!gameStarted) {
    newBullets = [];
    activeBullets = [];
    hits = [];
    powerups = Powerups.create({
      weaponUpgrades: 25,
      bullets: 200,
      health: 25,
      armour: 50,
    });
    shield = Shield.create();
    countdownStarted = true;
    timeBeforeStart = 10000; // 10 sec
    io.emit(NetworkIds.INITIATE_GAME_START);
  }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeGameNetwork() {
  io.on('connection', function(socket) {
    console.log('Connection established: ', socket.id);

    socket.on(NetworkIds.JOIN_LOBBY, () => joinLobby(socket));
    socket.on(NetworkIds.LOBBY_MESSAGE_CREATE, data =>
      io.emit(NetworkIds.LOBBY_MESSAGE_NEW, data)
    );
    socket.on(NetworkIds.DISCONNECT_LOBBY, () => removeLobbyClient(socket));

    socket.on(NetworkIds.INITIATE_GAME_START, startGame);
    socket.on(NetworkIds.DISCONNECT_GAME, () => removeGameClient(socket));
    socket.on(NetworkIds.SET_STARTING_POSITION, position =>
      joinGame(socket, position)
    );
    socket.on(NetworkIds.INPUT, data =>
      inputQueue.enqueue({ clientId: socket.id, message: data })
    );
    socket.on(NetworkIds.CHAT_MESSAGE_CREATE, data =>
      io.emit(NetworkIds.CHAT_MESSAGE_NEW, data)
    );

    socket.on('disconnect', function() {
      if (inLobbyClients.hasOwnProperty(socket.id)) {
        removeLobbyClient(socket);
      }
      if (inGameClients.hasOwnProperty(socket.id)) {
        removeGameClient(socket);
      }
    });
  });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
  io = initializeSocketIo(httpServer);
  initializeGameNetwork();
  gameLoop(present(), 0);
}

module.exports.initialize = initialize;
