MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	var editing = false;
	var action = '';
	var keyCode = [];

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
		// unregister old keycode
		// save key code and update in localstorate and display
		// use input to register the new keycode
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
