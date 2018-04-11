MyGame.network = (function() {
  'use strict';

  const socket = io();
  let queue = Queue.create();

  function getQueue() {
    return queue;
  }

  function resetQueue() {
    queue = Queue.create();
  }

  function emit(...args) {
    return socket.emit(...args);
  }

  function on(...args) {
    return socket.on(...args);
  }

  socket.on(NetworkIds.CONNECT_ACK, data => {
    queue.enqueue({
      type: NetworkIds.CONNECT_ACK,
      data: data,
    });
  });

  socket.on(NetworkIds.CONNECT_OTHER, data => {
    queue.enqueue({
      type: NetworkIds.CONNECT_OTHER,
      data: data,
    });
  });

  socket.on(NetworkIds.DISCONNECT_OTHER, data => {
    queue.enqueue({
      type: NetworkIds.DISCONNECT_OTHER,
      data: data,
    });
  });

  socket.on(NetworkIds.UPDATE_SELF, data => {
    queue.enqueue({
      type: NetworkIds.UPDATE_SELF,
      data: data,
    });
  });

  socket.on(NetworkIds.UPDATE_OTHER, data => {
    queue.enqueue({
      type: NetworkIds.UPDATE_OTHER,
      data: data,
    });
  });

  socket.on(NetworkIds.BULLET_NEW, data => {
    queue.enqueue({
      type: NetworkIds.BULLET_NEW,
      data: data,
    });
  });

  socket.on(NetworkIds.BULLET_HIT, data => {
    queue.enqueue({
      type: NetworkIds.BULLET_HIT,
      data: data,
    });
  });

  return {
    on,
    emit,
    getQueue,
    resetQueue,
    enqueue: queue.enqueue,
    dequeue: queue.dequeue,
  };
})();
