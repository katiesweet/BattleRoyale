MyGame.network = (function() {
  'use strict';

  let socket;
  let queue = Queue.create();
  let history = Queue.create();
  let messageId = 0;

  function connect() {
    const token = localStorage.getItem('token');
    socket = io.connect('', { query: `token=${token}` });

    const networkEvents = [
      NetworkIds.CONNECT_ACK,
      NetworkIds.CONNECT_OTHER,
      NetworkIds.DISCONNECT_OTHER,
      NetworkIds.UPDATE_SELF,
      NetworkIds.UPDATE_OTHER,
      NetworkIds.BULLET_NEW,
      NetworkIds.BULLET_HIT,
      NetworkIds.UPDATE_POWERUP
    ];

    networkEvents.forEach(event =>
      listen(event, data => {
        queue.enqueue({
          type: event,
          data: data,
        });
      })
    );
  }

  function disconnect() {
    socket.close();
    socket = null;
  }

  function emit(...args) {
    socket.emit(...args);
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
    listen,
    getQueue,
    resetQueue,
    enqueue: queue.enqueue,
    dequeue: queue.dequeue,
  };
})();
