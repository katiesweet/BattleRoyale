MyGame.network = (function() {
  'use strict';

  const socket = io();
  let queue = Queue.create();
  let history = Queue.create();
  let messageId = 0;

  let networkEvents = [
    NetworkIds.CONNECT_ACK,
    NetworkIds.CONNECT_OTHER,
    NetworkIds.DISCONNECT_OTHER,
    NetworkIds.UPDATE_SELF,
    NetworkIds.UPDATE_OTHER,
    NetworkIds.BULLET_NEW,
    NetworkIds.BULLET_HIT,
  ];

  networkEvents.forEach(event =>
    listen(event, data => {
      queue.enqueue({
        type: event,
        data: data,
      });
    })
  );

  function emit(...args) {
    return socket.emit(...args);
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
    emit,
    listen,
    history,
    getQueue,
    resetQueue,
    enqueue: queue.enqueue,
    dequeue: queue.dequeue,
  };
})();
