MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	var editing = false;
	var action = '';
	var keyCode = [];
	var codes = {
		'fire': 'default',
		'rotate-left': 'default',
		'rotate-right': 'default',
		'move-up': 'default',
		'move-down': 'default',
		'move-right': 'default',
		'move-left': 'default',
	};

	function initialize() {
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
			window.addEventListener('keyup', keyUp);

			for(var code in codes) {
				// try and get local storage (populate if it exists)
				// register those that exist with the input

				// QUESTION does the input support multi-key commands??????

				// populate the display table using current value
			}
	}

	function keyDown(event) {
		if (editing && action) {
			if (keyCode.indexOf(event.which) < 0) {
				keyCode.push(event.which);
			}
		}
	}

	function keyUp(event) {
		editing = false;
		// unregister old keycode (in codes array) from input
		// save new key in codes array
		// save new key in local storage
		// register new key to input
		// update display for new key in table
		keyCode = [];
		action = '';
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
