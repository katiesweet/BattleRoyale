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
    JOIN_LOBBY: {
      value: 'join-lobby',
      writable: false,
    },
    JOIN_LOBBY_OTHER: {
      value: 'join-lobby-other',
      writable: false,
    },
    DICONNECT_LOBBY: {
      value: 'disconnect-lobby',
      writable: false,
    },
    DISCONNECT_LOBBY_OTHER: {
      value: 'disconnect-lobby-other',
      writable: false,
    },
    DISCONNECT_GAME: {
      value: 'disconnect-game',
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
    LOBBY_MESSAGE_CREATE: {
      value: 'lobby-message-create',
      writable: false,
    },
    LOBBY_MESSAGE_NEW: {
      value: 'lobby-message-new',
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
    USE_HEALTH: {
      value: 'use-health',
      writable: false,
    },
    SHIELD_INFO: {
      value: 'shield-info',
      writable: false,
    },
    INITIATE_GAME_START: {
      value: 'initiate-game-start',
      writable: false,
    },
    AUTO_JOIN_GAME: {
      value: 'auto-join-game',
      writable: false,
    },
    PLAYER_COUNT: {
      value: 'player-count',
      writable: false,
    },
    END_OF_GAME: {
      value: 'game-over',
      writable: false,
    },
    WINNER: {
      value: 'winner',
      writable: false,
    },
    SPRINT: {
      value: 'sprint',
      writable: false,
    },
  });
})(typeof exports === 'undefined' ? (this['NetworkIds'] = {}) : exports);
