// ------------------------------------------------------------------
//
// Shared module between Nodejs and the browser that defines constants
// used for network communication.
//
// The use of the IIFE is to create a module that works on both the server
// and the client.
// Reference for this idea: https://caolan.org/posts/writing_for_node_and_the_browser.html
//
// ------------------------------------------------------------------
(function(exports) {
  'use strict';

  Object.defineProperties(exports, {
    INPUT: {
      value: 'input',
      writable: false,
    },
    INPUT_MOVE_UP: {
      value: 'move-up',
      writable: false,
    },
    INPUT_MOVE_DOWN: {
      value: 'move-down',
      writable: false,
    },
    INPUT_MOVE_LEFT: {
      value: 'move-left',
      writable: false,
    },
    INPUT_MOVE_RIGHT: {
      value: 'move-right',
      writable: false,
    },
    INPUT_ROTATE_LEFT: {
      value: 'rotate-left',
      writable: false,
    },
    INPUT_ROTATE_RIGHT: {
      value: 'rotate-right',
      writable: false,
    },
    INPUT_FIRE: {
      value: 'fire',
      writable: false,
    },
    CONNECT_ACK: {
      value: 'connect-ack',
      writable: false,
    },
    CONNECT_OTHER: {
      value: 'connect-other',
      writable: false,
    },
    DISCONNECT_OTHER: {
      value: 'disconnect-other',
      writable: false,
    },
    SET_STARTING_POSITION: {
      value: 'set-starting-position',
      writable: false,
    },
    UPDATE_SELF: {
      value: 'update-self',
      writable: false,
    },
    UPDATE_OTHER: {
      value: 'update-other',
      writable: false,
    },
    BULLET_NEW: {
      value: 'bullet-new',
      writable: false,
    },
    BULLET_HIT: {
      value: 'bullet-hit',
      writable: false,
    },
    UPDATE_POWERUP: {
      value: 'powerups',
      writable: false,
    },
    CHAT_MESSAGE_CREATE: {
      value: 'chat-message-create',
      writable: false,
    },
    CHAT_MESSAGE_NEW: {
      value: 'chat-message-new',
      writable: false,
    },
    GAME_MESSAGE_NEW: {
      value: 'game-message-new',
      writable: false,
    },
    OPPONENT_STARTING_POSITION: {
      value: 'opponent-start-position',
      writable: false,
    },
  });
})(typeof exports === 'undefined' ? (this['NetworkIds'] = {}) : exports);
