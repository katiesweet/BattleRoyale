// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

const present = require('present');
const Player = require('./player');
const Bullet = require('./bullet');
const Barriers = require('./barriers');
const NetworkIds = require('../shared/network-ids');
const Queue = require('../shared/queue.js');
const socketIo = require('socket.io');
const socketIoJwt = require('socketio-jwt');

const SIMULATION_UPDATE_RATE_MS = 50;
const STATE_UPDATE_RATE_MS = 100;
let lastUpdate = 0;
let quit = false;
let activeClients = {};
let newBullets = [];
let activeBullets = [];
let hits = [];
let inputQueue = Queue.create();
let nextBulletId = 1;
let barriers = Barriers.create();

//------------------------------------------------------------------
//
// Used to create a bullet in response to user input.
//
//------------------------------------------------------------------
function createBullet(clientId, playerModel) {
  let bullet = Bullet.create({
    id: nextBulletId++,
    clientId: clientId,
    position: {
      x: playerModel.position.x,
      y: playerModel.position.y,
    },
    direction: playerModel.direction,
    speed: playerModel.speed,
  });

  newBullets.push(bullet);
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
  let processMe = inputQueue;
  inputQueue = Queue.create();

  while (!processMe.empty) {
    let input = processMe.dequeue();
    let client = activeClients[input.clientId];
    client.lastMessageId = input.message.id;
    switch (input.message.type) {
      case NetworkIds.INPUT_MOVE_UP:
        client.player.moveUp(input.message.elapsedTime, barriers);
        break;
      case NetworkIds.INPUT_MOVE_LEFT:
        client.player.moveLeft(input.message.elapsedTime, barriers);
        break;
      case NetworkIds.INPUT_MOVE_RIGHT:
        client.player.moveRight(input.message.elapsedTime, barriers);
        break;
      case NetworkIds.INPUT_MOVE_DOWN:
        client.player.moveDown(input.message.elapsedTime, barriers);
        break;
      case NetworkIds.INPUT_ROTATE_LEFT:
        // client.player.rotateLeft(input.message.elapsedTime);
        client.player.rotateLeft();
        break;
      case NetworkIds.INPUT_ROTATE_RIGHT:
        // client.player.rotateRight(input.message.elapsedTime);
        client.player.rotateRight();
        break;
      case NetworkIds.INPUT_FIRE:
        createBullet(input.clientId, client.player);
        break;
    }
  }
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between two objects.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function collided(obj1, obj2) {
  let distance = Math.sqrt(
    Math.pow(obj1.position.x - obj2.position.x, 2) +
      Math.pow(obj1.position.y - obj2.position.y, 2)
  );
  let radii = obj1.radius + obj2.radius;

  return distance <= radii;
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
  // Update clients
  for (let clientId in activeClients) {
    activeClients[clientId].player.update(currentTime);
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
    for (let clientId in activeClients) {
      //
      // Don't allow a bullet to hit the player it was fired from.
      if (clientId !== activeBullets[bullet].clientId) {
        if (collided(activeBullets[bullet], activeClients[clientId].player)) {
          hit = true;
          hits.push({
            clientId: clientId,
            bulletId: activeBullets[bullet].id,
            position: activeClients[clientId].player.position,
          });
        }
      }
    }
    if (!hit) {
      keepBullets.push(activeBullets[bullet]);
    }
  }
  activeBullets = keepBullets;
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
  if (lastUpdate < STATE_UPDATE_RATE_MS) {
    return;
  }

  //
  // Build the bullet messages one time, then reuse inside the loop
  let bulletMessages = [];
  for (let item = 0; item < newBullets.length; item++) {
    let bullet = newBullets[item];
    bulletMessages.push({
      id: bullet.id,
      direction: bullet.direction,
      position: {
        x: bullet.position.x,
        y: bullet.position.y,
      },
      radius: bullet.radius,
      speed: bullet.speed,
      timeRemaining: bullet.timeRemaining,
    });
  }

  //
  // Move all the new bullets over to the active bullets array
  for (let bullet = 0; bullet < newBullets.length; bullet++) {
    activeBullets.push(newBullets[bullet]);
  }
  newBullets.length = 0;

  for (let clientId in activeClients) {
    let client = activeClients[clientId];
    let update = {
      clientId: clientId,
      lastMessageId: client.lastMessageId,
      direction: client.player.direction,
      position: client.player.position,
      updateWindow: lastUpdate,
    };
    if (client.player.reportUpdate) {
      client.socket.emit(NetworkIds.UPDATE_SELF, update);

      //
      // Notify all other connected clients about every
      // other connected client status...but only if they are updated.
      for (let otherId in activeClients) {
        if (otherId !== clientId) {
          activeClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
        }
      }
    }

    //
    // Report any new bullets to the active clients
    for (let bullet = 0; bullet < bulletMessages.length; bullet++) {
      client.socket.emit(NetworkIds.BULLET_NEW, bulletMessages[bullet]);
    }

    //
    // Report any bullet hits to this client
    for (let hit = 0; hit < hits.length; hit++) {
      client.socket.emit(NetworkIds.BULLET_HIT, hits[hit]);
    }
  }

  for (let clientId in activeClients) {
    activeClients[clientId].player.reportUpdate = false;
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
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
  processInput(elapsedTime);
  update(elapsedTime, currentTime);
  updateClients(elapsedTime);

  if (!quit) {
    setTimeout(() => {
      let now = present();
      gameLoop(now, now - currentTime);
    }, SIMULATION_UPDATE_RATE_MS);
  }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
  const io = socketIo(httpServer);

  io.use(
    socketIoJwt.authorize({
      secret: process.env.SECRET_KEY,
      handshake: true,
    })
  );

  io.on('connection', function(socket) {
    console.log('Connection established: ', socket.id);
    //
    // Create an entry in our list of connected clients
    const { username } = socket.decoded_token;
    const newPlayer = Player.create(username, socket.id);
    const otherPlayers = [];

    for (let clientId in activeClients) {
      const client = activeClients[clientId];

      if (client.hasOwnProperty('player')) {
        otherPlayers.push(client.player.toJSON());
      }
    }

    socket.broadcast.emit(NetworkIds.CONNECT_OTHER, newPlayer.toJSON());
    socket.emit(NetworkIds.CONNECT_ACK, {
      player: newPlayer.toJSON(),
      otherPlayers,
    });

    socket.on(NetworkIds.INPUT, data => {
      inputQueue.enqueue({ clientId: socket.id, message: data });
    });

    socket.on(NetworkIds.CHAT_MESSAGE_CREATE, data => {
      io.emit(NetworkIds.CHAT_MESSAGE_NEW, data);
    });

    socket.on('disconnect', function() {
      delete activeClients[socket.id];
      socket.broadcast.emit(NetworkIds.DISCONNECT_OTHER, {
        clientId: socket.id,
      });
    });

    activeClients[socket.id] = {
      socket: socket,
      player: newPlayer,
    };
  });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
  initializeSocketIO(httpServer);
  gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
  this.quit = true;
}

module.exports.initialize = initialize;
