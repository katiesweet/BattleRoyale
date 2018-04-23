MyGame.network = (function() {
  'use strict';

  let socket;
  let queue = Queue.create();
  let history = Queue.create();
  let messageId = 0;

  const inGameEvents = [
    NetworkIds.SET_STARTING_POSITION,
    NetworkIds.OPPONENT_STARTING_POSITION,
    NetworkIds.DISCONNECT_OTHER,
    NetworkIds.UPDATE_SELF,
    NetworkIds.UPDATE_OTHER,
    NetworkIds.BULLET_NEW,
    NetworkIds.BULLET_HIT,
    NetworkIds.REMOVE_POWERUPS,
    NetworkIds.UPDATE_SCORE,
    NetworkIds.SHIELD_INIT,
    NetworkIds.POWERUP_INIT,
    NetworkIds.END_OF_GAME,
    NetworkIds.WINNER,
  ];

  function unlistenGameEvents() {
    inGameEvents.forEach(event => unlisten(event, enqueueEvent(event)));
  }

  function initializeGameEvents() {
    inGameEvents.forEach(event => listen(event, enqueueEvent(event)));
  }

  function enqueueEvent(event) {
    return function(data) {
      queue.enqueue({ type: event, data });
    };
  }

  function connect() {
    const token = localStorage.getItem('token');

    if (socket) {
      socket.disconnect();
    }

    socket = io.connect('', { query: `token=${token}` });
  }

  function disconnect() {
    socket.close();
    socket = null;
  }

  function emit(...args) {
    socket.emit(...args);
  }

  function unlisten(networkId, callback) {
    socket.removeListener(networkId, callback);
  }

  function listen(networkId, callback) {
    socket.on(networkId, callback);
  }

  function getQueue() {
    return queue;
  }

  function resetQueue() {
    queue = Queue.create();
  }

  return {
    history,
    connect,
    disconnect,
    emit,
    unlisten,
    listen,
    unlistenGameEvents,
    initializeGameEvents,
    getQueue,
    resetQueue,
    enqueue: queue.enqueue,
    dequeue: queue.dequeue,
  };
})();
