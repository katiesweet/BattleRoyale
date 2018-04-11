MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	var editing = false;
	var action = '';
	var codes = {};

	function initialize() {
		codes = {
			'fire': {'input': input.KeyEvent.DOM_VK_SPACE, 'network': NetworkIds.INPUT_FIRE, 'id': 0},
			'rotate-left': {'input': input.KeyEvent.DOM_VK_A, 'network': NetworkIds.INPUT_ROTATE_LEFT, 'id': 0},
			'rotate-right': {'input': input.KeyEvent.DOM_VK_D, 'network': NetworkIds.INPUT_ROTATE_RIGHT, 'id': 0},
			'move-up': {'input': input.KeyEvent.DOM_VK_UP, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
			'move-down': {'input': input.KeyEvent.DOM_VK_DOWN, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
			'move-right':{'input':  input.KeyEvent.DOM_VK_RIGHT, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
			'move-left': {'input': input.KeyEvent.DOM_VK_LEFT, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
			// 'sprint': {'input': input.KeyEvent.DOM_VK_S, 'network': NetworkIds.INPUT_MOVE, 'id': 0},
		};

		console.log('INPUT', input);

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
				let predef = localStorage.getItem(code);
				let input = codes[code].input;
				if (predef) {
					input = predef;
				}
				codes[code].id = MyGame.registerEvent(codes[code].network, input, code);
				document.getElementById(code).innerHTML = ('<span>' + input + '</span>');
			}

	}


	function keyDown(event) {
		if (editing && action) {
			editing = false;
			MyGame.unregisterEvent(codes[action], codes[action].id);
			codes[action].input = event.which;
			codes[action].id = MyGame.registerEvent(codes[action].network, codes[action].input, action);
			localStorage.setItem(action, event.which);
			document.getElementById(action).innerHTML = ('<span>' + event.which + '</span>');
			action = '';
			editing = false;
		}
	}

	function run() { }

  function edit(id) {
		editing = true;
		action = id;
		document.getElementById(id).innerHTML = ('<span> press any key to set the new code </span>');
  }

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu, MyGame.input));
