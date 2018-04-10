MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	var editing = false;
	var action = '';
	var keyCode = '';
	var codes = {};

	function initialize() {
		codes = {
			'fire': {'input': input.KeyEvent.DOM_VK_SPACE, 'network': NetworkIds.INPUT_FIRE},
			'rotate-left': {'input': input.KeyEvent.DOM_VK_A, 'network': NetworkIds.INPUT_ROTATE_LEFT},
			'rotate-right': {'input': input.KeyEvent.DOM_VK_D, 'network': NetworkIds.INPUT_ROTATE_RIGHT},
			'move-up': {'input': input.KeyEvent.DOM_VK_UP, 'network': NetworkIds.INPUT_MOVE},
			'move-down': {'input': input.KeyEvent.DOM_VK_DOWN, 'network': NetworkIds.INPUT_MOVE},
			'move-right':{'input':  input.KeyEvent.DOM_VK_RIGHT, 'network': NetworkIds.INPUT_MOVE},
			'move-left': {'input': input.KeyEvent.DOM_VK_LEFT, 'network': NetworkIds.INPUT_MOVE},
			'sprint': {'input': input.KeyEvent.DOM_VK_S, 'network': NetworkIds.INPUT_MOVE},
		};

		document.getElementById('id-keyboard-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
      document.getElementById('fire-config').addEventListener('click', function() { edit('fire') });
      document.getElementById('rotate-left-config').addEventListener('click', function() { edit('rotate-left') });
      document.getElementById('rotate-right-config').addEventListener('click', function() { edit('rotate-right') });
      document.getElementById('move-up-config').addEventListener('click', function() { edit('move-up') });
      document.getElementById('move-down-config').addEventListener('click', function() { edit('move-down') });
      document.getElementById('move-right-config').addEventListener('click', function() { edit('move-right') });
      document.getElementById('move-left-config').addEventListener('click', function() { edit('move-left') });

			window.addEventListener('keydown', keyDown);

			for(var code in codes) {
				let predef = localstorage.getItem(code);
				let input = codes[code].input;
				if (predef) {
					input = predef;
				}
				MyGame.registerEvent(codes[code].network, input, code);
			}

	}


	function keyDown(event) {
		if (editing && action) {
			keycode = event.which;
			editing = false;
			// unregister old keycode (in codes array) from input

			codes[action].input = keycode;
			MyGame.registerEvent(codes[action].network, codes[action].input, action);
			localstorage.setItem(code, keycode);

			// update display for new key in table
			action = '';
			editing = false;
		}
	}

	function run() { }

  function edit(id) {
		editing = true;
		action = id;
  }

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu, MyGame.input));
