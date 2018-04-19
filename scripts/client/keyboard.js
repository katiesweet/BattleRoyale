MyGame.screens['keyboard-config'] = (function(menu, input) {
  'use strict';

  var editing = false;
  var action = '';
  var codes = {};

  let codeDisplay = {
    3: 'Cancel',
    6: 'Help',
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Return',
    14: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'Caps Lock',
    27: 'Escape',
    32: 'Space',
    33: 'Page Up',
    34: 'Page Down',
    25: 'End',
    36: 'Home',
    37: 'Left Arrow',
    38: 'Up Arrow',
    39: 'Right Arrow',
    40: 'Down Arrow',
    44: 'Print Screen',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    59: 'Semicolon',
    61: 'Equals',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    106: 'Multiply',
    107: 'Add',
    108: 'Separator',
    109: 'Subtract',
    110: 'Decimal',
    111: 'Divide',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    124: 'F13',
    144: 'Num Lock',
    188: 'Comma',
    190: 'Period',
    191: 'Slash',
    192: 'Back Quote',
    219: 'Open Bracket',
    220: 'Back Slash',
    221: 'Close Bracket',
    222: 'Quote',
    224: 'Meta',
  };

  function initialize() {
    codes = {
      fire: {
        input: input.KeyEvent.DOM_VK_SPACE,
        network: NetworkIds.INPUT_FIRE,
        id: 0,
      },
      'rotate-left': {
        input: input.KeyEvent.DOM_VK_A,
        network: NetworkIds.INPUT_ROTATE_LEFT,
        id: 0,
      },
      'rotate-right': {
        input: input.KeyEvent.DOM_VK_D,
        network: NetworkIds.INPUT_ROTATE_RIGHT,
        id: 0,
      },
      'move-up': {
        input: input.KeyEvent.DOM_VK_UP,
        network: NetworkIds.INPUT_MOVE_UP,
        id: 0,
      },
      'move-down': {
        input: input.KeyEvent.DOM_VK_DOWN,
        network: NetworkIds.INPUT_MOVE_DOWN,
        id: 0,
      },
      'move-right': {
        input: input.KeyEvent.DOM_VK_RIGHT,
        network: NetworkIds.INPUT_MOVE_RIGHT,
        id: 0,
      },
      'move-left': {
        input: input.KeyEvent.DOM_VK_LEFT,
        network: NetworkIds.INPUT_MOVE_LEFT,
        id: 0,
      },
      'use-health': {
        input: input.KeyEvent.DOM_VK_H,
        network: NetworkIds.USE_HEALTH,
        id: 0,
      }
      // 'sprint': {'input': input.KeyEvent.DOM_VK_S, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
    };

    document
      .getElementById('fire-config')
      .addEventListener('click', function() {
        edit('fire');
      });
    document
      .getElementById('rotate-left-config')
      .addEventListener('click', function() {
        edit('rotate-left');
      });
    document
      .getElementById('rotate-right-config')
      .addEventListener('click', function() {
        edit('rotate-right');
      });
    document
      .getElementById('move-up-config')
      .addEventListener('click', function() {
        edit('move-up');
      });
    document
      .getElementById('move-down-config')
      .addEventListener('click', function() {
        edit('move-down');
      });
    document
      .getElementById('move-right-config')
      .addEventListener('click', function() {
        edit('move-right');
      });
    document
      .getElementById('move-left-config')
      .addEventListener('click', function() {
        edit('move-left');
      });
    document
      .getElementById('use-health-config')
      .addEventListener('click', function() {
        edit('use-health');
      });

    window.addEventListener('keydown', keyDown);

    for (var code in codes) {
      let predef = localStorage.getItem(code);
      let input = codes[code].input;
      if (predef) {
        input = predef;
      }
      codes[code].id = MyGame.registerEvent(codes[code].network, input, code);
      document.getElementById(code).innerHTML =
        '<span>' + codeDisplay[input] + '</span>';
    }
  }

  function keyDown(event) {
    if (editing && action) {
      editing = false;
      MyGame.unregisterEvent(codes[action], codes[action].id);
      codes[action].input = event.which;
      codes[action].id = MyGame.registerEvent(
        codes[action].network,
        codes[action].input,
        action
      );
      localStorage.setItem(action, event.which);
      document.getElementById(action).innerHTML =
        '<span>' + codeDisplay[event.which] + '</span>';
      action = '';
      editing = false;
    }
  }

  function run() {}

  function edit(id) {
    editing = true;
    action = id;
    document.getElementById(id).innerHTML =
      '<span> press any key to set the new code </span>';
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu, MyGame.input);
