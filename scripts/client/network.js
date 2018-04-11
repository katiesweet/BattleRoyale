MyGame.network = (function() {
  'use strict';

  const socket = io();
  let queue = Queue.create();
  let listeners = [
    NetworkIds.CONNECT_ACK,
    NetworkIds.CONNECT_OTHER,
    NetworkIds.DISCONNECT_OTHER,
    NetworkIds.UPDATE_SELF,
    NetworkIds.UPDATE_OTHER,
    NetworkIds.BULLET_NEW,
    NetworkIds.BULLET_HIT,
  ];

  listeners.forEach(id => {
    socket.on(id, data => {
      queue.enqueue({
        type: id,
        data: data,
      });
    });
  });

  function emit(...args) {
    return socket.emit(...args);
  }

  function getQueue() {
    return queue;
  }

  function resetQueue() {
    queue = Queue.create();
  }

  return {
    emit,
    getQueue,
    resetQueue,
    enqueue: queue.enqueue,
    dequeue: queue.dequeue,
  };
})();
